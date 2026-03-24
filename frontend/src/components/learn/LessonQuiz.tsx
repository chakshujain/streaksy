'use client';

import { useState, useCallback } from 'react';
import type { QuizQuestion } from '@/lib/learn-data';
import { cn } from '@/lib/cn';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  ClipboardCheck,
  Eye,
} from 'lucide-react';

interface LessonQuizProps {
  quiz: QuizQuestion[];
  topicSlug: string;
  lessonSlug: string;
}

type QuestionState = {
  answered: boolean;
  selectedOption?: string;
  typedAnswer?: string;
  correct: boolean | null;
  showExplanation: boolean;
};

export function LessonQuiz({ quiz, topicSlug, lessonSlug }: LessonQuizProps) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [states, setStates] = useState<QuestionState[]>(
    quiz.map(() => ({ answered: false, correct: null, showExplanation: false }))
  );
  const [showResults, setShowResults] = useState(false);

  const current = quiz[currentIndex];
  const state = states[currentIndex];
  const totalCorrect = states.filter((s) => s.correct === true).length;

  const updateState = useCallback(
    (index: number, update: Partial<QuestionState>) => {
      setStates((prev) => prev.map((s, i) => (i === index ? { ...s, ...update } : s)));
    },
    []
  );

  const checkAnswer = useCallback(() => {
    const q = quiz[currentIndex];
    const s = states[currentIndex];

    if (q.type === 'mcq') {
      const correct = s.selectedOption === q.answer;
      updateState(currentIndex, { answered: true, correct, showExplanation: true });
    } else {
      const userAnswer = (s.typedAnswer || '').trim().toLowerCase();
      const correctAnswer = q.answer.toLowerCase();
      // For short-answer, check if user's answer contains the key answer
      const correct =
        userAnswer === correctAnswer ||
        userAnswer.includes(correctAnswer) ||
        correctAnswer.includes(userAnswer);
      updateState(currentIndex, { answered: true, correct, showExplanation: true });
    }
  }, [currentIndex, quiz, states, updateState]);

  const nextQuestion = useCallback(() => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowResults(true);
    }
  }, [currentIndex, quiz.length]);

  const restart = useCallback(() => {
    setStates(quiz.map(() => ({ answered: false, correct: null, showExplanation: false })));
    setCurrentIndex(0);
    setShowResults(false);
  }, [quiz]);

  if (!started) {
    return (
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
            <ClipboardCheck className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Lesson Quiz</h3>
            <p className="text-xs text-zinc-500">
              {quiz.length} question{quiz.length !== 1 ? 's' : ''} &middot; Test your understanding
            </p>
          </div>
        </div>
        <p className="text-sm text-zinc-400 mb-4">
          Ready to test what you learned? This quiz covers the key concepts from this lesson.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors"
        >
          Start Quiz <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (showResults) {
    const pct = Math.round((totalCorrect / quiz.length) * 100);
    const excellent = pct >= 80;
    const good = pct >= 50;
    return (
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6 space-y-4">
        <div className="text-center space-y-3">
          <div
            className={cn(
              'inline-flex h-16 w-16 items-center justify-center rounded-2xl',
              excellent
                ? 'bg-emerald-500/15'
                : good
                  ? 'bg-amber-500/15'
                  : 'bg-red-500/15'
            )}
          >
            <Trophy
              className={cn(
                'h-8 w-8',
                excellent ? 'text-emerald-400' : good ? 'text-amber-400' : 'text-red-400'
              )}
            />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-100">
              {totalCorrect}/{quiz.length}
            </p>
            <p
              className={cn(
                'text-sm font-medium',
                excellent ? 'text-emerald-400' : good ? 'text-amber-400' : 'text-red-400'
              )}
            >
              {excellent ? 'Excellent!' : good ? 'Good effort!' : 'Keep practicing!'}
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            {excellent
              ? 'You have a strong grasp of this topic.'
              : good
                ? 'Review the explanations below to strengthen your understanding.'
                : 'Consider re-reading the lesson and trying again.'}
          </p>
        </div>

        {/* Answer review */}
        <div className="space-y-2 pt-2">
          {quiz.map((q, i) => (
            <div
              key={i}
              className={cn(
                'rounded-lg border px-4 py-3',
                states[i].correct
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-red-500/20 bg-red-500/5'
              )}
            >
              <div className="flex items-start gap-2">
                {states[i].correct ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                )}
                <div className="space-y-1 min-w-0">
                  <p className="text-sm text-zinc-300">{q.question}</p>
                  {!states[i].correct && (
                    <p className="text-xs text-emerald-400">Answer: {q.answer}</p>
                  )}
                  <p className="text-xs text-zinc-500">{q.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={restart}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6 space-y-5">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-purple-400">
          Question {currentIndex + 1} of {quiz.length}
        </p>
        <div className="flex gap-1">
          {quiz.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 w-6 rounded-full transition-colors',
                i === currentIndex
                  ? 'bg-purple-400'
                  : states[i].answered
                    ? states[i].correct
                      ? 'bg-emerald-400'
                      : 'bg-red-400'
                    : 'bg-zinc-700'
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <p className="text-sm font-medium text-zinc-200">{current.question}</p>

      {/* MCQ Options */}
      {current.type === 'mcq' && current.options && (
        <div className="space-y-2">
          {current.options.map((opt, i) => {
            const isSelected = state.selectedOption === opt;
            const isCorrectAnswer = opt === current.answer;
            const showCorrect = state.answered && isCorrectAnswer;
            const showWrong = state.answered && isSelected && !isCorrectAnswer;

            return (
              <button
                key={i}
                onClick={() => {
                  if (!state.answered) {
                    updateState(currentIndex, { selectedOption: opt });
                  }
                }}
                disabled={state.answered}
                className={cn(
                  'w-full text-left rounded-lg border px-4 py-3 text-sm transition-all',
                  showCorrect
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : showWrong
                      ? 'border-red-500/40 bg-red-500/10 text-red-300'
                      : isSelected
                        ? 'border-purple-500/40 bg-purple-500/10 text-zinc-200'
                        : 'border-zinc-700/50 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                      showCorrect
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : showWrong
                          ? 'bg-red-500/20 text-red-400'
                          : isSelected
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-zinc-700/50 text-zinc-500'
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {showCorrect && <CheckCircle2 className="h-4 w-4 ml-auto text-emerald-400" />}
                  {showWrong && <XCircle className="h-4 w-4 ml-auto text-red-400" />}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Short Answer */}
      {current.type === 'short-answer' && (
        <div className="space-y-2">
          <input
            type="text"
            value={state.typedAnswer || ''}
            onChange={(e) => {
              if (!state.answered) {
                updateState(currentIndex, { typedAnswer: e.target.value });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !state.answered && (state.typedAnswer || '').trim()) {
                checkAnswer();
              }
            }}
            disabled={state.answered}
            placeholder="Type your answer..."
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/30 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/20 disabled:opacity-60"
          />
          {state.answered && (
            <div
              className={cn(
                'flex items-center gap-2 text-xs px-1',
                state.correct ? 'text-emerald-400' : 'text-red-400'
              )}
            >
              {state.correct ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              {state.correct ? 'Correct!' : `Answer: ${current.answer}`}
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {state.showExplanation && (
        <div className="rounded-lg border border-zinc-700/30 bg-zinc-800/30 p-3 flex gap-2.5">
          <Eye className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">{current.explanation}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-1">
        {!state.answered ? (
          <button
            onClick={checkAnswer}
            disabled={
              current.type === 'mcq'
                ? !state.selectedOption
                : !(state.typedAnswer || '').trim()
            }
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors"
          >
            {currentIndex < quiz.length - 1 ? (
              <>
                Next <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              'See Results'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
