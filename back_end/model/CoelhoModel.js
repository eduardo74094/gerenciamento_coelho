const Database = require('../database');

class CoelhoModel {

  async insertCoelho(coelho) {
    const sql = `
      INSERT INTO coelho (
        numero_coelho, nome_coelho, raca_coelho, data_nascimento_coelho,
        sexo_coelho, observacoes_coelho, peso_nascimento, peso_atual,
        peso_desmame, tipo_coelho, data_desmame, matriz_coelho,
        reprodutor_coelho, id_usuario, situacao_coelho, transferido_coelho,
        foto_coelho
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING *;
    `;

    const res = await Database.query(sql, [
      coelho.numero_coelho, coelho.nome_coelho, coelho.raca_coelho,
      coelho.data_nascimento_coelho, coelho.sexo_coelho, coelho.observacoes_coelho,
      coelho.peso_nascimento, coelho.peso_atual, coelho.peso_desmame,
      coelho.tipo_coelho, coelho.data_desmame, coelho.matriz_coelho,
      coelho.reprodutor_coelho, coelho.id_usuario, 
      coelho.situacao_coelho || 'ativo',
      coelho.transferido_coelho || null,
      coelho.foto_coelho || null
    ]);

    return res && res[0] ? res[0] : null;
  }

  async selectCoelhos() {
    const res = await Database.query("SELECT * FROM coelho ORDER BY nome_coelho ASC");
    return res;
  }

  async selectCoelhos_por_id(id) {
    const res = await Database.query("SELECT * FROM coelho WHERE id_coelho = $1", [id]);
    return res && res[0] ? res[0] : null;
  }

  async excluirCoelho(id) {
    const res = await Database.query("DELETE FROM coelho WHERE id_coelho = $1", [id]);
    return res;
  }

  async updateCoelho(id, coelho) {
    const sql = `
      UPDATE coelho SET
        numero_coelho = $1,
        nome_coelho = $2,
        raca_coelho = $3,
        data_nascimento_coelho = $4,
        sexo_coelho = $5,
        observacoes_coelho = $6,
        peso_nascimento = $7,
        peso_atual = $8,
        tipo_coelho = $9,
        data_desmame = $10,
        peso_desmame = $11,
        matriz_coelho = $12,
        reprodutor_coelho = $13,
        situacao_coelho = $14,
        transferido_coelho = $15,
        foto_coelho = $16
      WHERE id_coelho = $17
      RETURNING *;
    `;

    const valores = [
      coelho.numero_coelho,
      coelho.nome_coelho,
      coelho.raca_coelho,
      coelho.data_nascimento_coelho,
      coelho.sexo_coelho,
      coelho.observacoes_coelho || null,
      coelho.peso_nascimento,
      coelho.peso_atual,
      coelho.tipo_coelho,
      coelho.data_desmame,
      coelho.peso_desmame,
      coelho.matriz_coelho || null,
      coelho.reprodutor_coelho || null,
      coelho.situacao_coelho || 'ativo',
      coelho.transferido_coelho || null,
      coelho.foto_coelho || null,     // ← Foto vem por último antes do ID
      id
    ];

    try {
      const res = await Database.query(sql, valores);
      return res && res[0] ? res[0] : null;
    } catch (error) {
      console.error("Erro ao atualizar coelho:", error);
      throw error;
    }
  }
}

module.exports = { CoelhoModel };