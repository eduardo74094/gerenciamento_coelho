const {Pool} =require('pg');
const Database={
    conectar(){
        globalThis.Database=new Pool({
            host:"localhost",
            user:"postgres",
            port:5432,
            max:20,
            database:"Coelhos",
            password:'alegrete',
            idleTimeoutMillis: 30000, 
            connectionTimeoutMillis: 2000,
           
        });
    },
    async query(sql,parametros=[]){
        const result=await globalThis.Database.query(sql,parametros);
      
         return result.rows;
    }
}
module.exports=Database;