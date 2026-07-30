import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  // TODO: Log cancelled payment
  // Optionally send follow-up email

  return NextResponse.json({
    success: false,
    sessionId,
    message: 'Payment cancelled',
  });
}
