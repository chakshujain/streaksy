/**
 * Streaksy Background Service Worker (Enhanced)
 *
 * Responsibilities:
 *   - Receive SUBMISSION_ACCEPTED messages from content script (with rich data)
 *   - Call POST /api/sync/leetcode with JWT auth + submission details
 *   - Retry on failure (up to 3 attempts with exponential backoff)
 *   - Deduplicate syncs (track recently synced slugs)
 *   - Store sync history for popup UI
 */

const API_BASE = 'https://streaksy.in/api';
const MAX_RETRIES = 3;

// ── Recently synced slugs (prevent duplicate API calls) ──
const recentSyncs = new Map(); // slug -> timestamp
const SYNC_COOLDOWN_MS = 30_000;

// ── Message handler ──
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SUBMISSION_ACCEPTED') {
    handleAccepted(message)
      .then((result) => sendResponse({ success: true, ...result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // keep message channel open for async response
  }

  if (message.type === 'GET_STATUS') {
    getStatus().then(sendResponse);
    return true;
  }

  if (message.type === 'LOGIN') {
    handleLogin(message.email, message.password)
      .then((result) => sendResponse({ success: true, ...result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === 'LOGOUT') {
    handleLogout().then(() => sendResponse({ success: true }));
    return true;
  }
});

// ── Sync a solved problem (enhanced with rich data) ──
async function handleAccepted(data) {
  const { problemSlug } = data;

  // Dedup check
  const lastSync = recentSyncs.get(problemSlug);
  if (lastSync && Date.now() - lastSync < SYNC_COOLDOWN_MS) {
    console.log('[Streaksy BG] Skipping duplicate sync for:', problemSlug);
    return { skipped: true };
  }

  const auth = await getAuth();
  if (!auth?.token || !auth?.userId) {
    console.warn('[Streaksy BG] Not authenticated, skipping sync');
    await updateStatus('error', 'Not logged in', problemSlug);
    return { error: 'Not authenticated' };
  }

  // Mark as syncing
  await updateStatus('syncing', null, problemSlug);
  recentSyncs.set(problemSlug, Date.now());

  // Build request payload with all captured data
  const payload = {
    userId: auth.userId,
    problemSlug: problemSlug,
    status: 'solved',
    // Enhanced fields
    language: data.language || undefined,
    code: data.code || undefined,
    runtimeMs: data.runtimeMs || undefined,
    runtimePercentile: data.runtimePercentile || undefined,
    memoryKb: data.memoryKb || undefined,
    memoryPercentile: data.memoryPercentile || undefined,
    timeSpentSeconds: data.timeSpentSeconds || undefined,
    leetcodeSubmissionId: data.leetcodeSubmissionId || undefined,
  };

  // Clean undefined values
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

  // Retry loop
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${API_BASE}/sync/leetcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('[Streaksy BG] Synced:', problemSlug, result);

      await updateStatus('synced', null, problemSlug);
      await addToHistory(problemSlug, {
        language: data.language,
        runtimeMs: data.runtimeMs,
        memoryKb: data.memoryKb,
        timeSpentSeconds: data.timeSpentSeconds,
      });

      return { synced: true, data: result };
    } catch (err) {
      lastError = err;
      console.warn(`[Streaksy BG] Attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);

      if (attempt < MAX_RETRIES) {
        await sleep(1000 * Math.pow(2, attempt - 1));
      }
    }
  }

  // All retries failed
  recentSyncs.delete(problemSlug);
  await updateStatus('error', lastError?.message || 'Sync failed', problemSlug);

  // Schedule a retry via alarm
  chrome.alarms.create(`retry:${problemSlug}`, { delayInMinutes: 1 });

  throw lastError;
}

// ── Alarm-based retry ──
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('retry:')) {
    const slug = alarm.name.slice(6);
    console.log('[Streaksy BG] Retrying sync for:', slug);
    recentSyncs.delete(slug);
    try {
      await handleAccepted({ problemSlug: slug });
    } catch {
      // already handled inside handleAccepted
    }
  }
});

// ── Auth ──
async function handleLogin(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Login failed');
  }

  const data = await response.json();
  await chrome.storage.local.set({
    auth: {
      token: data.token,
      userId: data.user.id,
      email: data.user.email,
      displayName: data.user.displayName,
    },
  });

  return { user: data.user };
}

async function handleLogout() {
  await chrome.storage.local.remove(['auth', 'syncStatus', 'syncHistory']);
  recentSyncs.clear();
}

async function getAuth() {
  const result = await chrome.storage.local.get('auth');
  return result.auth || null;
}

// ── Status tracking ──
async function updateStatus(state, error, problemSlug) {
  await chrome.storage.local.set({
    syncStatus: {
      state,       // 'idle' | 'syncing' | 'synced' | 'error'
      error,
      problemSlug,
      timestamp: Date.now(),
    },
  });
}

async function getStatus() {
  const result = await chrome.storage.local.get(['auth', 'syncStatus', 'syncHistory']);
  return {
    auth: result.auth || null,
    syncStatus: result.syncStatus || { state: 'idle' },
    syncHistory: result.syncHistory || [],
  };
}

// ── Sync history (last 50, with rich data) ──
async function addToHistory(problemSlug, extra) {
  const result = await chrome.storage.local.get('syncHistory');
  const history = result.syncHistory || [];
  history.unshift({
    slug: problemSlug,
    timestamp: Date.now(),
    language: extra?.language || null,
    runtimeMs: extra?.runtimeMs || null,
    memoryKb: extra?.memoryKb || null,
    timeSpentSeconds: extra?.timeSpentSeconds || null,
  });
  // Keep last 50
  await chrome.storage.local.set({ syncHistory: history.slice(0, 50) });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log('[Streaksy BG] Service worker started (enhanced)');
