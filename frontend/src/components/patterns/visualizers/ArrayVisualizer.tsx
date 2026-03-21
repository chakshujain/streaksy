'use client';

interface Props {
  array: (string | number)[];
  highlights?: number[];
  pointers?: Record<string, number>;
  windowRange?: [number, number];
}

const BOX_W = 50;
const BOX_H = 42;
const GAP = 4;
const PADDING_X = 30;
const TOP_SPACE = 50;
const BOTTOM_SPACE = 25;

export default function ArrayVisualizer({ array, highlights = [], pointers = {}, windowRange }: Props) {
  if (!array.length) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
        No array data
      </div>
    );
  }

  const highlightSet = new Set(highlights);
  const totalW = array.length * (BOX_W + GAP) - GAP + PADDING_X * 2;
  const totalH = BOX_H + TOP_SPACE + BOTTOM_SPACE + 10;
  const yTop = TOP_SPACE;

  // Invert pointers: index -> list of pointer names
  const indexToPointers = new Map<number, string[]>();
  Object.entries(pointers).forEach(([name, idx]) => {
    if (!indexToPointers.has(idx)) indexToPointers.set(idx, []);
    indexToPointers.get(idx)!.push(name);
  });

  // Pointer colors cycle
  const ptrColors = ['#34d399', '#f87171', '#a78bfa', '#fbbf24', '#60a5fa', '#fb923c'];
  const ptrNameToColor = new Map<string, string>();
  let pci = 0;
  Object.keys(pointers).forEach(name => {
    ptrNameToColor.set(name, ptrColors[pci % ptrColors.length]);
    pci++;
  });

  function boxX(i: number) {
    return PADDING_X + i * (BOX_W + GAP);
  }

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sliding window highlight band */}
      {windowRange && (
        <rect
          x={boxX(windowRange[0]) - 3}
          y={yTop - 4}
          width={(windowRange[1] - windowRange[0] + 1) * (BOX_W + GAP) - GAP + 6}
          height={BOX_H + 8}
          rx={8}
          fill="rgba(16,185,129,0.08)"
          stroke="#34d399"
          strokeWidth={2}
          strokeDasharray="6 3"
          style={{ transition: 'all 500ms ease-in-out' }}
        />
      )}

      {/* Array boxes */}
      {array.map((val, i) => {
        const x = boxX(i);
        const isHL = highlightSet.has(i);
        const inWindow = windowRange ? i >= windowRange[0] && i <= windowRange[1] : false;
        const fill = isHL ? '#059669' : inWindow ? '#1e3a2f' : '#3f3f46';
        const stroke = isHL ? '#34d399' : inWindow ? '#065f46' : '#52525b';
        const glow = isHL ? 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' : 'none';
        const scale = isHL ? 'scale(1.05)' : 'scale(1)';

        return (
          <g key={`box-${i}`}>
            <rect
              x={x}
              y={yTop}
              width={BOX_W}
              height={BOX_H}
              rx={6}
              fill={fill}
              stroke={stroke}
              strokeWidth={2}
              style={{
                filter: glow,
                transform: scale,
                transformOrigin: `${x + BOX_W / 2}px ${yTop + BOX_H / 2}px`,
                transition: 'all 500ms ease-in-out',
              }}
            />
            <text
              x={x + BOX_W / 2}
              y={yTop + BOX_H / 2 + 5}
              textAnchor="middle"
              fill={isHL ? '#ffffff' : '#fafafa'}
              fontSize={14}
              fontWeight={700}
              style={{ pointerEvents: 'none' }}
            >
              {val}
            </text>

            {/* Index below */}
            <text
              x={x + BOX_W / 2}
              y={yTop + BOX_H + 16}
              textAnchor="middle"
              fill="#71717a"
              fontSize={10}
            >
              {i}
            </text>
          </g>
        );
      })}

      {/* Pointer labels above */}
      {Array.from(indexToPointers.entries()).map(([idx, names]) =>
        names.map((name, ni) => {
          const x = boxX(idx) + BOX_W / 2;
          const y = yTop - 14 - ni * 16;
          const color = ptrNameToColor.get(name) || '#a1a1aa';
          return (
            <g key={`ptr-${name}`}>
              <text
                x={x}
                y={y - 6}
                textAnchor="middle"
                fill={color}
                fontSize={10}
                fontWeight={700}
                letterSpacing={0.5}
              >
                {name}
              </text>
              {/* Down arrow */}
              <polygon
                points={`${x - 4},${y} ${x + 4},${y} ${x},${y + 6}`}
                fill={color}
                style={{ transition: 'all 500ms ease-in-out' }}
              />
            </g>
          );
        })
      )}
    </svg>
  );
}
