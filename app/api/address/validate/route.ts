// app/api/address/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { street1, city, state, zip, country } = await request.json();
    
    const response = await fetch('https://api.goshippo.com/addresses/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Validation',
        street1,
        city,
        state,
        zip,
        country,
        validate: true
      })
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      valid: data.validation_results?.is_valid || false,
      suggested: data.validation_results?.suggested || null
    });
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}