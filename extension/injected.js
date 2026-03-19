/**
 * Injected into the LeetCode page context to intercept network responses.
 * Captures: submission result, code, language, runtime, memory, submission ID.
 * Communicates back to the content script via window.postMessage.
 */
(function () {
  'use strict';

  function getProblemSlug() {
    const match = window.location.pathname.match(/^\/problems\/([^/]+)/);
    return match ? match[1] : null;
  }

  function notifySubmission(data) {
    window.postMessage({ type: 'STREAKSY_SUBMISSION', ...data }, '*');
  }

  // ── Intercept fetch ──
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';

    // Capture submission check responses (polling endpoint)
    if (url.includes('/submissions/detail/') && url.includes('/check/')) {
      try {
        const cloned = response.clone();
        const data = await cloned.json();
        if (data.state === 'SUCCESS') {
          const slug = getProblemSlug();
          if (slug) {
            // Extract submission ID from URL
            const subIdMatch = url.match(/\/submissions\/detail\/(\d+)\//);
            const leetcodeSubmissionId = subIdMatch ? subIdMatch[1] : null;

            notifySubmission({
              problemSlug: slug,
              status: data.status_msg, // 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', etc.
              accepted: data.status_msg === 'Accepted',
              language: data.lang || data.pretty_lang || null,
              runtimeMs: typeof data.status_runtime === 'string' ? parseInt(data.status_runtime) : (data.runtime || null),
              runtimePercentile: data.runtime_percentile != null ? parseFloat(data.runtime_percentile) : null,
              memoryKb: data.status_memory ? parseFloat(data.status_memory) : (data.memory ? Math.round(data.memory / 1024) : null),
              memoryPercentile: data.memory_percentile != null ? parseFloat(data.memory_percentile) : null,
              totalCorrect: data.total_correct || null,
              totalTestcases: data.total_testcases || null,
              leetcodeSubmissionId,
            });
          }
        }
      } catch {
        // pending state — not JSON yet, or parse error
      }
    }

    // Capture the submission POST to get the code being submitted
    if (url.includes('/problems/') && url.includes('/submit/')) {
      try {
        const reqBody = args[1]?.body;
        if (reqBody) {
          const parsed = JSON.parse(reqBody);
          if (parsed.typed_code || parsed.code) {
            const slug = getProblemSlug();
            if (slug) {
              window.postMessage({
                type: 'STREAKSY_CODE_CAPTURE',
                problemSlug: slug,
                code: parsed.typed_code || parsed.code,
                language: parsed.lang || null,
              }, '*');
            }
          }
        }
      } catch {
        // ignore
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
          if (data.state === 'SUCCESS') {
            const slug = getProblemSlug();
            const subIdMatch = this._streaksyUrl.match(/\/submissions\/detail\/(\d+)\//);
            const leetcodeSubmissionId = subIdMatch ? subIdMatch[1] : null;

            if (slug) {
              notifySubmission({
                problemSlug: slug,
                status: data.status_msg,
                accepted: data.status_msg === 'Accepted',
                language: data.lang || data.pretty_lang || null,
                runtimeMs: typeof data.status_runtime === 'string' ? parseInt(data.status_runtime) : (data.runtime || null),
                runtimePercentile: data.runtime_percentile != null ? parseFloat(data.runtime_percentile) : null,
                memoryKb: data.status_memory ? parseFloat(data.status_memory) : (data.memory ? Math.round(data.memory / 1024) : null),
                memoryPercentile: data.memory_percentile != null ? parseFloat(data.memory_percentile) : null,
                totalCorrect: data.total_correct || null,
                totalTestcases: data.total_testcases || null,
                leetcodeSubmissionId,
              });
            }
          }
        } catch {
          // ignore
        }
      });
    }

    // Capture submit POST body
    if (this._streaksyUrl?.includes('/problems/') && this._streaksyUrl?.includes('/submit/')) {
      try {
        const body = args[0];
        if (body) {
          const parsed = JSON.parse(body);
          if (parsed.typed_code || parsed.code) {
            const slug = getProblemSlug();
            if (slug) {
              window.postMessage({
                type: 'STREAKSY_CODE_CAPTURE',
                problemSlug: slug,
                code: parsed.typed_code || parsed.code,
                language: parsed.lang || null,
              }, '*');
            }
          }
        }
      } catch {
        // ignore
      }
    }

    return originalSend.apply(this, args);
  };

  console.log('[Streaksy] Network interceptors installed (enhanced)');
})();
