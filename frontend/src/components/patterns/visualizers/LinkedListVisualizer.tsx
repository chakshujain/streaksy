'use client';

interface LLNode {
  val: string | number;
  color?: 'default' | 'active' | 'visited' | 'found';
  label?: string;
}

interface Props {
  nodes: LLNode[];
  cycleTarget?: number | null;
}

const BOX_W = 60;
const BOX_H = 36;
const GAP = 40;
const ARROW_LEN = GAP;
const Y_CENTER = 70;
const PADDING_X = 30;

const colorMap: Record<string, { fill: string; stroke: string; text: string; glow?: string }> = {
  default: { fill: '#3f3f46', stroke: '#52525b', text: '#fafafa' },
  active: { fill: '#059669', stroke: '#34d399', text: '#ffffff', glow: 'rgba(16,185,129,0.5)' },
  visited: { fill: 'rgba(59,130,246,0.3)', stroke: '#60a5fa', text: '#93c5fd' },
  found: { fill: '#d97706', stroke: '#fbbf24', text: '#ffffff', glow: 'rgba(251,191,36,0.5)' },
};

export default function LinkedListVisualizer({ nodes, cycleTarget }: Props) {
  if (!nodes.length) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
        No list data
      </div>
    );
  }

  const totalW = nodes.length * BOX_W + (nodes.length - 1) * ARROW_LEN + PADDING_X * 2;
  const totalH = cycleTarget != null ? 160 : 120;

  function nodeX(i: number) {
    return PADDING_X + i * (BOX_W + ARROW_LEN);
  }

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="ll-arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#71717a" />
        </marker>
        <marker
          id="ll-cycle-arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#f87171" />
        </marker>
      </defs>

      {/* Arrows between nodes */}
      {nodes.map((_, i) => {
        if (i === nodes.length - 1) return null;
        const x1 = nodeX(i) + BOX_W;
        const x2 = nodeX(i + 1);
        return (
          <line
            key={`arrow-${i}`}
            x1={x1}
            y1={Y_CENTER}
            x2={x2 - 2}
            y2={Y_CENTER}
            stroke="#71717a"
            strokeWidth={2}
            markerEnd="url(#ll-arrowhead)"
            className="transition-all duration-500 ease-in-out"
          />
        );
      })}

      {/* Cycle arc */}
      {cycleTarget != null && cycleTarget >= 0 && cycleTarget < nodes.length && (
        (() => {
          const lastX = nodeX(nodes.length - 1) + BOX_W / 2;
          const targetX = nodeX(cycleTarget) + BOX_W / 2;
          const lastY = Y_CENTER + BOX_H / 2;
          const arcRadius = (lastX - targetX) / 2;
          const arcY = lastY + 30;
          return (
            <path
              d={`M ${lastX} ${lastY} C ${lastX} ${arcY + arcRadius * 0.5}, ${targetX} ${arcY + arcRadius * 0.5}, ${targetX} ${lastY}`}
              fill="none"
              stroke="#f87171"
              strokeWidth={2}
              strokeDasharray="6 3"
              markerEnd="url(#ll-cycle-arrowhead)"
              className="transition-all duration-500 ease-in-out"
            />
          );
        })()
      )}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const x = nodeX(i);
        const color = colorMap[node.color || 'default'];
        return (
          <g key={`node-${i}`} className="transition-all duration-500 ease-in-out">
            {/* Label with pointer triangle */}
            {node.label && (
              <>
                <text
                  x={x + BOX_W / 2}
                  y={Y_CENTER - BOX_H / 2 - 16}
                  textAnchor="middle"
                  fill="#a1a1aa"
                  fontSize={10}
                  fontWeight={700}
                  letterSpacing={0.5}
                >
                  {node.label}
                </text>
                <polygon
                  points={`${x + BOX_W / 2 - 4},${Y_CENTER - BOX_H / 2 - 10} ${x + BOX_W / 2 + 4},${Y_CENTER - BOX_H / 2 - 10} ${x + BOX_W / 2},${Y_CENTER - BOX_H / 2 - 4}`}
                  fill="#a1a1aa"
                />
              </>
            )}

            {/* Box */}
            <rect
              x={x}
              y={Y_CENTER - BOX_H / 2}
              width={BOX_W}
              height={BOX_H}
              rx={8}
              fill={color.fill}
              stroke={color.stroke}
              strokeWidth={2}
              style={{
                filter: color.glow ? `drop-shadow(0 0 8px ${color.glow})` : undefined,
                transition: 'all 500ms ease-in-out',
              }}
            />

            {/* Value */}
            <text
              x={x + BOX_W / 2}
              y={Y_CENTER + 5}
              textAnchor="middle"
              fill={color.text}
              fontSize={14}
              fontWeight={700}
              style={{ pointerEvents: 'none' }}
            >
              {node.val}
            </text>
          </g>
        );
      })}

      {/* NULL marker at end (if no cycle or cycle doesn't point from last) */}
      {cycleTarget == null && (
        <text
          x={nodeX(nodes.length - 1) + BOX_W + ARROW_LEN / 2}
          y={Y_CENTER + 4}
          textAnchor="middle"
          fill="#71717a"
          fontSize={11}
          fontWeight={600}
        >
          null
        </text>
      )}
    </svg>
  );
}
