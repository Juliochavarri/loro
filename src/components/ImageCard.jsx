import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function ImageCard({ imageUrl, loading, onRefresh, onImageLoad }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // When URL changes, reset the loaded state
  React.useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  return (
    <div className="glass-panel" style={{ padding: '1rem', position: 'relative' }}>
      <button 
        onClick={onRefresh}
        className="btn-secondary"
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, padding: '0.5rem', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none' }}
        title="Get new image"
        disabled={loading}
      >
        <RefreshCw size={20} color="white" className={loading ? 'animate-spin' : ''} />
      </button>

      <div className="image-wrapper">
        {(loading || !imageLoaded) && <div className="loading-skeleton"></div>}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Random test subject" 
            className="main-image"
            onLoad={() => {
              setImageLoaded(true);
              if (onImageLoad) onImageLoad();
            }}
            style={{ opacity: imageLoaded && !loading ? 1 : 0 }}
          />
        )}
      </div>
    </div>
  );
}
