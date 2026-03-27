function WidgetHeader() {
  return (
    <header className="widget-header">
      <span>BSD Laboratory</span>
      <div className="system-status">
        <div className="pulse-dot" />
        <span>Active</span>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg
      className="logo-mark"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BSD Lab neural dynamics logo"
      role="img"
    >
      <defs>
        <clipPath id="brain-mask">
          <path d="M55,145 C35,130 25,100 35,75 C45,50 75,35 105,40 C135,45 165,60 170,95 C175,130 150,155 125,160 C100,165 75,160 55,145 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#brain-mask)">
        <path
          d="M55,145 C35,130 25,100 35,75 C45,50 75,35 105,40 C135,45 165,60 170,95 C175,130 150,155 125,160 C100,165 75,160 55,145 Z"
          fill="var(--slate)"
          opacity="0.15"
        />
        <path
          className="wave-path wave-slow"
          d="M-200,100 Q-150,40 -100,100 T0,100 T100,100 T200,100 T300,100 T400,100"
        />
        <path
          className="wave-path wave-mid"
          d="M-200,120 Q-175,70 -150,120 T-50,120 T50,120 T150,120 T250,120 T350,120 T450,120"
        />
        <path
          className="wave-path wave-fast"
          d="M-200,80 Q-180,50 -160,80 T-80,80 T0,80 T80,80 T160,80 T240,80 T320,80 T400,80"
        />
        <path
          className="wave-path wave-highlight"
          d="M-200,90 Q-160,20 -120,90 T-40,90 T40,90 T120,90 T200,90 T280,90 T360,90 T440,90"
        />
      </g>

      <path
        className="brain-outline"
        d="M55,145 C35,130 25,100 35,75 C45,50 75,35 105,40 C135,45 165,60 170,95 C175,130 150,155 125,160 C100,165 75,160 55,145 Z"
      />
    </svg>
  );
}

function WidgetFooter() {
  return (
    <footer className="widget-footer">
      <div className="motif">/→</div>
      <h1 className="concept-title">Neural Dynamics</h1>
      <div className="metadata-line">
        <span>Phase: Oscillation</span>
        <span>•</span>
        <span>Vol 1</span>
      </div>
    </footer>
  );
}

export function NeuralDynamicsWidget({ compact = false }) {
  return (
    <section className={`widget ${compact ? "widget-compact" : ""}`}>
      <WidgetHeader />
      <div className="logo-container">
        <LogoMark />
      </div>
      <WidgetFooter />
    </section>
  );
}
