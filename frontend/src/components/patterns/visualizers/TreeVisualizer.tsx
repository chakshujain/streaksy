'use client';

interface TreeNodeData {
  val: string | number;
  left?: TreeNodeData | null;
  right?: TreeNodeData | null;
  color?: 'default' | 'active' | 'visited' | 'found' | 'queued';
  label?: string;
}

interface Props {
  root: TreeNodeData | null;
}

const NODE_RADIUS = 22;

const colorMap: Record<string, { fill: string; stroke: string; text: string; glow?: string }> = {
  default: { fill: '#3f3f46', stroke: '#52525b', text: '#fafafa' },
  active: { fill: '#059669', stroke: '#34d399', text: '#ffffff', glow: 'rgba(16,185,129,0.5)' },
  visited: { fill: 'rgba(59,130,246,0.3)', stroke: '#60a5fa', text: '#93c5fd' },
  found: { fill: '#d97706', stroke: '#fbbf24', text: '#ffffff', glow: 'rgba(251,191,36,0.5)' },
  queued: { fill: '#7c3aed', stroke: '#a78bfa', text: '#ffffff' },
};

function getTreeDepth(node: TreeNodeData | null | undefined): number {
  if (!node) return 0;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

function renderNode(
  node: TreeNodeData | null | undefined,
  cx: number,
  cy: number,
  hSpread: number,
  vSpacing: number,
  elements: JSX.Element[],
  key: string
) {
  if (!node) return;

  const color = colorMap[node.color || 'default'];

  // Draw edges to children first (so they render behind nodes)
  if (node.left) {
    const childX = cx - hSpread;
    const childY = cy + vSpacing;
    elements.push(
      <line
        key={`${key}-edge-l`}
        x1={cx}
        y1={cy + NODE_RADIUS}
        x2={childX}
        y2={childY - NODE_RADIUS}
        stroke="#52525b"
        strokeWidth={2}
        className="transition-all duration-500 ease-in-out"
      />
    );
    renderNode(node.left, childX, childY, hSpread / 2, vSpacing, elements, `${key}-l`);
  }

  if (node.right) {
    const childX = cx + hSpread;
    const childY = cy + vSpacing;
    elements.push(
      <line
        key={`${key}-edge-r`}
        x1={cx}
        y1={cy + NODE_RADIUS}
        x2={childX}
        y2={childY - NODE_RADIUS}
        stroke="#52525b"
        strokeWidth={2}
        className="transition-all duration-500 ease-in-out"
      />
    );
    renderNode(node.right, childX, childY, hSpread / 2, vSpacing, elements, `${key}-r`);
  }

  // Label above node
  if (node.label) {
    elements.push(
      <text
        key={`${key}-label`}
        x={cx}
        y={cy - NODE_RADIUS - 8}
        textAnchor="middle"
        fill="#a1a1aa"
        fontSize={11}
        fontWeight={600}
        className="transition-all duration-500 ease-in-out"
      >
        {node.label}
      </text>
    );
  }

  // Node circle
  elements.push(
    <circle
      key={`${key}-circle`}
      cx={cx}
      cy={cy}
      r={NODE_RADIUS}
      fill={color.fill}
      stroke={color.stroke}
      strokeWidth={2.5}
      style={{
        filter: color.glow ? `drop-shadow(0 0 8px ${color.glow})` : undefined,
        transition: 'all 500ms ease-in-out',
      }}
    />
  );

  // Active pulse ring
  if (node.color === 'active') {
    elements.push(
      <circle
        key={`${key}-pulse`}
        cx={cx}
        cy={cy}
        r={NODE_RADIUS + 4}
        fill="none"
        stroke="#34d399"
        strokeWidth={1.5}
        opacity={0.6}
        className="animate-ping"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
    );
  }

  // Node value text
  elements.push(
    <text
      key={`${key}-text`}
      x={cx}
      y={cy + 5}
      textAnchor="middle"
      fill={color.text}
      fontSize={14}
      fontWeight={700}
      className="transition-all duration-500 ease-in-out"
      style={{ pointerEvents: 'none' }}
    >
      {node.val}
    </text>
  );
}

export default function TreeVisualizer({ root }: Props) {
  if (!root) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 text-sm">
        No tree data
      </div>
    );
  }

  const depth = getTreeDepth(root);
  const width = Math.max(400, Math.pow(2, depth) * 60);
  const height = depth * 80 + 60;
  const hSpread = width / 4;

  const elements: JSX.Element[] = [];
  renderNode(root, width / 2, 45, hSpread, 75, elements, 'root');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0; }
        }
        .animate-ping { animation: pulseGlow 1.5s ease-in-out infinite; }
      `}</style>
      {elements}
    </svg>
  );
}
