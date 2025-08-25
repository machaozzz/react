const db = require('./db');
const fs = require('fs');
const path = require('path');

async function inspect(){
  const dbPath = path.join(__dirname, 'stand.db');
  console.log('DB file:', dbPath, 'exists?', fs.existsSync(dbPath));
  try{
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables:', tables.map(t=>t.name).join(', '));
  }catch(e){ console.error('Could not list tables:', e.message) }

  try{
    const users = await db.listUsers();
    console.log('\nUsers:');
    users.forEach(u=> console.log(` - ${u.id}: ${u.name} <${u.email}> (${u.role})`));
  }catch(e){ console.error('Could not list users:', e.message) }

  try{
    const vehicles = await db.listVehicles();
    console.log('\nVehicles (count:', vehicles.length, '):');
    vehicles.slice(0,10).forEach(v=> console.log(` - ${v.id}: ${v.title} €${v.price} ${v.year || ''}`));
  }catch(e){ console.error('Could not list vehicles:', e.message) }
}

inspect().then(()=>process.exit(0)).catch(()=>process.exit(1));
