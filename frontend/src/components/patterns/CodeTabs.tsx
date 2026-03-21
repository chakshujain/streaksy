'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/cn';

interface CodeTabsProps {
  codes?: { language: string; label: string; code: string }[];
  code?: string;
  language?: string;
  highlightLine?: number;
}

const LANGUAGE_LABELS: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  'c++': 'C++',
  cpp: 'C++',
  typescript: 'TypeScript',
  go: 'Go',
  rust: 'Rust',
};

export default function CodeTabs({ codes, code, language, highlightLine }: CodeTabsProps) {
  const tabs = useMemo(() => {
    if (codes && codes.length > 0) return codes;
    if (code && language) {
      return [{ language, label: LANGUAGE_LABELS[language.toLowerCase()] || language, code }];
    }
    return [];
  }, [codes, code, language]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.language || 'python');

  const activeCode = tabs.find((t) => t.language === activeTab) || tabs[0];

  if (!activeCode) return null;

  const lines = activeCode.code.split('\n');

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      {/* Tab bar */}
      {tabs.length > 1 && (
        <div className="flex border-b border-zinc-800 bg-zinc-900/50">
          {tabs.map((tab) => (
            <button
              key={tab.language}
              onClick={() => setActiveTab(tab.language)}
              className={cn(
                'px-4 py-2 text-xs font-medium transition-colors relative',
                activeTab === tab.language
                  ? 'text-emerald-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {tab.label}
              {activeTab === tab.language && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Code block */}
      <div className="overflow-x-auto">
        <pre className="text-xs font-mono leading-relaxed">
          <code>
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const isHighlighted = highlightLine === lineNum;
              return (
                <div
                  key={i}
                  className={cn(
                    'flex',
                    isHighlighted && 'bg-emerald-500/5 border-l-2 border-emerald-500'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block w-10 shrink-0 text-right pr-4 select-none text-zinc-600',
                      isHighlighted && 'text-emerald-600'
                    )}
                  >
                    {lineNum}
                  </span>
                  <span className={cn('text-zinc-300 pr-4', isHighlighted && 'text-zinc-200')}>
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
