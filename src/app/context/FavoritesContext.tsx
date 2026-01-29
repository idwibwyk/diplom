import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const STORAGE_KEY = 'mars_groom_favorites';

type Favorites = { services: number[]; courses: number[] };

function load(): Favorites {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { services: [], courses: [] };
    const v = JSON.parse(raw) as Favorites;
    return {
      services: Array.isArray(v.services) ? v.services : [],
      courses: Array.isArray(v.courses) ? v.courses : [],
    };
  } catch {
    return { services: [], courses: [] };
  }
}

function save(f: Favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
  } catch (_) {}
}

type FavoritesContextValue = {
  favorites: Favorites;
  toggleService: (id: number) => void;
  toggleCourse: (id: number) => void;
  isServiceFavorite: (id: number) => boolean;
  isCourseFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Favorites>(load);

  useEffect(() => {
    save(data);
  }, [data]);

  const toggleService = useCallback((id: number) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((x) => x !== id)
        : [...prev.services, id],
    }));
  }, []);

  const toggleCourse = useCallback((id: number) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.includes(id)
        ? prev.courses.filter((x) => x !== id)
        : [...prev.courses, id],
    }));
  }, []);

  const isServiceFavorite = useCallback((id: number) => data.services.includes(id), [data.services]);
  const isCourseFavorite = useCallback((id: number) => data.courses.includes(id), [data.courses]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites: data,
        toggleService,
        toggleCourse,
        isServiceFavorite,
        isCourseFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider');
  return ctx;
}
