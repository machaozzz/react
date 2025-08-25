const db = require('./db');
(async()=>{
  try{
    const rows = await db.all('SELECT id,name,email,email_encrypted,email_hash,password,role FROM users');
    console.log(JSON.stringify(rows,null,2));
  }catch(e){ console.error('ERR', e); }
  process.exit(0);
})()
