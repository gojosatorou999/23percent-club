/** Shown while a route's content streams in: the heartbeat trace running on a loop. */
export default function Loading() {
  return (
    <div className="route-loader" role="status" aria-label="Loading">
      <svg viewBox="0 0 64 64" aria-hidden>
        <polyline
          pathLength={1}
          points="4,32 20,32 24,32 26,26 28,38 30,10 32,54 34,32 60,32"
          fill="none"
          stroke="var(--logo-trace)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p>Loading</p>
    </div>
  );
}
