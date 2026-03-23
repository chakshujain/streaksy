'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { learnApi } from '@/lib/api';
import { MessageCircle, Loader2, Send, Code } from 'lucide-react';
import type { AILessonAnswer } from '@/lib/types';

interface AILessonQAProps {
  topic: string;
  lesson: string;
}

interface QAEntry {
  question: string;
  answer: AILessonAnswer;
}

export function AILessonQA({ topic, lesson }: AILessonQAProps) {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<QAEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const askQuestion = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);
    setError('');
    const q = question;
    setQuestion('');

    try {
      const res = await learnApi.askAI({ topic, lesson, question: q });
      setHistory(prev => [...prev, { question: q, answer: res.data.answer }]);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to get answer';
      setError(message);
      setQuestion(q);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        Ask AI about this lesson
      </button>
    );
  }

  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-blue-300">Ask AI</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs text-zinc-500 hover:text-zinc-300"
        >
          Close
        </button>
      </div>

      {history.length > 0 && (
        <div className="space-y-3 mb-3 max-h-96 overflow-y-auto">
          {history.map((entry, i) => (
            <div key={i} className="space-y-2">
              <div className="rounded-lg bg-blue-500/10 p-2.5 border border-blue-500/20">
                <p className="text-xs text-blue-300">{entry.question}</p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-3 border border-zinc-700/50">
                <p className="text-sm text-zinc-300">{entry.answer.answer}</p>
                {entry.answer.codeExample && (
                  <div className="mt-2 rounded-lg bg-zinc-900 p-2.5 border border-zinc-700/30">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Code className="h-3 w-3 text-zinc-500" />
                      <span className="text-[10px] text-zinc-500 uppercase">Code</span>
                    </div>
                    <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap">{entry.answer.codeExample}</pre>
                  </div>
                )}
                {entry.answer.relatedConcepts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {entry.answer.relatedConcepts.map((concept, j) => (
                      <span key={j} className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                        {concept}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
          placeholder="Ask a question about this lesson..."
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          disabled={loading}
        />
        <button
          onClick={askQuestion}
          disabled={loading || !question.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {error && (
        <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</div>
      )}
    </Card>
  );
}
