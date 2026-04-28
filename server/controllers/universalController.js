/**
 * Универсальный CRUD-контроллер с проверкой прав доступа по ролям.
 * Роли проекта MARS GROOM: guest, client, groomer, admin.
 *
 * @param {string} tableName - Название таблицы в БД
 * @param {Object} rolesConfig - Конфигурация прав доступа по ролям (переопределяет дефолт)
 * @param {Object} options - Дополнительные опции (excludeFields, allowGuestCreate, ownerField)
 */
import db from '../db/knex.js';
<<<<<<< Updated upstream
import { syncLoyaltyForUser } from '../services/loyalty.js';
=======
>>>>>>> Stashed changes

const createController = (tableName, rolesConfig = {}, options = {}) => {
  const {
    excludeFields = [],
    allowGuestCreate = false,
    ownerField = 'created_by',
    searchField = 'name',
<<<<<<< Updated upstream
=======
    autoAssignOwner = true,
>>>>>>> Stashed changes
  } = options;

  const defaultRoles = {
    guest: {
      read: false,
      create: allowGuestCreate,
      update: false,
      delete: false,
      readOwn: false,
      updateOwn: false,
      deleteOwn: false,
      manageAll: false,
    },
    client: {
      read: true,
      create: false,
      update: false,
      delete: false,
      readOwn: true,
      updateOwn: true,
      deleteOwn: false,
      manageAll: false,
    },
    groomer: {
      read: true,
      create: true,
      update: true,
      delete: false,
      readOwn: true,
      updateOwn: true,
      deleteOwn: false,
      manageAll: false,
    },
    admin: {
      read: true,
      create: true,
      update: true,
      delete: true,
      readOwn: true,
      updateOwn: true,
      deleteOwn: true,
      manageAll: true,
    },
  };

  const roles = { ...defaultRoles, ...rolesConfig };

  const checkPermission = (userRole, action, resource, userId, resourceOwnerId) => {
    const roleConfig = roles[userRole] || roles.guest;
    if (!roleConfig) return false;
    if (roleConfig.manageAll) return true;
    if (action === 'read' && roleConfig.read) return true;
    if (action === 'create' && roleConfig.create) return true;
    if (action === 'update' && roleConfig.update) return true;
    if (action === 'delete' && roleConfig.delete) return true;
    if (userId != null && resourceOwnerId != null && userId === resourceOwnerId) {
      if (action === 'read' && roleConfig.readOwn) return true;
      if (action === 'update' && roleConfig.updateOwn) return true;
      if (action === 'delete' && roleConfig.deleteOwn) return true;
    }
    return false;
  };

  const omitFields = (record) => {
    if (!record || excludeFields.length === 0) return record;
    const copy = { ...record };
    excludeFields.forEach((f) => delete copy[f]);
    return copy;
  };

  return {
    async create(req, res) {
      try {
        const user = req.user || { id: null, role: 'guest' };
        const data = { ...req.body };

        if (!checkPermission(user.role, 'create', tableName, user.id)) {
          return res.status(403).json({ success: false, error: 'Нет прав на создание' });
        }

<<<<<<< Updated upstream
        if (user.id && data[ownerField] === undefined) {
          data[ownerField] = user.id;
=======
        if (autoAssignOwner && user.id && data[ownerField] === undefined) {
          // Токен может быть валиден, но пользователь уже удалён после reseed.
          // В таком случае не проставляем FK поле, чтобы не падать по ограничению.
          const userExists = await db('users').where({ id: user.id }).first();
          if (userExists) data[ownerField] = user.id;
>>>>>>> Stashed changes
        }

        const [row] = await db(tableName).insert(data).returning('id');
        const id = row?.id ?? row;
        const newRecord = await db(tableName).where({ id }).first();

        return res.status(201).json({
          success: true,
          data: omitFields(newRecord),
          message: 'Запись успешно создана',
        });
      } catch (error) {
<<<<<<< Updated upstream
        if (error?.code === '23503' && String(error?.constraint || '').includes(`${tableName}_user_id_foreign`)) {
          return res.status(401).json({
            success: false,
            error: 'Сессия пользователя недействительна. Выполните вход заново.',
          });
        }
=======
>>>>>>> Stashed changes
        return res.status(500).json({ success: false, error: error.message });
      }
    },

    async getAll(req, res) {
      try {
        const user = req.user || { id: null, role: 'guest' };
        const { page = 1, limit = 20, ...filters } = req.query;
        const offset = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, Math.max(1, parseInt(limit, 10)));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

        if (!checkPermission(user.role, 'read', tableName, user.id)) {
          if (roles[user.role]?.readOwn && user.id) {
            filters[ownerField] = user.id;
          } else {
            return res.status(403).json({ success: false, error: 'Нет прав на чтение' });
          }
        }

<<<<<<< Updated upstream
        // Лояльность: перед выдачей собственных данных пересчитываем «лапки»
        if (tableName === 'loyalty_accounts' && user?.id && roles[user.role]?.readOwn) {
          await syncLoyaltyForUser(user.id);
        }

=======
>>>>>>> Stashed changes
        let query = db(tableName);
        const filterKeys = Object.keys(filters).filter(
          (k) => !['page', 'limit'].includes(k) && filters[k] !== undefined && filters[k] !== ''
        );
        filterKeys.forEach((key) => {
          query = query.where(key, filters[key]);
        });

        const data = await query
          .clone()
          .limit(limitNum)
          .offset(offset)
          .orderBy('created_at', 'desc');

        let totalQuery = db(tableName);
        filterKeys.forEach((key) => {
          totalQuery = totalQuery.where(key, filters[key]);
        });
        const countResult = await totalQuery.count('* as count').first();
        const total = parseInt(countResult?.count ?? 0, 10);

        return res.json({
          success: true,
          data: data.map(omitFields),
          pagination: {
            page: Math.max(1, parseInt(page, 10)),
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum) || 1,
          },
        });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    },

    async getById(req, res) {
      try {
        const user = req.user || { id: null, role: 'guest' };
        const { id } = req.params;

        const record = await db(tableName).where({ id }).first();
        if (!record) {
          return res.status(404).json({ success: false, error: 'Запись не найдена' });
        }

        const canRead = checkPermission(
          user.role,
          'read',
          tableName,
          user.id,
          record[ownerField]
        );
        if (!canRead) {
          return res.status(403).json({ success: false, error: 'Нет прав на просмотр этой записи' });
        }

        return res.json({
          success: true,
          data: omitFields(record),
        });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    },

    async update(req, res) {
      try {
        const user = req.user || { id: null, role: 'guest' };
        const { id } = req.params;
        const data = { ...req.body };

        const record = await db(tableName).where({ id }).first();
        if (!record) {
          return res.status(404).json({ success: false, error: 'Запись не найдена' });
        }

        const canUpdate = checkPermission(
          user.role,
          'update',
          tableName,
          user.id,
          record[ownerField]
        );
        if (!canUpdate) {
          return res.status(403).json({ success: false, error: 'Нет прав на обновление' });
        }

        delete data.id;
        delete data.created_at;
        data.updated_at = db.raw('now()');

        await db(tableName).where({ id }).update(data);
        const updatedRecord = await db(tableName).where({ id }).first();

        return res.json({
          success: true,
          data: omitFields(updatedRecord),
          message: 'Запись успешно обновлена',
        });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    },

    async delete(req, res) {
      try {
        const user = req.user || { id: null, role: 'guest' };
        const { id } = req.params;

        const record = await db(tableName).where({ id }).first();
        if (!record) {
          return res.status(404).json({ success: false, error: 'Запись не найдена' });
        }

        const canDelete = checkPermission(
          user.role,
          'delete',
          tableName,
          user.id,
          record[ownerField]
        );
        if (!canDelete) {
          return res.status(403).json({ success: false, error: 'Нет прав на удаление' });
        }

        await db(tableName).where({ id }).del();
        return res.json({
          success: true,
          message: 'Запись успешно удалена',
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    },

    async search(req, res) {
      try {
        const user = req.user || { id: null, role: 'guest' };
        const { q, field = searchField, ...filters } = req.query;

        if (!checkPermission(user.role, 'read', tableName, user.id)) {
          return res.status(403).json({ success: false, error: 'Нет прав на поиск' });
        }

        let query = db(tableName);
        if (q) {
          query = query.where(field, 'ilike', `%${q}%`);
        }
        const filterKeys = Object.keys(filters).filter(
          (k) => filters[k] !== undefined && filters[k] !== ''
        );
        filterKeys.forEach((key) => {
          query = query.where(key, filters[key]);
        });

        const results = await query.limit(50);
        return res.json({
          success: true,
          data: results.map(omitFields),
          count: results.length,
        });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    },
  };
};

export default createController;
