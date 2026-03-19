'use client';

import { X } from 'lucide-react';

interface YouTubeModalProps {
  url: string;
  title?: string;
  onClose: () => void;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function YouTubeModal({ url, title, onClose }: YouTubeModalProps) {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-3xl mx-4 animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-zinc-400 hover:text-white transition-colors">
          <X className="h-6 w-6" />
        </button>
        {title && <p className="text-sm font-medium text-zinc-300 mb-2">{title}</p>}
        <div className="relative w-full rounded-xl overflow-hidden border border-zinc-700" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title || 'Solution Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
