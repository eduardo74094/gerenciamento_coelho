require('dotenv').config();

const { Pool } = require('pg');

const Database = {
  conectar() {
    globalThis.Database = new Pool(
      process.env.DATABASE_URL
        ? {

            connectionString: process.env.DATABASE_URL,

            ssl:
              process.env.DB_SSL === 'false'
                ? false
                : { rejectUnauthorized: false },

            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          }
        : {
           
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'postgres',
            port: Number(process.env.DB_PORT || 5432),
            max: 20,
            database: process.env.DB_NAME || 'Coelhos',
            password: process.env.DB_PASSWORD || 'alegrete',

            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          }
    );

    console.log('Banco conectado!');
  },

  async query(sql, parametros = []) {
    try {
      const result = await globalThis.Database.query(
        sql,
        parametros
      );

      return result.rows;
    } catch (erro) {
      console.log('Erro SQL:', erro);
      throw erro;
    }
  },
};

module.exports = Database;