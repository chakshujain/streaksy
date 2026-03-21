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
    slug: 'frontend-dev',
    name: 'Frontend Development',
    description:
      'From HTML basics to deploying a React app — build real UIs with modern tools and best practices.',
    icon: '🎨',
    color: 'cyan',
    lessons: [
      {
        slug: 'html-fundamentals',
        title: 'HTML Fundamentals',
        description:
          'Elements, semantic HTML, forms, and accessibility — the skeleton of every web page.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '🦴',
        steps: [],
      },
      {
        slug: 'css-basics',
        title: 'CSS Basics',
        description:
          'Selectors, the box model, Flexbox, and Grid — make things look beautiful and responsive.',
        difficulty: 'beginner',
        duration: '20 min',
        icon: '🎨',
        steps: [],
      },
      {
        slug: 'javascript-essentials',
        title: 'JavaScript Essentials',
        description:
          'Variables, functions, DOM manipulation, and events — bring your pages to life.',
        difficulty: 'beginner',
        duration: '20 min',
        icon: '⚡',
        steps: [],
      },
      {
        slug: 'responsive-design',
        title: 'Responsive Design',
        description:
          'Media queries, mobile-first approach, breakpoints, and fluid typography.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '📱',
        steps: [],
      },
      {
        slug: 'react-basics',
        title: 'React Basics',
        description:
          'Components, JSX, props, state, and the render cycle — thinking in React.',
        difficulty: 'intermediate',
        duration: '20 min',
        icon: '⚛️',
        steps: [],
      },
      {
        slug: 'react-state-and-effects',
        title: 'React State & Effects',
        description:
          'useState, useEffect, the dependency array, lifecycle, and custom hooks.',
        difficulty: 'intermediate',
        duration: '20 min',
        icon: '🔄',
        steps: [],
      },
      {
        slug: 'api-integration',
        title: 'API Integration',
        description:
          'Fetch, async/await, loading states, error handling, and authentication headers.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🔌',
        steps: [],
      },
      {
        slug: 'build-and-deploy',
        title: 'Build & Deploy',
        description:
          'Vite, bundling, environment variables, and deploying to Vercel or Netlify.',
        difficulty: 'advanced',
        duration: '15 min',
        icon: '🚀',
        steps: [],
      },
    ],
  },
  {
    slug: 'backend-dev',
    name: 'Backend Development',
    description:
      'Build APIs, connect databases, handle auth, and deploy — the full backend journey with Node.js and Express.',
    icon: '⚙️',
    color: 'emerald',
    lessons: [
      {
        slug: 'what-is-a-server',
        title: 'What is a Server?',
        description:
          'The client-server model, HTTP methods, status codes, and the request lifecycle.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '🖥️',
        steps: [],
      },
      {
        slug: 'nodejs-and-express',
        title: 'Node.js & Express',
        description:
          'Setup, routing, middleware pipeline, and error handling with Express.js.',
        difficulty: 'beginner',
        duration: '20 min',
        icon: '🟢',
        steps: [],
      },
      {
        slug: 'rest-api-design',
        title: 'REST API Design',
        description:
          'CRUD operations, status codes, pagination, versioning, and best practices.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '📐',
        steps: [],
      },
      {
        slug: 'database-integration',
        title: 'Database Integration',
        description:
          'SQL with PostgreSQL, connection pools, JOINs, and ORM vs raw SQL trade-offs.',
        difficulty: 'intermediate',
        duration: '20 min',
        icon: '🗄️',
        steps: [],
      },
      {
        slug: 'authentication',
        title: 'Authentication',
        description:
          'Password hashing, JWT tokens, sessions, OAuth 2.0, and role-based access control.',
        difficulty: 'intermediate',
        duration: '20 min',
        icon: '🔐',
        steps: [],
      },
      {
        slug: 'error-handling-and-validation',
        title: 'Error Handling & Validation',
        description:
          'Zod schemas, validation middleware, structured errors, and logging with Pino.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🛡️',
        steps: [],
      },
      {
        slug: 'file-uploads-and-storage',
        title: 'File Uploads & Storage',
        description:
          'Multer for uploads, S3 cloud storage, presigned URLs, and security best practices.',
        difficulty: 'advanced',
        duration: '15 min',
        icon: '📁',
        steps: [],
      },
      {
        slug: 'deployment',
        title: 'Deployment',
        description:
          'Docker, docker-compose, PM2, environment variables, and deployment platforms.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '🚀',
        steps: [],
      },
    ],
  },
  {
    slug: 'git-github',
    name: 'Git & GitHub Mastery',
    description:
      'From git init to advanced workflows — branching, PRs, rebasing, and team collaboration secrets.',
    icon: '🌿',
    color: 'zinc',
    lessons: [
      {
        slug: 'git-basics',
        title: 'Git Basics',
        description:
          'Init, add, commit, log, diff — the core Git workflow and the three areas.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '📝',
        steps: [],
      },
      {
        slug: 'branching-and-merging',
        title: 'Branching & Merging',
        description:
          'Create branches, fast-forward and three-way merges, and resolve conflicts.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '🌿',
        steps: [],
      },
      {
        slug: 'github-workflows',
        title: 'GitHub Workflows',
        description:
          'Pull requests, code review, issues, and branch protection rules.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🐙',
        steps: [],
      },
      {
        slug: 'advanced-git',
        title: 'Advanced Git',
        description:
          'Rebase, interactive rebase, cherry-pick, stash, and reflog recovery.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '🧙',
        steps: [],
      },
      {
        slug: 'team-collaboration',
        title: 'Team Collaboration',
        description:
          'Branching strategies, conventional commits, Git hooks, CI/CD, and the fork model.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '👥',
        steps: [],
      },
    ],
  },
  {
    slug: 'design-patterns',
    name: 'Design Patterns',
    description:
      'Master the essential Gang of Four patterns — creational, structural, and behavioral — with real-world examples and code.',
    icon: '🧬',
    color: 'teal',
    lessons: [
      {
        slug: 'what-are-design-patterns',
        title: 'What are Design Patterns?',
        description:
          'History, the Gang of Four, pattern categories, and why patterns matter for every developer.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '📖',
        steps: [],
      },
      {
        slug: 'singleton-pattern',
        title: 'Singleton Pattern',
        description:
          'Ensure a class has exactly one instance with global access — lazy init, thread safety, and trade-offs.',
        difficulty: 'beginner',
        duration: '15 min',
        icon: '1️⃣',
        steps: [],
      },
      {
        slug: 'factory-method-pattern',
        title: 'Factory Method Pattern',
        description:
          'Delegate object creation to subclasses without specifying the exact class to instantiate.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🏭',
        steps: [],
      },
      {
        slug: 'abstract-factory-pattern',
        title: 'Abstract Factory Pattern',
        description:
          'Create families of related objects that are guaranteed to be compatible with each other.',
        difficulty: 'intermediate',
        duration: '20 min',
        icon: '🏗️',
        steps: [],
      },
      {
        slug: 'builder-pattern',
        title: 'Builder Pattern',
        description:
          'Construct complex objects step by step with a fluent, readable API.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🔧',
        steps: [],
      },
      {
        slug: 'observer-pattern',
        title: 'Observer Pattern',
        description:
          'Define one-to-many dependencies so that when one object changes, all dependents are notified.',
        difficulty: 'intermediate',
        duration: '20 min',
        icon: '👀',
        steps: [],
      },
      {
        slug: 'strategy-pattern',
        title: 'Strategy Pattern',
        description:
          'Define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '♟️',
        steps: [],
      },
      {
        slug: 'decorator-pattern',
        title: 'Decorator Pattern',
        description:
          'Attach additional responsibilities to objects dynamically by wrapping them.',
        difficulty: 'intermediate',
        duration: '20 min',
        icon: '🎀',
        steps: [],
      },
      {
        slug: 'adapter-pattern',
        title: 'Adapter Pattern',
        description:
          'Convert the interface of a class into another interface that clients expect.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🔌',
        steps: [],
      },
      {
        slug: 'command-pattern',
        title: 'Command Pattern',
        description:
          'Encapsulate actions as objects to enable undo/redo, queuing, and logging of operations.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '📜',
        steps: [],
      },
      {
        slug: 'template-method-pattern',
        title: 'Template Method Pattern',
        description:
          'Define the skeleton of an algorithm in a base class, letting subclasses fill in specific steps.',
        difficulty: 'advanced',
        duration: '15 min',
        icon: '📋',
        steps: [],
      },
      {
        slug: 'state-pattern',
        title: 'State Pattern',
        description:
          'Allow an object to change its behavior when its internal state changes.',
        difficulty: 'advanced',
        duration: '20 min',
        icon: '🔀',
        steps: [],
      },
      {
        slug: 'facade-pattern',
        title: 'Facade Pattern',
        description:
          'Provide a simplified interface to a complex subsystem, hiding internal complexity.',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🏛️',
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
import { designPatternsLessons } from '@/data/design-patterns-content';

populateLessons('multithreading', multithreadingLessons);
populateLessons('design-patterns', designPatternsLessons);

import { frontendLessons } from '@/data/frontend-content';
import { backendLessons } from '@/data/backend-content';
import { gitLessons } from '@/data/git-content';

populateLessons('frontend-dev', frontendLessons);
populateLessons('backend-dev', backendLessons);
populateLessons('git-github', gitLessons);
