/**
 * Solvo Popup UI
 *
 * Shows login form or authenticated state with sync status + history.
 * Communicates with the background service worker via chrome.runtime.sendMessage.
 */
(function () {
  'use strict';

  // ── DOM refs ──
  const loginView = document.getElementById('login-view');
  const mainView = document.getElementById('main-view');
  const loginForm = document.getElementById('login-form');
  const loginBtn = document.getElementById('login-btn');
  const loginError = document.getElementById('login-error');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const userAvatar = document.getElementById('user-avatar');
  const logoutBtn = document.getElementById('logout-btn');
  const statusIndicator = document.getElementById('status-indicator');
  const statusLabel = document.getElementById('status-label');
  const statusDetail = document.getElementById('status-detail');
  const syncHistory = document.getElementById('sync-history');

  // ── Init ──
  loadStatus();

  // Poll for status updates while popup is open
  const statusInterval = setInterval(loadStatus, 2000);
  window.addEventListener('unload', () => clearInterval(statusInterval));

  // ── Load current status ──
  function loadStatus() {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
      if (chrome.runtime.lastError || !response) return;

      if (response.auth) {
        showMainView(response.auth, response.syncStatus, response.syncHistory);
      } else {
        showLoginView();
      }
    });
  }

  // ── Views ──
  function showLoginView() {
    loginView.classList.remove('hidden');
    mainView.classList.add('hidden');
  }

  function showMainView(auth, status, history) {
    loginView.classList.add('hidden');
    mainView.classList.remove('hidden');

    // User info
    userName.textContent = auth.displayName || 'User';
    userEmail.textContent = auth.email || '';
    userAvatar.textContent = (auth.displayName || 'U').charAt(0).toUpperCase();

    // Sync status
    updateStatusCard(status);

    // History
    renderHistory(history || []);
  }

  function updateStatusCard(status) {
    const state = status?.state || 'idle';

    // Indicator color
    statusIndicator.className = 'status-indicator ' + state;

    switch (state) {
      case 'idle':
        statusLabel.textContent = 'Ready';
        statusDetail.textContent = 'Waiting for submissions...';
        break;
      case 'syncing':
        statusLabel.textContent = 'Syncing...';
        statusDetail.textContent = formatSlug(status.problemSlug);
        break;
      case 'synced':
        statusLabel.textContent = 'Synced';
        statusDetail.textContent = formatSlug(status.problemSlug) + ' — ' + timeAgo(status.timestamp);
        break;
      case 'error':
        statusLabel.textContent = 'Sync Failed';
        statusDetail.textContent = status.error || 'Unknown error';
        break;
    }
  }

  function renderHistory(history) {
    if (history.length === 0) {
      syncHistory.innerHTML = '<div class="empty-state">No syncs yet</div>';
      return;
    }

    syncHistory.innerHTML = history
      .map(
        (item) => `
      <div class="history-item">
        <div style="display:flex;align-items:center;min-width:0">
          <svg class="history-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="history-slug">${escapeHtml(formatSlug(item.slug))}</span>
        </div>
        <span class="history-time">${timeAgo(item.timestamp)}</span>
      </div>
    `
      )
      .join('');
  }

  // ── Login ──
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';

    chrome.runtime.sendMessage(
      {
        type: 'LOGIN',
        email: emailInput.value,
        password: passwordInput.value,
      },
      (response) => {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';

        if (chrome.runtime.lastError) {
          showError('Connection failed');
          return;
        }

        if (response?.success) {
          loadStatus();
        } else {
          showError(response?.error || 'Login failed');
        }
      }
    );
  });

  function showError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
  }

  // ── Logout ──
  logoutBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'LOGOUT' }, () => {
      loadStatus();
    });
  });

  // ── Helpers ──
  function formatSlug(slug) {
    if (!slug) return '—';
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function timeAgo(timestamp) {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return seconds + 's ago';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    const days = Math.floor(hours / 24);
    return days + 'd ago';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
