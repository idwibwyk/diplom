import React, { useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPhoneInput, normalizePhoneForDb, isValidPhone } from '@/app/utils/phoneMask';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<{ ok: boolean; error?: string; hint?: string }>;
  onRegister: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ ok: boolean; error?: string; hint?: string }>;
}

const MIN_PASSWORD_LENGTH = 6;
const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;

function validateName(name: string): string | null {
  const t = name.trim();
  if (t.length < 2) return 'Имя должно содержать не менее 2 символов';
  if (!NAME_REGEX.test(t)) return 'Имя может содержать только буквы, пробелы и дефис';
  return null;
}

function validatePassword(password: string, isLogin: boolean): string | null {
  if (!password) return 'Введите пароль';
  if (!isLogin && password.length < MIN_PASSWORD_LENGTH) return `Пароль должен быть не менее ${MIN_PASSWORD_LENGTH} символов`;
  return null;
}

export function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '+7 (',
    role: 'client',
  });

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    setFieldErrors((prev) => ({ ...prev, phone: '' }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setHint(null);
    setFieldErrors({});

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const name = formData.name.trim();

    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Введите email';
    const nameErr = mode === 'register' ? validateName(formData.name) : null;
    if (nameErr) errs.name = nameErr;
    const pwdErr = validatePassword(password, mode === 'login');
    if (pwdErr) errs.password = pwdErr;
    if (mode === 'register') {
      const phoneVal = formData.phone.trim();
      if (!phoneVal || phoneVal.length < 10) errs.phone = 'Введите корректный номер телефона';
      else if (!isValidPhone(phoneVal)) errs.phone = 'Формат: +7 (999) 123-45-67';
    }
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await onLogin(email, password);
        if (res.ok) onClose();
        else {
          setError(res.error || 'Ошибка входа');
          setHint(res.hint ?? null);
        }
      } else {
        const phoneForDb = normalizePhoneForDb(formData.phone);
        const res = await onRegister({ name, email, password, phone: phoneForDb || undefined });
        if (res.ok) onClose();
        else {
          setError(res.error || 'Ошибка регистрации');
          setHint(res.hint ?? null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
    setHint(null);
    setFieldErrors({});
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md z-50 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold">
              {mode === 'login' ? 'Вход' : 'Регистрация'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || hint) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4"
              >
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">{error}</p>
                    {hint && <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{hint}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Имя</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setFieldErrors((p) => ({ ...p, name: '' }));
                        clearError();
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40AB40] ${fieldErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                      placeholder="Введите имя"
                      required
                    />
                  </div>
                  {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Телефон</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onFocus={clearError}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40AB40] ${fieldErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                      placeholder="+7 (999) 123-45-67"
                      required
                    />
                  </div>
                  {fieldErrors.phone && <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setFieldErrors((p) => ({ ...p, email: '' }));
                    clearError();
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40AB40] ${fieldErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Введите электронную почту"
                  required
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setFieldErrors((p) => ({ ...p, password: '' }));
                    clearError();
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40AB40] ${fieldErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder={mode === 'login' ? '••••••••' : `Не менее ${MIN_PASSWORD_LENGTH} символов`}
                  required
                />
              </div>
              {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#40AB40] hover:bg-[#89E689] disabled:opacity-60 text-white py-3 rounded-xl font-bold transition-colors"
            >
              {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
                setHint(null);
                setFieldErrors({});
              }}
              className="text-[#40AB40] no-underline hover:no-underline transition-transform duration-200 hover:scale-110 inline-block"
            >
              {mode === 'login' ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
