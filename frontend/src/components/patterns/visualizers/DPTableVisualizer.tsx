'use client';

interface DPCell {
  value: string | number;
  color?: 'default' | 'active' | 'computed' | 'optimal';
}

interface Props {
  table: DPCell[][];
  rowLabels?: string[];
  colLabels?: string[];
}

const CELL_W = 52;
const CELL_H = 36;
const HEADER_W = 40;
const HEADER_H = 28;
const PADDING = 16;

const cellColors: Record<string, { fill: string; stroke: string; text: string }> = {
  default: { fill: '#27272a', stroke: '#3f3f46', text: '#a1a1aa' },
  active: { fill: '#059669', stroke: '#34d399', text: '#ffffff' },
  computed: { fill: 'rgba(59,130,246,0.2)', stroke: '#3b82f6', text: '#93c5fd' },
  optimal: { fill: '#d97706', stroke: '#fbbf24', text: '#ffffff' },
};

export default function DPTableVisualizer({ table, rowLabels, colLabels }: Props) {
  if (!table.length || !table[0].length) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
        No table data
      </div>
    );
  }

  const rows = table.length;
  const cols = table[0].length;
  const hasRowLabels = !!rowLabels?.length;
  const hasColLabels = !!colLabels?.length;

  const offsetX = PADDING + (hasRowLabels ? HEADER_W : 0);
  const offsetY = PADDING + (hasColLabels ? HEADER_H : 0);
  const totalW = offsetX + cols * CELL_W + PADDING;
  const totalH = offsetY + rows * CELL_H + PADDING;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes cellPulse {
          0%, 100% { stroke-opacity: 1; }
          50% { stroke-opacity: 0.3; }
        }
        .cell-active-ring { animation: cellPulse 1s ease-in-out infinite; }
      `}</style>

      {/* Column headers */}
      {hasColLabels && colLabels!.map((label, j) => (
        <text
          key={`col-${j}`}
          x={offsetX + j * CELL_W + CELL_W / 2}
          y={offsetY - 8}
          textAnchor="middle"
          fill="#71717a"
          fontSize={11}
          fontWeight={600}
        >
          {label}
        </text>
      ))}

      {/* Row headers */}
      {hasRowLabels && rowLabels!.map((label, i) => (
        <text
          key={`row-${i}`}
          x={offsetX - 10}
          y={offsetY + i * CELL_H + CELL_H / 2 + 4}
          textAnchor="end"
          fill="#71717a"
          fontSize={11}
          fontWeight={600}
        >
          {label}
        </text>
      ))}

      {/* Cells */}
      {table.map((row, i) =>
        row.map((cell, j) => {
          const cx = offsetX + j * CELL_W;
          const cy = offsetY + i * CELL_H;
          const c = cellColors[cell.color || 'default'];
          const isActive = cell.color === 'active';

          return (
            <g key={`cell-${i}-${j}`}>
              <rect
                x={cx + 1}
                y={cy + 1}
                width={CELL_W - 2}
                height={CELL_H - 2}
                rx={4}
                fill={c.fill}
                stroke={c.stroke}
                strokeWidth={1.5}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' : undefined,
                  transition: 'all 500ms ease-in-out',
                }}
              />

              {/* Active ring */}
              {isActive && (
                <rect
                  x={cx - 1}
                  y={cy - 1}
                  width={CELL_W + 2}
                  height={CELL_H + 2}
                  rx={6}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth={2}
                  className="cell-active-ring"
                />
              )}

              <text
                x={cx + CELL_W / 2}
                y={cy + CELL_H / 2 + 4}
                textAnchor="middle"
                fill={c.text}
                fontSize={13}
                fontWeight={700}
                style={{ pointerEvents: 'none', transition: 'all 500ms ease-in-out' }}
              >
                {cell.value}
              </text>
            </g>
          );
        })
      )}
    </svg>
  );
}
