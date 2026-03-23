-- ============================================================
-- A. "Crack the Job Together" (90 days, flagship)
-- ============================================================
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'coding-tech'),
  'Crack the Job Together',
  'crack-the-job-together',
  'The ultimate 90-day interview prep roadmap. DSA patterns, databases, system design, OOP, multithreading, and 30+ LeetCode problems — all in one structured plan.',
  '🚀', 'indigo', 90, 'intermediate', true
) ON CONFLICT (slug) DO NOTHING;

-- Days 1-19: One DSA pattern per day
INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 1, 'Two Pointers', 'Learn the two pointers pattern for array problems', 'pattern', '/patterns/two-pointers', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 2, 'Sliding Window', 'Master the sliding window technique', 'pattern', '/patterns/sliding-window', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 3, 'Fast & Slow Pointers', 'Detect cycles and find midpoints', 'pattern', '/patterns/fast-slow-pointers', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 4, 'Merge Intervals', 'Handle overlapping intervals', 'pattern', '/patterns/merge-intervals', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 5, 'Binary Search', 'Master binary search variations', 'pattern', '/patterns/binary-search', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 6, 'Prefix Sum', 'Range query problems with prefix sums', 'pattern', '/patterns/prefix-sum', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 7, 'Cyclic Sort', 'In-place sorting for known-range values', 'pattern', '/patterns/cyclic-sort', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 8, 'BFS (Breadth-First Search)', 'Level-by-level graph/tree traversal', 'pattern', '/patterns/bfs', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 9, 'DFS (Depth-First Search)', 'Depth-first graph/tree traversal', 'pattern', '/patterns/dfs', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 10, 'Backtracking', 'Solve constraint satisfaction problems', 'pattern', '/patterns/backtracking', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 11, 'Topological Sort', 'Order tasks with dependencies', 'pattern', '/patterns/topological-sort', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 12, 'DP — 0/1 Knapsack', 'Classic knapsack dynamic programming', 'pattern', '/patterns/dp-knapsack', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 13, 'DP — Longest Increasing Subsequence', 'LIS and related DP problems', 'pattern', '/patterns/dp-lis', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 14, 'DP — Longest Common Subsequence', 'LCS for string comparison', 'pattern', '/patterns/dp-lcs', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 15, 'Monotonic Stack', 'Next greater/smaller element problems', 'pattern', '/patterns/monotonic-stack', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 16, 'Two Heaps', 'Running medians and balanced data', 'pattern', '/patterns/two-heaps', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 17, 'Trie', 'Trie data structures for string problems', 'pattern', '/patterns/trie', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 18, 'Union Find', 'Disjoint set union for connected components', 'pattern', '/patterns/union-find', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 19, 'Bit Manipulation', 'Solve problems with bitwise operations', 'pattern', '/patterns/bit-manipulation', 1);

-- Days 20-33: Database + System Design lessons
INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 20, 'What is a Database?', 'Understand databases and why they matter', 'lesson', '/learn/databases/what-is-a-database', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 21, 'SQL Basics', 'Write your first SQL queries', 'lesson', '/learn/databases/sql-basics-select-where-order-by', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 22, 'Joins — Connecting Tables', 'Learn INNER, LEFT, RIGHT, and FULL joins', 'lesson', '/learn/databases/joins-connecting-tables', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 23, 'Indexing & Normalization', 'Indexes and normal forms for efficient data', 'lesson', '/learn/databases/indexing-making-queries-fast', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 24, 'Transactions & ACID', 'Atomicity, consistency, isolation, durability', 'lesson', '/learn/databases/transactions-acid-properties', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 25, 'Sharding & Replication', 'Scale databases horizontally', 'lesson', '/learn/databases/sharding-splitting-data-across-servers', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 26, 'CAP Theorem & SQL vs NoSQL', 'Tradeoffs in distributed databases', 'lesson', '/learn/databases/cap-theorem', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 27, 'What is System Design?', 'Introduction to system design thinking', 'lesson', '/learn/system-design/what-is-system-design', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 28, 'Client-Server & Load Balancing', 'How clients and servers communicate at scale', 'lesson', '/learn/system-design/load-balancing', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 29, 'Caching & CDN', 'Speed up everything with caches and edge locations', 'lesson', '/learn/system-design/caching-speed-up-everything', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 30, 'Message Queues & API Design', 'Async messaging and clean API patterns', 'lesson', '/learn/system-design/message-queues', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 31, 'Rate Limiting & Consistent Hashing', 'Protect services and distribute data evenly', 'lesson', '/learn/system-design/rate-limiting', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 32, 'Database Scaling', 'Replication, sharding, and read replicas', 'lesson', '/learn/system-design/database-scaling', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 33, 'Microservices vs Monolith', 'Choose the right architecture', 'lesson', '/learn/system-design/microservices-vs-monolith', 1);

-- Days 34-47: OOP + Multithreading lessons
INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 34, 'What is OOP?', 'Philosophy behind object-oriented programming', 'lesson', '/learn/oops/what-is-oop', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 35, 'Classes, Objects & Encapsulation', 'Define classes and hide internal state', 'lesson', '/learn/oops/encapsulation', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 36, 'Inheritance & Polymorphism', 'Code reuse and flexible method dispatch', 'lesson', '/learn/oops/polymorphism', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 37, 'Abstraction & Interfaces', 'Contracts and partial implementations', 'lesson', '/learn/oops/interfaces-and-abstract-classes', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 38, 'SOLID Principles', 'Five principles of clean OO design', 'lesson', '/learn/oops/solid-principles', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 39, 'Design Patterns: Singleton, Factory, Observer', 'Core creational and behavioral patterns', 'lesson', '/learn/oops/design-pattern-singleton-factory', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 40, 'Composition Over Inheritance', 'Prefer composition for flexible designs', 'lesson', '/learn/oops/composition-over-inheritance', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 41, 'Threads & Process vs Thread', 'Concurrency fundamentals', 'lesson', '/learn/multithreading/what-is-a-thread', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 42, 'Race Conditions & Mutex/Locks', 'Identify and prevent data races', 'lesson', '/learn/multithreading/race-conditions', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 43, 'Deadlock & Semaphores', 'Detect/prevent deadlocks, use semaphores', 'lesson', '/learn/multithreading/deadlock', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 44, 'Producer-Consumer & Thread Pools', 'Classic concurrency patterns', 'lesson', '/learn/multithreading/producer-consumer-pattern', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 45, 'Concurrent Data Structures', 'Thread-safe collections and atomics', 'lesson', '/learn/multithreading/concurrent-data-structures', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 46, 'Async/Await and Futures', 'Asynchronous code without callback hell', 'lesson', '/learn/multithreading/async-await-and-futures', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 47, 'Dining Philosophers', 'Solve the classic concurrency problem', 'lesson', '/learn/multithreading/classic-dining-philosophers', 1);

-- Days 48-75: Problem solving from LeetCode Top 150 (1-2 problems per day)
INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, metadata, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 48, 'Two Sum', 'Solve Two Sum — classic hash table problem', 'problem', 'https://leetcode.com/problems/two-sum/', '{"sheet":"leetcode-top-150","problem_slug":"two-sum"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 48, 'Valid Parentheses', 'Solve Valid Parentheses — stack basics', 'problem', 'https://leetcode.com/problems/valid-parentheses/', '{"sheet":"leetcode-top-150","problem_slug":"valid-parentheses"}', 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 49, 'Add Two Numbers', 'Linked list arithmetic', 'problem', 'https://leetcode.com/problems/add-two-numbers/', '{"sheet":"leetcode-top-150","problem_slug":"add-two-numbers"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 49, 'Merge Two Sorted Lists', 'Merge two sorted linked lists', 'problem', 'https://leetcode.com/problems/merge-two-sorted-lists/', '{"sheet":"leetcode-top-150","problem_slug":"merge-two-sorted-lists"}', 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 50, 'Longest Substring Without Repeating Characters', 'Sliding window on strings', 'problem', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', '{"sheet":"leetcode-top-150","problem_slug":"longest-substring-without-repeating-characters"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 51, 'Container With Most Water', 'Two pointers on arrays', 'problem', 'https://leetcode.com/problems/container-with-most-water/', '{"sheet":"leetcode-top-150","problem_slug":"container-with-most-water"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 51, '3Sum', 'Three-pointer variation', 'problem', 'https://leetcode.com/problems/3sum/', '{"sheet":"leetcode-top-150","problem_slug":"3sum"}', 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 52, 'Best Time to Buy and Sell Stock', 'Greedy / one-pass solution', 'problem', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', '{"sheet":"leetcode-top-150","problem_slug":"best-time-to-buy-and-sell-stock"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 52, 'Maximum Subarray', 'Kadane''s algorithm', 'problem', 'https://leetcode.com/problems/maximum-subarray/', '{"sheet":"leetcode-top-150","problem_slug":"maximum-subarray"}', 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 53, 'Climbing Stairs', 'Basic DP / Fibonacci', 'problem', 'https://leetcode.com/problems/climbing-stairs/', '{"sheet":"leetcode-top-150","problem_slug":"climbing-stairs"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 54, 'Longest Palindromic Substring', 'Expand-around-center technique', 'problem', 'https://leetcode.com/problems/longest-palindromic-substring/', '{"sheet":"leetcode-top-150","problem_slug":"longest-palindromic-substring"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 55, 'Reverse Integer', 'Math and overflow handling', 'problem', 'https://leetcode.com/problems/reverse-integer/', '{"sheet":"leetcode-top-150","problem_slug":"reverse-integer"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 56, 'Median of Two Sorted Arrays', 'Binary search on two arrays (hard)', 'problem', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', '{"sheet":"leetcode-top-150","problem_slug":"median-of-two-sorted-arrays"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 57, 'Binary Tree Inorder Traversal', 'Tree traversal basics', 'problem', 'https://leetcode.com/problems/binary-tree-inorder-traversal/', '{"sheet":"leetcode-top-150","problem_slug":"binary-tree-inorder-traversal"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 57, 'Symmetric Tree', 'Recursive tree comparison', 'problem', 'https://leetcode.com/problems/symmetric-tree/', '{"sheet":"leetcode-top-150","problem_slug":"symmetric-tree"}', 2),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 58, 'Review: Arrays & Strings', 'Revisit Two Sum, 3Sum, Longest Substring problems', 'review', NULL, '{}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 59, 'Review: Linked Lists & Trees', 'Revisit Add Two Numbers, Merge Lists, Tree Traversal', 'review', NULL, '{}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 60, 'Review: DP & Greedy', 'Revisit Climbing Stairs, Max Subarray, Buy/Sell Stock', 'review', NULL, '{}', 1),
  -- Days 61-75: More problem practice (using same seed problems in different combos + new themes)
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 61, 'Two Pointers Practice', 'Re-solve Container With Most Water + 3Sum under time pressure', 'problem', 'https://leetcode.com/problems/container-with-most-water/', '{"sheet":"leetcode-top-150","theme":"two-pointers"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 62, 'Sliding Window Practice', 'Re-solve Longest Substring Without Repeating Characters', 'problem', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', '{"sheet":"leetcode-top-150","theme":"sliding-window"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 63, 'Stack Practice', 'Re-solve Valid Parentheses + explore monotonic stack problems', 'problem', 'https://leetcode.com/problems/valid-parentheses/', '{"sheet":"leetcode-top-150","theme":"stack"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 64, 'Binary Search Practice', 'Apply binary search to Median of Two Sorted Arrays', 'problem', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', '{"sheet":"leetcode-top-150","theme":"binary-search"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 65, 'Tree Practice', 'Re-solve tree problems: Inorder Traversal + Symmetric Tree', 'problem', 'https://leetcode.com/problems/binary-tree-inorder-traversal/', '{"sheet":"leetcode-top-150","theme":"trees"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 66, 'DP Practice — Fibonacci Style', 'Climbing Stairs and related DP problems', 'problem', 'https://leetcode.com/problems/climbing-stairs/', '{"sheet":"leetcode-top-150","theme":"dp"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 67, 'DP Practice — String DP', 'Longest Palindromic Substring deep dive', 'problem', 'https://leetcode.com/problems/longest-palindromic-substring/', '{"sheet":"leetcode-top-150","theme":"dp-strings"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 68, 'Greedy Practice', 'Best Time to Buy and Sell Stock + Maximum Subarray', 'problem', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', '{"sheet":"leetcode-top-150","theme":"greedy"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 69, 'Linked List Practice', 'Add Two Numbers + Merge Two Sorted Lists timed', 'problem', 'https://leetcode.com/problems/add-two-numbers/', '{"sheet":"leetcode-top-150","theme":"linked-list"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 70, 'Mixed Problems Day 1', 'Two Sum + Reverse Integer + Valid Parentheses', 'problem', 'https://leetcode.com/problems/two-sum/', '{"sheet":"leetcode-top-150","theme":"mixed"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 71, 'Mixed Problems Day 2', 'Container With Most Water + Climbing Stairs', 'problem', 'https://leetcode.com/problems/container-with-most-water/', '{"sheet":"leetcode-top-150","theme":"mixed"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 72, 'Mixed Problems Day 3', 'Maximum Subarray + Symmetric Tree', 'problem', 'https://leetcode.com/problems/maximum-subarray/', '{"sheet":"leetcode-top-150","theme":"mixed"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 73, 'Hard Problem Day', 'Median of Two Sorted Arrays — deep analysis', 'problem', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', '{"sheet":"leetcode-top-150","theme":"hard"}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 74, 'Speed Round Day 1', 'Solve 3 easy problems in 30 minutes', 'review', NULL, '{}', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 75, 'Speed Round Day 2', 'Solve 2 medium problems in 40 minutes', 'review', NULL, '{}', 1);

-- Days 76-85: System Design practice
INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 76, 'Design: URL Shortener', 'Design a URL shortening service like bit.ly', 'lesson', '/learn/system-design/design-url-shortener', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 77, 'Design: Chat Application', 'Design a real-time chat system like WhatsApp', 'lesson', '/learn/system-design/design-chat-application', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 78, 'Design: Instagram', 'Design a photo-sharing social network', 'lesson', '/learn/system-design/design-instagram', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 79, 'Design: Twitter Feed', 'Design a news feed system with fan-out', 'lesson', '/learn/system-design/design-twitter-feed', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 80, 'Design: Uber', 'Design a ride-sharing platform', 'lesson', '/learn/system-design/design-uber', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 81, 'Design: Netflix Streaming', 'Design a video streaming service', 'lesson', '/learn/system-design/design-netflix-streaming', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 82, 'Design: Parking Lot System (OOP)', 'Apply OOP to design a parking management system', 'lesson', '/learn/oops/design-parking-lot-system', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 83, 'Design: ATM Machine (OOP)', 'Apply OOP to design an ATM system', 'lesson', '/learn/oops/design-atm-machine', 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 84, 'System Design Review', 'Review all 6 system designs, draw diagrams from scratch', 'review', NULL, 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 85, 'OOP Design Review', 'Review Parking Lot + ATM designs, apply SOLID', 'review', NULL, 1);

-- Days 86-90: Review + mock interview days
INSERT INTO template_tasks (template_id, day_number, title, description, task_type, link, position) VALUES
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 86, 'Mock Interview: DSA Round 1', 'Simulate a 45-min DSA interview — arrays, strings, trees', 'review', NULL, 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 87, 'Mock Interview: DSA Round 2', 'Simulate a 45-min DSA interview — DP, graphs, backtracking', 'review', NULL, 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 88, 'Mock Interview: System Design', 'Simulate a 45-min system design interview', 'review', NULL, 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 89, 'Mock Interview: OOP + Behavioral', 'Simulate OOP design round + behavioral questions', 'review', NULL, 1),
  ((SELECT id FROM roadmap_templates WHERE slug = 'crack-the-job-together'), 90, 'Final Review & Confidence Check', 'Review weak areas, celebrate your 90-day journey!', 'review', NULL, 1);

-- ============================================================
-- B. "Solve Striver Sheet" (30 days)
-- ============================================================
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'coding-tech'),
  'Solve Striver Sheet',
  'solve-striver-sheet',
  'Tackle the Striver SDE Sheet together in 30 days. Structured problem-solving with your peers.',
  '🔥', 'red', 30, 'intermediate', true
) ON CONFLICT (slug) DO NOTHING;

-- Insert tasks from striver-sheet problems (using the seed data problems that exist)
-- We assign problems across days; with 15 seed problems we spread them over the first days
INSERT INTO template_tasks (template_id, day_number, title, task_type, link, metadata, position)
SELECT
  t.id,
  ((row_number() OVER (ORDER BY p.title) - 1) / 3 + 1)::int AS day_number,
  p.title,
  'problem',
  p.url,
  jsonb_build_object('sheet', 'striver-sheet', 'problem_slug', p.slug),
  ((row_number() OVER (ORDER BY p.title) - 1) % 3 + 1)::int AS position
FROM roadmap_templates t
CROSS JOIN sheets s
JOIN sheet_problems sp ON sp.sheet_id = s.id
JOIN problems p ON p.id = sp.problem_id
WHERE t.slug = 'solve-striver-sheet'
  AND s.slug = 'striver-sheet';

-- If striver-sheet has no problems linked in seed, fall back to using all problems
-- and assign them as if they were striver problems
INSERT INTO template_tasks (template_id, day_number, title, task_type, link, metadata, position)
SELECT
  t.id,
  ((row_number() OVER (ORDER BY p.title) - 1) / 3 + 1)::int AS day_number,
  p.title,
  'problem',
  p.url,
  jsonb_build_object('sheet', 'striver-sheet', 'problem_slug', p.slug),
  ((row_number() OVER (ORDER BY p.title) - 1) % 3 + 1)::int AS position
FROM roadmap_templates t
CROSS JOIN problems p
WHERE t.slug = 'solve-striver-sheet'
  AND NOT EXISTS (
    SELECT 1 FROM template_tasks tt WHERE tt.template_id = t.id
  );

-- ============================================================
-- C. "Solve Love Babbar Sheet" (30 days)
-- ============================================================
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'coding-tech'),
  'Solve Love Babbar Sheet',
  'solve-love-babbar-sheet',
  'Work through the Love Babbar 450 DSA Sheet as a group. 30 days of structured problem-solving.',
  '💜', 'purple', 30, 'intermediate', true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO template_tasks (template_id, day_number, title, task_type, link, metadata, position)
SELECT
  t.id,
  ((row_number() OVER (ORDER BY p.title) - 1) / 3 + 1)::int AS day_number,
  p.title,
  'problem',
  p.url,
  jsonb_build_object('sheet', 'love-babbar-sheet', 'problem_slug', p.slug),
  ((row_number() OVER (ORDER BY p.title) - 1) % 3 + 1)::int AS position
FROM roadmap_templates t
CROSS JOIN sheets s
JOIN sheet_problems sp ON sp.sheet_id = s.id
JOIN problems p ON p.id = sp.problem_id
WHERE t.slug = 'solve-love-babbar-sheet'
  AND s.slug = 'love-babbar-sheet';

-- Fallback: use all problems if love-babbar-sheet has no linked problems
INSERT INTO template_tasks (template_id, day_number, title, task_type, link, metadata, position)
SELECT
  t.id,
  ((row_number() OVER (ORDER BY p.title) - 1) / 3 + 1)::int AS day_number,
  p.title,
  'problem',
  p.url,
  jsonb_build_object('sheet', 'love-babbar-sheet', 'problem_slug', p.slug),
  ((row_number() OVER (ORDER BY p.title) - 1) % 3 + 1)::int AS position
FROM roadmap_templates t
CROSS JOIN problems p
WHERE t.slug = 'solve-love-babbar-sheet'
  AND NOT EXISTS (
    SELECT 1 FROM template_tasks tt WHERE tt.template_id = t.id
  );

-- ============================================================
-- D. "LeetCode Top 150" (30 days)
-- ============================================================
INSERT INTO roadmap_templates (category_id, name, slug, description, icon, color, duration_days, difficulty, is_featured)
VALUES (
  (SELECT id FROM roadmap_categories WHERE slug = 'coding-tech'),
  'LeetCode Top 150',
  'leetcode-top-150',
  'Solve the LeetCode Top 150 interview questions together. 30 days, 5 problems per day.',
  '⭐', 'amber', 30, 'intermediate', true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO template_tasks (template_id, day_number, title, task_type, link, metadata, position)
SELECT
  t.id,
  ((row_number() OVER (ORDER BY sp.position, p.title) - 1) / 5 + 1)::int AS day_number,
  p.title,
  'problem',
  p.url,
  jsonb_build_object('sheet', 'leetcode-top-150', 'problem_slug', p.slug),
  ((row_number() OVER (ORDER BY sp.position, p.title) - 1) % 5 + 1)::int AS position
FROM roadmap_templates t
CROSS JOIN sheets s
JOIN sheet_problems sp ON sp.sheet_id = s.id
JOIN problems p ON p.id = sp.problem_id
WHERE t.slug = 'leetcode-top-150'
  AND s.slug = 'leetcode-top-150';
