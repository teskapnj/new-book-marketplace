import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
// Make sure to import the service account key as a plain JSON object


// Ensure Firebase Admin SDK is initialized
// This check prevents re-initialization in development mode (hot-reloading)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    })
  });
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const { listingId, buyerId, orderId } = await request.json();
    
    if (!listingId || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const listingRef = db.collection('listings').doc(listingId);

    // Start a new Firestore transaction to ensure data integrity
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(listingRef);

      // Check if the listing exists
      if (!doc.exists) {
        throw new Error('Listing not found');
      }

      const listingData = doc.data();

      // Check if the item is already sold
      if (listingData?.status === 'sold') {
        throw new Error('This listing has already been sold.');
      }
      
      // Perform the secure update within the transaction
      transaction.update(listingRef, {
        status: 'sold',
        soldAt: new Date(),
        soldInOrder: orderId,
        buyerId: buyerId || null, // Ensure buyerId is handled correctly
        updatedAt: new Date(),
      });
    });
    
    console.log(`Listing ${listingId} marked as sold by API`);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking listing as sold:', error);
    
    // Handle specific errors from the transaction and send appropriate HTTP status codes
    if (error.message.includes('already been sold')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 } // 409 Conflict
      );
    } else if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 } // 404 Not Found
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to mark listing as sold' },
        { status: 500 }
      );
    }
  }
}
