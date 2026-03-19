'use client';

import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface YouTubePlayerProps {
  url: string;
  title?: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function YouTubePlayer({ url, title }: YouTubePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(url);

  if (!videoId) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Play className="h-4 w-4 text-red-400" />
          {title || 'Video Solution'}
        </h3>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
        >
          Open on YouTube <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {playing ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-zinc-800" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title || 'Video Solution'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="relative w-full rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all group"
          style={{ paddingBottom: '56.25%' }}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title || 'Video thumbnail'}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 group-hover:scale-110 transition-transform shadow-lg">
              <Play className="h-7 w-7 text-white ml-1" fill="white" />
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
