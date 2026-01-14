document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.style.display === 'block';
      nav.style.display = open ? '' : 'block';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.classList.toggle('open');
    });
  }

  // Elements
  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const btnCreate = document.getElementById('btn-create-project');

  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  const createModal = document.getElementById('create-modal');

  function show(el) { el.style.display = 'flex'; }
  function hide(el) { el.style.display = 'none'; }

  // Open modals
  btnLogin && btnLogin.addEventListener('click', () => show(loginModal));
  btnRegister && btnRegister.addEventListener('click', () => show(registerModal));
  btnCreate && btnCreate.addEventListener('click', () => show(createModal));

  // Cancel buttons
  document.getElementById('login-cancel').addEventListener('click', () => hide(loginModal));
  document.getElementById('reg-cancel').addEventListener('click', () => hide(registerModal));
  document.getElementById('proj-cancel').addEventListener('click', () => hide(createModal));

  // Auth helpers
  function setToken(t) { localStorage.setItem('token', t); }
  function getToken() { return localStorage.getItem('token'); }

  async function api(path, opts = {}) {
    opts.headers = opts.headers || {};
    opts.headers['Content-Type'] = 'application/json';
    const token = getToken();
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch('/api' + path, opts);
    return res.json();
  }

  // Register
  document.getElementById('reg-submit').addEventListener('click', async () => {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const res = await api('/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    if (res.token) { setToken(res.token); hide(registerModal); loadProjects(); }
    else alert(res.error || 'Kayıt başarısız');
  });

  // Login
  document.getElementById('login-submit').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const res = await api('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (res.token) { setToken(res.token); hide(loginModal); loadProjects(); }
    else alert(res.error || 'Giriş başarısız');
  });

  // Create project
  document.getElementById('proj-submit').addEventListener('click', async () => {
    const title = document.getElementById('proj-title').value.trim();
    const description = document.getElementById('proj-desc').value.trim();
    const res = await api('/projects', { method: 'POST', body: JSON.stringify({ title, description }) });
    if (res.id) { hide(createModal); loadProjects(); }
    else alert(res.error || 'Proje oluşturulamadı');
  });

  // Load projects
  async function loadProjects() {
    const list = document.getElementById('projects-list');
    list.innerHTML = '<div class="muted">Yükleniyor...</div>';
    const rows = await api('/projects');
    if (!Array.isArray(rows)) { list.innerHTML = '<div class="muted">Veri alınamadı</div>'; return; }
    if (rows.length === 0) { list.innerHTML = '<div class="muted">Henüz proje yok</div>'; return; }
    list.innerHTML = rows.map(p => `
      <div class="project card">
        <h4>${escapeHtml(p.title)}</h4>
        <div class="meta">${p.owner_name ? 'Paylaşan: ' + escapeHtml(p.owner_name) : ''} • ${p.created_at || ''}</div>
        <p>${escapeHtml(p.description || '')}</p>
      </div>
    `).join('');
  }

  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

  loadProjects();

});
