'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/cn';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Minimize2,
  X,
} from 'lucide-react';

interface StudyTimerProps {
  /** Current roadmap task name to display */
  taskName?: string;
  /** Whether to render as a floating widget (bottom-right) */
  floating?: boolean;
  /** Called when the floating widget is closed */
  onClose?: () => void;
  /** Focus duration in minutes */
  initialFocus?: number;
  /** Break duration in minutes */
  initialBreak?: number;
}

interface StudyStats {
  totalSeconds: number;
  totalSessions: number;
  dailySeconds: Record<string, number>;
  dailySessions: Record<string, number>;
}

const STORAGE_KEY = 'streaksy_study_stats';

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadStats(): StudyStats {
  if (typeof window === 'undefined') {
    return { totalSeconds: 0, totalSessions: 0, dailySeconds: {}, dailySessions: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalSeconds: 0, totalSessions: 0, dailySeconds: {}, dailySessions: {} };
}

function saveStats(stats: StudyStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

/** Play a short beep using Web Audio API */
function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.stop(ctx.currentTime + 0.8);
  } catch {}
}

export function StudyTimer({
  taskName,
  floating = false,
  onClose,
  initialFocus = 25,
  initialBreak = 5,
}: StudyTimerProps) {
  const [focusMinutes, setFocusMinutes] = useState(initialFocus);
  const [breakMinutes, setBreakMinutes] = useState(initialBreak);
  const [secondsLeft, setSecondsLeft] = useState(initialFocus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [sessions, setSessions] = useState(0);
  const [minimized, setMinimized] = useState(false);

  const accumulatedRef = useRef(0); // seconds accumulated in current session

  // Sync initial values when props change
  useEffect(() => {
    setFocusMinutes(initialFocus);
    setBreakMinutes(initialBreak);
    if (!isRunning) {
      setSecondsLeft(initialFocus * 60);
      setMode('focus');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFocus, initialBreak]);

  // Countdown
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
      if (mode === 'focus') {
        accumulatedRef.current += 1;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  // When timer reaches 0
  useEffect(() => {
    if (secondsLeft !== 0 || !isRunning) return;
    playBeep();
    setIsRunning(false);

    if (mode === 'focus') {
      // Save study time
      const stats = loadStats();
      const today = getTodayKey();
      stats.totalSeconds += accumulatedRef.current;
      stats.totalSessions += 1;
      stats.dailySeconds[today] = (stats.dailySeconds[today] || 0) + accumulatedRef.current;
      stats.dailySessions[today] = (stats.dailySessions[today] || 0) + 1;
      saveStats(stats);
      accumulatedRef.current = 0;

      setSessions((s) => s + 1);
      setMode('break');
      setSecondsLeft(breakMinutes * 60);
    } else {
      setMode('focus');
      setSecondsLeft(focusMinutes * 60);
    }
  }, [secondsLeft, isRunning, mode, focusMinutes, breakMinutes]);

  const toggleRunning = useCallback(() => setIsRunning((r) => !r), []);

  const reset = useCallback(() => {
    // Save any accumulated focus time before resetting
    if (mode === 'focus' && accumulatedRef.current > 0) {
      const stats = loadStats();
      const today = getTodayKey();
      stats.totalSeconds += accumulatedRef.current;
      stats.dailySeconds[today] = (stats.dailySeconds[today] || 0) + accumulatedRef.current;
      saveStats(stats);
      accumulatedRef.current = 0;
    }
    setIsRunning(false);
    setMode('focus');
    setSecondsLeft(focusMinutes * 60);
  }, [focusMinutes, mode]);

  const totalSeconds = mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  // SVG ring params
  const size = floating && minimized ? 48 : floating ? 140 : 220;
  const stroke = floating && minimized ? 4 : floating ? 8 : 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const ringGradientId = mode === 'focus' ? 'focus-grad' : 'break-grad';

  // Minimized floating pill
  if (floating && minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700 px-3 py-2 shadow-2xl cursor-pointer group"
        onClick={() => setMinimized(false)}
      >
        <svg width={size} height={size} className="rotate-[-90deg]">
          <defs>
            <linearGradient id={`${ringGradientId}-mini`} x1="0%" y1="0%" x2="100%" y2="100%">
              {mode === 'focus' ? (
                <><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#06b6d4" /></>
              ) : (
                <><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#8b5cf6" /></>
              )}
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#27272a" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={`url(#${ringGradientId}-mini)`} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-sm font-mono font-semibold text-zinc-200">
          {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
        {onClose && (
          <button onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="text-zinc-500 hover:text-red-400 transition-colors ml-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  const timerContent = (
    <div className={cn('flex flex-col items-center gap-4', floating && 'gap-3')}>
      {/* Task name */}
      {taskName && (
        <p className={cn('text-xs text-zinc-500 text-center truncate max-w-full', floating ? 'max-w-[200px]' : 'max-w-[300px]')}>
          {taskName}
        </p>
      )}

      {/* Mode badge */}
      <div className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        mode === 'focus'
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'bg-cyan-500/10 text-cyan-400'
      )}>
        {mode === 'focus' ? <Timer className="h-3 w-3" /> : <Coffee className="h-3 w-3" />}
        {mode === 'focus' ? 'Focus' : 'Break'}
      </div>

      {/* Ring */}
      <div className="relative">
        <svg width={size} height={size} className="rotate-[-90deg]">
          <defs>
            <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              {mode === 'focus' ? (
                <><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#06b6d4" /></>
              ) : (
                <><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#8b5cf6" /></>
              )}
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#27272a" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={`url(#${ringGradientId})`} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-mono font-bold text-zinc-100', floating ? 'text-2xl' : 'text-4xl')}>
            {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          {!floating && (
            <span className="text-xs text-zinc-500 mt-1">
              Session {sessions + 1}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={toggleRunning}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-all shadow-lg',
            mode === 'focus'
              ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-emerald-500/25 hover:shadow-emerald-500/40'
              : 'bg-gradient-to-br from-cyan-500 to-purple-500 shadow-cyan-500/25 hover:shadow-cyan-500/40'
          )}
          title={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>
        {floating && (
          <button
            onClick={() => setMinimized(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
            title="Minimize"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sessions count */}
      {sessions > 0 && (
        <p className="text-xs text-zinc-500">
          {sessions} session{sessions !== 1 ? 's' : ''} completed
        </p>
      )}
    </div>
  );

  if (floating) {
    return (
      <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-zinc-700 bg-zinc-900/95 backdrop-blur-xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5" /> Study Timer
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimized(true)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
              <Minimize2 className="h-3.5 w-3.5" />
            </button>
            {onClose && (
              <button onClick={onClose} className="text-zinc-500 hover:text-red-400 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        {timerContent}
      </div>
    );
  }

  return timerContent;
}

export { loadStats, getTodayKey, type StudyStats };
