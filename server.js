const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// JSON file storage (data.json)
const DATA_FILE = path.join(__dirname, 'data.json');
function loadData(){
  try{
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  }catch(e){
    const initial = { nextIds: { users: 1, projects: 1, proposals: 1 }, users: [], projects: [], proposals: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
}
function saveData(d){
  fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2));
}

let data = loadData();

function getNextId(kind){
  const id = data.nextIds[kind] || 1;
  data.nextIds[kind] = id + 1;
  return id;
}

// Helpers
function generateToken(user){
  return jwt.sign({id: user.id, name: user.name, email: user.email, is_admin: user.is_admin || 0}, JWT_SECRET, {expiresIn:'7d'});
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
  const existing = data.users.find(u=>u.email === email.toLowerCase());
  if(existing) return res.status(400).json({error:'E-posta zaten kayıtlı.'});
  const hashed = await bcrypt.hash(password, 10);
  const id = getNextId('users');
  const user = { id, name: name||'', email: email.toLowerCase(), password: hashed, is_admin:0 };
  data.users.push(user);
  saveData(data);
  const safe = {id: user.id, name: user.name, email: user.email, is_admin: user.is_admin};
  const token = generateToken(safe);
  res.json({user: safe, token});
});

app.post('/api/login', async (req,res)=>{
  const {email, password} = req.body;
  if(!email || !password) return res.status(400).json({error:'Eksik alanlar'});
  const row = data.users.find(u=>u.email === (email||'').toLowerCase());
  if(!row) return res.status(400).json({error:'Kullanıcı bulunamadı'});
  const ok = await bcrypt.compare(password, row.password);
  if(!ok) return res.status(400).json({error:'Hatalı şifre'});
  const user = {id: row.id, name: row.name, email: row.email, is_admin: row.is_admin};
  const token = generateToken(user);
  res.json({user, token});
});

app.get('/api/projects', (req,res)=>{
  const rows = data.projects.map(p=>({
    ...p,
    owner_name: (data.users.find(u=>u.id === p.owner_id)||{}).name || ''
  })).sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));
  res.json(rows);
});

app.get('/api/projects/:id', (req,res)=>{
  const id = Number(req.params.id);
  if(!id) return res.status(400).json({error:'Geçersiz id'});
  const row = data.projects.find(p=>p.id === id);
  if(!row) return res.status(404).json({error:'Proje bulunamadı'});
  res.json({ ...row, owner_name: (data.users.find(u=>u.id===row.owner_id)||{}).name || '' });
});

app.get('/api/projects/:id/proposals', (req,res)=>{
  const id = Number(req.params.id);
  const rows = data.proposals.filter(pr=>pr.project_id === id).map(pr=>({
    ...pr,
    user_name: (data.users.find(u=>u.id===pr.user_id)||{}).name || ''
  })).sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));
  res.json(rows);
});

app.post('/api/projects', authMiddleware, (req,res)=>{
  const {title, description} = req.body;
  if(!title) return res.status(400).json({error:'Başlık gerekli'});
  const id = getNextId('projects');
  const proj = { id, title, description: description||'', owner_id: req.user.id, created_at: new Date().toISOString() };
  data.projects.push(proj);
  saveData(data);
  res.json({ ...proj, owner_name: (data.users.find(u=>u.id===proj.owner_id)||{}).name || '' });
});

app.post('/api/projects/:id/proposals', authMiddleware, (req,res)=>{
  const projectId = Number(req.params.id);
  const {message} = req.body;
  if(!projectId) return res.status(400).json({error:'Geçersiz proje'});
  const id = getNextId('proposals');
  const prop = { id, project_id: projectId, user_id: req.user.id, message: message||'', created_at: new Date().toISOString() };
  data.proposals.push(prop);
  saveData(data);
  res.json(prop);
});

app.get('/api/freelancers', (req,res)=>{
  const rows = data.users.map(u=>({id:u.id,name:u.name,email:u.email})).sort((a,b)=> a.name.localeCompare(b.name)).slice(0,20);
  res.json(rows);
});

app.get('/api/users/:id', (req,res)=>{
  const id = Number(req.params.id);
  if(!id) return res.status(400).json({error:'Geçersiz id'});
  const row = data.users.find(u=>u.id===id);
  if(!row) return res.status(404).json({error:'Kullanıcı bulunamadı'});
  res.json({id:row.id,name:row.name,email:row.email,is_admin:row.is_admin});
});

app.get('/api/users', authMiddleware, (req,res)=>{
  // only admin can list all users
  const me = data.users.find(u=>u.id === req.user.id);
  if(!me || !me.is_admin) return res.status(403).json({error:'Erişim reddedildi'});
  const rows = data.users.map(u=>({id:u.id,name:u.name,email:u.email,is_admin:u.is_admin})).sort((a,b)=> b.id - a.id);
  res.json(rows);
});

app.get('/api/me', authMiddleware, (req,res)=>{
  const row = data.users.find(u=>u.id === req.user.id);
  if(!row) return res.json({});
  res.json({id:row.id,name:row.name,email:row.email,is_admin:row.is_admin});
});

app.get('/api/my/projects', authMiddleware, (req,res)=>{
  const rows = data.projects.filter(p=>p.owner_id === req.user.id).sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));
  res.json(rows);
});

// Fallback to index.html for SPA-like behavior
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));
