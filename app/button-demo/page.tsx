"use client";

export default function ButtonDemo() {
  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dotted grid background like CodePen */}
      <svg 
        style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dottedGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.12)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dottedGrid)" />
      </svg>

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '2rem',
            color: '#2a2a2a',
            marginBottom: '3rem',
            fontWeight: 400,
          }}
        >
          Liquid Glass Button
        </h1>
        
        {/* Liquid Glass Button - Petr Knoll style */}
        <div className="liquid-glass-wrap">
          <button className="liquid-glass-button">
            <span>Join Sapira</span>
          </button>
          <div className="liquid-glass-shadow"></div>
        </div>

        <p style={{ 
          marginTop: '4rem', 
          fontSize: '0.875rem', 
          color: '#888',
          fontFamily: 'system-ui, sans-serif'
        }}>
          Hover para ver el efecto ✨
        </p>
      </div>
    </div>
  );
}
