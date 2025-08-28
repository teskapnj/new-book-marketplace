import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebaseAdmin';
import { sendOrderConfirmationEmail } from '../../../../../lib/emails';

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const orderDoc = await db.collection('orders').doc(id).get();
    
    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = orderDoc.data();
    
    await sendOrderConfirmationEmail({
      customerEmail: orderData?.customerInfo?.email || '',
      customerName: orderData?.customerInfo?.fullName || 'Customer',
      orderNumber: orderData?.orderNumber || id,
      items: orderData?.items || [],
      totalAmount: orderData?.totalAmount || 0,
      shippingAddress: orderData?.shippingAddress || {}
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}