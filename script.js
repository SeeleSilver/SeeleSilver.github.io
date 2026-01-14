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

  loadProjects();

});
