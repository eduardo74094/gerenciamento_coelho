const Database = require('../database');
const { pbkdf2, randomBytes} = require('node:crypto');

class Usuario{

    async selectUsuarios(){
        
           const res= await Database.query("Select * from usuario");
        return res;
        
    }
     async selectUsuarios_por_id(id){
        
        const res= await Database.query("Select * from usuario WHERE id_usuario=$1",[id]);
          return res;
    }
   async insertUsuario(usuario){
        
                const sql=("INSERT INTO usuario (nome_usuario,email,senha,tempero,tipoususario)values($1,$2,$3,$4,$5) ")
                const res= await Database.query(sql,[usuario.nome_usuario,usuario.email,usuario.senha,usuario.tempero,usuario.tipoususario || null]);
        
    }
     async updateUsuario(id,usuario){
    
                const sql=("UPDATE  usuario set  nome_usuario=$1,email=$2,senha=$3,tipoususario=$4 where id_usuario=$5")
                const res= await Database.query(sql,[usuario.nome_usuario,usuario.email,usuario.senha,usuario.tipoususario || null,id]);
      return res;
        
    }
      async excluirUsuario(id){
       
        const sql=("DELETE FROM   usuario   where id_usuario=$1")
        const res= await Database.query(sql,[id]); 
    
        
    }
     async login(email){
    
        const sql=('Select * from usuario where email=$1 ');
        const res= await Database.query(sql,[email]);
      return res[0];
        
    }
    async alterar_senha_tempero(hash,tempero,id){
        const sql=('Update usuario  set  senha=$1,tempero=$2 where id_usuario=$3');
        const res=await Database.query(sql,[hash,tempero,id]);
        return res;
    }
   

   

     criarHash(senha, tempero){
        return new Promise(done => {
            randomBytes(8, (err, randomBytes) => {
                const salt = tempero ?? randomBytes.toString('hex');  
                pbkdf2(senha, salt, 100000, 16, 'sha512', async function(err, derivedKey){
                    done({
                        salt,
                        hash: derivedKey.toString('hex')
                    });  
                });    
            });
        });
    }


          
    

   


    
   
}
module.exports={
   Usuario,
   

};