'use client';

import { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { sheetsApi } from '@/lib/api';

interface SheetUploadProps {
  onSuccess?: () => void;
}

export function SheetUpload({ onSuccess }: SheetUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'csv') {
      setFeedback({ type: 'error', message: 'Only .xlsx and .csv files are supported.' });
      return;
    }
    setFile(f);
    setFeedback(null);
    if (!name) {
      setName(f.name.replace(/\.(xlsx|csv)$/i, ''));
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleUpload = async () => {
    if (!file || !name.trim()) return;
    setUploading(true);
    setFeedback(null);
    try {
      await sheetsApi.upload(name.trim(), file);
      setFeedback({ type: 'success', message: 'Sheet uploaded successfully!' });
      setFile(null);
      setName('');
      onSuccess?.();
    } catch {
      setFeedback({ type: 'error', message: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card variant="glass">
      <h3 className="mb-4 text-sm font-semibold text-zinc-300">Upload Problem Sheet 📤</h3>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300
          ${dragging
            ? 'border-emerald-400 bg-emerald-500/5 glow-md'
            : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <Upload className={`mx-auto h-8 w-8 mb-3 ${dragging ? 'text-emerald-400' : 'text-zinc-500'}`} />
        <p className="text-sm text-zinc-400">
          Drop your <span className="text-zinc-300 font-medium">.xlsx</span> or{' '}
          <span className="text-zinc-300 font-medium">.csv</span> file here
        </p>
        <p className="text-xs text-zinc-600 mt-1">or click to browse</p>
      </div>

      {/* Selected file */}
      {file && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-zinc-800/50 px-4 py-3">
          <FileSpreadsheet className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-200 truncate">{file.name}</p>
            <p className="text-xs text-zinc-500">{formatSize(file.size)}</p>
          </div>
          <button
            onClick={() => { setFile(null); setFeedback(null); }}
            className="rounded-lg p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sheet name input */}
      {file && (
        <div className="mt-4">
          <label className="block text-xs text-zinc-500 mb-1.5">Sheet Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Blind 75"
            className="w-full rounded-xl bg-zinc-800/60 border border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
          />
        </div>
      )}

      {/* Upload button */}
      {file && (
        <div className="mt-4">
          <Button
            variant="gradient"
            className="w-full"
            loading={uploading}
            disabled={!name.trim()}
            onClick={handleUpload}
          >
            Upload Sheet
          </Button>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          {feedback.message}
        </div>
      )}
    </Card>
  );
}
