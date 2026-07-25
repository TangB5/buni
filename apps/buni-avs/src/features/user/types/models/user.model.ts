// ─────────────────────────────────────────────────────────────
// DOMAIN MODEL
// Frontend/domain representation
// ─────────────────────────────────────────────────────────────

export interface User {
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
  role: UserRole;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  VIEWER = 'VIEWER',
  CONTRIBUTOR = 'CONTRIBUTOR',
  CURATOR = 'CURATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface UserStats {
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

export interface UserPattern {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: PatternStatus;
  views: number;
  downloads: number;
  imgUrl: string;
}

export enum PatternStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  REVIEW = 'review',
}

export interface UserActivity {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  type: ActivityType;
}

export enum ActivityType {
  COMMENT = 'comment',
  DOWNLOAD = 'download',
  REVIEW = 'review',
  FAVORITE = 'favorite',
}
