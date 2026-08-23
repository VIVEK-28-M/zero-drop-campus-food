/** Deterministic pseudo-QR rendered from a seed string (mock pass visual). */
export function FakeQr({ seed, size = 180 }: { seed: string; size?: number }) {
  const cells = 21;
  let h = 2166136261;
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;

  const isFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= cells - 7 && y < 7) || (x < 7 && y >= cells - 7);

  const squares: React.ReactNode[] = [];
  const cell = size / cells;
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      if (isFinder(x, y)) continue;
      if (rand() > 0.52) {
        squares.push(
          <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} rx={cell * 0.2} />
        );
      }
    }
  }

  const finder = (ox: number, oy: number) => (
    <g key={`f${ox}${oy}`}>
      <rect x={ox * cell} y={oy * cell} width={7 * cell} height={7 * cell} rx={cell} />
      <rect
        x={(ox + 1) * cell}
        y={(oy + 1) * cell}
        width={5 * cell}
        height={5 * cell}
        rx={cell * 0.7}
        className="fill-background"
      />
      <rect x={(ox + 2) * cell} y={(oy + 2) * cell} width={3 * cell} height={3 * cell} rx={cell * 0.5} />
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="fill-foreground"
      role="img"
      aria-label={`Order verification code ${seed}`}
    >
      {squares}
      {finder(0, 0)}
      {finder(cells - 7, 0)}
      {finder(0, cells - 7)}
    </svg>
  );
}
