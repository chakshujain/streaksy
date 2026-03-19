import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Revision Hub — Flashcard Review for DSA Problems',
  description: 'Review key takeaways from solved problems with spaced-repetition flashcards. Quiz yourself before interviews.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
