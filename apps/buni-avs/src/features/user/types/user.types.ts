export interface UserProfile {
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
  status: 'published' | 'draft' | 'review';
  views: number;
  downloads: number;
  imgUrl: string;
}

export interface UserActivity {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'comment' | 'download' | 'review' | 'favorite';
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  specialty?: string;
  avatar?: string;
}
