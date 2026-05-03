const Database = require('../database');

class Reprodutor {
  // Adiciona um novo reprodutor
  async adicionarReprodutor(reprodutor) {
    const sql = `
      INSERT INTO reprodutor (
        id_coelho,
        data_acasalamento,
        numero_laparos,
        peso_total_ninhada,
         peso_total_pos_ninhada,
        numero_matriz
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_reprodutor
    `;
    const res = await Database.query(sql, [
      reprodutor.id_coelho,
      reprodutor.data_acasalamento,
      reprodutor.numero_laparos,
      reprodutor.peso_total_ninhada,
      reprodutor.peso_total_pos_ninhada,
      reprodutor.numero_matriz
    ]);
    return res && res[0] ? res[0] : null;
  }

  // Lista todos os reprodutores
  async listarReprodutores(coelhoId = null) {
    console.log('ReprodutorModel.listarReprodutores chamado com coelhoId:', coelhoId);
    
    try {
      if (coelhoId !== null && !Number.isNaN(coelhoId)) {
        console.log('Filtrando por coelhoId:', coelhoId);
        const sql = `SELECT * FROM reprodutor WHERE id_coelho=$1 ORDER BY data_acasalamento DESC`;
        const res = await Database.query(sql, [coelhoId]);
        console.log('Resultado filtrado:', res ? res.length : 0, 'registros');
        return res || [];
      } else {
        console.log('Listando todos os reprodutores');
        const sql = `SELECT * FROM reprodutor ORDER BY data_acasalamento DESC`;
        const res = await Database.query(sql);
        console.log('Resultado total:', res ? res.length : 0, 'registros');
        return res || [];
      }
    } catch (error) {
      console.error('Erro em listarReprodutores:', error);
      throw error;
    }
  }

  // Seleciona um reprodutor por ID
  async selecionarReprodutorPorId(id) {
    const sql = `SELECT * FROM reprodutor WHERE id_reprodutor = $1`;
    const res = await Database.query(sql, [id]);
    return res && res[0] ? res[0] : null;
  }

  // Atualiza um reprodutor
  async atualizarReprodutor(id, reprodutor) {
    const sql = `
      UPDATE reprodutor SET
        id_coelho = $1,
        data_acasalamento = $2,
        numero_laparos = $3,
        peso_total_ninhada = $4,
         peso_total_pos_ninhada = $5,
        numero_matriz = $6
      WHERE id_reprodutor = $7
      RETURNING *
    `;
    const res = await Database.query(sql, [
      reprodutor.id_coelho,
      reprodutor.data_acasalamento,
      reprodutor.numero_laparos,
      reprodutor.peso_total_ninhada,
     reprodutor.peso_total_pos_ninhada,
      reprodutor.numero_matriz,
      id
    ]);
    return res && res[0] ? res[0] : null;
  }

  // Exclui um reprodutor
  async excluirReprodutor(id) {
    const sql = `DELETE FROM reprodutor WHERE id_reprodutor = $1`;
    await Database.query(sql, [id]);
    return true;
  }
}

module.exports = {
  Reprodutor,
};