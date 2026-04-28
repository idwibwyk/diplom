/**
 * API-клиент для бэкенда MARS GROOM.
 * Базовый URL и заголовок Authorization с JWT.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const STORAGE_USER = 'mars_groom_user';

function getToken(): string | null {
  return localStorage.getItem('mars_groom_token');
}

export function hasToken(): boolean {
  return !!getToken();
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem('mars_groom_token', token);
  else localStorage.removeItem('mars_groom_token');
}

export interface ApiError {
  success: false;
  error?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T } | { error: string; hint?: string }> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch {
    return {
      error: 'Не удалось подключиться к серверу',
      hint: 'Проверьте, что бэкенд запущен и VITE_API_URL настроен корректно',
    };
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = json?.error || res.statusText || 'Ошибка запроса';
    const hint = json?.hint;
    if (res.status === 401 && token) {
      // Сбрасываем сессию только когда токен действительно невалиден.
      localStorage.removeItem('mars_groom_token');
      localStorage.removeItem(STORAGE_USER);
      window.dispatchEvent(new CustomEvent('mars_auth_invalid'));
    }
    return hint != null ? { error: message, hint: String(hint) } : { error: message };
  }
  return { data: json as T };
}

export interface TimeSlot {
  time: string;
  datetime: string;
  available?: boolean;
}

/** Базовый URL бэкенда без /api — для картинок загрузок (uploads) */
export function getUploadBaseUrl(): string {
  return (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '') || 'http://localhost:3001';
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),

  /** Загрузка фото питомца (multipart/form-data), поле "photo" */
  async uploadPetPhoto(formData: FormData): Promise<{ data?: { success: true; url: string }; error?: string }> {
    const url = `${API_BASE}/upload/pet-photo`;
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { method: 'POST', body: formData, headers });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (json as { error?: string }).error || res.statusText };
    return { data: json as { success: true; url: string } };
  },
  /** Загрузка фото клиента (multipart/form-data), поле "photo" */
  async uploadUserPhoto(formData: FormData): Promise<{ data?: { success: true; url: string }; error?: string }> {
    const url = `${API_BASE}/upload/user-photo`;
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { method: 'POST', body: formData, headers });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (json as { error?: string }).error || res.statusText };
    return { data: json as { success: true; url: string } };
  },

  /** Загрузка файла домашнего задания (multipart/form-data), поле "file" */
  async uploadHomeworkFile(formData: FormData): Promise<{ data?: { success: true; url: string; original_name?: string }; error?: string }> {
    const url = `${API_BASE}/upload/homework-file`;
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { method: 'POST', body: formData, headers });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (json as { error?: string }).error || res.statusText };
    return { data: json as { success: true; url: string; original_name?: string } };
  },

  /** Доступные слоты на дату для записи на услугу */
  getSlots: (params: { date: string; master_id?: number; service_id?: number }) => {
    const q = new URLSearchParams({ date: params.date });
    if (params.master_id != null) q.set('master_id', String(params.master_id));
    if (params.service_id != null) q.set('service_id', String(params.service_id));
    return request<{ success: true; data: TimeSlot[] }>(
      `/service_bookings/slots?${q.toString()}`
    );
  },
};

export default api;
