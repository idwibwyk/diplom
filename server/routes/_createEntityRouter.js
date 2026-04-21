/**
 * Фабрика роутера для сущности: GET /, GET /search, GET /:id, POST, PUT, DELETE.
 * Используется всеми 44 роутерами.
 */
import express from 'express';
import createController from '../controllers/universalController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateIdParam } from '../middleware/validate.js';

export default function createEntityRouter(tableName, rolesConfig = {}, options = {}) {
  const ctrl = createController(tableName, rolesConfig, options);
  const router = express.Router({ mergeParams: true });
  router.use(optionalAuth);
  router.get('/', ctrl.getAll);
  router.get('/search', ctrl.search);
  router.get('/:id', validateIdParam, ctrl.getById);
  router.post('/', ctrl.create);
  router.put('/:id', validateIdParam, ctrl.update);
  router.delete('/:id', validateIdParam, ctrl.delete);
  return router;
}
