import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogIn } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { ProfileDropdown } from './ProfileDropdown';
import { useAuth } from '@/app/context/AuthContext';

export function CoursesHeader() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = (email: string, password: string) => {
    const { role } = login(email, password);
    setIsAuthModalOpen(false);
    if (role === 'groomer') navigate('/dashboard-groomer');
    else if (role === 'admin') navigate('/dashboard-admin');
  };

  const handleRegister = (data: { name: string; email: string }) => {
    register(data);
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-28">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/pictures/logo.jpg" alt="MARS GROOM" className="w-24 h-24 object-contain" />
              <span className="text-2xl font-bold">MARS GROOM</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/courses" className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Курсы
              </Link>
              <Link to="/courses/list" className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Каталог
              </Link>
              <Link to="/courses/schedule" className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Расписание
              </Link>
              <Link to="/library" className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Библиотека
              </Link>
              <Link to="/courses/blog" className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Блог
              </Link>
              <Link to="/courses/education" className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Сведения
              </Link>
              <Link to="/courses/zone-rental" className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Аренда
              </Link>
              {user ? (
                <ProfileDropdown variant={user.role === 'client' ? 'teal' : 'green'} />
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 btn-gradient-green text-white rounded-full"
                >
                  <LogIn className="w-5 h-5" />
                  Войти
                </button>
              )}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </>
  );
}
