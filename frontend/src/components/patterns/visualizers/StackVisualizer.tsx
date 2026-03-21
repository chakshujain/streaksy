'use client';

interface Props {
  items: (string | number)[];
  highlights?: number[];
  labels?: Record<number, string>;
}

const BLOCK_W = 80;
const BLOCK_H = 36;
const GAP = 4;
const PADDING = 40;

export default function StackVisualizer({ items, highlights = [], labels = {} }: Props) {
  if (!items.length) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
        Empty stack
      </div>
    );
  }

  const highlightSet = new Set(highlights);
  const totalH = items.length * (BLOCK_H + GAP) + PADDING * 2 + 20;
  const totalW = BLOCK_W + PADDING * 2 + 80;

  // Items render bottom-to-top: index 0 is bottom of stack, last is top
  function blockY(i: number) {
    return totalH - PADDING - (i + 1) * (BLOCK_H + GAP);
  }

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes stackSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stack-block { animation: stackSlide 0.3s ease-out; }
      `}</style>

      {/* Base line */}
      <line
        x1={PADDING - 5}
        y1={totalH - PADDING + 4}
        x2={PADDING + BLOCK_W + 5}
        y2={totalH - PADDING + 4}
        stroke="#52525b"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {items.map((item, i) => {
        const y = blockY(i);
        const isHL = highlightSet.has(i);
        const isTop = i === items.length - 1;
        const fill = isHL ? '#059669' : '#3f3f46';
        const stroke = isHL ? '#34d399' : '#52525b';
        const glow = isHL ? 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' : 'none';

        return (
          <g key={`block-${i}`} className="stack-block">
            <rect
              x={PADDING}
              y={y}
              width={BLOCK_W}
              height={BLOCK_H}
              rx={6}
              fill={fill}
              stroke={stroke}
              strokeWidth={2}
              style={{ filter: glow, transition: 'all 500ms ease-in-out' }}
            />
            <text
              x={PADDING + BLOCK_W / 2}
              y={y + BLOCK_H / 2 + 5}
              textAnchor="middle"
              fill="#fafafa"
              fontSize={14}
              fontWeight={700}
              style={{ pointerEvents: 'none' }}
            >
              {item}
            </text>

            {/* Custom label */}
            {labels[i] && (
              <text
                x={PADDING + BLOCK_W + 12}
                y={y + BLOCK_H / 2 + 4}
                fill="#a1a1aa"
                fontSize={10}
                fontWeight={600}
              >
                {labels[i]}
              </text>
            )}

            {/* TOP indicator */}
            {isTop && (
              <>
                <text
                  x={PADDING + BLOCK_W + 14}
                  y={y + BLOCK_H / 2 + 4}
                  fill="#34d399"
                  fontSize={11}
                  fontWeight={800}
                  letterSpacing={1}
                >
                  TOP
                </text>
                {/* Arrow pointing at top block */}
                <line
                  x1={PADDING + BLOCK_W + 10}
                  y1={y + BLOCK_H / 2}
                  x2={PADDING + BLOCK_W + 4}
                  y2={y + BLOCK_H / 2}
                  stroke="#34d399"
                  strokeWidth={2}
                  markerEnd=""
                />
                <polygon
                  points={`${PADDING + BLOCK_W + 4},${y + BLOCK_H / 2 - 4} ${PADDING + BLOCK_W + 4},${y + BLOCK_H / 2 + 4} ${PADDING + BLOCK_W},${y + BLOCK_H / 2}`}
                  fill="#34d399"
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
