
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll();
  const headers = Object.fromEntries(request.headers.entries());
  
  return NextResponse.json({
    message: 'Cookie test endpoint',
    cookies: cookies.map(c => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length || 0 })),
    cookieCount: cookies.length,
    host: request.headers.get('host'),
    userAgent: request.headers.get('user-agent'),
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer'),
    timestamp: new Date().toISOString(),
    allHeaders: headers
  });
}
