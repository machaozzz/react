const db = require('./db');

async function seed(){
  try{
    await db.createUser('Dono', 'owner@stand.pt', 'ownerpass123', 'owner');
    await db.createUser('Socio', 'partner@stand.pt', 'partnerpass123', 'partner');
    console.log('Seed created: owner@stand.pt / ownerpass123  partner@stand.pt / partnerpass123');
  }catch(e){ console.error('Seed error:', e.message); }
  process.exit(0);
}
seed();
