/**
 * Универсальный хук useEntity — подключение к любому роутеру API (таблице БД).
 * Возвращает: list, item, create, update, remove, refetch и все состояния загрузки/ошибок.
 */

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/app/api/client';
import type { ApiListResponse, ApiItemResponse, ApiErrorResponse } from '@/app/api/types';

export interface UseEntityOptions<T = Record<string, unknown>> {
  /** Загружать список сразу при монтировании */
  fetchListOnMount?: boolean;
  /** Параметры запроса списка (page, limit, фильтры) */
  listParams?: Record<string, string | number | undefined>;
  /** ID записи для загрузки одной (getById) */
  id?: number | null;
  /** Загружать одну запись по id при монтировании */
  fetchItemOnMount?: boolean;
  /** Если false — не выполнять запросы при монтировании (для защищённых ресурсов без 403) */
  enabled?: boolean;
}

export interface EntityPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UseEntityResult<T = Record<string, unknown>> {
  /** Список записей (из GET /entity) */
  list: T[];
  /** Одна запись (из GET /entity/:id) */
  item: T | null;
  /** Пагинация списка */
  pagination: EntityPagination | null;

  /** Загрузить список (с опциональными params) */
  refetchList: (params?: Record<string, string | number | undefined>) => Promise<void>;
  /** Загрузить одну запись по id */
  refetchItem: (itemId: number) => Promise<void>;

  /** Создать запись (POST /entity) */
  create: (body: Partial<T>) => Promise<{ data: T | null; error: string | null }>;
  /** Обновить запись (PUT /entity/:id) */
  update: (id: number, body: Partial<T>) => Promise<{ data: T | null; error: string | null }>;
  /** Удалить запись (DELETE /entity/:id) */
  remove: (id: number) => Promise<{ success: boolean; error: string | null }>;

  /** Состояния списка */
  loadingList: boolean;
  loadingListError: string | null;
  /** Состояния одной записи */
  loadingItem: boolean;
  loadingItemError: string | null;
  /** Состояния create */
  creating: boolean;
  createError: string | null;
  /** Состояния update */
  updating: boolean;
  updateError: string | null;
  /** Состояния delete */
  deleting: boolean;
  deleteError: string | null;
}

const defaultPagination: EntityPagination = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
};

/**
 * Универсальный хук для работы с любой сущностью API.
 * @param entityName — название роутера (таблицы): masters, services, courses, pets, faq_items, gallery_items, contacts, leads, service_bookings, course_schedules, reviews и т.д.
 */
export function useEntity<T = Record<string, unknown>>(
  entityName: string,
  options: UseEntityOptions<T> = {}
): UseEntityResult<T> {
  const {
    fetchListOnMount = true,
    listParams = {},
    id = null,
    fetchItemOnMount = false,
    enabled = true,
  } = options;

  const [list, setList] = useState<T[]>([]);
  const [item, setItem] = useState<T | null>(null);
  const [pagination, setPagination] = useState<EntityPagination | null>(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingListError, setLoadingListError] = useState<string | null>(null);
  const [loadingItem, setLoadingItem] = useState(false);
  const [loadingItemError, setLoadingItemError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const basePath = `/${entityName}`;

  const refetchList = useCallback(
    async (params?: Record<string, string | number | undefined>) => {
      setLoadingList(true);
      setLoadingListError(null);
      const query = new URLSearchParams();
      const merged = { ...listParams, ...params };
      Object.entries(merged).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.set(k, String(v));
      });
      const queryString = query.toString();
      const path = queryString ? `${basePath}?${queryString}` : basePath;
      const res = await api.get<ApiListResponse<T> | ApiErrorResponse>(path);
      setLoadingList(false);
      if ('error' in res && res.error) {
        setLoadingListError(res.error);
        setList([]);
        setPagination(null);
        return;
      }
      // res = { data: backendBody }; backendBody = { success, data: T[], pagination? }
      const backendBody = (res as { data: ApiListResponse<T> }).data;
      setList(Array.isArray(backendBody?.data) ? backendBody.data : []);
      setPagination(backendBody?.pagination ?? null);
    },
    [basePath, listParams]
  );

  const refetchItem = useCallback(
    async (itemId: number) => {
      setLoadingItem(true);
      setLoadingItemError(null);
      const res = await api.get<ApiItemResponse<T> | ApiErrorResponse>(`${basePath}/${itemId}`);
      setLoadingItem(false);
      if ('error' in res && res.error) {
        setLoadingItemError(res.error);
        setItem(null);
        return;
      }
      const backendBody = (res as { data: ApiItemResponse<T> }).data;
      setItem(backendBody?.data ?? null);
    },
    [basePath]
  );

  const create = useCallback(
    async (body: Partial<T>): Promise<{ data: T | null; error: string | null }> => {
      setCreating(true);
      setCreateError(null);
      const res = await api.post<ApiItemResponse<T> | ApiErrorResponse>(basePath, body);
      setCreating(false);
      if ('error' in res && res.error) {
        setCreateError(res.error);
        return { data: null, error: res.error };
      }
      const backendBody = (res as { data: ApiItemResponse<T> }).data;
      const newItem = backendBody?.data ?? null;
      if (newItem) setList((prev) => [newItem as T, ...prev]);
      return { data: newItem ?? null, error: null };
    },
    [basePath]
  );

  const update = useCallback(
    async (id: number, body: Partial<T>): Promise<{ data: T | null; error: string | null }> => {
      setUpdating(true);
      setUpdateError(null);
      const res = await api.put<ApiItemResponse<T> | ApiErrorResponse>(`${basePath}/${id}`, body);
      setUpdating(false);
      if ('error' in res && res.error) {
        setUpdateError(res.error);
        return { data: null, error: res.error };
      }
      const backendBody = (res as { data: ApiItemResponse<T> }).data;
      const updatedItem = backendBody?.data ?? null;
      if (updatedItem) {
        setList((prev) => prev.map((x) => ((x as { id?: number }).id === id ? updatedItem : x)));
        if (item && (item as { id?: number }).id === id) setItem(updatedItem);
      }
      return { data: updatedItem ?? null, error: null };
    },
    [basePath, item]
  );

  const remove = useCallback(
    async (id: number): Promise<{ success: boolean; error: string | null }> => {
      setDeleting(true);
      setDeleteError(null);
      const res = await api.delete<{ success?: boolean } | ApiErrorResponse>(`${basePath}/${id}`);
      setDeleting(false);
      if ('error' in res && res.error) {
        setDeleteError(res.error);
        return { success: false, error: res.error };
      }
      setList((prev) => prev.filter((x) => (x as { id?: number }).id !== id));
      if (item && (item as { id?: number }).id === id) setItem(null);
      return { success: true, error: null };
    },
    [basePath, item]
  );

  // При смене сущности сбрасываем список и ошибку, чтобы не показывать старые данные
  useEffect(() => {
    setList([]);
    setLoadingListError(null);
    setPagination(null);
  }, [entityName]);

  useEffect(() => {
    if (enabled && fetchListOnMount) refetchList();
  }, [entityName, enabled, fetchListOnMount]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (enabled && fetchItemOnMount && id != null) refetchItem(id);
  }, [entityName, enabled, fetchItemOnMount, id]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    list,
    item,
    pagination: pagination ?? null,
    refetchList,
    refetchItem,
    create,
    update,
    remove,
    loadingList,
    loadingListError,
    loadingItem,
    loadingItemError,
    creating,
    createError,
    updating,
    updateError,
    deleting,
    deleteError,
  };
}

export default useEntity;
