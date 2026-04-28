/**
<<<<<<< Updated upstream
 * Загрузка файлов (фото питомцев) через multer.
 * POST /api/upload/pet-photo — поле "photo", только для авторизованных клиентов.
 * POST /api/upload/user-photo — поле "photo", только для авторизованных пользователей.
=======
 * Загрузка файлов через multer.
 * POST /api/upload/pet-photo — фото питомца (image/*)
 * POST /api/upload/homework-file — текстовый документ для домашнего задания.
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
const userUploadsDir = path.join(projectRoot, 'uploads', 'users');
=======
const homeworkUploadsDir = path.join(projectRoot, 'uploads', 'homework');
>>>>>>> Stashed changes

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
<<<<<<< Updated upstream
if (!fs.existsSync(userUploadsDir)) {
  fs.mkdirSync(userUploadsDir, { recursive: true });
=======
if (!fs.existsSync(homeworkUploadsDir)) {
  fs.mkdirSync(homeworkUploadsDir, { recursive: true });
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======

const homeworkStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, homeworkUploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.txt';
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    cb(null, safe);
  },
});

const uploadHomework = multer({
  storage: homeworkStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedByMime = /^(text\/plain|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/i
      .test(file.mimetype);
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedByExt = ['.txt', '.pdf', '.doc', '.docx'].includes(ext);
    if (allowedByMime || allowedByExt) cb(null, true);
    else cb(new Error('Разрешены только текстовые документы: TXT, PDF, DOC, DOCX'));
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
router.post('/user-photo', requireAuth, uploadUser.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Файл не загружен' });
  }
  const relativePath = `/uploads/users/${req.file.filename}`;
  return res.json({ success: true, url: relativePath });
=======
router.post('/homework-file', requireAuth, uploadHomework.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Файл не загружен' });
  }
  const relativePath = `/uploads/homework/${req.file.filename}`;
  return res.json({ success: true, url: relativePath, original_name: req.file.originalname });
>>>>>>> Stashed changes
});

export default router;
