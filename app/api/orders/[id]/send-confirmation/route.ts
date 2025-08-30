import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebaseAdmin';
import { sendOrderConfirmationEmail } from '../../../../../lib/emails';

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log(`Processing email confirmation request for order: ${id}`);
    
    // Önce order'ı kontrol et
    const orderDoc = await db.collection('orders').doc(id).get();
    
    if (!orderDoc.exists) {
      console.log(`Order not found: ${id}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = orderDoc.data();
    const orderNumber = orderData?.orderNumber || id;
    const customerEmail = orderData?.customerInfo?.email || '';
    
    if (!customerEmail) {
      console.log(`No customer email found for order: ${id}`);
      return NextResponse.json({ error: 'Customer email not found' }, { status: 400 });
    }

    // Bu order için daha önce email gönderilmiş mi kontrol et
    const existingEmails = await db.collection('mail')
      .where('to', '==', customerEmail)
      .where('orderNumber', '==', orderNumber)
      .where('emailType', '==', 'order_confirmation')
      .limit(1)
      .get();

    if (!existingEmails.empty) {
      console.log(`Email already sent for order: ${orderNumber}`);
      return NextResponse.json({ 
        success: true, 
        message: 'Email already sent',
        alreadySent: true 
      });
    }

    // Alternatif olarak order document'inde email status kontrol et
    if (orderData?.emailStatus?.confirmationSent) {
      console.log(`Email status already marked as sent for order: ${orderNumber}`);
      return NextResponse.json({ 
        success: true, 
        message: 'Email already sent (status check)',
        alreadySent: true 
      });
    }

    console.log(`Sending new email for order: ${orderNumber} to: ${customerEmail}`);
    
    // Email gönder
    await sendOrderConfirmationEmail({
      customerEmail,
      customerName: orderData?.customerInfo?.fullName || 'Customer',
      orderNumber,
      items: orderData?.items || [],
      totalAmount: orderData?.totalAmount || 0,
      shippingAddress: orderData?.shippingAddress || {}
    });

    // Order document'inde email gönderildi olarak işaretle
    await db.collection('orders').doc(id).update({
      'emailStatus.confirmationSent': true,
      'emailStatus.confirmationSentAt': new Date(),
      'emailStatus.confirmationEmail': customerEmail
    });

    console.log(`Email confirmation successfully queued for order: ${orderNumber}`);

    return NextResponse.json({ 
      success: true,
      message: 'Email sent successfully',
      orderNumber,
      customerEmail
    });
    
  } catch (error) {
    console.error('Error in send-confirmation endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}