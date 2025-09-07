// app/api/auth/verify-role/route.ts - COMPLETE VERSION
import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  uid: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { uid, email } = body;
    
    if (!uid || !email) {
      return NextResponse.json({
        success: false,
        role: 'user',
        verified: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    console.log(`🔍 API Role check for UID: ${uid}, Email: ${email}`);

    // Bu API artık sadece admin kontrolü yapıyor
    // Gerçek rol kontrolü client-side Firestore'dan yapılıyor
    
    // Admin email kontrolü
    if (email === 'admin@secondlife.com') {
      console.log('✅ Admin role assigned via API');
      return NextResponse.json({
        success: true,
        role: 'admin',
        verified: true
      });
    }

    // Diğer tüm kullanıcılar için success döndür
    // Client-side Firestore kontrolü yapacak
    console.log('📝 API returning success, client will handle Firestore');
    
    return NextResponse.json({
      success: true,
      role: 'user', // Client-side override edilecek
      verified: true
    });

  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json({
      success: false,
      role: 'user',
      verified: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed'
  }, { status: 405 });
}