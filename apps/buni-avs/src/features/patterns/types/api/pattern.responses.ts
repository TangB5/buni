import { PatternDto } from '../dto/pattern.dto';

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

export type PatternListApiResponse =
  ApiResponse<
    PaginatedResponse<PatternDto>
  >;

export type PatternDetailsApiResponse =
  ApiResponse<PatternDto>;

  