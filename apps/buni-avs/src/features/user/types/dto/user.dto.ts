// ─────────────────────────────────────────────────────────────
// BACKEND DTO
// Représente EXACTEMENT la réponse backend
// ─────────────────────────────────────────────────────────────

export interface UserDto {
  id: string;
  email: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  github: string | null;
  twitter: string | null;
  specialty: string | null;
  avatar: string | null;
  role: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStatsDto {
  patternsCreated: number;
  totalViews: number;
  memberSince: string;
  downloadsTotal?: number;
  favoritesCount?: number;
  commentsCount?: number;
  trends?: {
    patternsTrend: string;
    downloadsTrend: string;
    viewsTrend: string;
    favoritesTrend: string;
  };
}

export interface UserPatternDto {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  views: number;
  downloads: number;
  imgUrl: string;
}

export interface UserActivityDto {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  type?: string;
}
