'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    error: 'border-red-500/20 bg-red-500/10 text-red-400',
    info: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400',
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4" />,
    error: <AlertTriangle className="h-4 w-4" />,
    info: <CheckCircle className="h-4 w-4" />,
  };

  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm transition-all duration-300',
      styles[type],
      visible ? 'animate-slide-in-right opacity-100' : 'opacity-0 translate-x-4'
    )}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={() => { setVisible(false); onClose?.(); }} className="ml-2 opacity-50 hover:opacity-100">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
