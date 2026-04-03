import { RefreshCw } from 'lucide-react';

export default function ImageCard({ imageUrl, loading, onRefresh }) {
  return (
    <div className="glass-panel" style={{ padding: '1rem', position: 'relative' }}>
      <button
        onClick={onRefresh}
        className="btn-secondary"
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, padding: '0.5rem', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none' }}
        title="Get new image"
      >
        <RefreshCw size={20} color="white" className={loading ? 'animate-spin' : ''} />
      </button>

      <div className="image-wrapper">
        {loading && <div className="loading-skeleton"></div>}
        {!loading && imageUrl && (
          <img
            key={imageUrl}
            src={imageUrl}
            alt="Scene to describe"
            className="main-image"
            style={{ opacity: 1 }}
          />
        )}
      </div>
    </div>
  );
}
