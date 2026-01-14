const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize DB
const db = new Database(path.join(__dirname, 'data.sqlite'));
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
);
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  owner_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER,
  user_id INTEGER,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// Helpers
function generateToken(user){
  return jwt.sign({id: user.id, name: user.name, email: user.email}, JWT_SECRET, {expiresIn:'7d'});
}

function authMiddleware(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({error:'Unauthorized'});
  const parts = h.split(' ');
  if(parts.length!==2) return res.status(401).json({error:'Unauthorized'});
  const token = parts[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){
    res.status(401).json({error:'Invalid token'});
  }
}

// Routes
app.post('/api/register', async (req,res)=>{
  const {name, email, password} = req.body;
  if(!email || !password) return res.status(400).json({error:'Eksik alanlar'});
  const hashed = await bcrypt.hash(password, 10);
  try{
    const stmt = db.prepare('INSERT INTO users (name,email,password) VALUES (?,?,?)');
    const info = stmt.run(name||'', email, hashed);
    const user = {id: info.lastInsertRowid, name: name||'', email};
    const token = generateToken(user);
    res.json({user, token});
  }catch(e){
    res.status(400).json({error:'Kayıt başarısız veya e-posta zaten kayıtlı.'});
  }
});

app.post('/api/login', async (req,res)=>{
  const {email, password} = req.body;
  if(!email || !password) return res.status(400).json({error:'Eksik alanlar'});
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if(!row) return res.status(400).json({error:'Kullanıcı bulunamadı'});
  const ok = await bcrypt.compare(password, row.password);
  if(!ok) return res.status(400).json({error:'Hatalı şifre'});
  const user = {id: row.id, name: row.name, email: row.email};
  const token = generateToken(user);
  res.json({user, token});
});

app.get('/api/projects', (req,res)=>{
  const rows = db.prepare('SELECT p.*, u.name as owner_name FROM projects p LEFT JOIN users u ON p.owner_id=u.id ORDER BY p.created_at DESC').all();
  res.json(rows);
});

app.post('/api/projects', authMiddleware, (req,res)=>{
  const {title, description} = req.body;
  if(!title) return res.status(400).json({error:'Başlık gerekli'});
  const stmt = db.prepare('INSERT INTO projects (title,description,owner_id) VALUES (?,?,?)');
  const info = stmt.run(title, description||'', req.user.id);
  const proj = db.prepare('SELECT p.*, u.name as owner_name FROM projects p LEFT JOIN users u ON p.owner_id=u.id WHERE p.id = ?').get(info.lastInsertRowid);
  res.json(proj);
});

app.post('/api/projects/:id/proposals', authMiddleware, (req,res)=>{
  const projectId = Number(req.params.id);
  const {message} = req.body;
  if(!projectId) return res.status(400).json({error:'Geçersiz proje'});
  const stmt = db.prepare('INSERT INTO proposals (project_id,user_id,message) VALUES (?,?,?)');
  const info = stmt.run(projectId, req.user.id, message||'');
  const prop = db.prepare('SELECT * FROM proposals WHERE id = ?').get(info.lastInsertRowid);
  res.json(prop);
});

app.get('/api/freelancers', (req,res)=>{
  const rows = db.prepare('SELECT id,name,email FROM users ORDER BY name LIMIT 20').all();
  res.json(rows);
});

// Fallback to index.html for SPA-like behavior
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));
