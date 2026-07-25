import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const accessToken = body?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Token Google manquant' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Google auth route ready',
      data: { accessToken },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 },
    );
  }
}
