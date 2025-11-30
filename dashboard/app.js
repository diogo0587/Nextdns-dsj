class NextDNSApp {
  constructor() {
    this.config = {
      baseUrl: 'UPDATE_ME_PROXY_URL',
      profileId: '85d564',
      apiKey: 'f31f2871d328a52a45fefadc09a1c67d0dd5d53d'
    };
    this.init();
  }
  init() {
    this.setupTheme();
    document.getElementById('theme-toggle').onclick = () => this.toggleTheme();
    this.loadDashboard();
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
  async loadDashboard() {
    const container = document.getElementById('content');
    container.innerHTML = 'Carregando dashboard...';
    try {
      const resp = await fetch(`${this.config.baseUrl}/profiles/${this.config.profileId}/analytics/status`, {
        headers: {
          'X-Api-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        }
      });
      const raw = await resp.text();
      container.innerHTML = `<b>Status (${resp.status}):</b><pre>${raw}</pre>`;
    } catch (e) {
      container.textContent = `Erro ao consultar NextDNS: ${e}`;
    }
  }
}
window.app = new NextDNSApp();
