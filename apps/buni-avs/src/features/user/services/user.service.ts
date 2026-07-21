import { apiClient } from "@buni/api";
import type {
  UserProfile,
  UserStats,
  UserPattern,
  UserActivity,
  UpdateProfileData,
} from '../types/user.types';

class UserService {
  private readonly baseUrl = '/api/v1/users';

  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<{ data: UserProfile; success: boolean }>(`${this.baseUrl}/me`);
    return response.data.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await apiClient.patch<{ data: UserProfile; success: boolean }>(`${this.baseUrl}/me`, data);
    return response.data.data;
  }

  async getStats(): Promise<UserStats> {
    const response = await apiClient.get<{ data: UserStats; success: boolean }>(`${this.baseUrl}/me/stats`);
    return response.data.data;
  }

  async getPatterns(limit: number = 5): Promise<UserPattern[]> {
    const response = await apiClient.get<{ data: UserPattern[]; success: boolean }>(`${this.baseUrl}/me/patterns`, {
      params: { limit },
    });
    return response.data.data;
  }

  async getActivity(limit: number = 6): Promise<UserActivity[]> {
    const response = await apiClient.get<{ data: UserActivity[]; success: boolean }>(`${this.baseUrl}/me/activity`, {
      params: { limit },
    });
    return response.data.data;
  }

  async deleteAccount(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/me`);
  }

  async uploadAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ data: UserProfile; success: boolean }>(
      `${this.baseUrl}/me/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  // Admin methods
  async getAllUsers(params?: { search?: string; role?: string }): Promise<UserProfile[]> {
    const response = await apiClient.get<{ data: UserProfile[]; success: boolean }>(`${this.baseUrl}/admin`, {
      params,
    });
    return response.data.data;
  }

  async updateUserRole(userId: string, role: string): Promise<UserProfile> {
    const response = await apiClient.patch<{ data: UserProfile; success: boolean }>(
      `${this.baseUrl}/admin/${userId}/role`,
      { role }
    );
    return response.data.data;
  }

  async toggleUserVerification(userId: string, verified: boolean): Promise<UserProfile> {
    const response = await apiClient.patch<{ data: UserProfile; success: boolean }>(
      `${this.baseUrl}/admin/${userId}/verification`,
      { verified }
    );
    return response.data.data;
  }

  async getPlatformStats(): Promise<{
    totalUsers: number;
    totalPatterns: number;
    totalDownloads: number;
    totalViews: number;
    verifiedUsers: number;
    admins: number;
    curators: number;
    contributors: number;
    patternsByStatus: {
      published: number;
      draft: number;
      review: number;
    };
  }> {
    const response = await apiClient.get<{ data: any; success: boolean }>(`${this.baseUrl}/admin/stats`);
    return response.data.data;
  }

  async getContributors(): Promise<any[]> {
    const response = await apiClient.get<{ data: any; success: boolean }>(`${this.baseUrl}/contributors`);
    return response.data.data;
  }
}

export const userService = new UserService();
