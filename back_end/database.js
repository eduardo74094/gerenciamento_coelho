const { Pool } = require('pg');

const Database = {
  conectar() {
    const connectionString = process.env.DATABASE_URL;

    globalThis.Database = new Pool(
      connectionString
        ? {
            connectionString,
            ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
            max: Number(process.env.DB_MAX || 20),
            idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT || 30000),
            connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT || 10000),
          }
        : {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'postgres',
            port: Number(process.env.DB_PORT || 5432),
            max: Number(process.env.DB_MAX || 20),
            database: process.env.DB_NAME || 'Coelhos',
            password: process.env.DB_PASSWORD || '',
            idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT || 30000),
            connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT || 10000),
          }
    );
  },

  async query(sql, parametros = []) {
    const result = await globalThis.Database.query(sql, parametros);
    return result.rows;
  },
};

module.exports = Database;