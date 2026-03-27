const brainPath =
  "M55,145 C35,130 25,100 35,75 C45,50 75,35 105,40 C135,45 165,60 170,95 C175,130 150,155 125,160 C100,165 75,160 55,145 Z";

export function BrainWaveLogo({
  className = "",
  maskId,
  showGlow = false,
  variant = "default",
}) {
  const isHero = variant === "hero";
  const showSlow = true;
  const showMid = true;
  const showFast = true;
  const showHighlight = true;

  return (
    <svg
      className={`brain-logo ${className}`.trim()}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={maskId}>
          <path d={brainPath} />
        </clipPath>
        {showGlow ? (
          <radialGradient id={`${maskId}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbfaf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f5f1e9" stopOpacity="0" />
          </radialGradient>
        ) : null}
      </defs>

      {showGlow ? <circle cx="100" cy="100" r="80" fill={`url(#${maskId}-glow)`} /> : null}

      <g clipPath={`url(#${maskId})`}>
        {variant !== "nav" ? (
          <path
            className={`brain-logo__plate ${isHero ? "brain-logo__plate--hero" : ""}`}
            d={brainPath}
            fill={isHero ? "#f6f3eb" : "#eeeeee"}
            opacity={isHero ? "0.55" : "0.3"}
          />
        ) : null}
        {showSlow ? (
          <path
            className="brain-logo__wave-path brain-logo__wave-slow"
            d="M-200,100 Q-150,40 -100,100 T0,100 T100,100 T200,100 T300,100 T400,100"
          />
        ) : null}
        {showMid ? (
          <path
            className="brain-logo__wave-path brain-logo__wave-mid"
            d="M-200,120 Q-175,70 -150,120 T-50,120 T50,120 T150,120 T250,120 T350,120 T450,120"
          />
        ) : null}
        {showFast ? (
          <path
            className="brain-logo__wave-path brain-logo__wave-fast"
            d="M-200,80 Q-180,50 -160,80 T-80,80 T0,80 T80,80 T160,80 T240,80 T320,80 T400,80"
          />
        ) : null}
        {showHighlight ? (
          <path
            className="brain-logo__wave-path brain-logo__wave-highlight"
            d="M-200,90 Q-160,20 -120,90 T-40,90 T40,90 T120,90 T200,90 T280,90 T360,90 T440,90"
          />
        ) : null}
      </g>

      <path className="brain-logo__outline" d={brainPath} strokeWidth={isHero ? "1.25" : undefined} />
      {isHero ? <path className="brain-logo__outline-glow" d={brainPath} /> : null}
    </svg>
  );
}

export function BackgroundWave({ className = "", variant = "fill" }) {
  if (variant === "stroke") {
    return (
      <svg className={className} viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,250 C250,350 500,150 750,250 C1000,350 1250,150 1500,250 L1500,0 L0,0 Z"
          fill="none"
          stroke="#bcb99a"
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,250 C250,150 500,350 750,250 C1000,150 1250,350 1500,250 L1500,0 L0,0 Z"
        fill="#fbfaf6"
        opacity="0.5"
      />
    </svg>
  );
}
