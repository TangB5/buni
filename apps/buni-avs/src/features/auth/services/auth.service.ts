'use client';

import { post, get } from '../../../core/api/client';
import type { LoginDto, RegisterDto, User } from '../types';

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export const authService = {
  async register(dto: RegisterDto) {
    return post<AuthResponse>('/api/v1/auth/register', dto);
  },

  async login(dto: LoginDto) {
    return post<AuthResponse>('/api/v1/auth/login', dto);
  },

  async logout() {
    try {
      return await post('/api/v1/auth/logout');
    } catch (err) {
      console.warn('Logout failed:', err);
    }
  },

  async getMe() {
    return get<UserResponse>('/api/v1/users/me');
  },

  async refreshToken() {
    return post<AuthResponse>('/api/v1/auth/refresh');
  },
};
