import { get } from '@buni/api';


export interface DashboardStats {
  patternsCreated: number;
  downloadsTotal: number;
  totalViews: number;
  favoritesCount: number;
  trends: {
    patternsTrend: string;
    downloadsTrend: string;
    viewsTrend: string;
    favoritesTrend: string;
  };
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
  slug?: string;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await get<{ success: boolean; data: DashboardStats }>('/api/v1/users/me/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {
        patternsCreated: 0,
        downloadsTotal: 0,
        totalViews: 0,
        favoritesCount: 0,
        trends: {
          patternsTrend: '+0 ce mois',
          downloadsTrend: '+0% vs mois dernier',
          viewsTrend: '+0 ce mois',
          favoritesTrend: '+0 nouveaux',
        },
      };
    }
  }

  async getRecentPatterns(limit: number = 5): Promise<UserPattern[]> {
    try {
      const response = await get<{ success: boolean; data: any[] }>(`/api/v1/users/me/patterns?limit=${limit}`);
      return (response.data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        status: p.status,
        viewCount: p.views || 0,
        downloadCount: p.downloads || 0,
        slug: p.slug,
      }));
    } catch (error) {
      console.error('Failed to fetch patterns:', error);
      return [];
    }
  }

  async getActivity(limit: number = 6): Promise<DashboardActivity[]> {
    try {
      const response = await get<{ success: boolean; data: DashboardActivity[] }>(`/api/v1/users/me/activity?limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      return [];
    }
  }

  async getGlobalRecentPatterns(limit: number = 5): Promise<UserPattern[]> {
    try {
      const response = await get<{ success: boolean; data: any[] }>(`/api/v1/patterns/recent/global?limit=${limit}`);
      return (response.data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        status: p.status?.toLowerCase() as 'published' | 'draft' | 'review',
        viewCount: p.views || 0,
        downloadCount: p.downloads || 0,
        slug: p.slug,
      }));
    } catch (error) {
      console.error('Failed to fetch global recent patterns:', error);
      return [];
    }
  }

  async getGlobalActivity(limit: number = 6): Promise<DashboardActivity[]> {
    try {
      const response = await get<{ success: boolean; data: DashboardActivity[] }>(`/api/v1/activities/global?perPage=${limit}`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch global activity:', error);
      return [];
    }
  }
}

export const dashboardService = new DashboardService();
