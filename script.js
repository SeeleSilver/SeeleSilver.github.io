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

  // Cancel buttons
  document.getElementById('login-cancel').addEventListener('click', () => hide(loginModal));
  document.getElementById('reg-cancel').addEventListener('click', () => hide(registerModal));
  document.getElementById('proj-cancel').addEventListener('click', () => hide(createModal));

  // Protect create: require login
  if(btnCreate) btnCreate.addEventListener('click', async () => {
    const me = await loadAuthState();
    if(!me){ show(loginModal); return; }
    show(createModal);
  });

  // Auth helpers
  function setToken(t) { localStorage.setItem('token', t); }
  function getToken() { return localStorage.getItem('token'); }

  // Auth state UI
  async function loadAuthState(){
    const token = getToken();
    const userMenu = document.getElementById('user-menu');
    const authActions = document.getElementById('auth-actions');
    const userName = document.getElementById('user-name');
    if(!token){
      if(userMenu) userMenu.style.display = 'none';
      if(authActions) authActions.style.display = 'flex';
      return null;
    }
    const me = await api('/me');
    if(me && me.id){
      if(userMenu){ userMenu.style.display = 'flex'; }
      if(authActions){ authActions.style.display = 'none'; }
      if(userName) userName.textContent = me.name || me.email || 'Kullanıcı';
      // show admin actions if user is admin
      const btnUsers = document.getElementById('btn-users');
      if(btnUsers) btnUsers.style.display = (me.is_admin ? 'inline-block' : 'none');
      return me;
    }else{
      localStorage.removeItem('token');
      if(userMenu) userMenu.style.display = 'none';
      if(authActions) authActions.style.display = 'flex';
      return null;
    }
  }

  // Logout
  const btnLogout = document.getElementById('btn-logout');
  if(btnLogout) btnLogout.addEventListener('click', ()=>{
    localStorage.removeItem('token');
    loadAuthState();
    location.hash = '#/';
  });

  // Dashboard button
  const btnDashboard = document.getElementById('btn-dashboard');
  if(btnDashboard) btnDashboard.addEventListener('click', ()=> location.hash = '#/dashboard');

  // Admin users button
  const btnUsers = document.getElementById('btn-users');
  if(btnUsers) btnUsers.addEventListener('click', ()=> location.hash = '#/users');

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
    if (res.token) { setToken(res.token); hide(registerModal); await loadAuthState(); loadProjects(); }
    else alert(res.error || 'Kayıt başarısız');
  });

  // Login
  document.getElementById('login-submit').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const res = await api('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (res.token) { setToken(res.token); hide(loginModal); await loadAuthState(); loadProjects(); }
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

  // Simple hash router with quick animation
  const appRoot = document.getElementById('app');
  function showView(html){
    const old = appRoot.querySelector('.current-view');
    const wrapper = document.createElement('div');
    wrapper.className = 'current-view page-enter';
    wrapper.innerHTML = html;
    appRoot.appendChild(wrapper);
    requestAnimationFrame(()=> wrapper.classList.remove('page-enter'));
    if(old){
      old.classList.add('page-exit');
      setTimeout(()=> old.remove(), 280);
    }
  }

  async function renderRoute(){
    const hash = location.hash || '#/';
    if(hash.startsWith('#/project/')){
      const id = hash.split('/')[2];
      showView('<div class="muted">Yükleniyor...</div>');
      const p = await api(`/projects/${id}`);
      if(p.error){ showView(`<div class="muted">${p.error}</div>`); return; }
      const html = `
        <div class="card">
          <h2>${escapeHtml(p.title)}</h2>
          <div class="muted">Paylaşan: ${escapeHtml(p.owner_name||'')}</div>
          <p>${escapeHtml(p.description||'')}</p>
        </div>
      `;
      showView(html);
      return;
    }

    if(hash === '#/users'){
      showView('<div class="muted">Yükleniyor...</div>');
      const rows = await api('/users');
      if(rows.error){ showView(`<div class="muted">${rows.error}</div>`); return; }
      const html = `
        <div class="card">
          <h2>Kayıtlı Kullanıcılar</h2>
          <table style="width:100%;border-collapse:collapse">
            <thead><tr><th style="text-align:left;padding:.5rem">ID</th><th style="text-align:left;padding:.5rem">İsim</th><th style="text-align:left;padding:.5rem">E-posta</th><th style="text-align:left;padding:.5rem">Admin</th></tr></thead>
            <tbody>
              ${rows.map(u=>`<tr><td style="padding:.5rem">${u.id}</td><td style="padding:.5rem">${escapeHtml(u.name)}</td><td style="padding:.5rem">${escapeHtml(u.email)}</td><td style="padding:.5rem">${u.is_admin? 'Evet':'Hayır'}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
      showView(html);
      return;
    }

    if(hash === '#/dashboard'){
      showView('<div class="muted">Yükleniyor...</div>');
      const me = await api('/me');
      if(!me || !me.id) { showView('<div class="muted">Giriş yapmalısınız</div>'); return; }
      const rows = await api('/my/projects');
      const list = (Array.isArray(rows) && rows.length) ? rows.map(r=>`<div class="card"><h4>${escapeHtml(r.title)}</h4><p>${escapeHtml(r.description||'')}</p></div>`).join('') : '<div class="muted">Henüz proje yok</div>';
      showView(`<h2>Hoşgeldin ${escapeHtml(me.name)}</h2>${list}`);
      return;
    }

    // default -> projects list view
    if(hash === '#/' || hash === '#/home' || hash === '#/projects' || hash === ''){
      // reuse existing projects list DOM
      const content = document.getElementById('projects');
      if(content){
        showView(content.outerHTML);
        loadProjects();
        // attach project links
        setTimeout(()=>{
          const projectCards = document.querySelectorAll('.project.card');
          projectCards.forEach((c,i)=>{
            c.style.cursor='pointer';
            c.addEventListener('click', ()=>{ location.hash = '#/project/' + (i+1); });
          });
        },350);
        return;
      }
    }

    // fallback: show home sections
    const home = document.querySelector('[data-view="home"]');
    if(home) showView(home.outerHTML);
  }

  window.addEventListener('hashchange', renderRoute);
  renderRoute();

  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

  // initialize
  loadAuthState().then(() => loadProjects());

});
