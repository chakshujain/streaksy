'use client';

import { useState, useCallback, useRef } from 'react';
import {
  ResponsiveGridLayout,
  useContainerWidth,
} from 'react-grid-layout';
import type {
  LayoutItem,
  Layout,
  ResponsiveLayouts,
} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { GripVertical, Lock, Unlock, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'streaksy_dashboard_layout';

interface DashboardWidget {
  id: string;
  title: string;
  defaultLayout: { x: number; y: number; w: number; h: number; minW?: number; minH?: number };
  component: React.ReactNode;
}

interface DashboardGridProps {
  widgets: DashboardWidget[];
}

function loadSavedLayouts(): ResponsiveLayouts | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveLayouts(layouts: ResponsiveLayouts) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
}

function widgetToLayoutItem(w: DashboardWidget): LayoutItem {
  return { i: w.id, ...w.defaultLayout };
}

function buildDefaultLayouts(widgets: DashboardWidget[]): ResponsiveLayouts {
  return {
    lg: widgets.map(widgetToLayoutItem),
    md: widgets.map(w => ({ ...widgetToLayoutItem(w), w: Math.min(w.defaultLayout.w, 10) })),
    sm: widgets.map(w => ({ i: w.id, x: 0, y: w.defaultLayout.y, w: 6, h: w.defaultLayout.h, minW: w.defaultLayout.minW, minH: w.defaultLayout.minH })),
    xs: widgets.map(w => ({ i: w.id, x: 0, y: w.defaultLayout.y, w: 4, h: w.defaultLayout.h, minW: w.defaultLayout.minW, minH: w.defaultLayout.minH })),
    xxs: widgets.map(w => ({ i: w.id, x: 0, y: w.defaultLayout.y, w: 2, h: w.defaultLayout.h, minW: w.defaultLayout.minW, minH: w.defaultLayout.minH })),
  };
}

export type { DashboardWidget };

export function DashboardGrid({ widgets }: DashboardGridProps) {
  const [locked, setLocked] = useState(true);
  const defaultLayoutsRef = useRef(buildDefaultLayouts(widgets));
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(() => {
    const saved = loadSavedLayouts();
    return saved ?? defaultLayoutsRef.current;
  });

  const { width, containerRef, mounted } = useContainerWidth({ initialWidth: 1280 });

  const handleLayoutChange = useCallback((_layout: Layout, allLayouts: ResponsiveLayouts) => {
    setLayouts(allLayouts);
    if (!locked) {
      saveLayouts(allLayouts);
    }
  }, [locked]);

  const handleReset = useCallback(() => {
    const defaults = defaultLayoutsRef.current;
    setLayouts(defaults);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>}>
      {/* Lock/Unlock toggle */}
      <div className="flex justify-end mb-2 gap-2">
        {!locked && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            title="Reset layout to default"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Layout
          </button>
        )}
        <button
          onClick={() => setLocked(prev => !prev)}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
          title={locked ? 'Unlock to rearrange widgets' : 'Lock layout'}
        >
          {locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
          {locked ? 'Customize Layout' : 'Lock Layout'}
        </button>
      </div>

      {mounted && (
        <ResponsiveGridLayout
          width={width}
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          dragConfig={{ enabled: !locked, handle: '.drag-handle', threshold: 3, bounded: false }}
          resizeConfig={{ enabled: !locked, handles: ['se'] }}
          onLayoutChange={handleLayoutChange}
          containerPadding={[0, 0]}
          margin={[16, 16]}
        >
          {widgets.map(widget => (
            <div key={widget.id} className="relative group">
              {!locked && (
                <div className="drag-handle absolute -top-0 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-b-lg bg-zinc-800/90 border border-t-0 border-zinc-700 px-3 py-0.5 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-3 w-3 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500">{widget.title}</span>
                </div>
              )}
              <div className={`h-full overflow-auto ${!locked ? 'ring-1 ring-zinc-800 ring-dashed rounded-2xl' : ''}`}>
                {widget.component}
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
