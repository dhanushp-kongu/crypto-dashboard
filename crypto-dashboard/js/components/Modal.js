// ─── components/Modal.js ─────────────────────────────────────────────────────

function CoinModal({ coin, isWatched, onToggleWatch, onClose }) {
  if (!coin) return null;

  const md     = coin.market_data;
  const change = md?.price_change_percentage_24h;
  const isUp   = change >= 0;

  // Close on backdrop click
  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const fmt = (v, prefix = '$') => {
    if (!v && v !== 0) return '—';
    if (v >= 1e9) return `${prefix}${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `${prefix}${(v / 1e6).toFixed(2)}M`;
    return `${prefix}${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fmtPrice = (v) => {
    if (!v && v !== 0) return '—';
    if (v < 0.01) return `$${v.toFixed(6)}`;
    return `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <div className="modal-coin-info">
            <img className="modal-coin-img" src={coin.image?.large} alt={coin.name} />
            <div>
              <div className="modal-coin-name">{coin.name}</div>
              <div className="modal-coin-sym">{coin.symbol?.toUpperCase()}</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Stats Grid */}
        <div className="modal-grid">

          <div className="modal-stat">
            <div className="modal-stat-label">Current Price</div>
            <div className="modal-stat-value">{fmtPrice(md?.current_price?.usd)}</div>
          </div>

          <div className="modal-stat">
            <div className="modal-stat-label">24h Change</div>
            <div className="modal-stat-value" style={{ color: isUp ? 'var(--up)' : 'var(--down)' }}>
              {isUp ? '▲' : '▼'} {Math.abs(change || 0).toFixed(2)}%
            </div>
          </div>

          <div className="modal-stat">
            <div className="modal-stat-label">24h High</div>
            <div className="modal-stat-value" style={{ color: 'var(--up)' }}>
              {fmtPrice(md?.high_24h?.usd)}
            </div>
          </div>

          <div className="modal-stat">
            <div className="modal-stat-label">24h Low</div>
            <div className="modal-stat-value" style={{ color: 'var(--down)' }}>
              {fmtPrice(md?.low_24h?.usd)}
            </div>
          </div>

          <div className="modal-stat">
            <div className="modal-stat-label">Market Cap</div>
            <div className="modal-stat-value">{fmt(md?.market_cap?.usd)}</div>
          </div>

          <div className="modal-stat">
            <div className="modal-stat-label">Total Volume</div>
            <div className="modal-stat-value">{fmt(md?.total_volume?.usd)}</div>
          </div>

          <div className="modal-stat">
            <div className="modal-stat-label">Circulating Supply</div>
            <div className="modal-stat-value">
              {md?.circulating_supply
                ? `${(md.circulating_supply / 1e6).toFixed(2)}M`
                : '—'}
            </div>
          </div>

          <div className="modal-stat">
            <div className="modal-stat-label">All-Time High</div>
            <div className="modal-stat-value">{fmtPrice(md?.ath?.usd)}</div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="btn btn-ghost"
            onClick={() => onToggleWatch(coin.id)}
          >
            {isWatched ? '⭐ Watching' : '☆ Add to Watchlist'}
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
