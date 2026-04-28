/**
 * Загрузка файлов (фото питомцев) через multer.
 * POST /api/upload/pet-photo — поле "photo", только для авторизованных клиентов.
 * POST /api/upload/user-photo — поле "photo", только для авторизованных пользователей.
 */
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const uploadsDir = path.join(projectRoot, 'uploads', 'pets');
const userUploadsDir = path.join(projectRoot, 'uploads', 'users');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(userUploadsDir)) {
  fs.mkdirSync(userUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.mimetype);
    if (allowed) cb(null, true);
    else cb(new Error('Разрешены только изображения (JPEG, PNG, GIF, WEBP)'));
  },
});
const uploadUser = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, userUploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
      cb(null, safe);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.mimetype);
    if (allowed) cb(null, true);
    else cb(new Error('Разрешены только изображения (JPEG, PNG, GIF, WEBP)'));
  },
});

const router = express.Router();

router.post('/pet-photo', requireAuth, upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Файл не загружен' });
  }
  const relativePath = `/uploads/pets/${req.file.filename}`;
  return res.json({ success: true, url: relativePath });
});

router.post('/user-photo', requireAuth, uploadUser.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Файл не загружен' });
  }
  const relativePath = `/uploads/users/${req.file.filename}`;
  return res.json({ success: true, url: relativePath });
});

export default router;
