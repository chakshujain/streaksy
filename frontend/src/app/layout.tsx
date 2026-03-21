import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Streaksy — DSA Prep Platform | LeetCode Tracker & Study Groups',
    template: '%s | Streaksy',
  },
  description: 'Master Data Structures & Algorithms with Streaksy. Auto-sync LeetCode submissions, compete in study groups, track streaks, review with flashcards, and ace your coding interviews. Free to start.',
  keywords: [
    'leetcode tracker', 'dsa prep', 'leetcode progress tracker', 'coding interview prep',
    'study groups leetcode', 'leetcode streak tracker', 'blind 75', 'neetcode 150',
    'striver sde sheet', 'love babbar 450', 'grind 75', 'leetcode sync',
    'data structures and algorithms', 'coding practice', 'faang interview prep',
    'leetcode chrome extension', 'competitive programming', 'dsa revision',
    'leetcode leaderboard', 'coding streak', 'algorithm practice platform',
  ],
  authors: [{ name: 'Streaksy' }],
  creator: 'Streaksy',
  publisher: 'Streaksy',
  metadataBase: new URL('https://streaksy.in'),
  alternates: {
    canonical: 'https://streaksy.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://streaksy.in',
    siteName: 'Streaksy',
    title: 'Streaksy — DSA Prep Platform | LeetCode Tracker & Study Groups',
    description: 'Master DSA with auto LeetCode sync, study groups, streaks, revision flashcards, and live war rooms. Join 10,000+ developers crushing their interview prep.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Streaksy — DSA Prep, Together',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streaksy — DSA Prep Platform | LeetCode Tracker',
    description: 'Auto-sync LeetCode, compete in groups, track streaks, ace interviews. Free.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'ADD_GOOGLE_VERIFICATION_CODE_LATER',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
