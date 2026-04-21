/**
 * Типы ответов API MARS GROOM.
 * Бэкенд возвращает: success, data?, error?, pagination?
 */

export interface ApiListResponse<T> {
  success: true;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiItemResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  hint?: string;
}

export type ApiResponse<T> = ApiListResponse<T> | ApiItemResponse<T> | ApiErrorResponse;

export function isApiError<T>(r: ApiResponse<T>): r is ApiErrorResponse {
  return r && (r as ApiErrorResponse).success === false;
}

export function getListData<T>(r: ApiResponse<T[]>): T[] {
  if (isApiError(r)) return [];
  return Array.isArray((r as ApiListResponse<T[]>).data) ? (r as ApiListResponse<T[]>).data : [];
}

export function getItemData<T>(r: ApiResponse<T>): T | null {
  if (isApiError(r)) return null;
  return (r as ApiItemResponse<T>).data ?? null;
}
