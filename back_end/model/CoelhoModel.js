const Database = require('../database');


class CoelhoModel{
async insertCoelho(coelho){

const sql = `
INSERT INTO coelho (
  numero_coelho,
  nome_coelho,
  raca_coelho,
  data_nascimento_coelho,
  sexo_coelho,
  observacoes_coelho,
  peso_nascimento,
  peso_atual,
  peso_desmame,
  tipo_coelho,
  data_desmame,
  matriz_coelho,
  reprodutor_coelho,
  id_usuario,
  situacao_coelho,
  transferido_coelho
) VALUES (
  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
) RETURNING *;
`;

const res = await Database.query(sql, [
  coelho.numero_coelho,
  coelho.nome_coelho,
  coelho.raca_coelho,
  coelho.data_nascimento_coelho,
  coelho.sexo_coelho,
  coelho.observacoes_coelho,
  coelho.peso_nascimento,
  coelho.peso_atual,
  coelho.peso_desmame,
  coelho.tipo_coelho,
  coelho.data_desmame,
  coelho.matriz_coelho,
  coelho.reprodutor_coelho,
  coelho.id_usuario,
  coelho.situacao_coelho || null,
  coelho.transferido_coelho || null
]);

return res && res[0] ? res[0] : null;
}
async  selectCoelhos(){
 
    const res= await Database.query("Select * from  coelho  ORDER BY nome_coelho ASC ");
    return res;
}
async  selectCoelhos_por_id(id){
   
    const res= await Database.query("Select * from coelho WHERE id_coelho=$1",[id]);
    return res && res[0] ? res[0] : null;
}
async excluirCoelho(id){
   
    const sql=("DELETE FROM   coelho  where id_coelho=$1")
    const res= await Database.query(sql,[id]);


   
}

async updateCoelho(id, coelho) {

    const sql = `
    UPDATE coelho SET
      numero_coelho=$1,
      nome_coelho=$2,
      raca_coelho=$3,
      data_nascimento_coelho=$4,
      sexo_coelho=$5,
      observacoes_coelho=$6,
      peso_nascimento=$7,
      peso_atual=$8,
      tipo_coelho=$9,
      data_desmame=$10,
      peso_desmame=$11,
      matriz_coelho=$12,
      reprodutor_coelho=$13,
      situacao_coelho=$14,
      transferido_coelho=$15
    WHERE id_coelho=$16
    RETURNING *;
    `;

    const res = await Database.query(sql, [
      coelho.numero_coelho,
      coelho.nome_coelho,
      coelho.raca_coelho,
      coelho.data_nascimento_coelho,
      coelho.sexo_coelho,
      coelho.observacoes_coelho,
      coelho.peso_nascimento,
      coelho.peso_atual,
      coelho.tipo_coelho,
      coelho.data_desmame,
      coelho.peso_desmame,
      coelho.matriz_coelho,
      coelho.reprodutor_coelho,
      (
        coelho.situacao_coelho !== undefined
          ? coelho.situacao_coelho
          : (coelho.situacao || null)
      ),
      coelho.transferido_coelho || null,
      id
    ]);

    return res && res[0] ? res[0] : null;;
  }
}

module.exports = {
  CoelhoModel,
};