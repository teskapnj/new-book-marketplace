// app/api/shipping/rates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getShippingRates, isTestModeEnabled, convertParcelToNumbers } from '@/lib/shippo';
import type { ShippingAddress } from '@/lib/shippo'; // Removed ShippingParcel since it's not used

export async function POST(request: NextRequest) {
  try {
    console.log('Received shipping rates request');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { address_from, address_to, parcels } = body;

    // Validate incoming data
    if (!address_from || !address_to || !parcels || !Array.isArray(parcels) || parcels.length === 0) {
      console.error('Missing required parameters:', { address_from, address_to, parcels });
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters',
        details: 'address_from, address_to, and parcels array are required'
      }, { status: 400 });
    }

    // Convert the first parcel to proper number format
    const parcel = convertParcelToNumbers(parcels[0]);
    
    console.log('Converted parcel:', parcel);
    console.log('From address:', address_from);
    console.log('To address:', address_to);

    // Calculate shipping rates
    const result = await getShippingRates(
      address_from as ShippingAddress,
      address_to as ShippingAddress,
      parcel
    );

    console.log('Shipping rates result:', result);

    // Add test mode information to the response
    return NextResponse.json({
      success: true,
      data: result,
      testMode: isTestModeEnabled()
    });
  } catch (error) {
    console.error('Shipping rates error:', error);

    // Return a proper JSON error response
    return NextResponse.json({
      success: false,
      error: 'Failed to calculate shipping rates',
      message: error instanceof Error ? error.message : 'Unknown error',
      testMode: isTestModeEnabled()
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}