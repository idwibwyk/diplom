/**
 * Контроллер авторизации: логин и регистрация.
 * Телефон в БД хранится в едином формате: +7 (XXX) XXX-XX-XX.
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/knex.js';
import { JWT_SECRET } from '../middleware/auth.js';

const EXCLUDE_USER_FIELDS = ['password_hash'];

function omitFields(record) {
  if (!record) return record;
  const copy = { ...record };
  EXCLUDE_USER_FIELDS.forEach((f) => delete copy[f]);
  return copy;
}

/** Нормализация телефона к единому виду в БД: +7 (XXX) XXX-XX-XX */
function normalizePhone(value) {
  if (!value || typeof value !== 'string') return null;
  const digits = value.replace(/\D/g, '');
  let d = digits.startsWith('8') ? '7' + digits.slice(1) : digits.startsWith('7') ? digits : '7' + digits;
  d = d.slice(0, 11);
  if (d.length < 11) return value.trim() || null;
  return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Укажите email и пароль' });
    }

    const user = await db('users').where({ email: email.trim().toLowerCase() }).first();
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Пользователь с таким email не найден.',
        hint: 'Зарегистрируйтесь, чтобы создать аккаунт.',
      });
    }
    if (!user.password_hash) {
      return res.status(401).json({
        success: false,
        error: 'Пользователь с таким email не найден.',
        hint: 'Зарегистрируйтесь, чтобы создать аккаунт.',
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        error: 'Неверный пароль.',
        hint: 'Проверьте правильность ввода пароля.',
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '365d' });

    return res.json({
      success: true,
      token,
      user: omitFields(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function register(req, res) {
  try {
    const { email, password, name, phone } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Укажите email, пароль и имя' });
    }

    const existing = await db('users').where({ email: email.trim().toLowerCase() }).first();
    if (existing) {
      return res.status(409).json({ success: false, error: 'Пользователь с таким email уже существует. Войдите в аккаунт или используйте другой email.' });
    }

    const phoneNormalized = normalizePhone(phone);
    const password_hash = await bcrypt.hash(password, 10);
    const [row] = await db('users')
      .insert({
        email: email.trim().toLowerCase(),
        password_hash,
        name: name.trim(),
        phone: phoneNormalized,
        role: 'client',
      })
      .returning('id');
    const id = row?.id ?? row;
    const user = await db('users').where({ id }).first();

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '365d' });

    return res.status(201).json({
      success: true,
      token,
      user: omitFields(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
