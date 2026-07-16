import { get } from '@buni/api';


export interface DashboardStats {
  patternsCount: number;
  downloadsTotal: number;
  viewsTotal: number;
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
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await get<{ success: boolean; data: DashboardStats }>('/api/v1/users/me/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {
        patternsCount: 0,
        downloadsTotal: 0,
        viewsTotal: 0,
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
}

export const dashboardService = new DashboardService();
