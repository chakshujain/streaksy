/**
 * Streaksy Background Service Worker
 *
 * Responsibilities:
 *   - Receive SUBMISSION_ACCEPTED messages from content script
 *   - Call POST /api/sync/leetcode with JWT auth
 *   - Retry on failure (up to 3 attempts with exponential backoff)
 *   - Deduplicate syncs (track recently synced slugs)
 *   - Store sync history for popup UI
 */

const API_BASE = 'http://streaksy.in:3001/api';
const MAX_RETRIES = 3;

// ── Recently synced slugs (prevent duplicate API calls) ──
const recentSyncs = new Map(); // slug -> timestamp
const SYNC_COOLDOWN_MS = 30_000;

// ── Message handler ──
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SUBMISSION_ACCEPTED') {
    handleAccepted(message.problemSlug)
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

// ── Sync a solved problem ──
async function handleAccepted(problemSlug) {
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
        body: JSON.stringify({
          userId: auth.userId,
          problemSlug: problemSlug,
          status: 'solved',
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[Streaksy BG] Synced:', problemSlug, data);

      await updateStatus('synced', null, problemSlug);
      await addToHistory(problemSlug);

      return { synced: true, data };
    } catch (err) {
      lastError = err;
      console.warn(`[Streaksy BG] Attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);

      if (attempt < MAX_RETRIES) {
        // Exponential backoff: 1s, 2s, 4s
        await sleep(1000 * Math.pow(2, attempt - 1));
      }
    }
  }

  // All retries failed
  recentSyncs.delete(problemSlug); // allow retry later
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
    recentSyncs.delete(slug); // clear cooldown
    try {
      await handleAccepted(slug);
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

// ── Sync history (last 20) ──
async function addToHistory(problemSlug) {
  const result = await chrome.storage.local.get('syncHistory');
  const history = result.syncHistory || [];
  history.unshift({ slug: problemSlug, timestamp: Date.now() });
  // Keep only last 20
  await chrome.storage.local.set({ syncHistory: history.slice(0, 20) });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log('[Streaksy BG] Service worker started');
