'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/cn';
import type { SimulationStep } from '@/lib/patterns-data';
import {
  TreeVisualizer,
  LinkedListVisualizer,
  GraphVisualizer,
  StackVisualizer,
  DPTableVisualizer,
  TrieVisualizer,
  ArrayVisualizer,
} from '@/components/patterns/visualizers';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
} from 'lucide-react';

interface SimulationPlayerProps {
  steps: SimulationStep[];
}

const SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 },
];

export default function SimulationPlayer({ steps }: SimulationPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef(false);
  const speedMenuRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep] || steps[0];

  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    utteranceRef.current = null;
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.();
      return;
    }

    cancelSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;

    // Try to select a clear English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en') && v.name.includes('Google')
    ) || voices.find((v) => v.lang.startsWith('en-US')) || voices.find((v) => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      isSpeakingRef.current = false;
      onEnd?.();
    };
    utterance.onerror = () => {
      isSpeakingRef.current = false;
      onEnd?.();
    };

    isSpeakingRef.current = true;
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [speed, cancelSpeech]);

  // Auto-play logic
  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const baseInterval = 1500 / speed;

    if (audioEnabled) {
      // With audio: speak current step, wait for speech to finish, then advance
      let cancelled = false;

      const advanceWithSpeech = () => {
        if (cancelled) return;

        speak(step?.description || '', () => {
          if (cancelled) return;

          // Small pause after speech before advancing
          setTimeout(() => {
            if (cancelled) return;
            setCurrentStep((s) => {
              if (s >= steps.length - 1) {
                setPlaying(false);
                return s;
              }
              return s + 1;
            });
          }, 300);
        });
      };

      advanceWithSpeech();

      return () => {
        cancelled = true;
        cancelSpeech();
      };
    } else {
      // Without audio: simple interval
      intervalRef.current = setInterval(() => {
        setCurrentStep((s) => {
          if (s >= steps.length - 1) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, baseInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [playing, speed, audioEnabled, currentStep, steps.length, step?.description, speak, cancelSpeech]);

  // Speak on manual step change when audio is enabled and not playing
  useEffect(() => {
    if (audioEnabled && !playing && step) {
      speak(step.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, audioEnabled]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => cancelSpeech();
  }, [cancelSpeech]);

  // Close speed menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!step) return null;

  const reset = () => {
    setPlaying(false);
    cancelSpeech();
    setCurrentStep(0);
  };

  const stepBack = () => {
    setPlaying(false);
    cancelSpeech();
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const stepForward = () => {
    setPlaying(false);
    cancelSpeech();
    setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
  };

  const togglePlay = () => {
    if (playing) {
      cancelSpeech();
    }
    setPlaying(!playing);
  };

  const goToStep = (i: number) => {
    setPlaying(false);
    cancelSpeech();
    setCurrentStep(i);
  };

  const toggleAudio = () => {
    if (audioEnabled) {
      cancelSpeech();
    }
    setAudioEnabled(!audioEnabled);
  };

  const useProgressBar = steps.length >= 8;

  return (
    <div className="space-y-4">
      {/* Visualization area */}
      <div className="min-h-[80px]">
        {/* Priority-based visualizer dispatch */}
        {step.treeData && (
          <TreeVisualizer root={step.treeData} />
        )}
        {!step.treeData && step.graphNodes && (
          <GraphVisualizer nodes={step.graphNodes} edges={step.graphEdges} />
        )}
        {!step.treeData && !step.graphNodes && step.linkedList && (
          <LinkedListVisualizer nodes={step.linkedList} cycleTarget={step.linkedListCycle} />
        )}
        {!step.treeData && !step.graphNodes && !step.linkedList && step.dpTable && (
          <DPTableVisualizer
            table={step.dpTable}
            rowLabels={step.dpRowLabels?.map(String)}
            colLabels={step.dpColLabels?.map(String)}
          />
        )}
        {!step.treeData && !step.graphNodes && !step.linkedList && !step.dpTable && step.trieData && (
          <TrieVisualizer data={step.trieData as { words: string[]; highlightPath?: string; endNodes?: string[] }} />
        )}
        {!step.treeData && !step.graphNodes && !step.linkedList && !step.dpTable && !step.trieData && step.stackVertical && step.stack && (
          <StackVisualizer items={step.stack} />
        )}
        {!step.treeData && !step.graphNodes && !step.linkedList && !step.dpTable && !step.trieData && !(step.stackVertical && step.stack) && step.grid && (
          <GridInline grid={step.grid} gridHighlights={step.gridHighlights} />
        )}
        {!step.treeData && !step.graphNodes && !step.linkedList && !step.dpTable && !step.trieData && !(step.stackVertical && step.stack) && !step.grid && step.array && (
          <ArrayVisualizer array={step.array} highlights={step.highlights} pointers={step.pointers} />
        )}
      </div>

      {/* Queue / Stack (inline, shown alongside main viz when not the primary visualizer) */}
      {step.queue && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">Queue:</span>
          <div className="flex gap-1">
            {step.queue.length === 0 ? (
              <span className="text-xs text-zinc-600 italic">empty</span>
            ) : (
              step.queue.map((val, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center min-w-[32px] h-8 rounded border bg-purple-500/10 border-purple-500/30 text-xs font-mono text-purple-400"
                >
                  {val}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {step.stack && !step.stackVertical && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">Stack:</span>
          <div className="flex gap-1">
            {step.stack.length === 0 ? (
              <span className="text-xs text-zinc-600 italic">empty</span>
            ) : (
              step.stack.map((val, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center min-w-[32px] h-8 rounded border bg-amber-500/10 border-amber-500/30 text-xs font-mono text-amber-400"
                >
                  {val}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Variables display */}
      {step.variables && Object.keys(step.variables).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(step.variables).map(([key, val]) => (
            <div key={key} className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-2 py-1">
              <span className="text-[10px] font-medium text-zinc-500">{key}:</span>
              <span className="text-xs font-mono text-zinc-300">{String(val)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Step description */}
      <div className={cn(
        'rounded-lg p-3 border text-sm',
        step.result
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300'
      )}>
        {/* Enhanced step display: action / reason / state */}
        {step.action && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-400">
              {step.action}
            </span>
          </div>
        )}

        <p>{step.description}</p>

        {step.reason && (
          <p className="mt-1.5 text-xs italic text-zinc-500">
            <span className="text-zinc-400 font-medium not-italic">Why: </span>
            {step.reason}
          </p>
        )}

        {step.state && (
          <div className="mt-2">
            <span className="inline-flex items-center rounded-md bg-zinc-700/50 border border-zinc-600/50 px-2 py-0.5 text-[11px] font-mono text-zinc-300">
              {step.state}
            </span>
          </div>
        )}

        {step.result && (
          <p className="mt-1.5 font-semibold text-emerald-400">{step.result}</p>
        )}
      </div>

      {/* Controls bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Transport buttons */}
        <button onClick={reset} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors" title="Reset">
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={stepBack}
          disabled={currentStep === 0}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors disabled:opacity-30"
          title="Step Back"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          onClick={togglePlay}
          className={cn(
            'p-2 rounded-lg transition-colors',
            playing ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          )}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          onClick={stepForward}
          disabled={currentStep === steps.length - 1}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors disabled:opacity-30"
          title="Step Forward"
        >
          <SkipForward className="h-4 w-4" />
        </button>

        {/* Speed control */}
        <div className="relative" ref={speedMenuRef}>
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-400 transition-colors"
          >
            {speed}x
            <ChevronDown className="h-3 w-3" />
          </button>
          {showSpeedMenu && (
            <div className="absolute bottom-full mb-1 left-0 z-10 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xl overflow-hidden">
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSpeed(opt.value); setShowSpeedMenu(false); }}
                  className={cn(
                    'block w-full px-4 py-1.5 text-xs text-left transition-colors',
                    speed === opt.value ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-400 hover:bg-zinc-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Audio toggle */}
        <button
          onClick={toggleAudio}
          className={cn(
            'p-2 rounded-lg transition-colors',
            audioEnabled ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          )}
          title={audioEnabled ? 'Mute narration' : 'Enable narration'}
        >
          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        {/* Progress indicator */}
        <div className="ml-2 flex items-center gap-1.5">
          {useProgressBar ? (
            <div className="w-32 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          ) : (
            steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  i === currentStep ? 'bg-emerald-400 scale-125' :
                  i < currentStep ? 'bg-emerald-400/30' : 'bg-zinc-700'
                )}
              />
            ))
          )}
        </div>

        {/* Step counter */}
        <span className="ml-auto text-xs text-zinc-500">
          Step {currentStep + 1} / {steps.length}
        </span>
      </div>
    </div>
  );
}

/** Inline grid rendering (same as original page logic) */
function GridInline({ grid, gridHighlights }: { grid: (number | string)[][]; gridHighlights?: [number, number][] }) {
  return (
    <div className="inline-flex flex-col gap-0.5">
      {grid.map((row, r) => (
        <div key={r} className="flex gap-0.5">
          {row.map((cell, c) => {
            const isHighlighted = gridHighlights?.some(([hr, hc]) => hr === r && hc === c);
            return (
              <div
                key={c}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded border text-sm font-mono transition-all duration-300',
                  isHighlighted
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : cell === '1' || cell === 1
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-600'
                )}
              >
                {cell}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
