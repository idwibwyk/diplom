/**
 * Сервер API MARS GROOM — Express + универсальный CRUD с проверкой прав по ролям.
 * Запуск: node server/index.js или npm run server
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const uploadsDir = path.join(projectRoot, 'uploads');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use('/uploads', express.static(uploadsDir));
app.use('/api', routes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'MARS GROOM API' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}/api`);
});
