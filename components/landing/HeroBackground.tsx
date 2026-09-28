export function HeroBackground() {
  return (
    <div className="landing-hero__bg" aria-hidden>
      <svg className="landing-hero__svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#67647c" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#f7f6f2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#heroGlow)" />
        <circle cx="120" cy="100" r="48" fill="#7a9e7e" opacity="0.14" />
        <circle cx="680" cy="80" r="36" fill="#c98b7a" opacity="0.12" />
        <circle cx="700" cy="320" r="56" fill="#5a7a9e" opacity="0.1" />
        <circle cx="90" cy="380" r="42" fill="#b8a88a" opacity="0.14" />
        <circle cx="400" cy="520" r="64" fill="#9a9a9a" opacity="0.08" />
        <g opacity="0.06" stroke="#283244" strokeWidth="0.8" fill="none">
          <circle cx="400" cy="280" r="100" />
          <circle cx="400" cy="280" r="70" />
          <line x1="400" y1="180" x2="400" y2="380" />
          <line x1="300" y1="280" x2="500" y2="280" />
        </g>
        <text x="400" y="268" textAnchor="middle" fontSize="11" fill="#283244" opacity="0.07" fontFamily="serif">
          木 火 土 金 水
        </text>
      </svg>
    </div>
  );
}
