-- Seed roadmap categories
INSERT INTO roadmap_categories (name, slug, icon, color, position) VALUES
  ('Coding & Tech', 'coding-tech', '🖥️', 'emerald', 1),
  ('Fitness & Health', 'fitness-health', '💪', 'blue', 2),
  ('Learning & Reading', 'learning-reading', '📚', 'amber', 3),
  ('Custom', 'custom', '✨', 'purple', 4),
  ('Languages', 'languages', '🌍', 'cyan', 5),
  ('Personal Growth', 'personal-growth', '🌱', 'rose', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CODING & TECH TEMPLATES
-- ============================================================

-- DSA Patterns (30 days)
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'coding-tech'),
  'DSA Patterns (30 Days)',
  'dsa-patterns-30',
  'Master 19 essential DSA patterns with review days. Covers two pointers, sliding window, trees, graphs, DP, and more.',
  '🧩', 'emerald', 30, 'intermediate', true
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 1, 'Two Pointers', 'Learn the two pointers pattern for array problems', 'pattern', '/patterns/two-pointers', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 2, 'Sliding Window', 'Master the sliding window technique for subarray problems', 'pattern', '/patterns/sliding-window', 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 3, 'Review Day — Two Pointers + Sliding Window', 'Practice problems using Two Pointers and Sliding Window', 'review', NULL, 3),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 4, 'Fast & Slow Pointers', 'Detect cycles and find middle elements with two-speed pointers', 'pattern', '/patterns/fast-slow-pointers', 4),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 5, 'Merge Intervals', 'Learn to merge and handle overlapping intervals', 'pattern', '/patterns/merge-intervals', 5),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 6, 'Review Day — Fast & Slow Pointers + Merge Intervals', 'Practice problems from days 4-5', 'review', NULL, 6),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 7, 'Binary Search', 'Master binary search and its variations', 'pattern', '/patterns/binary-search', 7),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 8, 'Prefix Sum', 'Learn prefix sums for range query problems', 'pattern', '/patterns/prefix-sum', 8),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 9, 'Review Day — Binary Search + Prefix Sum', 'Practice problems from days 7-8', 'review', NULL, 9),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 10, 'Cyclic Sort', 'Sort elements in-place when values are in a known range', 'pattern', '/patterns/cyclic-sort', 10),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 11, 'BFS (Breadth-First Search)', 'Explore graphs and trees level by level', 'pattern', '/patterns/bfs', 11),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 12, 'DFS (Depth-First Search)', 'Traverse graphs and trees depth-first', 'pattern', '/patterns/dfs', 12),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 13, 'Review Day — Cyclic Sort + BFS + DFS', 'Practice graph and sort problems', 'review', NULL, 13),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 14, 'Backtracking', 'Solve constraint satisfaction problems with backtracking', 'pattern', '/patterns/backtracking', 14),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 15, 'Topological Sort', 'Order tasks with dependencies using topological sort', 'pattern', '/patterns/topological-sort', 15),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 16, 'Review Day — Backtracking + Topological Sort', 'Practice problems from days 14-15', 'review', NULL, 16),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 17, 'DP — 0/1 Knapsack', 'Learn the classic knapsack dynamic programming pattern', 'pattern', '/patterns/dp-knapsack', 17),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 18, 'DP — Longest Increasing Subsequence', 'Master LIS and related DP problems', 'pattern', '/patterns/dp-lis', 18),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 19, 'DP — Longest Common Subsequence', 'Learn LCS for string comparison problems', 'pattern', '/patterns/dp-lcs', 19),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 20, 'Review Day — Dynamic Programming', 'Practice all three DP patterns', 'review', NULL, 20),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 21, 'Monotonic Stack', 'Use monotonic stacks for next greater/smaller element problems', 'pattern', '/patterns/monotonic-stack', 21),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 22, 'Two Heaps', 'Maintain running medians and balanced data with two heaps', 'pattern', '/patterns/two-heaps', 22),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 23, 'Review Day — Monotonic Stack + Two Heaps', 'Practice problems from days 21-22', 'review', NULL, 23),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 24, 'Trie', 'Build and traverse trie data structures for string problems', 'pattern', '/patterns/trie', 24),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 25, 'Union Find', 'Use disjoint set union for connected component problems', 'pattern', '/patterns/union-find', 25),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 26, 'Bit Manipulation', 'Solve problems using bitwise operations', 'pattern', '/patterns/bit-manipulation', 26),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 27, 'Review Day — Trie + Union Find + Bit Manipulation', 'Practice problems from days 24-26', 'review', NULL, 27),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 28, 'Mock Interview #1', 'Simulate a real interview using patterns from weeks 1-2', 'review', NULL, 28),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 29, 'Mock Interview #2', 'Simulate a real interview using patterns from weeks 3-4', 'review', NULL, 29),
  ((SELECT id FROM roadmap_templates WHERE slug = 'dsa-patterns-30'), 30, 'Final Review — All 19 Patterns', 'Comprehensive review of every pattern', 'review', NULL, 30);

-- Learn Databases (14 days) — maps to 13 lessons + 1 review
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'coding-tech'),
  'Learn Databases (14 Days)',
  'learn-databases',
  'From SQL basics to sharding, replication, and CAP theorem. Master databases in two weeks.',
  '🗄️', 'cyan', 14, 'beginner', true
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 1, 'What is a Database?', 'Understand what databases are and why they matter', 'lesson', '/learn/databases/what-is-a-database', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 2, 'SQL Basics — SELECT, WHERE, ORDER BY', 'Write your first SQL queries', 'lesson', '/learn/databases/sql-basics-select-where-order-by', 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 3, 'Joins — Connecting Tables', 'Learn INNER, LEFT, RIGHT, and FULL joins', 'lesson', '/learn/databases/joins-connecting-tables', 3),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 4, 'Indexing — Making Queries Fast', 'Understand how indexes speed up queries', 'lesson', '/learn/databases/indexing-making-queries-fast', 4),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 5, 'Normalization — Organizing Data', 'Learn 1NF, 2NF, 3NF and why they matter', 'lesson', '/learn/databases/normalization-organizing-data', 5),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 6, 'Transactions & ACID Properties', 'Understand atomicity, consistency, isolation, durability', 'lesson', '/learn/databases/transactions-acid-properties', 6),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 7, 'Isolation Levels', 'Learn read committed, repeatable read, serializable', 'lesson', '/learn/databases/isolation-levels', 7),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 8, 'Query Optimization', 'Optimize slow queries with EXPLAIN and best practices', 'lesson', '/learn/databases/query-optimization', 8),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 9, 'Sharding — Splitting Data Across Servers', 'Learn horizontal partitioning strategies', 'lesson', '/learn/databases/sharding-splitting-data-across-servers', 9),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 10, 'Replication — Copies for Safety', 'Understand master-slave and multi-master replication', 'lesson', '/learn/databases/replication-copies-for-safety', 10),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 11, 'CAP Theorem', 'Understand the tradeoffs between consistency, availability, and partition tolerance', 'lesson', '/learn/databases/cap-theorem', 11),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 12, 'SQL vs NoSQL', 'Compare relational and non-relational databases', 'lesson', '/learn/databases/sql-vs-nosql', 12),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 13, 'Database Design Patterns', 'Learn common patterns for database schema design', 'lesson', '/learn/databases/database-design-patterns', 13),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-databases'), 14, 'Final Review — Databases', 'Review all database concepts and test your knowledge', 'review', NULL, 14);

-- Learn System Design (17 days)
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'coding-tech'),
  'Learn System Design (17 Days)',
  'learn-system-design',
  'From client-server basics to designing Netflix. Cover load balancing, caching, microservices, and real system designs.',
  '🏗️', 'violet', 17, 'intermediate', true
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 1, 'What is System Design?', 'Introduction to system design interviews and thinking', 'lesson', '/learn/system-design/what-is-system-design', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 2, 'Client-Server Architecture', 'Understand how clients and servers communicate', 'lesson', '/learn/system-design/client-server-architecture', 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 3, 'Load Balancing', 'Distribute traffic across multiple servers', 'lesson', '/learn/system-design/load-balancing', 3),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 4, 'Caching — Speed Up Everything', 'Use caching at every layer for performance', 'lesson', '/learn/system-design/caching-speed-up-everything', 4),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 5, 'CDN — Content Closer to Users', 'Deliver static content from edge locations', 'lesson', '/learn/system-design/cdn-content-closer-to-users', 5),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 6, 'Message Queues', 'Decouple services with asynchronous messaging', 'lesson', '/learn/system-design/message-queues', 6),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 7, 'Database Scaling', 'Scale databases with replication and sharding', 'lesson', '/learn/system-design/database-scaling', 7),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 8, 'API Design', 'Design clean, consistent REST and GraphQL APIs', 'lesson', '/learn/system-design/api-design', 8),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 9, 'Rate Limiting', 'Protect services from abuse with rate limiters', 'lesson', '/learn/system-design/rate-limiting', 9),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 10, 'Consistent Hashing', 'Distribute data evenly across nodes', 'lesson', '/learn/system-design/consistent-hashing', 10),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 11, 'Microservices vs Monolith', 'Choose the right architecture for your system', 'lesson', '/learn/system-design/microservices-vs-monolith', 11),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 12, 'Design: URL Shortener', 'Design a URL shortening service like bit.ly', 'lesson', '/learn/system-design/design-url-shortener', 12),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 13, 'Design: Chat Application', 'Design a real-time chat system like WhatsApp', 'lesson', '/learn/system-design/design-chat-application', 13),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 14, 'Design: Instagram', 'Design a photo-sharing social network', 'lesson', '/learn/system-design/design-instagram', 14),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 15, 'Design: Twitter Feed', 'Design a news feed system with fan-out', 'lesson', '/learn/system-design/design-twitter-feed', 15),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 16, 'Design: Uber', 'Design a ride-sharing platform', 'lesson', '/learn/system-design/design-uber', 16),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-system-design'), 17, 'Design: Netflix Streaming', 'Design a video streaming service', 'lesson', '/learn/system-design/design-netflix-streaming', 17);

-- Learn OOP (14 days)
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'coding-tech'),
  'Learn OOP (14 Days)',
  'learn-oops',
  'Object-Oriented Programming from basics to SOLID principles and design patterns. Includes real design exercises.',
  '🧱', 'orange', 14, 'beginner', false
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 1, 'What is OOP?', 'Understand the philosophy behind object-oriented programming', 'lesson', '/learn/oops/what-is-oop', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 2, 'Classes and Objects', 'Learn to define classes and create objects', 'lesson', '/learn/oops/classes-and-objects', 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 3, 'Encapsulation', 'Hide internal state and expose clean interfaces', 'lesson', '/learn/oops/encapsulation', 3),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 4, 'Inheritance', 'Reuse code through parent-child relationships', 'lesson', '/learn/oops/inheritance', 4),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 5, 'Polymorphism', 'Write flexible code with method overriding and overloading', 'lesson', '/learn/oops/polymorphism', 5),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 6, 'Abstraction', 'Simplify complex systems by hiding details', 'lesson', '/learn/oops/abstraction', 6),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 7, 'Interfaces and Abstract Classes', 'Define contracts and partial implementations', 'lesson', '/learn/oops/interfaces-and-abstract-classes', 7),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 8, 'SOLID Principles', 'Master the five principles of clean OO design', 'lesson', '/learn/oops/solid-principles', 8),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 9, 'Design Pattern: Singleton & Factory', 'Create objects with creational patterns', 'lesson', '/learn/oops/design-pattern-singleton-factory', 9),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 10, 'Design Pattern: Observer & Strategy', 'Decouple behavior with behavioral patterns', 'lesson', '/learn/oops/design-pattern-observer-strategy', 10),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 11, 'Design Pattern: Builder & Adapter', 'Construct and adapt objects with structural patterns', 'lesson', '/learn/oops/design-pattern-builder-adapter', 11),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 12, 'Composition Over Inheritance', 'Prefer composition for flexible designs', 'lesson', '/learn/oops/composition-over-inheritance', 12),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 13, 'Design: Parking Lot System', 'Apply OOP to design a parking management system', 'lesson', '/learn/oops/design-parking-lot-system', 13),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-oops'), 14, 'Design: ATM Machine', 'Apply OOP to design an ATM system', 'lesson', '/learn/oops/design-atm-machine', 14);

-- Learn Multithreading (12 days)
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'coding-tech'),
  'Learn Multithreading (12 Days)',
  'learn-multithreading',
  'Threads, locks, deadlocks, and concurrent patterns. From basics to the Dining Philosophers problem.',
  '🔄', 'rose', 12, 'intermediate', false
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 1, 'What is a Thread?', 'Understand threads and why concurrency matters', 'lesson', '/learn/multithreading/what-is-a-thread', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 2, 'Process vs Thread', 'Compare processes and threads, when to use each', 'lesson', '/learn/multithreading/process-vs-thread', 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 3, 'Creating Threads', 'Learn to create and manage threads in code', 'lesson', '/learn/multithreading/creating-threads', 3),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 4, 'Race Conditions', 'Identify and prevent race conditions', 'lesson', '/learn/multithreading/race-conditions', 4),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 5, 'Mutex and Locks', 'Protect shared resources with mutual exclusion', 'lesson', '/learn/multithreading/mutex-and-locks', 5),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 6, 'Deadlock', 'Understand, detect, and prevent deadlocks', 'lesson', '/learn/multithreading/deadlock', 6),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 7, 'Semaphores', 'Control access to resources with counting semaphores', 'lesson', '/learn/multithreading/semaphores', 7),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 8, 'Producer-Consumer Pattern', 'Implement the classic producer-consumer with queues', 'lesson', '/learn/multithreading/producer-consumer-pattern', 8),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 9, 'Thread Pools', 'Manage thread lifecycles efficiently with pools', 'lesson', '/learn/multithreading/thread-pools', 9),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 10, 'Concurrent Data Structures', 'Use thread-safe collections and atomic operations', 'lesson', '/learn/multithreading/concurrent-data-structures', 10),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 11, 'Async/Await and Futures', 'Write asynchronous code without callback hell', 'lesson', '/learn/multithreading/async-await-and-futures', 11),
  ((SELECT id FROM roadmap_templates WHERE slug = 'learn-multithreading'), 12, 'Classic: Dining Philosophers', 'Solve the classic concurrency problem', 'lesson', '/learn/multithreading/classic-dining-philosophers', 12);

-- ============================================================
-- FITNESS & HEALTH TEMPLATES
-- ============================================================

-- Go to Gym (30 days)
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'fitness-health'),
  'Go to Gym (30 Days)',
  'gym-daily-30',
  'Build a consistent gym habit over 30 days. Just show up and complete your workout.',
  '🏋️', 'blue', 30, 'beginner', true
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position)
SELECT
  (SELECT id FROM roadmap_templates WHERE slug = 'gym-daily-30'),
  d.n,
  'Day ' || d.n || ' — Complete your workout',
  CASE
    WHEN d.n = 1 THEN 'First day! Just show up and do what you can. Consistency over intensity.'
    WHEN d.n % 7 = 0 THEN 'Rest day or light stretching. Recovery is part of the process.'
    WHEN d.n = 15 THEN 'Halfway there! You''re building a real habit now.'
    WHEN d.n = 30 THEN 'Final day! You made it. 30 days of consistent gym attendance.'
    ELSE 'Complete your workout today. Any movement counts.'
  END,
  'checkin', NULL, d.n
FROM generate_series(1, 30) AS d(n);

-- 10K Steps (30 days)
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'fitness-health'),
  '10K Steps (30 Days)',
  '10k-steps-30',
  'Walk 10,000 steps every day for 30 days. A simple habit that transforms your health.',
  '🚶', 'green', 30, 'beginner', false
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position)
SELECT
  (SELECT id FROM roadmap_templates WHERE slug = '10k-steps-30'),
  d.n,
  'Day ' || d.n || ' — Walk 10,000 steps',
  CASE
    WHEN d.n = 1 THEN 'Track your steps today. 10,000 is roughly 5 miles / 8 km.'
    WHEN d.n = 7 THEN 'One week done! Your body is adjusting to the daily walking.'
    WHEN d.n = 14 THEN 'Two weeks! Walking should feel natural by now.'
    WHEN d.n = 30 THEN 'You did it! 300,000 steps in a month.'
    ELSE 'Walk 10,000 steps today. Take the stairs, walk during calls, explore your neighborhood.'
  END,
  'checkin', NULL, d.n
FROM generate_series(1, 30) AS d(n);

-- Quit Smoking (90 days)
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'fitness-health'),
  'Quit Smoking (90 Days)',
  'quit-smoking',
  'A milestone-based 90-day plan to quit smoking. Track your smoke-free days and celebrate progress.',
  '🚭', 'red', 90, 'advanced', true
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position)
SELECT
  (SELECT id FROM roadmap_templates WHERE slug = 'quit-smoking'),
  d.n,
  CASE
    WHEN d.n = 1 THEN 'Day 1 — Your quit day'
    WHEN d.n = 2 THEN 'Day 2 — Stay strong'
    WHEN d.n = 3 THEN 'Day 3 — Milestone: 72 hours smoke-free!'
    WHEN d.n = 7 THEN 'Day 7 — One week milestone!'
    WHEN d.n = 14 THEN 'Day 14 — Two weeks smoke-free!'
    WHEN d.n = 21 THEN 'Day 21 — Three weeks! Habit breaking zone.'
    WHEN d.n = 30 THEN 'Day 30 — One month smoke-free!'
    WHEN d.n = 60 THEN 'Day 60 — Two months! Lungs are healing.'
    WHEN d.n = 90 THEN 'Day 90 — You made it! 90 days smoke-free.'
    ELSE 'Day ' || d.n || ' — Stay smoke-free'
  END,
  CASE
    WHEN d.n = 1 THEN 'This is your first day without smoking. Throw away all cigarettes and lighters. You can do this.'
    WHEN d.n = 3 THEN 'Nicotine is leaving your body. The worst physical cravings should peak around now.'
    WHEN d.n = 7 THEN 'One week! Your sense of taste and smell are improving. Keep going.'
    WHEN d.n = 14 THEN 'Two weeks without smoking. Cravings are becoming less frequent.'
    WHEN d.n = 30 THEN 'One month! Your lung function is already improving. Be proud.'
    WHEN d.n = 60 THEN 'Two months! Risk of heart attack is starting to drop.'
    WHEN d.n = 90 THEN 'Three months smoke-free! You have broken the habit. Your body thanks you.'
    ELSE 'Stay smoke-free today. If cravings hit, take deep breaths, drink water, or go for a walk.'
  END,
  'checkin', NULL, d.n
FROM generate_series(1, 90) AS d(n);

-- 30-Day Meditation
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'fitness-health'),
  '30-Day Meditation',
  'meditation-30',
  'Build a meditation practice from 5 minutes to 20 minutes over 30 days.',
  '🧘', 'indigo', 30, 'beginner', false
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position)
SELECT
  (SELECT id FROM roadmap_templates WHERE slug = 'meditation-30'),
  d.n,
  'Day ' || d.n || ' — Meditate for ' ||
    CASE
      WHEN d.n <= 7 THEN '5'
      WHEN d.n <= 14 THEN '10'
      WHEN d.n <= 21 THEN '15'
      ELSE '20'
    END || ' minutes',
  CASE
    WHEN d.n = 1 THEN 'Find a quiet spot. Set a timer for 5 minutes. Focus on your breath. When your mind wanders, gently bring it back.'
    WHEN d.n = 8 THEN 'Increasing to 10 minutes today. You''ve built the foundation, now deepen your practice.'
    WHEN d.n = 15 THEN 'Moving to 15 minutes. Try body scan meditation — notice sensations from head to toe.'
    WHEN d.n = 22 THEN 'Full 20 minutes today. You''re becoming a meditator. Try loving-kindness meditation.'
    WHEN d.n = 30 THEN 'Final day! 20 minutes of meditation. You''ve built a powerful daily habit.'
    ELSE 'Complete your meditation session. Sit comfortably, close your eyes, and breathe.'
  END,
  'checkin', NULL, d.n
FROM generate_series(1, 30) AS d(n);

-- ============================================================
-- LEARNING & READING TEMPLATES
-- ============================================================

-- Read 1 Book/Month (30 days)
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'learning-reading'),
  'Read 1 Book/Month (30 Days)',
  'read-book-month',
  'Read at least 20 pages daily to finish one book per month. Track your reading habit.',
  '📖', 'amber', 30, 'beginner', true
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position)
SELECT
  (SELECT id FROM roadmap_templates WHERE slug = 'read-book-month'),
  d.n,
  CASE
    WHEN d.n = 1 THEN 'Day 1 — Pick your book and read 20+ pages'
    WHEN d.n = 10 THEN 'Day 10 — You should be ~200 pages in!'
    WHEN d.n = 20 THEN 'Day 20 — Past the halfway mark'
    WHEN d.n = 30 THEN 'Day 30 — Finish the book!'
    ELSE 'Day ' || d.n || ' — Read 20+ pages'
  END,
  CASE
    WHEN d.n = 1 THEN 'Choose a book you''ve been wanting to read. Read at least 20 pages today. Set a recurring time — morning or before bed works best.'
    WHEN d.n = 15 THEN 'Halfway through the month! Write down your favorite quote or idea from the book so far.'
    WHEN d.n = 30 THEN 'Last day! Finish your book and reflect on what you learned. Pick your next book to keep the momentum.'
    ELSE 'Read at least 20 pages today. Find your quiet reading time and stick to it.'
  END,
  'checkin', NULL, d.n
FROM generate_series(1, 30) AS d(n);

-- 100 Days of Code
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'learning-reading'),
  '100 Days of Code',
  '100-days-of-code',
  'Code for at least 1 hour every day for 100 days. The classic challenge to build coding consistency.',
  '💻', 'emerald', 100, 'intermediate', true
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position)
SELECT
  (SELECT id FROM roadmap_templates WHERE slug = '100-days-of-code'),
  d.n,
  CASE
    WHEN d.n = 1 THEN 'Day 1 — Start your 100 Days of Code journey'
    WHEN d.n = 25 THEN 'Day 25 — Quarter way through!'
    WHEN d.n = 50 THEN 'Day 50 — Halfway milestone!'
    WHEN d.n = 75 THEN 'Day 75 — Three quarters done!'
    WHEN d.n = 100 THEN 'Day 100 — You made it!'
    ELSE 'Day ' || d.n || ' — Code for 1+ hour'
  END,
  CASE
    WHEN d.n = 1 THEN 'Start your journey! Code for at least 1 hour today. Pick a project or tutorial to work on.'
    WHEN d.n = 50 THEN 'Halfway! Look back at Day 1 and see how far you''ve come. You''re a different coder now.'
    WHEN d.n = 100 THEN 'Congratulations! 100 days of consistent coding. You''ve built discipline and skills that last.'
    ELSE 'Code for at least 1 hour today. Work on projects, tutorials, or open source contributions.'
  END,
  'checkin', NULL, d.n
FROM generate_series(1, 100) AS d(n);

-- Daily Journal (30 days)
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'learning-reading'),
  'Daily Journal (30 Days)',
  'daily-journal-30',
  'Build a journaling habit with daily prompts. Reflect, plan, and grow every day.',
  '📝', 'rose', 30, 'beginner', false
);

INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 1, 'Day 1 — What are 3 things you''re grateful for?', 'Start your journaling practice with gratitude', 'checkin', NULL, 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 2, 'Day 2 — Describe your ideal day', 'What does a perfect day look like for you?', 'checkin', NULL, 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 3, 'Day 3 — What''s one habit you want to build?', 'Identify a positive habit and write why it matters', 'checkin', NULL, 3),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 4, 'Day 4 — Write about a challenge you overcame', 'Reflect on your resilience', 'checkin', NULL, 4),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 5, 'Day 5 — What are your top 3 priorities right now?', 'Clarify what matters most', 'checkin', NULL, 5),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 6, 'Day 6 — Letter to your future self', 'Write a letter to yourself 1 year from now', 'checkin', NULL, 6),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 7, 'Day 7 — Weekly reflection', 'What went well this week? What could improve?', 'checkin', NULL, 7),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 8, 'Day 8 — What''s something new you learned recently?', 'Document your learning', 'checkin', NULL, 8),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 9, 'Day 9 — Describe a person who inspires you', 'What qualities do they have that you admire?', 'checkin', NULL, 9),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 10, 'Day 10 — What would you do if you couldn''t fail?', 'Dream big without limits', 'checkin', NULL, 10),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 11, 'Day 11 — What''s draining your energy?', 'Identify energy drains and brainstorm solutions', 'checkin', NULL, 11),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 12, 'Day 12 — List 5 things that make you happy', 'Focus on positive experiences', 'checkin', NULL, 12),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 13, 'Day 13 — What''s a skill you want to develop?', 'Plan your learning journey', 'checkin', NULL, 13),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 14, 'Day 14 — Weekly reflection', 'Review week 2 progress and insights', 'checkin', NULL, 14),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 15, 'Day 15 — Halfway check-in', 'How has journaling affected your mindset?', 'checkin', NULL, 15),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 16, 'Day 16 — What boundaries do you need to set?', 'Identify areas where you need better boundaries', 'checkin', NULL, 16),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 17, 'Day 17 — Describe your morning routine', 'Is it serving you well? What would you change?', 'checkin', NULL, 17),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 18, 'Day 18 — What''s a fear you want to overcome?', 'Face a fear by writing about it', 'checkin', NULL, 18),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 19, 'Day 19 — Write about a turning point in your life', 'What moment changed your direction?', 'checkin', NULL, 19),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 20, 'Day 20 — What advice would you give your younger self?', 'Wisdom from experience', 'checkin', NULL, 20),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 21, 'Day 21 — Weekly reflection', 'Review week 3 insights and growth', 'checkin', NULL, 21),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 22, 'Day 22 — What does success mean to you?', 'Define success on your own terms', 'checkin', NULL, 22),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 23, 'Day 23 — List your accomplishments this year', 'Celebrate your wins, big and small', 'checkin', NULL, 23),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 24, 'Day 24 — What''s one thing you''d change about the world?', 'Think about your values and impact', 'checkin', NULL, 24),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 25, 'Day 25 — Write about a relationship that matters', 'Express gratitude for someone important', 'checkin', NULL, 25),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 26, 'Day 26 — What''s your biggest takeaway from journaling?', 'Reflect on the journaling process itself', 'checkin', NULL, 26),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 27, 'Day 27 — Plan your next month', 'Set intentions and goals for the coming month', 'checkin', NULL, 27),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 28, 'Day 28 — Weekly reflection', 'Final weekly review', 'checkin', NULL, 28),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 29, 'Day 29 — Write a commitment letter to yourself', 'Commit to continuing journaling or another habit', 'checkin', NULL, 29),
  ((SELECT id FROM roadmap_templates WHERE slug = 'daily-journal-30'), 30, 'Day 30 — Final reflection', 'Review your entire 30-day journey. How have you grown?', 'checkin', NULL, 30);
