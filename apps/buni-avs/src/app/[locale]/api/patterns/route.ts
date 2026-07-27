import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const params = new URLSearchParams(searchParams);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const backendRes = await fetch(`${apiUrl}/api/v1/patterns?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        ...(request.headers.get('Authorization')
          ? { Authorization: request.headers.get('Authorization')! }
          : {}),
      },
      next: { revalidate: 60 },
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: 'Erreur backend' },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 },
    );
  }
}
