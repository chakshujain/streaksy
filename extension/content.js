/**
 * Streaksy Content Script — injected into LeetCode problem pages.
 *
 * Enhanced detection:
 *   1. Injects injected.js to intercept fetch/XHR for submission details + code
 *   2. MutationObserver watching for "Accepted" DOM elements (fallback)
 *   3. Tracks time spent on problem page
 *   4. Captures submitted code, language, runtime, memory
 *
 * All data funnels to the background service worker.
 */
(function () {
  'use strict';

  // ── State ──
  let lastSyncedSlug = null;
  let lastSyncTimestamp = 0;
  const DEDUP_WINDOW_MS = 10_000;

  // Time tracking
  const pageLoadTime = Date.now();
  let pendingCode = null;
  let pendingLanguage = null;

  function getProblemSlug() {
    const match = window.location.pathname.match(/^\/problems\/([^/]+)/);
    return match ? match[1] : null;
  }

  function getTimeSpentSeconds() {
    return Math.round((Date.now() - pageLoadTime) / 1000);
  }

  function notifyAccepted(slug, submissionData) {
    const now = Date.now();
    if (slug === lastSyncedSlug && now - lastSyncTimestamp < DEDUP_WINDOW_MS) {
      return; // dedup
    }
    lastSyncedSlug = slug;
    lastSyncTimestamp = now;

    const payload = {
      type: 'SUBMISSION_ACCEPTED',
      problemSlug: slug,
      timeSpentSeconds: getTimeSpentSeconds(),
      // Include captured code if available
      code: pendingCode || null,
      language: pendingLanguage || submissionData?.language || null,
      // Include performance data from submission check
      runtimeMs: submissionData?.runtimeMs || null,
      runtimePercentile: submissionData?.runtimePercentile || null,
      memoryKb: submissionData?.memoryKb || null,
      memoryPercentile: submissionData?.memoryPercentile || null,
      leetcodeSubmissionId: submissionData?.leetcodeSubmissionId || null,
      totalCorrect: submissionData?.totalCorrect || null,
      totalTestcases: submissionData?.totalTestcases || null,
    };

    console.log('[Streaksy] Accepted detected:', slug, payload);
    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('[Streaksy] Message send failed:', chrome.runtime.lastError.message);
      }
    });

    // Reset pending code after sync
    pendingCode = null;
    pendingLanguage = null;
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
    if (event.source !== window) return;

    // Code capture (from submit POST interception)
    if (event.data?.type === 'STREAKSY_CODE_CAPTURE') {
      pendingCode = event.data.code;
      pendingLanguage = event.data.language;
      console.log('[Streaksy] Code captured:', event.data.language, `(${event.data.code?.length} chars)`);
    }

    // Full submission data (from check endpoint)
    if (event.data?.type === 'STREAKSY_SUBMISSION') {
      if (event.data.accepted) {
        const slug = event.data.problemSlug;
        if (slug) notifyAccepted(slug, event.data);
      } else {
        // Track non-accepted submissions too (for attempt counting)
        console.log('[Streaksy] Non-accepted submission:', event.data.status);
      }
    }

    // Legacy accepted message (backward compat)
    if (event.data?.type === 'STREAKSY_ACCEPTED') {
      const slug = event.data.problemSlug;
      if (slug) notifyAccepted(slug, null);
    }
  });

  // ── DOM Observer: detect "Accepted" result elements (fallback) ──
  function startDomObserver() {
    const observer = new MutationObserver(() => {
      if (checkForAccepted()) {
        const slug = getProblemSlug();
        if (slug) notifyAccepted(slug, null);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return observer;
  }

  function checkForAccepted() {
    const resultEl = document.querySelector('[data-e2e-locator="submission-result"]');
    if (resultEl && /accepted/i.test(resultEl.textContent)) {
      return true;
    }

    const successEls = document.querySelectorAll(
      '[class*="success"], [class*="accepted"], [class*="Accepted"]'
    );
    for (const el of successEls) {
      if (/^Accepted$/i.test(el.textContent.trim())) {
        return true;
      }
    }

    const spans = document.querySelectorAll('span[class], div[class]');
    for (const span of spans) {
      const text = span.textContent.trim();
      if (text === 'Accepted') {
        const parent = span.closest('[class*="result"], [class*="submission"], [id*="result"]');
        if (parent) return true;

        try {
          const color = window.getComputedStyle(span).color;
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

  console.log('[Streaksy] Loaded for problem:', slug, '(tracking time)');
  injectPageScript();
  startDomObserver();
})();
