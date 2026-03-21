'use client';

interface GNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: 'default' | 'active' | 'visited' | 'queued';
}

interface GEdge {
  from: string;
  to: string;
  directed?: boolean;
  highlighted?: boolean;
  label?: string;
}

interface Props {
  nodes: GNode[];
  edges?: GEdge[];
}

const NODE_R = 20;
const SCALE = 5; // 0-100 normalized coords * SCALE = 0-500

const colorMap: Record<string, { fill: string; stroke: string; text: string; glow?: string }> = {
  default: { fill: '#3f3f46', stroke: '#52525b', text: '#fafafa' },
  active: { fill: '#059669', stroke: '#34d399', text: '#ffffff', glow: 'rgba(16,185,129,0.5)' },
  visited: { fill: 'rgba(59,130,246,0.3)', stroke: '#60a5fa', text: '#93c5fd' },
  queued: { fill: '#7c3aed', stroke: '#a78bfa', text: '#ffffff' },
};

function scaleX(x: number) { return x * SCALE + 40; }
function scaleY(y: number) { return y * SCALE + 40; }

export default function GraphVisualizer({ nodes, edges = [] }: Props) {
  if (!nodes.length) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 text-sm">
        No graph data
      </div>
    );
  }

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Compute edge endpoints shortened to stop at node border
  function edgeCoords(from: GNode, to: GNode) {
    const x1 = scaleX(from.x), y1 = scaleY(from.y);
    const x2 = scaleX(to.x), y2 = scaleY(to.y);
    const dx = x2 - x1, dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / dist, uy = dy / dist;
    return {
      x1: x1 + ux * NODE_R,
      y1: y1 + uy * NODE_R,
      x2: x2 - ux * (NODE_R + 6), // extra offset for arrowhead
      y2: y2 - uy * (NODE_R + 6),
      mx: (x1 + x2) / 2,
      my: (y1 + y2) / 2,
    };
  }

  return (
    <svg
      viewBox="0 0 580 580"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="graph-arrow"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#71717a" />
        </marker>
        <marker
          id="graph-arrow-hl"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#34d399" />
        </marker>
      </defs>

      <style>{`
        @keyframes edgeGlow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(16,185,129,0.3)); }
          50% { filter: drop-shadow(0 0 10px rgba(16,185,129,0.7)); }
        }
        .edge-glow { animation: edgeGlow 1.5s ease-in-out infinite; }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0; }
        }
        .node-pulse { animation: pulseGlow 1.5s ease-in-out infinite; }
      `}</style>

      {/* Edges */}
      {edges.map((edge, i) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;
        const c = edgeCoords(from, to);
        const hl = edge.highlighted;
        return (
          <g key={`edge-${i}`} className={hl ? 'edge-glow' : ''}>
            <line
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke={hl ? '#34d399' : '#52525b'}
              strokeWidth={hl ? 2.5 : 1.5}
              markerEnd={edge.directed ? (hl ? 'url(#graph-arrow-hl)' : 'url(#graph-arrow)') : undefined}
              className="transition-all duration-500 ease-in-out"
            />
            {edge.label && (
              <text
                x={c.mx}
                y={c.my - 8}
                textAnchor="middle"
                fill={hl ? '#34d399' : '#a1a1aa'}
                fontSize={11}
                fontWeight={600}
                className="transition-all duration-500 ease-in-out"
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const cx = scaleX(node.x);
        const cy = scaleY(node.y);
        const color = colorMap[node.color || 'default'];
        return (
          <g key={`node-${node.id}`}>
            {node.color === 'active' && (
              <circle
                cx={cx}
                cy={cy}
                r={NODE_R + 5}
                fill="none"
                stroke="#34d399"
                strokeWidth={1.5}
                className="node-pulse"
              />
            )}
            <circle
              cx={cx}
              cy={cy}
              r={NODE_R}
              fill={color.fill}
              stroke={color.stroke}
              strokeWidth={2.5}
              style={{
                filter: color.glow ? `drop-shadow(0 0 8px ${color.glow})` : undefined,
                transition: 'all 500ms ease-in-out',
              }}
            />
            <text
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              fill={color.text}
              fontSize={13}
              fontWeight={700}
              style={{ pointerEvents: 'none' }}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
