// ─── app.js ───────────────────────────────────────────────────────────────────
// Root component with React Context for state management

const { useState, useEffect, useContext, createContext, useCallback, useMemo } = React;

// ─── App Context (State Management) ──────────────────────────────────────────
const AppContext = createContext(null);

function AppProvider({ children }) {
  const [coins,     setCoins]     = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [watchlist, setWatchlist] = useState(() => StorageService.loadWatchlist());
  const [theme,     setTheme]     = useState(() => StorageService.loadTheme());
  const [lastUpdated, setLastUpdated] = useState(null);

  // Apply theme to <html> tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    StorageService.saveTheme(theme);
  }, [theme]);

  // Fetch coins — wrapped in useCallback to avoid recreating on every render
  const fetchCoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getTopCoins();
      setCoins(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => { fetchCoins(); }, [fetchCoins]);

  // Toggle watchlist
  const toggleWatchlist = useCallback((coinId) => {
    setWatchlist(prev => StorageService.toggleWatchlist(coinId, prev));
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  return (
    <AppContext.Provider value={{
      coins, loading, error, watchlist,
      theme, lastUpdated,
      fetchCoins, toggleWatchlist, toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonList() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="skeleton" key={i}>
          <div className="skel-circle" />
          <div className="skel-lines">
            <div className="skel-line" style={{ width: '40%' }} />
            <div className="skel-line" style={{ width: '25%' }} />
          </div>
          <div className="skel-lines" style={{ alignItems: 'flex-end' }}>
            <div className="skel-line" style={{ width: '60%' }} />
            <div className="skel-line" style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function Dashboard() {
  const {
    coins, loading, error, watchlist,
    theme, lastUpdated,
    fetchCoins, toggleWatchlist, toggleTheme,
  } = useContext(AppContext);

  const [search,     setSearch]     = useState('');
  const [activeTab,  setActiveTab]  = useState('all');   // 'all' | 'watchlist'
  const [selectedCoin, setSelectedCoin] = useState(null); // coin detail from API
  const [modalLoading, setModalLoading] = useState(false);

  // ── Filtered list — useMemo avoids recalculating on every render ─────────────
  const filteredCoins = useMemo(() => {
    let list = activeTab === 'watchlist'
      ? coins.filter(c => watchlist.includes(c.id))
      : coins;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
      );
    }

    return list;
  }, [coins, watchlist, activeTab, search]);

  // ── Open detail modal ─────────────────────────────────────────────────────────
  const openModal = async (coin) => {
    setModalLoading(true);
    setSelectedCoin({ ...coin, image: { large: coin.image }, market_data: null }); // show placeholder immediately
    try {
      const detail = await ApiService.getCoinDetail(coin.id);
      setSelectedCoin(detail);
    } catch {
      // If detail fetch fails, show basic data from list
      setSelectedCoin({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: { large: coin.image },
        market_data: {
          current_price:               { usd: coin.current_price },
          price_change_percentage_24h: coin.price_change_percentage_24h,
          high_24h:                    { usd: coin.high_24h },
          low_24h:                     { usd: coin.low_24h },
          market_cap:                  { usd: coin.market_cap },
          total_volume:                { usd: coin.total_volume },
          circulating_supply:          coin.circulating_supply,
          ath:                         { usd: coin.ath },
        },
      });
    } finally {
      setModalLoading(false);
    }
  };

  // ── Stats for the bar ─────────────────────────────────────────────────────────
  const totalMarketCap = coins.reduce((s, c) => s + (c.market_cap || 0), 0);
  const gainers        = coins.filter(c => c.price_change_percentage_24h > 0).length;

  return (
    <div className="app">

      {/* Header */}
      <Header
        search={search}
        onSearch={setSearch}
        onRefresh={fetchCoins}
        loading={loading}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Stats Bar */}
      {coins.length > 0 && (
        <div className="stats-bar">
          <div className="stat-chip">
            🌍 Total Market Cap: <strong>
              ${(totalMarketCap / 1e12).toFixed(2)}T
            </strong>
          </div>
          <div className="stat-chip">
            📈 Gainers: <strong style={{ color: 'var(--up)' }}>{gainers}</strong>
            &nbsp;/&nbsp;
            📉 Losers: <strong style={{ color: 'var(--down)' }}>{coins.length - gainers}</strong>
          </div>
          <div className="stat-chip">
            ⭐ Watching: <strong>{watchlist.length}</strong>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <ErrorBanner message={error} onRetry={fetchCoins} />}

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}>
          🏆 All Coins
        </button>
        <button className={`tab ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}>
          ⭐ Watchlist ({watchlist.length})
        </button>
      </div>

      {/* Table Header */}
      {!loading && filteredCoins.length > 0 && (
        <div className="table-header">
          <span>#</span>
          <span>Coin</span>
          <span>Price</span>
          <span className="hide-mobile">24h Change</span>
          <span className="hide-mobile">Market Cap</span>
          <span>Watch</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && coins.length === 0 && <SkeletonList />}

      {/* Coin List */}
      {!loading || coins.length > 0 ? (
        filteredCoins.length > 0 ? (
          filteredCoins.map((coin, i) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              rank={coins.indexOf(coin) + 1}
              isWatched={watchlist.includes(coin.id)}
              onToggleWatch={toggleWatchlist}
              onClick={openModal}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              {activeTab === 'watchlist' ? '⭐' : '🔍'}
            </div>
            <div className="empty-title">
              {activeTab === 'watchlist'
                ? 'Your watchlist is empty'
                : 'No coins found'}
            </div>
            <div className="empty-sub">
              {activeTab === 'watchlist'
                ? 'Star any coin to add it to your watchlist.'
                : `No results for "${search}". Try a different search.`}
            </div>
          </div>
        )
      ) : null}

      {/* Last Updated */}
      {lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Detail Modal */}
      {selectedCoin && (
        <CoinModal
          coin={selectedCoin}
          isWatched={watchlist.includes(selectedCoin.id)}
          onToggleWatch={toggleWatchlist}
          onClose={() => setSelectedCoin(null)}
        />
      )}

    </div>
  );
}

// ─── Mount ────────────────────────────────────────────────────────────────────
function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
