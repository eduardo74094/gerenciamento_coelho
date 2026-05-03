const Database = require('../database');

class Matriz {
  // Insere um registro de matriz (parto)
  async insertMatriz(matriz) {
    console.log('MatrizModel.insertMatriz - dados recebidos:', matriz);
    if (!matriz || !matriz.id_coelho) {
      throw new Error('Matriz.insertMatriz: id_coelho (pai) é obrigatório');
    }
    
   const sql = `
  INSERT INTO matriz (
    id_coelho,
    data_parto,
    data_cobertura,
    "data_palpação",
    "palpação_resultado",
    ninho,
    laparos,
    laparos_mortos,
    laparos_transferidos,
    peso_total_ninhada,
    peso_total_pos_ninhada, 
    data_desmame,
    total_desmame,
    numero_reprodutor
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
  RETURNING id_matriz
`;

const params = [
  matriz.id_coelho,
  matriz.data_parto,
  matriz.data_cobertura || null,
  matriz.data_palpação || null,
  matriz.palpação_resultado || null,
  (matriz.ninho ?? null),
  (matriz.laparos ?? null),
  (matriz.laparos_mortos ?? null),
  (matriz.laparos_transferidos ?? null),
  (matriz.peso_total_ninhada ?? null),
  (matriz.peso_total_pos_ninhada ?? null), 
  matriz.data_desmame || null,
  (matriz.total_desmame ?? null),
  (matriz.numero_reprodutor ?? null)
];
    

    
    console.log('MatrizModel.insertMatriz - SQL:', sql);
    console.log('MatrizModel.insertMatriz - params:', params);
    const res = await Database.query(sql, params);
    return res && res[0] ? res[0] : null;
  }

  // Seleciona todas as matrizes
  async selectMatrizes(coelhoId = null) {
  // Ordena por data do parto (mais recente primeiro). Se coelhoId fornecido, filtra por id_coelho.
  try {
      // Only filter when coelhoId is a real number (not null and not NaN).
      if (coelhoId !== null && !Number.isNaN(coelhoId)) {
        const sql = `SELECT * FROM matriz WHERE id_coelho=$1 ORDER BY data_parto DESC`;
        const res = await Database.query(sql, [coelhoId]);
        return res || [];
      } else {
        // No valid coelhoId provided; return all matrizes
        console.log('MatrizModel.selectMatrizes: no valid coelhoId provided, returning all records');
        const sql = `SELECT * FROM matriz ORDER BY data_parto DESC`;
        const res = await Database.query(sql);
        return res || []; // Database.query retorna array de rows
      }
  } catch (error) {
    console.error('MatrizModel.selectMatrizes error:', error && error.stack ? error.stack : error);
    throw error;
  }
  }

  // Seleciona uma matriz por ID
  async selectMatrizPorId(id) {
    const sql = `SELECT * FROM matriz WHERE id_matriz = $1`;
    const res = await Database.query(sql, [id]);
  return res && res[0] ? res[0] : null;
  }

  // Atualiza um registro de matriz
  async updateMatriz(id, matriz) {
    const sql = `
  UPDATE matriz SET
    id_coelho=$1,
    data_parto=$2,
    data_cobertura=$3,
    "data_palpação"=$4,
    "palpação_resultado"=$5,
    ninho=$6,
    laparos=$7,
    laparos_mortos=$8,
    laparos_transferidos=$9,
    peso_total_ninhada=$10,
    peso_total_pos_ninhada=$11, 
    data_desmame=$12,
    total_desmame=$13,
    numero_reprodutor=$14
  WHERE id_matriz=$15
  RETURNING *
`;

const res = await Database.query(sql, [
  matriz.id_coelho,
  matriz.data_parto,
  matriz.data_cobertura || null,
  matriz.data_palpação || null,
  matriz.palpação_resultado || null,
  (matriz.ninho ?? null),
  (matriz.laparos ?? null),
  (matriz.laparos_mortos ?? null),
  (matriz.laparos_transferidos ?? null),
  (matriz.peso_total_ninhada ?? null),
  (matriz.peso_total_pos_ninhada ?? null), 
  matriz.data_desmame || null,
  (matriz.total_desmame ?? null),
  (matriz.numero_reprodutor ?? null),
  id
]);
    return res && res[0] ? res[0] : null;
  }

  // Exclui um registro de matriz
  async deleteMatriz(id) {
    const sql = `DELETE FROM matriz WHERE id_matriz=$1`;
    await Database.query(sql, [id]);
    return true;
  }
}

module.exports = {
  Matriz
};
