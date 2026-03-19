/**
 * Injected into the LeetCode page context to intercept network responses.
 * Communicates back to the content script via window.postMessage.
 */
(function () {
  'use strict';

  function getProblemSlug() {
    const match = window.location.pathname.match(/^\/problems\/([^/]+)/);
    return match ? match[1] : null;
  }

  function notifyAccepted(slug) {
    window.postMessage({ type: 'STREAKSY_ACCEPTED', problemSlug: slug }, '*');
  }

  // ── Intercept fetch ──
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';

    if (url.includes('/submissions/detail/') && url.includes('/check/')) {
      try {
        const cloned = response.clone();
        const data = await cloned.json();
        if (data.status_msg === 'Accepted') {
          const slug = getProblemSlug();
          if (slug) notifyAccepted(slug);
        }
      } catch {
        // pending state — not JSON yet
      }
    }
    return response;
  };

  // ── Intercept XMLHttpRequest ──
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._streaksyUrl = url;
    return originalOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    if (this._streaksyUrl?.includes('/submissions/detail/') &&
        this._streaksyUrl?.includes('/check/')) {
      this.addEventListener('load', function () {
        try {
          const data = JSON.parse(this.responseText);
          if (data.status_msg === 'Accepted') {
            const slug = getProblemSlug();
            if (slug) notifyAccepted(slug);
          }
        } catch {
          // ignore
        }
      });
    }
    return originalSend.apply(this, args);
  };

  console.log('[Streaksy] Network interceptors installed');
})();
