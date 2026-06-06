const Database = require('../database');

class CoelhoModel {

  // Funções auxiliares de conversão (usadas em todas as operações)
  toInt(value) {
    if (value == null || value === "" || value === "null" || value === "undefined") {
      return null;
    }
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }

  toDouble(value) {
    if (value == null || value === "" || value === "null" || value === "undefined") {
      return null;
    }
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  toNull(value) {
    if (value == null || value === "" || value === "null" || value === "undefined") {
      return null;
    }
    return value;
  }

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

    const valores = [
      this.toInt(coelho.numero_coelho),
      this.toNull(coelho.nome_coelho),
      this.toNull(coelho.raca_coelho),
      coelho.data_nascimento_coelho,
      this.toNull(coelho.sexo_coelho),
      this.toNull(coelho.observacoes_coelho),
      this.toDouble(coelho.peso_nascimento),
      this.toDouble(coelho.peso_atual),
      this.toDouble(coelho.peso_desmame),
      this.toNull(coelho.tipo_coelho),
      coelho.data_desmame,
      this.toInt(coelho.matriz_coelho),
      this.toInt(coelho.reprodutor_coelho),
      this.toInt(coelho.id_usuario),
      coelho.situacao_coelho || 'ativo',
      this.toInt(coelho.transferido_coelho),   // ← principal problema
      this.toNull(coelho.foto_coelho)
    ];

    try {
      const res = await Database.query(sql, valores);
      return res && res[0] ? res[0] : null;
    } catch (error) {
      console.error("❌ Erro ao inserir coelho:", error);
      throw error;
    }
  }

  async selectCoelhos() {
    try {
      const res = await Database.query("SELECT * FROM coelho ORDER BY nome_coelho ASC");
      return res;
    } catch (error) {
      console.error("❌ Erro ao buscar coelhos:", error);
      throw error;
    }
  }

  async selectCoelhos_por_id(id) {
    try {
      const res = await Database.query("SELECT * FROM coelho WHERE id_coelho = $1", [id]);
      return res && res[0] ? res[0] : null;
    } catch (error) {
      console.error("❌ Erro ao buscar coelho por ID:", error);
      throw error;
    }
  }

  async excluirCoelho(id) {
    try {
      const res = await Database.query("DELETE FROM coelho WHERE id_coelho = $1", [id]);
      return res;
    } catch (error) {
      console.error("❌ Erro ao excluir coelho:", error);
      throw error;
    }
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
        peso_desmame = $9,
        tipo_coelho = $10,
        data_desmame = $11,
        matriz_coelho = $12,
        reprodutor_coelho = $13,
        situacao_coelho = $14,
        transferido_coelho = $15,
        foto_coelho = $16
      WHERE id_coelho = $17
      RETURNING *;
    `;

    const valores = [
      this.toInt(coelho.numero_coelho),
      this.toNull(coelho.nome_coelho),
      this.toNull(coelho.raca_coelho),
      coelho.data_nascimento_coelho,
      this.toNull(coelho.sexo_coelho),
      this.toNull(coelho.observacoes_coelho),
      this.toDouble(coelho.peso_nascimento),
      this.toDouble(coelho.peso_atual),
      this.toDouble(coelho.peso_desmame),
      this.toNull(coelho.tipo_coelho),
      coelho.data_desmame,
      this.toInt(coelho.matriz_coelho),
      this.toInt(coelho.reprodutor_coelho),
      coelho.situacao_coelho || 'ativo',
      this.toInt(coelho.transferido_coelho),
      this.toNull(coelho.foto_coelho),
      this.toInt(id)                    // ID do WHERE
    ];

    try {
      const res = await Database.query(sql, valores);
      return res && res[0] ? res[0] : null;
    } catch (error) {
      console.error("❌ Erro ao atualizar coelho:", error);
      throw error;
    }
  }
}

module.exports = { CoelhoModel };