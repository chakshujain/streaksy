export interface ComparisonItem {
  left: string;
  right: string;
}

export interface FlowStep {
  label: string;
  description?: string;
  icon?: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface InfoCard {
  title: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface LessonStep {
  title: string;
  content: string;            // Keep SHORT — max 2-3 sentences per paragraph
  bullets?: string[];          // Key points as bullets instead of paragraphs
  analogy?: string;
  code?: {
    language: string;
    label: string;
    code: string;
  }[];
  // Rich visuals
  comparison?: {
    leftTitle: string;
    rightTitle: string;
    leftColor?: string;
    rightColor?: string;
    items: ComparisonItem[];
  };
  flow?: FlowStep[];
  table?: TableData;
  cards?: InfoCard[];
  diagram?: string;            // ASCII diagram in monospace
  // Legacy
  visual?: 'diagram' | 'flowchart' | 'table' | 'comparison';
  visualData?: Record<string, unknown>;
  keyTakeaway?: string;
}

export interface Lesson {
  slug: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  icon: string;
  steps: LessonStep[];
  commonMistakes?: { mistake: string; explanation: string }[];
  practiceQuestions?: string[];
}

export interface Topic {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const topics: Topic[] = [
  {
    slug: 'dsa-patterns',
    name: 'DSA Patterns',
    description:
      'Master the 19 essential problem-solving patterns with interactive step-by-step simulations, visual algorithms, and multi-language code.',
    icon: '🧩',
    color: 'emerald',
    lessons: [], // empty — routing handled specially via /patterns
  },
  {
    slug: 'databases',
    name: 'Databases',
    description:
      'From SQL basics to sharding and replication — everything you need to know about storing and querying data at scale.',
    icon: '🗄️',
    color: 'blue',
    lessons: [
      {
        slug: 'what-is-a-database',
        title: 'What is a Database?',
        description:
          'Understand what databases are, why they exist, and the different types you will encounter.',
        difficulty: 'beginner',
        duration: '10 min',
        icon: '📦',
        steps: [],
      },
      {
        slug: 'sql-basics-select-where-order-by',
        title: 'SQL Basics: SELECT, WHERE, ORDER BY',
        description:
          'Write your first queries — filter rows, sort results, and retrieve exactly the data you need.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '🔍',
        steps: [],
      },
      {
        slug: 'joins-connecting-tables',
        title: 'JOINs — Connecting Tables',
        description:
          'Learn INNER, LEFT, RIGHT, and FULL joins to combine data spread across multiple tables.',
        difficulty: 'beginner',
        duration: '20 min',
        icon: '🔗',
        steps: [],
      },
      {
        slug: 'indexing-making-queries-fast',
        title: 'Indexing — Making Queries Fast',
        description:
          'Discover how indexes work under the hood and when to add (or skip) them.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '⚡',
        steps: [],
      },
      {
        slug: 'normalization-organizing-data',
        title: 'Normalization — Organizing Data',
        description:
          'Structure your tables to eliminate redundancy using the normal forms (1NF through 3NF).',
        difficulty: 'intermediate',
        duration: '20 min',
        icon: '🗂️',
        steps: [],
      },
      {
        slug: 'transactions-acid-properties',
        title: 'Transactions & ACID Properties',
        description:
          'Understand atomic operations and how databases guarantee consistency even during failures.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🔒',
        steps: [],
      },
      {
        slug: 'isolation-levels',
        title: 'Isolation Levels',
        description:
          'Explore read uncommitted through serializable and the trade-offs each level makes.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🛡️',
        steps: [],
      },
      {
        slug: 'query-optimization',
        title: 'Query Optimization',
        description:
          'Read EXPLAIN plans, avoid common anti-patterns, and make slow queries blazing fast.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '🚀',
        steps: [],
      },
      {
        slug: 'sharding-splitting-data-across-servers',
        title: 'Sharding — Splitting Data Across Servers',
        description:
          'Scale horizontally by distributing data across multiple machines with shard keys.',
        difficulty: 'advanced',
        duration: '15 min',
        icon: '🧩',
        steps: [],
      },
      {
        slug: 'replication-copies-for-safety',
        title: 'Replication — Copies for Safety',
        description:
          'Keep your data safe and available with leader-follower and multi-leader replication.',
        difficulty: 'advanced',
        duration: '15 min',
        icon: '📋',
        steps: [],
      },
      {
        slug: 'cap-theorem',
        title: 'CAP Theorem',
        description:
          'Understand the fundamental trade-off between consistency, availability, and partition tolerance.',
        difficulty: 'advanced',
        duration: '10 min',
        icon: '⚖️',
        steps: [],
      },
      {
        slug: 'sql-vs-nosql',
        title: 'SQL vs NoSQL — When to Use Which',
        description:
          'Compare relational and non-relational databases and pick the right one for your use case.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🤔',
        steps: [],
      },
      {
        slug: 'database-design-patterns',
        title: 'Database Design Patterns',
        description:
          'Master common patterns like soft deletes, polymorphic associations, and event sourcing.',
        difficulty: 'advanced',
        duration: '25 min',
        icon: '🏛️',
        steps: [],
      },
    ],
  },
  {
    slug: 'system-design',
    name: 'System Design',
    description:
      'Learn to architect scalable, reliable systems — from load balancers and caching to full end-to-end designs.',
    icon: '🏗️',
    color: 'purple',
    lessons: [
      {
        slug: 'what-is-system-design',
        title: 'What is System Design?',
        description:
          'An overview of system design interviews and the mindset you need to succeed.',
        difficulty: 'beginner',
        duration: '10 min',
        icon: '🌐',
        steps: [],
      },
      {
        slug: 'client-server-architecture',
        title: 'Client-Server Architecture',
        description:
          'The foundational model of the internet — how clients talk to servers and back.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '💻',
        steps: [],
      },
      {
        slug: 'load-balancing',
        title: 'Load Balancing',
        description:
          'Distribute traffic across servers to prevent overload and ensure high availability.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '⚖️',
        steps: [],
      },
      {
        slug: 'caching-speed-up-everything',
        title: 'Caching — Speed Up Everything',
        description:
          'Store frequently accessed data closer to the user with in-memory caches and CDNs.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '💨',
        steps: [],
      },
      {
        slug: 'cdn-content-closer-to-users',
        title: 'CDN — Content Closer to Users',
        description:
          'Serve static and dynamic content from edge servers around the globe.',
        difficulty: 'intermediate',
        duration: '10 min',
        icon: '🌍',
        steps: [],
      },
      {
        slug: 'message-queues',
        title: 'Message Queues',
        description:
          'Decouple services with async messaging using tools like RabbitMQ, Kafka, and SQS.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '📬',
        steps: [],
      },
      {
        slug: 'database-scaling',
        title: 'Database Scaling',
        description:
          'Scale reads with replicas, writes with sharding, and everything with connection pooling.',
        difficulty: 'intermediate',
        duration: '20 min',
        icon: '📈',
        steps: [],
      },
      {
        slug: 'api-design',
        title: 'API Design',
        description:
          'Design clean, versioned REST and GraphQL APIs that developers love to use.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🔌',
        steps: [],
      },
      {
        slug: 'rate-limiting',
        title: 'Rate Limiting',
        description:
          'Protect your services from abuse with token buckets, sliding windows, and more.',
        difficulty: 'intermediate',
        duration: '10 min',
        icon: '🚦',
        steps: [],
      },
      {
        slug: 'consistent-hashing',
        title: 'Consistent Hashing',
        description:
          'Distribute data across nodes so that adding or removing servers causes minimal disruption.',
        difficulty: 'advanced',
        duration: '15 min',
        icon: '🔄',
        steps: [],
      },
      {
        slug: 'microservices-vs-monolith',
        title: 'Microservices vs Monolith',
        description:
          'Compare deployment models and learn when micro wins and when mono is just fine.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '🏢',
        steps: [],
      },
      {
        slug: 'design-url-shortener',
        title: 'Design: URL Shortener',
        description:
          'End-to-end design of a URL shortening service like bit.ly with high throughput.',
        difficulty: 'advanced',
        duration: '25 min',
        icon: '🔗',
        steps: [],
      },
      {
        slug: 'design-chat-application',
        title: 'Design: Chat Application',
        description:
          'Build a real-time messaging system with WebSockets, presence, and message storage.',
        difficulty: 'advanced',
        duration: '30 min',
        icon: '💬',
        steps: [],
      },
      {
        slug: 'design-instagram',
        title: 'Design: Instagram',
        description:
          'Design a photo-sharing platform with feeds, stories, and billions of uploads.',
        difficulty: 'advanced',
        duration: '30 min',
        icon: '📸',
        steps: [],
      },
      {
        slug: 'design-twitter-feed',
        title: 'Design: Twitter Feed',
        description:
          'Build a news feed system that handles fan-out, ranking, and real-time updates.',
        difficulty: 'advanced',
        duration: '30 min',
        icon: '🐦',
        steps: [],
      },
      {
        slug: 'design-uber',
        title: 'Design: Uber',
        description:
          'Architect a ride-sharing platform with real-time location, matching, and ETA.',
        difficulty: 'advanced',
        duration: '35 min',
        icon: '🚗',
        steps: [],
      },
      {
        slug: 'design-netflix-streaming',
        title: 'Design: Netflix Streaming',
        description:
          'Design a video streaming platform with adaptive bitrate, CDN, and recommendations.',
        difficulty: 'advanced',
        duration: '35 min',
        icon: '🎬',
        steps: [],
      },
    ],
  },
  {
    slug: 'oops',
    name: 'Object-Oriented Programming',
    description:
      'Master OOP fundamentals, SOLID principles, and classic design patterns with real-world examples.',
    icon: '🧱',
    color: 'amber',
    lessons: [
      {
        slug: 'what-is-oop',
        title: 'What is OOP?',
        description:
          'A gentle introduction to object-oriented thinking and why it matters.',
        difficulty: 'beginner',
        duration: '10 min',
        icon: '🧠',
        steps: [],
      },
      {
        slug: 'classes-and-objects',
        title: 'Classes & Objects',
        description:
          'Learn the building blocks — blueprints (classes) and instances (objects).',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '🏭',
        steps: [],
      },
      {
        slug: 'encapsulation',
        title: 'Encapsulation',
        description:
          'Hide internal details and expose only what is necessary through public interfaces.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '📦',
        steps: [],
      },
      {
        slug: 'inheritance',
        title: 'Inheritance',
        description:
          'Reuse and extend behavior by building class hierarchies.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '🌳',
        steps: [],
      },
      {
        slug: 'polymorphism',
        title: 'Polymorphism',
        description:
          'Write code that works with objects of many types through a single interface.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🎭',
        steps: [],
      },
      {
        slug: 'abstraction',
        title: 'Abstraction',
        description:
          'Model complex systems by focusing on what an object does, not how it does it.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🎨',
        steps: [],
      },
      {
        slug: 'interfaces-and-abstract-classes',
        title: 'Interfaces & Abstract Classes',
        description:
          'Define contracts that classes must fulfill — and know when to use which.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '📜',
        steps: [],
      },
      {
        slug: 'solid-principles',
        title: 'SOLID Principles',
        description:
          'The five principles that make object-oriented code maintainable and extensible.',
        difficulty: 'intermediate',
        duration: '25 min',
        icon: '🏗️',
        steps: [],
      },
      {
        slug: 'design-pattern-singleton-factory',
        title: 'Design Pattern: Singleton & Factory',
        description:
          'Control object creation with two of the most commonly used creational patterns.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '🏭',
        steps: [],
      },
      {
        slug: 'design-pattern-observer-strategy',
        title: 'Design Pattern: Observer & Strategy',
        description:
          'Decouple behavior with event-driven and strategy-based approaches.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '👀',
        steps: [],
      },
      {
        slug: 'design-pattern-builder-adapter',
        title: 'Design Pattern: Builder & Adapter',
        description:
          'Construct complex objects step-by-step and bridge incompatible interfaces.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '🔧',
        steps: [],
      },
      {
        slug: 'composition-over-inheritance',
        title: 'Composition over Inheritance',
        description:
          'Why "has-a" often beats "is-a" and how to refactor towards composition.',
        difficulty: 'advanced',
        duration: '15 min',
        icon: '🧩',
        steps: [],
      },
      {
        slug: 'design-parking-lot-system',
        title: 'Design: Parking Lot System',
        description:
          'A classic OOP design exercise — model spots, vehicles, tickets, and payments.',
        difficulty: 'advanced',
        duration: '25 min',
        icon: '🅿️',
        steps: [],
      },
      {
        slug: 'design-atm-machine',
        title: 'Design: ATM Machine',
        description:
          'Design an ATM with accounts, transactions, and state management.',
        difficulty: 'advanced',
        duration: '25 min',
        icon: '🏧',
        steps: [],
      },
    ],
  },
  {
    slug: 'multithreading',
    name: 'Multithreading',
    description:
      'Understand threads, synchronization primitives, and classic concurrency problems from the ground up.',
    icon: '⚡',
    color: 'red',
    lessons: [
      {
        slug: 'what-is-a-thread',
        title: 'What is a Thread?',
        description:
          'The smallest unit of execution — what threads are and why we use them.',
        difficulty: 'beginner',
        duration: '10 min',
        icon: '🧵',
        steps: [],
      },
      {
        slug: 'process-vs-thread',
        title: 'Process vs Thread',
        description:
          'Understand the key differences between processes and threads in memory and scheduling.',
        difficulty: 'beginner',
        duration: '10 min',
        icon: '⚙️',
        steps: [],
      },
      {
        slug: 'creating-threads',
        title: 'Creating Threads',
        description:
          'Spawn and manage threads in Java, Python, and C++ with hands-on examples.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '🚀',
        steps: [],
      },
      {
        slug: 'race-conditions',
        title: 'Race Conditions',
        description:
          'See how shared mutable state leads to bugs and learn to identify race conditions.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🏎️',
        steps: [],
      },
      {
        slug: 'mutex-and-locks',
        title: 'Mutex & Locks',
        description:
          'Protect critical sections with mutual exclusion using mutexes and lock guards.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🔐',
        steps: [],
      },
      {
        slug: 'deadlock',
        title: 'Deadlock',
        description:
          'Understand how deadlocks happen, detect them, and prevent them with ordering strategies.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🔄',
        steps: [],
      },
      {
        slug: 'semaphores',
        title: 'Semaphores',
        description:
          'Control access to a limited number of resources with counting and binary semaphores.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🚦',
        steps: [],
      },
      {
        slug: 'producer-consumer-pattern',
        title: 'Producer-Consumer Pattern',
        description:
          'Coordinate producers and consumers with bounded buffers and condition variables.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '📦',
        steps: [],
      },
      {
        slug: 'thread-pools',
        title: 'Thread Pools',
        description:
          'Reuse threads efficiently to handle many tasks without the overhead of creation.',
        difficulty: 'advanced',
        duration: '15 min',
        icon: '🏊',
        steps: [],
      },
      {
        slug: 'concurrent-data-structures',
        title: 'Concurrent Data Structures',
        description:
          'Use thread-safe maps, queues, and lists without rolling your own synchronization.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '🗃️',
        steps: [],
      },
      {
        slug: 'async-await-and-futures',
        title: 'Async/Await & Futures',
        description:
          'Write non-blocking concurrent code with async/await, promises, and futures.',
        difficulty: 'advanced',
        duration: '15 min',
        icon: '⏳',
        steps: [],
      },
      {
        slug: 'classic-dining-philosophers',
        title: 'Classic: Dining Philosophers',
        description:
          'Solve the famous concurrency problem and learn resource ordering strategies.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '🍝',
        steps: [],
      },
    ],
  },
];

// ── Populate lessons from content files ────────────────────────────────
// Content is in separate files to keep this file manageable

function populateLessons(topicSlug: string, contentMap: Record<string, { steps: LessonStep[]; commonMistakes?: { mistake: string; explanation: string }[]; practiceQuestions?: string[] }>) {
  const topic = topics.find(t => t.slug === topicSlug);
  if (!topic) return;
  for (const lesson of topic.lessons) {
    const content = contentMap[lesson.slug];
    if (content) {
      lesson.steps = content.steps;
      if (content.commonMistakes) lesson.commonMistakes = content.commonMistakes;
      if (content.practiceQuestions) lesson.practiceQuestions = content.practiceQuestions;
    }
  }
}

// Import content from separate files
import { databaseLessons } from '@/data/databases-content';
import { oopsLessons } from '@/data/oops-content';

populateLessons('databases', databaseLessons);
populateLessons('oops', oopsLessons);

import { systemDesignLessons } from '@/data/system-design-content';

populateLessons('system-design', systemDesignLessons);

import { multithreadingLessons } from '@/data/multithreading-content';

populateLessons('multithreading', multithreadingLessons);
