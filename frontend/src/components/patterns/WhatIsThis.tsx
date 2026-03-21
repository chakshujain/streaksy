'use client';

import { Lightbulb } from 'lucide-react';

interface WhatIsThisProps {
  whatIsThis?: string;
  realWorldAnalogy?: string;
  /** New-style analogy text (preferred over whatIsThis) */
  analogy?: string;
  /** Key insight callout */
  keyInsight?: string;
}

/**
 * Legacy WhatIsThis component — kept for backward compatibility.
 * The pattern detail page now renders intuition content inline,
 * so this is a simple pass-through renderer.
 */
export default function WhatIsThis({
  whatIsThis,
  realWorldAnalogy,
  analogy,
  keyInsight,
}: WhatIsThisProps) {
  const text = analogy || whatIsThis;

  if (!text) return null;

  const paragraphs = text.split('\n\n').filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-l-2 border-l-purple-500/50 bg-zinc-900/60 border border-zinc-800 p-5">
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-[15px] text-zinc-300 leading-relaxed italic mb-3 last:mb-0"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {realWorldAnalogy && !analogy && (
        <div className="flex gap-3 rounded-lg border-l-2 border-emerald-500 bg-emerald-500/5 p-4">
          <Lightbulb className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
              Real World Analogy
            </span>
            <p className="mt-1 text-sm text-zinc-300 leading-relaxed">{realWorldAnalogy}</p>
          </div>
        </div>
      )}

      {keyInsight && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              💡 Key Insight
            </span>
            <p className="mt-1 text-sm text-zinc-300 leading-relaxed">{keyInsight}</p>
          </div>
        </div>
      )}
    </div>
  );
}
