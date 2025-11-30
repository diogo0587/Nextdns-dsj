class NextDNSApp {
  constructor() {
    this.config = {
      baseUrl: 'https://api-proxy-atjvh8uiq-diogo0587s-projects.vercel.app/api-proxy',
      profileId: '85d564',
      apiKey: 'f31f2871d328a52a45fefadc09a1c67d0dd5d53d'
    };
    this.currentSection = 'analytics';
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupMenuNavigation();
    document.getElementById('theme-toggle').onclick = () => this.toggleTheme();
    document.getElementById('profile-id').textContent = this.config.profileId;
    this.loadSection('analytics');
  }

  setupTheme() {
    const theme = localStorage.getItem('nd_theme') || 'dark';
    document.body.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('nd_theme', next);
  }

  setupMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        menuItems.forEach(m => m.classList.remove('active'));
        item.classList.add('active');
        const section = item.getAttribute('data-section');
        this.loadSection(section);
      });
    });
  }

  async apiRequest(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: {
          'X-Api-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        }
      };
      if (body) options.body = JSON.stringify(body);
      
      const resp = await fetch(`${this.config.baseUrl}${endpoint}`, options);
      return await resp.json();
    } catch (e) {
      console.error('API Error:', e);
      return { error: e.message };
    }
  }

  showLoader() {
    document.getElementById('content').innerHTML = '<div class="loader">Carregando...</div>';
  }

  loadSection(section) {
    this.currentSection = section;
    this.showLoader();
    
    switch(section) {
      case 'analytics':
        this.loadAnalytics();
        break;
      case 'logs':
        this.loadLogs();
        break;
      case 'security':
        this.loadSecurity();
        break;
      case 'privacy':
        this.loadPrivacy();
        break;
      case 'parental':
        this.loadParental();
        break;
      case 'denylist':
        this.loadDenylist();
        break;
      case 'allowlist':
        this.loadAllowlist();
        break;
      case 'settings':
        this.loadSettings();
        break;
    }
  }

  async loadAnalytics() {
    const data = await this.apiRequest(`/profiles/${this.config.profileId}/analytics/status`);
    
    const html = `
      <div class="card">
        <h3>📊 Analytics & Status</h3>
        <div class="stat-grid">
          <div class="stat-box">
            <h4>${data.queries || 0}</h4>
            <p>Total Queries</p>
          </div>
          <div class="stat-box">
            <h4>${data.blocked || 0}</h4>
            <p>Blocked</p>
          </div>
          <div class="stat-box">
            <h4>${data.relayed || 0}</h4>
            <p>Relayed</p>
          </div>
          <div class="stat-box">
            <h4>${((data.blocked / data.queries) * 100 || 0).toFixed(1)}%</h4>
            <p>Block Rate</p>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>📈 Dados Completos</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
    document.getElementById('content').innerHTML = html;
  }

  async loadLogs() {
    const data = await this.apiRequest(`/profiles/${this.config.profileId}/logs?limit=50`);
    
    let html = `
      <div class="card">
        <h3>📝 Logs Recentes (50 últimos)</h3>
        <button class="btn" onclick="app.refreshSection()">🔄 Atualizar</button>
    `;
    
    if (data.data && data.data.length > 0) {
      data.data.forEach(log => {
        const status = log.status === 2 ? 'blocked' : 'allowed';
        const statusText = log.status === 2 ? 'Bloqueado' : 'Permitido';
        html += `
          <div class="log-entry">
            <div>
              <div class="log-domain">${log.domain || 'N/A'}</div>
              <small>${new Date(log.timestamp).toLocaleString('pt-BR')}</small>
            </div>
            <span class="log-status ${status}">${statusText}</span>
          </div>
        `;
      });
    } else {
      html += '<p>Nenhum log encontrado.</p>';
    }
    
    html += '</div>';
    document.getElementById('content').innerHTML = html;
  }

  async loadSecurity() {
    const data = await this.apiRequest(`/profiles/${this.config.profileId}/security`);
    
    const html = `
      <div class="card">
        <h3>🔒 Security Settings</h3>
        ${this.createToggle('Threat Intelligence Feeds', data.threatIntelligenceFeeds || false, 'threatIntelligenceFeeds')}
        ${this.createToggle('AI-Driven Threat Detection', data.aiThreatDetection || false, 'aiThreatDetection')}
        ${this.createToggle('Google Safe Browsing', data.googleSafeBrowsing || false, 'googleSafeBrowsing')}
        ${this.createToggle('Cryptojacking Protection', data.cryptojacking || false, 'cryptojacking')}
        ${this.createToggle('DNS Rebinding Protection', data.dnsRebindingProtection || false, 'dnsRebindingProtection')}
        ${this.createToggle('IDN Homograph Attacks Protection', data.idnHomographs || false, 'idnHomographs')}
        ${this.createToggle('Typosquatting Protection', data.typosquatting || false, 'typosquatting')}
        ${this.createToggle('Domain Generation Algorithms (DGAs)', data.dga || false, 'dga')}
        ${this.createToggle('Block Newly Registered Domains (NRDs)', data.nrd || false, 'nrd')}
        ${this.createToggle('Block Dynamic DNS Hostnames', data.ddns || false, 'ddns')}
        ${this.createToggle('Block Parked Domains', data.parking || false, 'parking')}
        <button class="btn" onclick="app.saveSecurity()">💾 Salvar Alterações</button>
      </div>
      <div class="card">
        <h3>📋 Dados Completos</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
    document.getElementById('content').innerHTML = html;
  }

  async loadPrivacy() {
    const data = await this.apiRequest(`/profiles/${this.config.profileId}/privacy`);
    
    const html = `
      <div class="card">
        <h3>🕵️ Privacy Settings</h3>
        ${this.createToggle('Block Disguised Third-Party Trackers', data.disguisedTrackers || false, 'disguisedTrackers')}
        ${this.createToggle('Allow Affiliate & Tracking Links', data.allowAffiliate || false, 'allowAffiliate')}
        ${this.createToggle('Block Aggressive Blocklists', data.blockAggressive || false, 'blockAggressive')}
        <h4 style="margin-top: 2rem;">Blocklists Ativas:</h4>
        <p>${data.blocklists ? data.blocklists.join(', ') : 'Nenhuma'}</p>
        <button class="btn" onclick="app.savePrivacy()">💾 Salvar Alterações</button>
      </div>
      <div class="card">
        <h3>📋 Dados Completos</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
    document.getElementById('content').innerHTML = html;
  }

  async loadParental() {
    const data = await this.apiRequest(`/profiles/${this.config.profileId}/parentalControl`);
    
    const html = `
      <div class="card">
        <h3>👨‍👩‍👧‍👦 Parental Control</h3>
        ${this.createToggle('Safe Search', data.safeSearch || false, 'safeSearch')}
        ${this.createToggle('YouTube Restricted Mode', data.youtubeRestrictedMode || false, 'youtubeRestrictedMode')}
        ${this.createToggle('Block Bypass Methods', data.blockBypass || false, 'blockBypass')}
        
        <h4 style="margin-top: 2rem;">Categorias Bloqueadas:</h4>
        ${data.categories ? data.categories.map(cat => `
          <div class="toggle">
            <span>${cat.id}</span>
            <div class="toggle-switch ${cat.active ? 'active' : ''}" data-category="${cat.id}"></div>
          </div>
        `).join('') : '<p>Nenhuma categoria configurada</p>'}
        
        <h4 style="margin-top: 2rem;">Serviços/Apps Bloqueados:</h4>
        ${data.services ? data.services.map(svc => `
          <div class="toggle">
            <span>${svc.id}</span>
            <div class="toggle-switch ${svc.active ? 'active' : ''}" data-service="${svc.id}"></div>
          </div>
        `).join('') : '<p>Nenhum serviço bloqueado</p>'}
        
        <button class="btn" onclick="app.saveParental()">💾 Salvar Alterações</button>
      </div>
      <div class="card">
        <h3>📋 Dados Completos</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
    document.getElementById('content').innerHTML = html;
  }

  async loadDenylist() {
    const data = await this.apiRequest(`/profiles/${this.config.profileId}/denylist`);
    
    let html = `
      <div class="card">
        <h3>🚫 Denylist (Domínios Bloqueados)</h3>
        <div class="input-group">
          <label>Adicionar domínio:</label>
          <input type="text" id="deny-domain" placeholder="exemplo.com">
          <button class="btn" onclick="app.addToDenylist()">➕ Adicionar</button>
        </div>
        <div style="margin-top: 2rem;">
    `;
    
    if (data && data.length > 0) {
      data.forEach(item => {
        html += `
          <div class="log-entry">
            <span class="log-domain">${item.domain || item.id}</span>
            <button class="btn btn-danger" onclick="app.removeFromDenylist('${item.id}')">🗑️ Remover</button>
          </div>
        `;
      });
    } else {
      html += '<p>Nenhum domínio na denylist</p>';
    }
    
    html += '</div></div>';
    document.getElementById('content').innerHTML = html;
  }

  async loadAllowlist() {
    const data = await this.apiRequest(`/profiles/${this.config.profileId}/allowlist`);
    
    let html = `
      <div class="card">
        <h3>✅ Allowlist (Domínios Permitidos)</h3>
        <div class="input-group">
          <label>Adicionar domínio:</label>
          <input type="text" id="allow-domain" placeholder="exemplo.com">
          <button class="btn" onclick="app.addToAllowlist()">➕ Adicionar</button>
        </div>
        <div style="margin-top: 2rem;">
    `;
    
    if (data && data.length > 0) {
      data.forEach(item => {
        html += `
          <div class="log-entry">
            <span class="log-domain">${item.domain || item.id}</span>
            <button class="btn btn-danger" onclick="app.removeFromAllowlist('${item.id}')">🗑️ Remover</button>
          </div>
        `;
      });
    } else {
      html += '<p>Nenhum domínio na allowlist</p>';
    }
    
    html += '</div></div>';
    document.getElementById('content').innerHTML = html;
  }

  async loadSettings() {
    const data = await this.apiRequest(`/profiles/${this.config.profileId}`);
    
    const html = `
      <div class="card">
        <h3>⚙️ Settings & Profile Info</h3>
        <div class="input-group">
          <label>Profile Name:</label>
          <input type="text" value="${data.name || 'N/A'}" disabled>
        </div>
        <div class="input-group">
          <label>Profile ID:</label>
          <input type="text" value="${this.config.profileId}" disabled>
        </div>
        <div class="input-group">
          <label>Fingerprint:</label>
          <input type="text" value="${data.fingerprint || 'N/A'}" disabled>
        </div>
      </div>
      <div class="card">
        <h3>📋 Dados Completos do Profile</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
    document.getElementById('content').innerHTML = html;
  }

  createToggle(label, active, id) {
    return `
      <div class="toggle">
        <span>${label}</span>
        <div class="toggle-switch ${active ? 'active' : ''}" data-toggle="${id}" onclick="app.toggleSwitch(this)"></div>
      </div>
    `;
  }

  toggleSwitch(element) {
    element.classList.toggle('active');
  }

  refreshSection() {
    this.loadSection(this.currentSection);
  }

  async addToDenylist() {
    const domain = document.getElementById('deny-domain').value;
    if (!domain) return alert('Digite um domínio');
    await this.apiRequest(`/profiles/${this.config.profileId}/denylist`, 'POST', { id: domain });
    this.loadDenylist();
  }

  async removeFromDenylist(id) {
    await this.apiRequest(`/profiles/${this.config.profileId}/denylist/${id}`, 'DELETE');
    this.loadDenylist();
  }

  async addToAllowlist() {
    const domain = document.getElementById('allow-domain').value;
    if (!domain) return alert('Digite um domínio');
    await this.apiRequest(`/profiles/${this.config.profileId}/allowlist`, 'POST', { id: domain });
    this.loadAllowlist();
  }

  async removeFromAllowlist(id) {
    await this.apiRequest(`/profiles/${this.config.profileId}/allowlist/${id}`, 'DELETE');
    this.loadAllowlist();
  }

  async saveSecurity() {
    alert('Função de salvar Security em desenvolvimento');
  }

  async savePrivacy() {
    alert('Função de salvar Privacy em desenvolvimento');
  }

  async saveParental() {
    alert('Função de salvar Parental em desenvolvimento');
  }
}

window.app = new NextDNSApp();
