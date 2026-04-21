/**
 * Middleware авторизации: подставляет req.user из JWT или гостя.
 * Для маршрутов, где авторизация не обязательна (универсальный контроллер сам проверяет права).
 */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mars-groom-secret-change-in-production';

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    req.user = { id: null, role: 'guest' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role || 'client' };
    return next();
  } catch {
    req.user = { id: null, role: 'guest' };
    return next();
  }
}

/**
 * Обязательная авторизация: если нет валидного токена — 401.
 */
export function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  next();
}

/**
 * Только админ.
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ только для администратора' });
  }
  next();
}

export { JWT_SECRET };
