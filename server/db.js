const mysql = require('mysql2/promise');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Config via env vars (definir no XAMPP/PowerShell antes de arrancar)
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'standdb';

const ENC_KEY_RAW = process.env.ENC_KEY || 'dev-secret-please-change-32-bytes-minimum';
const HMAC_KEY_RAW = process.env.HMAC_KEY || 'dev-hmac-key-change-this';

function deriveKey(raw){ return crypto.createHash('sha256').update(String(raw)).digest(); }
const ENC_KEY = deriveKey(ENC_KEY_RAW);
const HMAC_KEY = deriveKey(HMAC_KEY_RAW);

function encryptValue(plain){
  if (plain == null) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENC_KEY, iv);
  const ct = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString('base64');
}
function decryptValue(b64){
  if (!b64) return null;
  try{
    const buf = Buffer.from(b64, 'base64');
    const iv = buf.slice(0,12);
    const tag = buf.slice(12,28);
    const ct = buf.slice(28);
    const dec = crypto.createDecipheriv('aes-256-gcm', ENC_KEY, iv);
    dec.setAuthTag(tag);
    const out = Buffer.concat([dec.update(ct), dec.final()]);
    return out.toString('utf8');
  }catch(e){ return null; }
}
function hmacValue(val){
  return crypto.createHmac('sha256', HMAC_KEY).update(String(val)).digest('hex');
}

const pool = mysql.createPool({
  host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASS, database: DB_NAME,
  waitForConnections: true, connectionLimit: 10, queueLimit: 0, multipleStatements: false
});

async function query(sql, params=[]){ const [rows] = await pool.execute(sql, params); return rows; }

async function init(){
  // create tables if missing
  await query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    email_encrypted TEXT,
    email_hash VARCHAR(128),
    password VARCHAR(255),
    role VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

  await query(`CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    title TEXT,
    description TEXT,
    price DOUBLE,
  year INT,
  fuel VARCHAR(64),
  hp INT,
  seats INT,
  displacement INT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

  await query(`CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    url TEXT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

  // fuels table for normalized fuel types
  await query(`CREATE TABLE IF NOT EXISTS fuels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) UNIQUE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

  // In case previous schema used varchar for hp/displacement, try to alter
  try{
    await query(`ALTER TABLE vehicles MODIFY COLUMN hp INT NULL`);
    await query(`ALTER TABLE vehicles MODIFY COLUMN displacement INT NULL`);
    await query(`ALTER TABLE vehicles MODIFY COLUMN seats INT NULL`);
  }catch(e){ /* ignore if cannot alter or already correct */ }

  // create index if possible; ignore error if syntax not supported
  try{ await query(`CREATE INDEX idx_users_email_hash ON users(email_hash(64));`); }catch(e){ /* ignore */ }
}

init().catch(err=>{ console.error('DB init error', err); });

module.exports = {
  pool, encryptValue, decryptValue, hmacValue,

  // create user (hash password inside)
  async createUser(name, email, password, role){
    const enc = encryptValue(email);
    const h = hmacValue(String(email).toLowerCase());
    const pwdHash = password ? await bcrypt.hash(String(password), 10) : null;
    const [res] = await pool.execute('INSERT INTO users (name,email_encrypted,email_hash,password,role,created_at) VALUES (?,?,?,?,?,NOW())', [name,enc,h,pwdHash,role]);
    return res.insertId || null;
  },

  async getUserByEmail(email){
    const h = hmacValue(String(email).toLowerCase());
    const rows = await query('SELECT * FROM users WHERE email_hash = ? LIMIT 1', [h]);
    const row = rows && rows.length ? rows[0] : null;
    if (!row) return null;
    row.email = decryptValue(row.email_encrypted);
    return row;
  },

  async getUserById(id){
    const rows = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    if (!rows || !rows.length) return null;
    const row = rows[0];
    row.email = decryptValue(row.email_encrypted);
    return row;
  },

  async listUsers(){
    const rows = await query('SELECT id,name,email_encrypted,role FROM users');
    return rows.map(r=>({ id: r.id, name: r.name, email: decryptValue(r.email_encrypted), role: r.role }));
  },

  verifyPassword(plain, hash){ try { return bcrypt.compareSync(String(plain), String(hash)); } catch(e){ return false; } },

  // vehicles
  async createVehicle(obj){
    const hp = obj.hp != null && obj.hp !== '' ? parseInt(obj.hp,10) : null;
    const displacement = obj.displacement != null && obj.displacement !== '' ? parseInt(obj.displacement,10) : null;
    const seats = obj.seats != null && obj.seats !== '' ? parseInt(obj.seats,10) : null;
    const year = obj.year != null && obj.year !== '' ? parseInt(obj.year,10) : null;
    const price = isNaN(Number(obj.price)) ? 0 : Number(obj.price);
    const [res] = await pool.execute('INSERT INTO vehicles (owner_id,title,description,price,year,fuel,hp,seats,displacement) VALUES (?,?,?,?,?,?,?,?,?)',
      [obj.owner_id,obj.title||'',obj.description||'',price,year,obj.fuel||'',hp,seats,displacement]);
    return res.insertId || null;
  },
  async listVehicles(){
    const rows = await query('SELECT v.*, (SELECT url FROM images i WHERE i.vehicle_id = v.id LIMIT 1) AS image FROM vehicles v');
    return rows.map(r=>({
      ...r,
      price: r.price != null ? Number(r.price) : 0,
      year: r.year != null ? (Number.isInteger(r.year) ? r.year : parseInt(r.year,10)||null) : null,
      hp: r.hp != null ? (Number.isInteger(r.hp) ? r.hp : (r.hp!=='' ? parseInt(r.hp,10) : null)) : null,
      seats: r.seats != null ? (Number.isInteger(r.seats) ? r.seats : (r.seats!=='' ? parseInt(r.seats,10) : null)) : null,
      displacement: r.displacement != null ? (Number.isInteger(r.displacement) ? r.displacement : (r.displacement!=='' ? parseInt(r.displacement,10) : null)) : null
    }));
  },
  async getVehicle(id){
    const rows = await query('SELECT * FROM vehicles WHERE id = ? LIMIT 1', [id]);
    if (!rows || !rows.length) return null;
    const v = rows[0];
    const imgs = await query('SELECT url FROM images WHERE vehicle_id = ?', [id]);
    v.images = imgs.map(r=>r.url);
    return v;
  },
  async addImage(vehicleId, url){ await query('INSERT INTO images (vehicle_id,url) VALUES (?,?)', [vehicleId, url]); },

  async updateVehicle(id, data){
    const fields = ['title','description','price','year','fuel','hp','seats','displacement'];
    const updates = []; const params = [];
    for (const f of fields) if (f in data){
      let val = data[f];
      if (['hp','seats','displacement','year'].includes(f)){
        val = val != null && val !== '' ? parseInt(val,10) : null;
      }
      if (f === 'price'){
        val = isNaN(Number(val)) ? 0 : Number(val);
      }
      updates.push(`${f} = ?`);
      params.push(val);
    }
    if (!updates.length) return;
    params.push(id);
    await query(`UPDATE vehicles SET ${updates.join(', ')} WHERE id = ?`, params);
  },

  // fuels
  async listFuels(){ const rows = await query('SELECT id,name FROM fuels ORDER BY name'); return rows.map(r=>({ id:r.id, name:r.name })); },
  async createFuel(name){ if (!name) return null; try{ const [res] = await pool.execute('INSERT INTO fuels (name) VALUES (?)', [String(name).trim()]); return res.insertId || null; }catch(e){ // duplicate or error
      const existing = await query('SELECT id FROM fuels WHERE name = ? LIMIT 1', [String(name).trim()]); return existing && existing.length ? existing[0].id : null;
    } },

  async deleteVehicle(id){ await query('DELETE FROM images WHERE vehicle_id = ?', [id]); await query('DELETE FROM vehicles WHERE id = ?', [id]); }
};
