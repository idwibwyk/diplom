import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useAuth } from '@/app/context/AuthContext';

type Variant = 'teal' | 'blue' | 'green';

const variantClass: Record<Variant, string> = {
  teal: 'btn-gradient-teal',
  blue: 'btn-gradient-blue',
  green: 'btn-gradient-green',
};

export function ProfileDropdown({ variant = 'teal' }: { variant?: Variant }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const profileHref =
    user.role === 'groomer'
      ? '/dashboard-groomer'
      : user.role === 'admin'
        ? '/dashboard-admin'
        : '/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-2 ${variantClass[variant]} text-white rounded-full transition-opacity`}
        >
          <User className="w-5 h-5" />
          {user.name}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuItem asChild>
          <Link to={profileHref} className="flex items-center gap-2 cursor-pointer">
            <User className="w-4 h-4" />
            Перейти в профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
          <LogOut className="w-4 h-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
