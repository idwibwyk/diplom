import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export type ThemeColor = 'teal' | 'blue' | 'green';

type ThemeContextValue = {
  theme: ThemeColor;
  /** Цвет акцента: #53C9CA (teal), #4A90E2 (blue), #40AB40 (green) */
  primary: string;
  /** Класс градиента для кнопок */
  btnGradient: string;
  /** Класс для заголовков с градиентом */
  titleGradient: string;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const TEAL = {
  primary: '#53C9CA',
  btnGradient: 'bg-gradient-to-r from-[#53C9CA] to-[#9ADFE0] hover:from-[#45b5b6] hover:to-[#8ad5d6]',
  titleGradient: 'bg-gradient-to-r from-[#53C9CA] to-[#9ADFE0] bg-clip-text text-transparent',
};
const BLUE = {
  primary: '#4A90E2',
  btnGradient: 'bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] hover:from-[#3d7bc9] hover:to-[#8eb5e0]',
  titleGradient: 'bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent',
};
const GREEN = {
  primary: '#40AB40',
  btnGradient: 'bg-gradient-to-r from-[#40AB40] to-[#89E689] hover:from-[#009B00] hover:to-[#6ed46e]',
  titleGradient: 'bg-gradient-to-r from-[#40AB40] to-[#89E689] bg-clip-text text-transparent',
};

function getThemeFromPath(pathname: string): ThemeColor {
  if (pathname.startsWith('/services')) return 'blue';
  if (pathname.startsWith('/courses') || pathname.startsWith('/book/course') || pathname.startsWith('/dashboard-courses')) return 'green';
  return 'teal';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const theme = useMemo(() => getThemeFromPath(location.pathname), [location.pathname]);
  const value = useMemo<ThemeContextValue>(() => {
    const map = { teal: TEAL, blue: BLUE, green: GREEN };
    const t = map[theme];
    return { theme, primary: t.primary, btnGradient: t.btnGradient, titleGradient: t.titleGradient };
  }, [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx ?? { theme: 'teal' as ThemeColor, ...TEAL };
}
