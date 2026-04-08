import { get } from '@/core/api/client';

export interface DashboardStats {
  patternsCount: number;
  downloadsTotal: number;
  viewsTotal: number;
  favoritesCount: number;
}

export interface DashboardActivity {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'comment' | 'download' | 'review' | 'favorite';
}

export interface UserPattern {
  id: string;
  name: string;
  type: string;
  status: 'published' | 'draft' | 'review';
  viewCount: number;
  downloadCount: number;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await get('/api/v1/users/me/stats');
      return response as DashboardStats;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {
        patternsCount: 0,
        downloadsTotal: 0,
        viewsTotal: 0,
        favoritesCount: 0,
      };
    }
  }

  async getRecentPatterns(limit: number = 5): Promise<UserPattern[]> {
    try {
      const response = await get(`/api/v1/users/me/patterns?limit=${limit}`);
      return (response as UserPattern[]) || [];
    } catch (error) {
      console.error('Failed to fetch patterns:', error);
      return [];
    }
  }

  async getActivity(limit: number = 6): Promise<DashboardActivity[]> {
    try {
      const response = await get(`/api/v1/users/me/activity?limit=${limit}`);
      return (response as DashboardActivity[]) || [];
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      return [];
    }
  }
}

export const dashboardService = new DashboardService();
