/**
 * Solvo Content Script — injected into LeetCode problem pages.
 *
 * Detection strategies:
 *   1. Injects injected.js into the page to intercept fetch/XHR submission responses
 *   2. MutationObserver watching for "Accepted" DOM elements
 *
 * Both strategies funnel through notifyAccepted() which deduplicates
 * and forwards to the background service worker.
 */
(function () {
  'use strict';

  // ── Dedup state ──
  let lastSyncedSlug = null;
  let lastSyncTimestamp = 0;
  const DEDUP_WINDOW_MS = 10_000;

  function getProblemSlug() {
    const match = window.location.pathname.match(/^\/problems\/([^/]+)/);
    return match ? match[1] : null;
  }

  function notifyAccepted(slug) {
    const now = Date.now();
    if (slug === lastSyncedSlug && now - lastSyncTimestamp < DEDUP_WINDOW_MS) {
      return; // dedup
    }
    lastSyncedSlug = slug;
    lastSyncTimestamp = now;

    console.log('[Solvo] Accepted detected:', slug);
    chrome.runtime.sendMessage(
      { type: 'SUBMISSION_ACCEPTED', problemSlug: slug },
      (response) => {
        if (chrome.runtime.lastError) {
          console.warn('[Solvo] Message send failed:', chrome.runtime.lastError.message);
        }
      }
    );
  }

  // ── Inject page-context script for network interception ──
  function injectPageScript() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  }

  // ── Listen for messages from injected page script ──
  window.addEventListener('message', (event) => {
    if (event.source !== window || event.data?.type !== 'SOLVO_ACCEPTED') return;
    const slug = event.data.problemSlug;
    if (slug) notifyAccepted(slug);
  });

  // ── DOM Observer: detect "Accepted" result elements ──
  function startDomObserver() {
    const observer = new MutationObserver(() => {
      // Check for accepted result in the current DOM
      if (checkForAccepted()) {
        const slug = getProblemSlug();
        if (slug) notifyAccepted(slug);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return observer;
  }

  function checkForAccepted() {
    // Strategy A: data attribute selector (LeetCode e2e locator)
    const resultEl = document.querySelector('[data-e2e-locator="submission-result"]');
    if (resultEl && /accepted/i.test(resultEl.textContent)) {
      return true;
    }

    // Strategy B: class-based selectors
    const successEls = document.querySelectorAll(
      '[class*="success"], [class*="accepted"], [class*="Accepted"]'
    );
    for (const el of successEls) {
      if (/^Accepted$/i.test(el.textContent.trim())) {
        return true;
      }
    }

    // Strategy C: green "Accepted" text near submission result
    const spans = document.querySelectorAll('span[class], div[class]');
    for (const span of spans) {
      const text = span.textContent.trim();
      if (text === 'Accepted') {
        // Verify it's in a result context (not just any random "Accepted" text)
        const parent = span.closest('[class*="result"], [class*="submission"], [id*="result"]');
        if (parent) return true;

        // Or check computed color (LeetCode uses green)
        try {
          const color = window.getComputedStyle(span).color;
          // Green-ish: rgb values where G is dominant
          const rgb = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
          if (rgb) {
            const [, r, g, b] = rgb.map(Number);
            if (g > 150 && g > r && g > b) return true;
          }
        } catch {
          // ignore
        }
      }
    }

    return false;
  }

  // ── Init ──
  const slug = getProblemSlug();
  if (!slug) return;

  console.log('[Solvo] Loaded for problem:', slug);
  injectPageScript();
  startDomObserver();
})();
