import { apiClient } from "@buni/api";
import type { UserDto, UserStatsDto, UserPatternDto, UserActivityDto } from '../types';

class UserService {
  private readonly baseUrl = '/api/v1/users';

  async getProfile(): Promise<UserDto> {
    const response = await apiClient.get<{ data: UserDto; success: boolean }>(`${this.baseUrl}/me`);
    return response.data.data;
  }

  async updateProfile(data: any): Promise<UserDto> {
    const response = await apiClient.patch<{ data: UserDto; success: boolean }>(`${this.baseUrl}/me`, data);
    return response.data.data;
  }

  async getStats(): Promise<UserStatsDto> {
    const response = await apiClient.get<{ data: UserStatsDto; success: boolean }>(`${this.baseUrl}/me/stats`);
    return response.data.data;
  }

  async getPatterns(limit: number = 5): Promise<UserPatternDto[]> {
    const response = await apiClient.get<{ data: UserPatternDto[]; success: boolean }>(`${this.baseUrl}/me/patterns`, {
      params: { limit },
    });
    return response.data.data;
  }

  async getActivity(limit: number = 6): Promise<UserActivityDto[]> {
    const response = await apiClient.get<{ data: UserActivityDto[]; success: boolean }>(`${this.baseUrl}/me/activity`, {
      params: { limit },
    });
    return response.data.data;
  }

  async deleteAccount(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/me`);
  }

  async uploadAvatar(file: File): Promise<UserDto> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ data: UserDto; success: boolean }>(
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
  async getAllUsers(params?: { search?: string; role?: string }): Promise<UserDto[]> {
    const response = await apiClient.get<{ data: UserDto[]; success: boolean }>(`${this.baseUrl}/admin`, {
      params,
    });
    return response.data.data;
  }

  async updateUserRole(userId: string, role: string): Promise<UserDto> {
    const response = await apiClient.patch<{ data: UserDto; success: boolean }>(
      `${this.baseUrl}/admin/${userId}/role`,
      { role }
    );
    return response.data.data;
  }

  async toggleUserVerification(userId: string, verified: boolean): Promise<UserDto> {
    const response = await apiClient.patch<{ data: UserDto; success: boolean }>(
      `${this.baseUrl}/admin/${userId}/verification`,
      { verified }
    );
    return response.data.data;
  }

  async getPlatformStats(): Promise<any> {
    const response = await apiClient.get<{ data: any; success: boolean }>(`${this.baseUrl}/admin/stats`);
    return response.data.data;
  }

  async getContributors(): Promise<any[]> {
    const response = await apiClient.get<{ data: any; success: boolean }>(`${this.baseUrl}/contributors`);
    return response.data.data;
  }

  async becomeCurator(data: any): Promise<UserDto> {
    const response = await apiClient.post<{ data: UserDto; success: boolean }>(
      `${this.baseUrl}/become-curator`,
      data
    );
    return response.data.data;
  }
}

export const userService = new UserService();
