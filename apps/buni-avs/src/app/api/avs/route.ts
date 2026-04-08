import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ── Schéma query params ───────────────────────────────────────────────────────
const QuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  patternType: z.string().optional(),
  region: z.string().optional(),
  search: z.string().max(128).optional(),
  featured: z.coerce.boolean().optional(),
});

// ── Schéma de création ────────────────────────────────────────────────────────
const CreatePatternSchema = z.object({
  nameFr: z.string().min(2).max(128),
  nameEn: z.string().min(2).max(128),
  descFr: z.string().min(10).max(2000),
  descEn: z.string().min(10).max(2000),
  patternType: z.enum(['kente', 'bogolan', 'adinkra', 'ndebele', 'kuba', 'ndop', 'wax']),
  region: z.enum([
    'west-africa',
    'east-africa',
    'central-africa',
    'north-africa',
    'south-africa',
    'diaspora',
  ]),
  country: z.string().length(2).toUpperCase(),
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
  symbolism: z.object({
    meaning: z.string().max(512),
    keywords: z.array(z.string().max(32)).min(1).max(10),
    usage: z.enum(['ceremonial', 'daily', 'royal', 'spiritual', 'universal']),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/avs/patterns
// Proxy vers le backend ou mock en développement
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = QuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!query.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Paramètres invalides',
          details: query.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // En production, proxifier vers le backend Express
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      const params = new URLSearchParams(
        Object.entries(query.data)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      );
      const backendRes = await fetch(`${apiUrl}/patterns?${params.toString()}`, {
        headers: {
          Accept: 'application/json',

          ...(request.headers.get('Authorization')
            ? { Authorization: request.headers.get('Authorization')! }
            : {}),
        },
        next: { revalidate: 60 },
      });

      if (!backendRes.ok) {
        throw new Error(`Backend error: ${backendRes.status}`);
      }

      const data: unknown = await backendRes.json();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
      });
    }

    // Mock en développement (aucun backend)
    return NextResponse.json({
      success: true,
      message: 'OK (mock)',
      data: [],
      meta: { page: query.data.page, perPage: query.data.perPage, totalItems: 0, totalPages: 0 },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/avs/patterns
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Vérification auth basique (le middleware gère la protection complète)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé', code: 'UNAUTHORIZED' },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const result = CreatePatternSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Données invalides',
          details: result.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    // Proxy vers backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      const backendRes = await fetch(`${apiUrl}/patterns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(result.data),
      });

      const data: unknown = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Motif créé (mock)',
        data: { ...result.data, id: crypto.randomUUID() },
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 },
    );
  }
}
