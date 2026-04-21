/**
 * Валидация тела запроса: обязательные поля для create/update.
 * При отсутствии поля возвращает 400 с success: false.
 */
export function validateBody(requiredFields = []) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Тело запроса должно быть объектом' });
    }
    const missing = requiredFields.filter((f) => req.body[f] === undefined || req.body[f] === '');
    if (missing.length) {
      return res.status(400).json({
        success: false,
        error: `Не указаны обязательные поля: ${missing.join(', ')}`,
      });
    }
    next();
  };
}

/**
 * Валидация id в params (число).
 */
export function validateIdParam(req, res, next) {
  const id = req.params.id;
  if (id === undefined) return next();
  const num = parseInt(id, 10);
  if (Number.isNaN(num) || num < 1) {
    return res.status(400).json({ success: false, error: 'Некорректный идентификатор' });
  }
  next();
}
