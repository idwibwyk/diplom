/**
 * Подключение к БД для сервера (общий экземпляр Knex).
 */
import knex from 'knex';
import config from '../../knexfile.js';

const db = knex(config.default || config);
export default db;
