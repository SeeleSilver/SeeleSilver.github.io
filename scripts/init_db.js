const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, '..', 'data.sqlite');
const db = new Database(dbPath);

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

function seed() {
  const users = [
    { name: 'Test Kullanıcı', email: 'test@example.com', password: 'password' },
    { name: 'Freelancer Demo', email: 'freela@example.com', password: 'secret' }
  ];

  const insertUser = db.prepare('INSERT OR IGNORE INTO users (name,email,password) VALUES (?,?,?)');
  const insertProject = db.prepare('INSERT INTO projects (title,description,owner_id) VALUES (?,?,?)');

  const hashed1 = bcrypt.hashSync(users[0].password, 10);
  const hashed2 = bcrypt.hashSync(users[1].password, 10);

  insertUser.run(users[0].name, users[0].email, hashed1);
  insertUser.run(users[1].name, users[1].email, hashed2);

  const u1 = db.prepare('SELECT id FROM users WHERE email = ?').get(users[0].email);
  const u2 = db.prepare('SELECT id FROM users WHERE email = ?').get(users[1].email);

  // seed projects if none
  const count = db.prepare('SELECT COUNT(*) as c FROM projects').get().c;
  if (count === 0) {
    insertProject.run('Örnek E-ticaret', 'Basit e-ticaret sitesi kurulumu', u1.id);
    insertProject.run('Mobil Sağlık Uygulaması', 'Sağlık takip uygulaması için MVP', u2.id);
  }

  console.log('DB initialized and seeded at', dbPath);
}

seed();
