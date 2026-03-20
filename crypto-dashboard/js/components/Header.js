// ─── components/Header.js ────────────────────────────────────────────────────

function Header({ search, onSearch, onRefresh, loading, theme, onToggleTheme }) {
  return (
    <header className="header">

      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">₿</div>
        <div className="logo-text">Crypto<span>Lens</span></div>
      </div>

      {/* Controls */}
      <div className="header-right">

        {/* Search */}
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search coin..."
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
        </div>

        {/* Refresh */}
        <button
          className="btn btn-primary"
          onClick={onRefresh}
          disabled={loading}
        >
          <span className={loading ? 'spin' : ''}>↻</span>
          {loading ? 'Updating...' : 'Refresh'}
        </button>

        {/* Dark / Light toggle */}
        <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

      </div>
    </header>
  );
}
