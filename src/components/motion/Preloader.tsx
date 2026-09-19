/*
 * First-visit splash. The heartbeat trace draws itself, "23%" counts up,
 * symbols orbit, then the whole thing irises open onto the page.
 *
 * It is timed entirely in CSS (a server component, no JavaScript), so it
 * plays and clears on its own and ends as `visibility: hidden`.
 * SPLASH_SCRIPT (in <head>) marks the session once it has been seen, so
 * it only plays on the first page of a visit.
 */
export const SPLASH_SCRIPT = `(function(){try{if(sessionStorage.getItem('23club:splash')){document.documentElement.setAttribute('data-splash','done');}else{sessionStorage.setItem('23club:splash','1');}}catch(e){}})();`;

const ORBIT = ["₹", "%", "Σ", "↗", "∞", "Δ"];

export function Preloader() {
  return (
    <div className="splash" aria-hidden="true">
      <div className="splash-glow" />
      <div className="splash-grid" />
      <div className="splash-core">
        <div className="splash-orbit">
          {ORBIT.map((g, i) => (
            <span key={i} style={{ ["--i" as string]: i }}>
              {g}
            </span>
          ))}
        </div>
        <svg viewBox="0 0 64 64" className="splash-mark">
          <polyline
            className="splash-trace"
            pathLength={1}
            points="4,32 20,32 24,32 26,26 28,38 30,10 32,54 34,32 60,32"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line className="splash-cross" pathLength={1} x1="31" y1="18" x2="31" y2="46" stroke="#00bfff" strokeWidth="3" strokeLinecap="round" />
          <line className="splash-cross" pathLength={1} x1="24" y1="32" x2="38" y2="32" stroke="#00bfff" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="splash-count" />
        <div className="splash-bar">
          <span />
        </div>
        <p className="splash-word">Learn · Invest · Grow · Compound</p>
      </div>
    </div>
  );
}
