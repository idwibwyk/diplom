import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, LogIn } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { ProfileDropdown } from './ProfileDropdown';
import { useAuth } from '@/app/context/AuthContext';

export function CoursesHeader() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (to: string) => (e: React.MouseEvent) => {
    if (location.pathname === to) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const res = await login(email, password);
    if (!res.ok) return res;
    setIsAuthModalOpen(false);
    if (res.role === 'groomer') navigate('/dashboard-groomer');
    else if (res.role === 'admin') navigate('/dashboard-admin');
    else navigate('/dashboard');
    return res;
  };

  const handleRegister = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await register(data);
    if (res.ok) setIsAuthModalOpen(false);
    return res;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#1e2939]/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-28">
            <Link to="/" onClick={handleHomeClick} className="flex items-center space-x-3">
              <img src="/pictures/logo.png" alt="MARS GROOM" className="w-24 h-24 object-contain" />
              <span className="text-2xl font-bold">MARS GROOM</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/courses" onClick={handleNavClick('/courses')} className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Курсы
              </Link>
              <Link to="/courses/list" onClick={handleNavClick('/courses/list')} className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Каталог
              </Link>
              <Link to="/courses/schedule" onClick={handleNavClick('/courses/schedule')} className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Расписание
              </Link>
              <Link to="/library" onClick={handleNavClick('/library')} className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Библиотека
              </Link>
              <Link to="/courses/blog" onClick={handleNavClick('/courses/blog')} className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Блог
              </Link>
              <Link to="/courses/education" onClick={handleNavClick('/courses/education')} className="text-lg hover:text-[#40AB40] transition-colors font-medium">
                Сведения
              </Link>
              <Link to="/courses/zone-rental" onClick={handleNavClick('/courses/zone-rental')} className="text-lg hover:text-[#40AB40] transition-colors font-medium">
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
