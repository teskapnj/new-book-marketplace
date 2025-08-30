// app/api/orders/[id]/add-tracking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';
import { initializeShippoTracking, getTrackingUrl } from '@/lib/shippo';
import { sendTrackingEmail } from '@/lib/emails';
import { FieldValue } from 'firebase-admin/firestore';

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
     
     // EMAIL GÖNDERME KISMI
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