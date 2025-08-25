const express = require('express');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// storage for images
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage });

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
}

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid token' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await db.getUserById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function ownerOnly(req, res, next) {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Owner only' });
  next();
}

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
  const user = await db.getUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Owner can create users
app.post('/api/users', authMiddleware, ownerOnly, async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const newId = await db.createUser(name || 'User', email, hashed, role);
    res.json({ id: newId });
  } catch (err) {
    res.status(500).json({ message: String(err) });
  }
});

app.get('/api/users', authMiddleware, ownerOnly, async (req, res) => {
  const users = await db.listUsers();
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
});

// Vehicles
app.get('/api/vehicles', async (req, res) => {
  const { q, sort, fuel, hp_min, hp_max, disp_min, disp_max } = req.query;
  let vehicles = await db.listVehicles();
  if (q) {
    const qq = q.toLowerCase();
    vehicles = vehicles.filter(v => (v.title + ' ' + (v.description||'')).toLowerCase().includes(qq));
  }
  if (fuel) vehicles = vehicles.filter(v => String(v.fuel||'').toLowerCase() === String(fuel).toLowerCase());
  if (hp_min) vehicles = vehicles.filter(v => v.hp != null && Number(v.hp) >= Number(hp_min));
  if (hp_max) vehicles = vehicles.filter(v => v.hp != null && Number(v.hp) <= Number(hp_max));
  if (disp_min) vehicles = vehicles.filter(v => v.displacement != null && Number(v.displacement) >= Number(disp_min));
  if (disp_max) vehicles = vehicles.filter(v => v.displacement != null && Number(v.displacement) <= Number(disp_max));
  if (sort === 'price_asc') vehicles.sort((a,b)=>a.price-b.price);
  if (sort === 'price_desc') vehicles.sort((a,b)=>b.price-a.price);
  if (sort === 'year_desc') vehicles.sort((a,b)=>b.year-a.year);
  res.json(vehicles);
});

// fuels endpoints
app.get('/api/fuels', async (req, res) => {
  const fuels = await db.listFuels();
  res.json(fuels);
});

app.post('/api/fuels', authMiddleware, async (req, res) => {
  // only owner or partner may create fuel types
  if (!['owner','partner'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Missing name' });
  const id = await db.createFuel(name);
  res.json({ id });
});

app.get('/api/vehicles/:id', async (req, res) => {
  const v = await db.getVehicle(req.params.id);
  if (!v) return res.status(404).json({ message: 'Not found' });
  res.json(v);
});

app.post('/api/vehicles', authMiddleware, upload.array('images', 6), async (req, res) => {
  // only owner or partner
  if (!['owner','partner'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const data = req.body;
  // basic validation
  const id = await db.createVehicle({
    owner_id: req.user.id,
    title: data.title,
    description: data.description,
    price: Number(data.price) || 0,
    year: Number(data.year) || null,
    fuel: data.fuel || '',
    hp: data.hp || '',
    seats: data.seats || '',
    displacement: data.displacement || ''
  });
  // save images
  const files = req.files || [];
  for (const f of files) {
    await db.addImage(id, '/uploads/' + path.basename(f.path));
  }
  res.json({ id });
});

app.put('/api/vehicles/:id', authMiddleware, upload.array('images', 6), async (req, res) => {
  const v = await db.getVehicle(req.params.id);
  if (!v) return res.status(404).json({ message: 'Not found' });
  if (!(req.user.role === 'owner' || (req.user.role === 'partner' && req.user.id === v.owner_id))) return res.status(403).json({ message: 'Forbidden' });
  const data = req.body;
  await db.updateVehicle(req.params.id, data);
  const files = req.files || [];
  for (const f of files) await db.addImage(req.params.id, '/uploads/' + path.basename(f.path));
  res.json({ ok: true });
});

app.delete('/api/vehicles/:id', authMiddleware, async (req, res) => {
  const v = await db.getVehicle(req.params.id);
  if (!v) return res.status(404).json({ message: 'Not found' });
  if (!(req.user.role === 'owner' || (req.user.role === 'partner' && req.user.id === v.owner_id))) return res.status(403).json({ message: 'Forbidden' });
  await db.deleteVehicle(req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log('Server running on', PORT));
