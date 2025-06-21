const {Client}=require("pg");
require("dotenv").config();

const getConnection=()=>{
   return new Client({
   connectionString:process.env.DATABASE_URL,
   ssl:{
     rejectUnauthorized: false // Accept self-signed certs (ok for Render)
   }
  });
  }
  
  module.exports=getConnection;