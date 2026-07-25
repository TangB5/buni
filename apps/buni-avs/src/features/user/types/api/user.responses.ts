import { UserDto } from '../dto/user.dto';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export type UserListApiResponse = ApiResponse<PaginatedResponse<UserDto>>;
export type UserDetailApiResponse = ApiResponse<UserDto>;
export type UserStatsApiResponse = ApiResponse<any>;
export type UserPatternsApiResponse = ApiResponse<any>;
export type UserActivityApiResponse = ApiResponse<any>;
