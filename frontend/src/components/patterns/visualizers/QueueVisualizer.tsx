'use client';

interface Props {
  items: (string | number)[];
  highlights?: number[];
  labels?: Record<number, string>;
}

const BOX_W = 56;
const BOX_H = 40;
const GAP = 6;
const PADDING = 50;
const Y_CENTER = 55;

export default function QueueVisualizer({ items, highlights = [], labels = {} }: Props) {
  if (!items.length) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
        Empty queue
      </div>
    );
  }

  const highlightSet = new Set(highlights);
  const totalW = items.length * (BOX_W + GAP) + PADDING * 2;
  const totalH = 110;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* FRONT label */}
      <g>
        <text
          x={PADDING / 2}
          y={Y_CENTER - BOX_H / 2 - 6}
          textAnchor="middle"
          fill="#34d399"
          fontSize={10}
          fontWeight={800}
          letterSpacing={0.5}
        >
          FRONT
        </text>
        <polygon
          points={`${PADDING / 2 + 6},${Y_CENTER - 4} ${PADDING / 2 + 6},${Y_CENTER + 4} ${PADDING - 6},${Y_CENTER}`}
          fill="#34d399"
          transform={`scale(-1,1) translate(${-(PADDING / 2 + 6 + PADDING - 6)},0)`}
        />
        <line
          x1={PADDING / 2 + 2}
          y1={Y_CENTER}
          x2={PADDING - 8}
          y2={Y_CENTER}
          stroke="#34d399"
          strokeWidth={2}
        />
        <polygon
          points={`${PADDING - 8},${Y_CENTER - 4} ${PADDING - 8},${Y_CENTER + 4} ${PADDING - 2},${Y_CENTER}`}
          fill="#34d399"
        />
      </g>

      {/* BACK label */}
      <g>
        <text
          x={totalW - PADDING / 2}
          y={Y_CENTER - BOX_H / 2 - 6}
          textAnchor="middle"
          fill="#a78bfa"
          fontSize={10}
          fontWeight={800}
          letterSpacing={0.5}
        >
          BACK
        </text>
        <line
          x1={totalW - PADDING + 8}
          y1={Y_CENTER}
          x2={totalW - PADDING / 2 - 2}
          y2={Y_CENTER}
          stroke="#a78bfa"
          strokeWidth={2}
        />
        <polygon
          points={`${totalW - PADDING / 2 - 2},${Y_CENTER - 4} ${totalW - PADDING / 2 - 2},${Y_CENTER + 4} ${totalW - PADDING / 2 + 4},${Y_CENTER}`}
          fill="#a78bfa"
        />
      </g>

      {/* Queue items */}
      {items.map((item, i) => {
        const x = PADDING + i * (BOX_W + GAP);
        const isHL = highlightSet.has(i);
        const fill = isHL ? '#059669' : '#3f3f46';
        const stroke = isHL ? '#34d399' : '#52525b';
        const glow = isHL ? 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' : 'none';

        return (
          <g key={`item-${i}`}>
            {/* Label above */}
            {labels[i] && (
              <text
                x={x + BOX_W / 2}
                y={Y_CENTER - BOX_H / 2 - 6}
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize={9}
                fontWeight={600}
              >
                {labels[i]}
              </text>
            )}

            <rect
              x={x}
              y={Y_CENTER - BOX_H / 2}
              width={BOX_W}
              height={BOX_H}
              rx={6}
              fill={fill}
              stroke={stroke}
              strokeWidth={2}
              style={{ filter: glow, transition: 'all 500ms ease-in-out' }}
            />
            <text
              x={x + BOX_W / 2}
              y={Y_CENTER + 5}
              textAnchor="middle"
              fill="#fafafa"
              fontSize={14}
              fontWeight={700}
              style={{ pointerEvents: 'none' }}
            >
              {item}
            </text>

            {/* Index below */}
            <text
              x={x + BOX_W / 2}
              y={Y_CENTER + BOX_H / 2 + 14}
              textAnchor="middle"
              fill="#71717a"
              fontSize={9}
            >
              {i}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
