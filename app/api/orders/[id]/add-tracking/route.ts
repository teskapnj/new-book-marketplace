// app/api/orders/[id]/add-tracking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';
import { initializeShippoTracking, getTrackingUrl } from '@/lib/shippo';
import { FieldValue } from 'firebase-admin/firestore';
import nodemailer from 'nodemailer';

// Nodemailer transporter'ı oluştur
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Tracking email gönderme fonksiyonu
const sendTrackingEmail = async ({
  customerEmail,
  customerName,
  orderNumber,
  trackingNumber,
  carrier,
  trackingUrl
}: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
}) => {
  const transporter = createEmailTransporter();
  
  const mailOptions = {
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Your Order #${orderNumber} Has Shipped!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Order Has Shipped!</h2>
        
        <p>Hi ${customerName},</p>
        
        <p>Great news! Your order #${orderNumber} has been shipped and is on its way to you.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Tracking Information</h3>
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <p><strong>Carrier:</strong> ${carrier.toUpperCase()}</p>
          <p><strong>Track Your Package:</strong> <a href="${trackingUrl}" style="color: #007bff;">${trackingUrl}</a></p>
        </div>
        
        <p>You can click the tracking link above to see real-time updates on your package's location and delivery status.</p>
        
        <p>If you have any questions about your order, please don't hesitate to contact our customer service team.</p>
        
        <p>Thank you for your business!</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          This email was sent regarding order #${orderNumber}. 
          If you have any questions, please contact us at ${process.env.ADMIN_EMAIL}
        </p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

export async function POST(
 request: NextRequest, 
 { params }: { params: Promise<{ id: string }> }
) {
 try {
   const { id } = await params;
   const body = await request.json();
   const { trackingNumber, carrier } = body;
   
   // Gelen verileri doğrula
   if (!id || !trackingNumber || !carrier) {
     return NextResponse.json(
       { error: 'Missing required fields' },
       { status: 400 }
     );
   }
   
   console.log(`Adding tracking to order ${id}: ${trackingNumber} (${carrier})`);
   
   try {
     // Admin SDK ile Firestore erişimi
     const orderRef = db.collection('orders').doc(id);
     const orderSnap = await orderRef.get();
     
     if (!orderSnap.exists) {
       console.error(`Order not found: ${id}`);
       return NextResponse.json(
         { error: 'Order not found' },
         { status: 404 }
       );
     }
     
     const orderData = orderSnap.data();
     
     if (orderData?.status === 'delivered') {
       console.error(`Order already delivered: ${id}`);
       return NextResponse.json(
         { error: 'Cannot add tracking to a delivered order' },
         { status: 400 }
       );
     }
     
     // Yetkilendirme kontrolü
     const authHeader = request.headers.get('authorization');
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return NextResponse.json(
         { error: 'Unauthorized: Missing authorization header' },
         { status: 401 }
       );
     }
     
     const token = authHeader.split('Bearer ')[1];
     
     try {
       // Admin SDK ile token doğrulama
       const decodedToken = await auth.verifyIdToken(token);
       const uid = decodedToken.uid;
       
       // Kullanıcının admin olup olmadığını kontrol et
       const userDoc = await db.collection('users').doc(uid).get();
       if (!userDoc.exists) {
         return NextResponse.json(
           { error: 'User not found' },
           { status: 404 }
         );
       }
       
       const userData = userDoc.data();
       if (userData?.role !== 'admin') {
         return NextResponse.json(
           { error: 'Admin access required' },
           { status: 403 }
         );
       }
     } catch (authError) {
       console.error('Authentication error:', authError);
       return NextResponse.json(
         { error: 'Unauthorized: Invalid token' },
         { status: 401 }
       );
     }
     
     const trackingUrl = getTrackingUrl(carrier, trackingNumber);
     
     // Shippo'yu test et (isteğe bağlı)
     let shippoSuccess = false;
     try {
       console.log(`Initializing Shippo tracking for ${trackingNumber}`);
       
       // Test takip numaraları için carrier'ı "shippo" olarak değiştir
       let shippoCarrier = carrier;
       if (trackingNumber === "SHippoTest" || trackingNumber === "10000000000000000") {
         shippoCarrier = "shippo";
         console.log(`Using test carrier: ${shippoCarrier} for tracking number: ${trackingNumber}`);
       }
       
       await initializeShippoTracking(trackingNumber, shippoCarrier);
       shippoSuccess = true;
       console.log('Shippo tracking initialized successfully');
     } catch (shippoError) {
       console.error('Shippo initialization failed:', shippoError);
       // Devam et, Shippo hatası kritik değil
     }
     
     // Siparişi güncelle (Admin SDK ile)
     const updateData: any = {
       trackingNumber: trackingNumber.toUpperCase(),
       carrier: carrier.toLowerCase(), // Orijinal carrier'ı sakla
       status: 'shipped',
       shippedAt: FieldValue.serverTimestamp(),
       trackingUrl,
       updatedAt: FieldValue.serverTimestamp()
     };
     
     if (shippoSuccess) {
       updateData.trackingStatus = 'UNKNOWN';
       updateData.statusDetails = 'Tracking initialized';
       updateData.lastTracked = FieldValue.serverTimestamp();
     }
     
     await orderRef.update(updateData);
     console.log(`Order ${id} updated successfully`);
     
     // NODEMAILER İLE EMAIL GÖNDERME
     const customerEmail = orderData?.customerInfo?.email;
     const customerName = orderData?.customerInfo?.fullName || 'Customer';
     const orderNumber = orderData?.orderNumber || id;

     let emailSent = false;
     if (customerEmail) {
       try {
         console.log(`Sending tracking email to: ${customerEmail}`);
         
         await sendTrackingEmail({
           customerEmail,
           customerName,
           orderNumber,
           trackingNumber: trackingNumber.toUpperCase(),
           carrier: carrier.toLowerCase(),
           trackingUrl
         });
         
         console.log(`Tracking email sent successfully for order: ${id}`);
         emailSent = true;
       } catch (emailError) {
         console.error('Failed to send tracking email:', emailError);
       }
     } else {
       console.warn(`No customer email found for order: ${id}`);
     }
     
     return NextResponse.json({ 
       success: true,
       trackingUrl,
       shippoInitialized: shippoSuccess,
       emailSent
     });
   } catch (firebaseError) {
     console.error('Firebase error:', firebaseError);
     return NextResponse.json(
       { 
         error: 'Firebase operation failed',
         details: firebaseError instanceof Error ? firebaseError.message : 'Unknown Firebase error'
       },
       { status: 500 }
     );
   }
 } catch (error) {
   console.error('Error in add-tracking API:', error);
   
   let errorMessage = 'Failed to add tracking';
   let errorDetails = undefined;
   
   if (error instanceof Error) {
     errorMessage = error.message;
     errorDetails = error.stack;
   }
   
   return NextResponse.json(
     { 
       error: errorMessage,
       details: errorDetails
     },
     { status: 500 }
   );
 }
}