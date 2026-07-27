import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const backendRes = await fetch(`${apiUrl}/api/v1/patterns/${id}`, {
      headers: {
        Accept: 'application/json',
        ...(request.headers.get('Authorization')
          ? { Authorization: request.headers.get('Authorization')! }
          : {}),
      },
      next: { revalidate: 300 },
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: 'Motif non trouvé' },
        { status: 404 },
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 },
    );
  }
}
