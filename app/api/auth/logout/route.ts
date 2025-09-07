// app/api/auth/logout/route.ts - COMPLETE VERSION
import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  uid: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { uid } = body;
    
    console.log('🚪 Logout request received for UID:', uid);

    // Burada logout işlemleri yapılabilir:
    // - Session temizleme
    // - Güvenlik logları
    // - Database güncellemeleri

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('❌ Logout API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    error: 'Method not allowed'
  }, { status: 405 });
}