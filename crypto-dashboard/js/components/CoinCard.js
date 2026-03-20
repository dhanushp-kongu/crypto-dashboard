// ─── components/CoinCard.js ───────────────────────────────────────────────────

// Format large numbers: 1,200,000,000 → $1.2B
function formatMarketCap(value) {
  if (!value) return '—';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9)  return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6)  return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

// Format price — handles very small numbers like $0.000045
function formatPrice(value) {
  if (!value && value !== 0) return '—';
  if (value < 0.01) return `$${value.toFixed(6)}`;
  if (value < 1)    return `$${value.toFixed(4)}`;
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function CoinCard({ coin, rank, isWatched, onToggleWatch, onClick }) {
  const change = coin.price_change_percentage_24h;
  const isUp   = change >= 0;

  const handleStar = (e) => {
    e.stopPropagation(); // don't open modal when starring
    onToggleWatch(coin.id);
  };

  return (
    <div className="coin-card" onClick={() => onClick(coin)}>

      {/* Rank */}
      <div className="rank">#{rank}</div>

      {/* Coin Name + Icon */}
      <div className="coin-info">
        {coin.image
          ? <img className="coin-img" src={coin.image} alt={coin.name} />
          : <div className="coin-img-placeholder">{coin.symbol[0].toUpperCase()}</div>
        }
        <div>
          <div className="coin-name">{coin.name}</div>
          <div className="coin-symbol">{coin.symbol}</div>
        </div>
      </div>

      {/* Price */}
      <div className="coin-price">{formatPrice(coin.current_price)}</div>

      {/* 24h Change */}
      <div className="hide-mobile">
        <span className={`change ${isUp ? 'up' : 'down'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </span>
      </div>

      {/* Market Cap */}
      <div className="market-cap hide-mobile">
        {formatMarketCap(coin.market_cap)}
      </div>

      {/* Watchlist Star */}
      <button
        className="star-btn"
        onClick={handleStar}
        title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {isWatched ? '⭐' : '☆'}
      </button>

    </div>
  );
}
