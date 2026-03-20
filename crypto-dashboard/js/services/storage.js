// ─── services/storage.js ─────────────────────────────────────────────────────
// Handles all LocalStorage operations for watchlist persistence

const WATCHLIST_KEY = 'cryptolens_watchlist';
const THEME_KEY     = 'cryptolens_theme';

const StorageService = {

  // ── Watchlist ──────────────────────────────────────────────────────────────

  // Load watchlist — returns array of coin IDs e.g. ['bitcoin', 'ethereum']
  loadWatchlist: () => {
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // Save entire watchlist array
  saveWatchlist: (watchlist) => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (err) {
      console.warn('Could not save watchlist:', err);
    }
  },

  // Toggle a coin in/out of watchlist — returns updated watchlist
  toggleWatchlist: (coinId, current) => {
    const updated = current.includes(coinId)
      ? current.filter(id => id !== coinId)   // remove
      : [...current, coinId];                  // add
    StorageService.saveWatchlist(updated);
    return updated;
  },

  // ── Theme ──────────────────────────────────────────────────────────────────

  loadTheme: () => {
    try { return localStorage.getItem(THEME_KEY) || 'dark'; }
    catch { return 'dark'; }
  },

  saveTheme: (theme) => {
    try { localStorage.setItem(THEME_KEY, theme); }
    catch {}
  },
};
