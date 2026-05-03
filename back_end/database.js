const { Pool } = require('pg');

const Database = {
  conectar() {
    globalThis.Database = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  },

  async query(sql, parametros = []) {
    const result = await globalThis.Database.query(sql, parametros);
    return result.rows;
  }
};

module.exports = Database;