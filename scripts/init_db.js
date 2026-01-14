const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const dataPath = path.join(__dirname, '..', 'data.json');

function init(){
  if(fs.existsSync(dataPath)){
    console.log('data.json already exists at', dataPath);
    return;
  }

  const users = [
    { name: 'Test Kullanıcı', email: 'test@example.com', password: 'password', is_admin: 1 },
    { name: 'Freelancer Demo', email: 'freela@example.com', password: 'secret', is_admin: 0 }
  ];

  const hashedUsers = users.map((u, i) => ({
    id: i+1,
    name: u.name,
    email: u.email.toLowerCase(),
    password: bcrypt.hashSync(u.password, 10),
    is_admin: u.is_admin || 0
  }));

  const projects = [
    { id: 1, title: 'Örnek E-ticaret', description: 'Basit e-ticaret sitesi kurulumu', owner_id: 1, created_at: new Date().toISOString() },
    { id: 2, title: 'Mobil Sağlık Uygulaması', description: 'Sağlık takip uygulaması için MVP', owner_id: 2, created_at: new Date().toISOString() }
  ];

  const data = {
    nextIds: { users: hashedUsers.length + 1, projects: projects.length + 1, proposals: 1 },
    users: hashedUsers,
    projects,
    proposals: []
  };

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log('Initialized data.json with seed data at', dataPath);
}

init();
