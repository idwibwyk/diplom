import { Heart } from 'lucide-react';
import { useFavoritesContext } from '@/app/context/FavoritesContext';

interface FavoriteButtonProps {
  type: 'service' | 'course';
  id: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function FavoriteButton({ type, id, className = '', onClick }: FavoriteButtonProps) {
  const { isServiceFavorite, isCourseFavorite, toggleService, toggleCourse } = useFavoritesContext();
  const isFav = type === 'service' ? isServiceFavorite(id) : isCourseFavorite(id);
  const toggle = type === 'service' ? toggleService : toggleCourse;

  return (
    <button
      type="button"
      aria-label={isFav ? 'Убрать из избранного' : 'В избранное'}
      onClick={(e) => {
        toggle(id);
        onClick?.(e);
      }}
      className={`p-2 rounded-full transition-colors ${className}`}
    >
      <Heart
        className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`}
      />
    </button>
  );
}
