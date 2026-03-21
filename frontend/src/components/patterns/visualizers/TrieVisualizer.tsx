'use client';

interface TrieData {
  words: string[];
  highlightPath?: string;
  endNodes?: string[];
}

interface Props {
  data: TrieData;
}

interface TrieNode {
  char: string;
  children: Map<string, TrieNode>;
  isEnd: boolean;
  path: string; // full path from root e.g. "ca" for node 'a' under 'c'
}

const NODE_R = 18;
const V_SPACING = 70;
const H_MIN_SPACING = 50;

function buildTrie(words: string[]): TrieNode {
  const root: TrieNode = { char: '', children: new Map(), isEnd: false, path: '' };
  for (const word of words) {
    let current = root;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (!current.children.has(ch)) {
        current.children.set(ch, {
          char: ch,
          children: new Map(),
          isEnd: false,
          path: word.slice(0, i + 1),
        });
      }
      current = current.children.get(ch)!;
    }
    current.isEnd = true;
  }
  return root;
}

function getSubtreeWidth(node: TrieNode): number {
  if (node.children.size === 0) return H_MIN_SPACING;
  let width = 0;
  node.children.forEach(child => {
    width += getSubtreeWidth(child);
  });
  return Math.max(width, H_MIN_SPACING);
}

function renderTrieNode(
  node: TrieNode,
  cx: number,
  cy: number,
  highlightPath: string | undefined,
  endNodeSet: Set<string>,
  elements: JSX.Element[],
  key: string
) {
  const isOnPath = highlightPath ? highlightPath.startsWith(node.path) || node.path === '' : false;
  const isHighlighted = isOnPath && (node.path.length <= (highlightPath?.length || 0));
  const isEnd = node.isEnd || endNodeSet.has(node.path);

  const fill = isHighlighted ? '#059669' : '#3f3f46';
  const stroke = isHighlighted ? '#34d399' : '#52525b';
  const textFill = isHighlighted ? '#ffffff' : '#fafafa';
  const glow = isHighlighted ? 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' : 'none';

  // End-of-word double border
  if (isEnd) {
    elements.push(
      <circle
        key={`${key}-outer`}
        cx={cx}
        cy={cy}
        r={NODE_R + 4}
        fill="none"
        stroke={isHighlighted ? '#34d399' : '#fbbf24'}
        strokeWidth={2}
        style={{ transition: 'all 500ms ease-in-out' }}
      />
    );
  }

  elements.push(
    <circle
      key={`${key}-circle`}
      cx={cx}
      cy={cy}
      r={NODE_R}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      style={{ filter: glow, transition: 'all 500ms ease-in-out' }}
    />
  );

  const label = node.path === '' ? 'root' : node.char;
  elements.push(
    <text
      key={`${key}-text`}
      x={cx}
      y={cy + 5}
      textAnchor="middle"
      fill={textFill}
      fontSize={13}
      fontWeight={700}
      style={{ pointerEvents: 'none' }}
    >
      {label}
    </text>
  );

  // Render children
  const children = Array.from(node.children.values());
  if (children.length === 0) return;

  const totalWidth = children.reduce((sum, child) => sum + getSubtreeWidth(child), 0);
  let startX = cx - totalWidth / 2;

  children.forEach((child, i) => {
    const childWidth = getSubtreeWidth(child);
    const childCx = startX + childWidth / 2;
    const childCy = cy + V_SPACING;
    startX += childWidth;

    const edgeHighlighted = highlightPath ? child.path === highlightPath.slice(0, child.path.length) : false;

    // Edge line
    elements.push(
      <line
        key={`${key}-edge-${i}`}
        x1={cx}
        y1={cy + NODE_R}
        x2={childCx}
        y2={childCy - NODE_R}
        stroke={edgeHighlighted ? '#34d399' : '#52525b'}
        strokeWidth={edgeHighlighted ? 2.5 : 1.5}
        style={{ transition: 'all 500ms ease-in-out' }}
      />
    );

    // Edge character label
    const midX = (cx + childCx) / 2;
    const midY = (cy + NODE_R + childCy - NODE_R) / 2;
    elements.push(
      <text
        key={`${key}-edgelabel-${i}`}
        x={midX + (childCx > cx ? 8 : -8)}
        y={midY}
        textAnchor="middle"
        fill={edgeHighlighted ? '#34d399' : '#a1a1aa'}
        fontSize={12}
        fontWeight={700}
        style={{ transition: 'all 500ms ease-in-out' }}
      >
        {child.char}
      </text>
    );

    renderTrieNode(child, childCx, childCy, highlightPath, endNodeSet, elements, `${key}-${child.char}`);
  });
}

export default function TrieVisualizer({ data }: Props) {
  const { words, highlightPath, endNodes = [] } = data;

  if (!words.length) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
        No trie data
      </div>
    );
  }

  const root = buildTrie(words);
  const endNodeSet = new Set(endNodes);

  // Calculate dimensions
  const totalWidth = Math.max(400, getSubtreeWidth(root) + 80);
  const maxDepth = Math.max(...words.map(w => w.length));
  const totalHeight = (maxDepth + 1) * V_SPACING + 60;

  const elements: JSX.Element[] = [];
  renderTrieNode(root, totalWidth / 2, 40, highlightPath, endNodeSet, elements, 'trie');

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {elements}
    </svg>
  );
}
