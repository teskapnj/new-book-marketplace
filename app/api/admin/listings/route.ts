// app/api/admin/listings/route.ts - Secure Listings API
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { sanitizeInput, validatePagination } from '@/lib/security-utils';
import { rateLimit } from '@/lib/rate-limit';
import { auditLog } from '@/lib/audit-logger';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

// Rate limiting configuration
const adminApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  keyGenerator: (req) => `admin_api_${req.ip}_${req.headers.get('authorization')?.slice(-10)}`
});

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await adminApiLimiter(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    // Admin verification
    const adminAuth = await verifyAdminAccess(request, ['listings:view']);
    if (!adminAuth.success) {
      return NextResponse.json(
        { error: adminAuth.error },
        { status: adminAuth.status }
      );
    }

    // Extract and validate query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = sanitizeInput(url.searchParams.get('status') || 'all');
    const search = sanitizeInput(url.searchParams.get('search') || '');
    const sortBy = sanitizeInput(url.searchParams.get('sortBy') || 'createdAt');
    const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    // Validate pagination
    const validation = validatePagination(page, limit);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Build Firestore query
    let query = db.collection('listings');

    // Apply filters
    if (status !== 'all') {
      const allowedStatuses = ['pending', 'approved', 'rejected', 'sold'];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status filter' },
          { status: 400 }
        );
      }
      query = query.where('status', '==', status);
    }

    // Apply sorting
    const allowedSortFields = ['createdAt', 'updatedAt', 'totalValue', 'title'];
    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        { error: 'Invalid sort field' },
        { status: 400 }
      );
    }
    query = query.orderBy(sortBy, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.offset(offset).limit(limit);

    // Execute query
    const snapshot = await query.get();
    const listings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Remove sensitive fields
      vendorId: adminAuth.user.permissions.includes('sellers:view') ? doc.data().vendorId : '[REDACTED]'
    }));

    // Apply search filter (client-side for flexibility)
    let filteredListings = listings;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredListings = listings.filter(listing => 
        listing.title?.toLowerCase().includes(searchLower) ||
        listing.id.toLowerCase().includes(searchLower) ||
        (adminAuth.user.permissions.includes('sellers:view') && 
         listing.vendorName?.toLowerCase().includes(searchLower))
      );
    }

    // Get total count for pagination
    let totalQuery = db.collection('listings');
    if (status !== 'all') {
      totalQuery = totalQuery.where('status', '==', status);
    }
    const totalSnapshot = await totalQuery.count().get();
    const totalCount = totalSnapshot.data().count;

    // Log admin action
    await auditLog(adminAuth.user.uid, 'listings_viewed', {
      page,
      limit,
      status,
      search: search ? '[SEARCH_PERFORMED]' : null,
      resultCount: filteredListings.length,
      ip: request.ip
    });

    return NextResponse.json({
      success: true,
      data: {
        listings: filteredListings,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1
        },
        filters: {
          status,
          search,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Admin listings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin verification with higher permissions
    const adminAuth = await verifyAdminAccess(request, ['listings:approve', 'listings:reject']);
    if (!adminAuth.success) {
      return NextResponse.json(
        { error: adminAuth.error },
        { status: adminAuth.status }
      );
    }

    const body = await request.json();
    const { listingId, action, reason, notes } = body;

    // Validate input
    if (!listingId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const allowedActions = ['approve', 'reject', 'delete'];
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Check delete permission separately
    if (action === 'delete' && !adminAuth.user.permissions.includes('listings:delete')) {
      return NextResponse.json(
        { error: 'Insufficient permissions for delete action' },
        { status: 403 }
      );
    }

    // Validate rejection reason if needed
    if (action === 'reject' && (!reason || reason.trim().length < 10)) {
      return NextResponse.json(
        { error: 'Rejection reason must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Get listing document
    const listingRef = db.collection('listings').doc(listingId);
    const listingDoc = await listingRef.get();

    if (!listingDoc.exists) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    const listingData = listingDoc.data();

    // Perform action
    let updateData: any = {
      updatedAt: new Date(),
      updatedBy: adminAuth.user.uid,
      adminNotes: sanitizeInput(notes || '')
    };

    switch (action) {
      case 'approve':
        updateData.status = 'approved';
        updateData.approvedAt = new Date();
        updateData.approvedBy = adminAuth.user.uid;
        break;
      
      case 'reject':
        updateData.status = 'rejected';
        updateData.rejectedAt = new Date();
        updateData.rejectedBy = adminAuth.user.uid;
        updateData.rejectionReason = sanitizeInput(reason);
        break;
      
      case 'delete':
        // Soft delete instead of hard delete
        updateData.status = 'deleted';
        updateData.deletedAt = new Date();
        updateData.deletedBy = adminAuth.user.uid;
        break;
    }

    await listingRef.update(updateData);

    // Log admin action
    await auditLog(adminAuth.user.uid, `listing_${action}`, {
      listingId,
      listingTitle: listingData?.title,
      sellerId: listingData?.vendorId,
      reason: action === 'reject' ? sanitizeInput(reason) : null,
      notes: sanitizeInput(notes || ''),
      ip: request.ip
    });

    // Send notification to seller if needed
    if (action === 'approve' || action === 'reject') {
      // Queue email notification
      await fetch('/api/notifications/seller-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: listingData?.vendorId,
          action,
          listingId,
          reason: action === 'reject' ? reason : null
        })
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      data: {
        listingId,
        action,
        newStatus: updateData.status,
        message: `Listing ${action}d successfully`
      }
    });

  } catch (error) {
    console.error('Admin listing action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/admin/orders/route.ts - Secure Orders API
export async function GET(request: NextRequest) {
  try {
    // Admin verification
    const adminAuth = await verifyAdminAccess(request, ['orders:view']);
    if (!adminAuth.success) {
      return NextResponse.json(
        { error: adminAuth.error },
        { status: adminAuth.status }
      );
    }

    // Extract parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
    const status = sanitizeInput(url.searchParams.get('status') || 'all');

    // Build query
    let query = db.collection('orders');
    
    if (status !== 'all') {
      const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      query = query.where('status', '==', status);
    }

    query = query.orderBy('createdAt', 'desc');
    const offset = (page - 1) * limit;
    query = query.offset(offset).limit(limit);

    const snapshot = await query.get();
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Redact sensitive customer info based on permissions
        customerInfo: adminAuth.user.permissions.includes('orders:view_customer_details') 
          ? data.customerInfo 
          : {
              email: data.customerInfo?.email?.replace(/(.{3})(.*)(@.*)/, '$1***$3'),
              fullName: '[REDACTED]'
            }
      };
    });

    // Log access
    await auditLog(adminAuth.user.uid, 'orders_viewed', {
      page,
      limit,
      status,
      resultCount: orders.length
    });

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          hasNext: orders.length === limit,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// app/api/admin/orders/[id]/route.ts - Individual Order API
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminAuth = await verifyAdminAccess(request, ['orders:update']);
    if (!adminAuth.success) {
      return NextResponse.json(
        { error: adminAuth.error },
        { status: adminAuth.status }
      );
    }

    const orderId = params.id;
    const body = await request.json();
    const { status, notes, trackingNumber, carrier } = body;

    // Validate status
    const allowedStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Validate tracking info if provided
    if (trackingNumber && !carrier) {
      return NextResponse.json({ error: 'Carrier required with tracking number' }, { status: 400 });
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date(),
      updatedBy: adminAuth.user.uid
    };

    if (status) updateData.status = status;
    if (notes) updateData.adminNotes = sanitizeInput(notes);
    if (trackingNumber) {
      updateData.trackingNumber = sanitizeInput(trackingNumber);
      updateData.carrier = sanitizeInput(carrier);
      updateData.shippedAt = new Date();
    }

    await orderRef.update(updateData);

    // Log action
    await auditLog(adminAuth.user.uid, 'order_updated', {
      orderId,
      changes: Object.keys(updateData),
      newStatus: status,
      trackingAdded: !!trackingNumber
    });

    return NextResponse.json({
      success: true,
      data: { orderId, updated: updateData }
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}