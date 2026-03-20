// ─── services/api.js ──────────────────────────────────────────────────────────
// ALL API calls are in this one file — clean separation from UI

const API_BASE = 'https://api.coingecko.com/api/v3';

const ApiService = {

  // Fetch top 20 coins with market data
  getTopCoins: async () => {
    const url = `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`;

    const response = await fetch(url);

    // Handle rate limit (429) and other HTTP errors
    if (response.status === 429) {
      throw new Error('API rate limit reached. Please wait a moment and try again.');
    }
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  },

  // Fetch single coin detail for modal
  getCoinDetail: async (coinId) => {
    const url = `${API_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;

    const response = await fetch(url);

    if (response.status === 429) {
      throw new Error('API rate limit reached. Please try again shortly.');
    }
    if (!response.ok) {
      throw new Error(`Failed to load coin details.`);
    }

    const data = await response.json();
    return data;
  },
};
