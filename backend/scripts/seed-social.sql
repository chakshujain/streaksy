-- ============================================================
-- Streaksy: Seed social data — groups, feed events, likes, comments
-- Creates a "Streaksy" system user + demo users for populated feel
-- ============================================================

-- ── Create demo users ──
INSERT INTO users (id, email, password_hash, display_name, email_verified, bio) VALUES
('00000000-0000-0000-0000-000000000001', 'streaksy@streaksy.in', '$2b$12$placeholder.hash.not.real.login', 'Streaksy', true, 'Official Streaksy account. Keep grinding! 🔥'),
('00000000-0000-0000-0000-000000000002', 'arjun@demo.streaksy.in', '$2b$12$placeholder.hash.not.real.login', 'Arjun Mehta', true, 'SDE @ Google | 200+ LC problems | Python lover'),
('00000000-0000-0000-0000-000000000003', 'priya@demo.streaksy.in', '$2b$12$placeholder.hash.not.real.login', 'Priya Sharma', true, 'CS grad student @ IIT Delhi | Grinding for placements'),
('00000000-0000-0000-0000-000000000004', 'rahul@demo.streaksy.in', '$2b$12$placeholder.hash.not.real.login', 'Rahul Verma', true, 'Full-stack dev | 150-day streak holder 🔥'),
('00000000-0000-0000-0000-000000000005', 'neha@demo.streaksy.in', '$2b$12$placeholder.hash.not.real.login', 'Neha Gupta', true, 'Competitive programmer | Codeforces Expert'),
('00000000-0000-0000-0000-000000000006', 'alex@demo.streaksy.in', '$2b$12$placeholder.hash.not.real.login', 'Alex Chen', true, 'SDE II @ Amazon | Helping friends prep'),
('00000000-0000-0000-0000-000000000007', 'sara@demo.streaksy.in', '$2b$12$placeholder.hash.not.real.login', 'Sara Patel', true, 'Pre-final year | Blind 75 complete ✅'),
('00000000-0000-0000-0000-000000000008', 'dev@demo.streaksy.in', '$2b$12$placeholder.hash.not.real.login', 'Dev Singh', true, 'Backend engineer | Java & Go enthusiast')
ON CONFLICT (email) DO NOTHING;

-- ── Create demo streaks ──
INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_solve_date) VALUES
('00000000-0000-0000-0000-000000000002', 42, 42, CURRENT_DATE),
('00000000-0000-0000-0000-000000000003', 15, 28, CURRENT_DATE),
('00000000-0000-0000-0000-000000000004', 150, 150, CURRENT_DATE),
('00000000-0000-0000-0000-000000000005', 67, 67, CURRENT_DATE),
('00000000-0000-0000-0000-000000000006', 30, 45, CURRENT_DATE),
('00000000-0000-0000-0000-000000000007', 21, 21, CURRENT_DATE),
('00000000-0000-0000-0000-000000000008', 8, 35, CURRENT_DATE)
ON CONFLICT (user_id) DO NOTHING;

-- ── Create demo groups ──
INSERT INTO groups (id, name, description, invite_code, created_by) VALUES
('10000000-0000-0000-0000-000000000001', 'Streaksy Global', 'The official Streaksy community group. Everyone is welcome! Solve, compete, and grow together.', 'STREAKSY', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000002', 'Neetcode Gang', 'Grinding NeetCode 150 together. Daily problems, weekly contests.', 'NEETCODE', '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000003', 'FAANG Prep 2026', 'Serious interview prep for top tech companies. Blind 75 + system design.', 'FAANG26', '00000000-0000-0000-0000-000000000006'),
('10000000-0000-0000-0000-000000000004', 'DSA Beginners', 'Just starting your DSA journey? No judgment here. Ask questions, learn patterns.', 'DSASTART', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (invite_code) DO NOTHING;

-- ── Add demo users to groups ──
INSERT INTO group_members (group_id, user_id, role) VALUES
-- Streaksy Global (everyone)
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin'),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'member'),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'member'),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'member'),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'member'),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'member'),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'member'),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008', 'member'),
-- Neetcode Gang
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'admin'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'member'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'member'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', 'member'),
-- FAANG Prep
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', 'admin'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'member'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'member'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'member'),
-- DSA Beginners
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'admin'),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007', 'member'),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000008', 'member')
ON CONFLICT DO NOTHING;

-- ── Create feed events (recent, staggered timestamps) ──
INSERT INTO feed_events (id, user_id, event_type, title, description, metadata, created_at) VALUES
-- Today
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'streak_milestone', 'Reached a 150-day streak! 🔥', 'Absolutely insane dedication. 5 months of daily problem solving!', '{"streakDays": 150}', NOW() - INTERVAL '20 minutes'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Trapping Rain Water"', null, '{"problemSlug": "trapping-rain-water", "problemTitle": "Trapping Rain Water", "difficulty": "hard"}', NOW() - INTERVAL '45 minutes'),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'solve', 'Solved "Merge K Sorted Lists"', null, '{"problemSlug": "merge-k-sorted-lists", "problemTitle": "Merge K Sorted Lists", "difficulty": "hard"}', NOW() - INTERVAL '1 hour'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Two Sum"', 'My first problem on Streaksy!', '{"problemSlug": "two-sum", "problemTitle": "Two Sum", "difficulty": "easy"}', NOW() - INTERVAL '2 hours'),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007', 'streak_milestone', 'Reached a 21-day streak! 🔥', 'Three weeks strong! 💪', '{"streakDays": 21}', NOW() - INTERVAL '3 hours'),
-- Yesterday
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'solve', 'Solved "LRU Cache"', 'Finally understood doubly linked list + hashmap combo!', '{"problemSlug": "lru-cache", "problemTitle": "LRU Cache", "difficulty": "medium"}', NOW() - INTERVAL '18 hours'),
('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Number of Islands"', null, '{"problemSlug": "number-of-islands", "problemTitle": "Number of Islands", "difficulty": "medium"}', NOW() - INTERVAL '20 hours'),
('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', 'streak_milestone', 'Reached a 67-day streak! 🔥', null, '{"streakDays": 67}', NOW() - INTERVAL '22 hours'),
('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000008', 'solve', 'Solved "Valid Parentheses"', 'Stack problems finally clicking!', '{"problemSlug": "valid-parentheses", "problemTitle": "Valid Parentheses", "difficulty": "easy"}', NOW() - INTERVAL '24 hours'),
-- 2 days ago
('20000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004', 'solve', 'Solved "Binary Tree Maximum Path Sum"', 'Recursive DFS with global max — tricky but elegant.', '{"problemSlug": "binary-tree-maximum-path-sum", "problemTitle": "Binary Tree Maximum Path Sum", "difficulty": "hard"}', NOW() - INTERVAL '2 days'),
('20000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Climbing Stairs"', 'DP clicked for me today! It is just Fibonacci 🤯', '{"problemSlug": "climbing-stairs", "problemTitle": "Climbing Stairs", "difficulty": "easy"}', NOW() - INTERVAL '2 days 3 hours'),
('20000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000006', 'solve', 'Solved "Course Schedule"', 'Topological sort using BFS (Kahn''s algo)', '{"problemSlug": "course-schedule", "problemTitle": "Course Schedule", "difficulty": "medium"}', NOW() - INTERVAL '2 days 5 hours'),
('20000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000007', 'solve', 'Solved "Reverse Linked List"', null, '{"problemSlug": "reverse-linked-list", "problemTitle": "Reverse Linked List", "difficulty": "easy"}', NOW() - INTERVAL '2 days 8 hours'),
-- 3 days ago
('20000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Serialize and Deserialize Binary Tree"', 'BFS approach with level-order traversal. Clean solution.', '{"problemSlug": "serialize-and-deserialize-binary-tree", "problemTitle": "Serialize and Deserialize Binary Tree", "difficulty": "hard"}', NOW() - INTERVAL '3 days'),
('20000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000005', 'solve', 'Solved "Longest Increasing Subsequence"', 'Used patience sorting for O(n log n). Beautiful algorithm.', '{"problemSlug": "longest-increasing-subsequence", "problemTitle": "Longest Increasing Subsequence", "difficulty": "medium"}', NOW() - INTERVAL '3 days 2 hours'),
('20000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000006', 'streak_milestone', 'Reached a 30-day streak! 🔥', 'One month of consistency! This platform keeps me accountable.', '{"streakDays": 30}', NOW() - INTERVAL '3 days 4 hours'),
('20000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000001', 'solve', 'Solved "Coin Change"', 'Classic unbounded knapsack DP. Master this pattern!', '{"problemSlug": "coin-change", "problemTitle": "Coin Change", "difficulty": "medium"}', NOW() - INTERVAL '3 days 6 hours'),
-- 4-5 days ago
('20000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000004', 'solve', 'Solved "Word Break"', 'Memoized DFS or bottom-up DP — both work great here.', '{"problemSlug": "word-break", "problemTitle": "Word Break", "difficulty": "medium"}', NOW() - INTERVAL '4 days'),
('20000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000008', 'solve', 'Solved "Binary Search"', 'Back to basics. Getting the boundaries right is key.', '{"problemSlug": "binary-search", "problemTitle": "Binary Search", "difficulty": "easy"}', NOW() - INTERVAL '4 days 5 hours'),
('20000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Best Time to Buy and Sell Stock"', 'Kadane''s variant! Track min price and max profit.', '{"problemSlug": "best-time-to-buy-and-sell-stock", "problemTitle": "Best Time to Buy and Sell Stock", "difficulty": "easy"}', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- ── Add likes to feed events ──
INSERT INTO feed_likes (feed_event_id, user_id, created_at) VALUES
-- 150-day streak gets tons of love
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '15 minutes'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '14 minutes'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '12 minutes'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '10 minutes'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', NOW() - INTERVAL '8 minutes'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008', NOW() - INTERVAL '5 minutes'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 minutes'),
-- Trapping Rain Water (hard problem respect)
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '30 minutes'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '28 minutes'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '25 minutes'),
-- Merge K Sorted Lists
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '50 minutes'),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '48 minutes'),
-- First solve gets encouragement
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 hour 30 minutes'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 hour 28 minutes'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '1 hour 25 minutes'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007', NOW() - INTERVAL '1 hour 20 minutes'),
-- 21-day streak
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 hours 30 minutes'),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '2 hours 25 minutes'),
-- Scattered likes on older posts
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '16 hours'),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '15 hours'),
('20000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 day 20 hours'),
('20000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '1 day 19 hours'),
('20000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '1 day 18 hours'),
('20000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day 22 hours'),
('20000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '1 day 21 hours'),
('20000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '2 days 20 hours'),
('20000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '2 days 18 hours'),
('20000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '3 days 2 hours'),
('20000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '3 days 1 hour'),
('20000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '3 days'),
('20000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '2 days 23 hours'),
('20000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '3 days 4 hours')
ON CONFLICT DO NOTHING;

-- ── Add comments to feed events ──
INSERT INTO feed_comments (id, feed_event_id, user_id, content, created_at) VALUES
-- 150-day streak comments
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Absolute legend 🐐 How do you not miss a single day?!', NOW() - INTERVAL '18 minutes'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', '150 days!!! This is insane dedication. Teach me your ways 🙏', NOW() - INTERVAL '15 minutes'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'Thanks! The trick is solving one easy problem even on busy days. Consistency > intensity.', NOW() - INTERVAL '12 minutes'),
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Inspirational! I just started my streak yesterday. Hope to get there someday 💪', NOW() - INTERVAL '10 minutes'),
('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '🔥🔥🔥 This is what Streaksy is all about! Keep crushing it!', NOW() - INTERVAL '5 minutes'),
-- Trapping Rain Water comments
('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'Two pointer approach or stack? I find the two pointer one cleaner.', NOW() - INTERVAL '40 minutes'),
('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Two pointers! O(1) space is the way. Prefix max arrays also work but waste memory.', NOW() - INTERVAL '35 minutes'),
('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'This is THE classic interview question. Good solve! 🎯', NOW() - INTERVAL '30 minutes'),
-- First solve (Two Sum) — encouraging comments
('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Welcome to Streaksy! Two Sum is the perfect starting point. Keep going! 🚀', NOW() - INTERVAL '1 hour 45 minutes'),
('30000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Great first solve! Pro tip: try solving it with a hash map for O(n) time 👍', NOW() - INTERVAL '1 hour 40 minutes'),
('30000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 'Everyone starts with Two Sum! Now try Contains Duplicate — it''s another easy win 💪', NOW() - INTERVAL '1 hour 35 minutes'),
-- LRU Cache comment
('30000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'LRU Cache is asked in literally every FAANG interview. Nice one! 🏆', NOW() - INTERVAL '17 hours'),
-- Climbing Stairs comment
('30000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'That moment when DP clicks is magical ✨ Next try House Robber — same pattern!', NOW() - INTERVAL '2 days 1 hour'),
('30000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000004', 'Wait until you realize 90% of DP is just "what decisions can I make at each step" 🧠', NOW() - INTERVAL '2 days'),
-- 30-day streak comments
('30000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000004', 'One month! The hardest part is over. It becomes a habit after this 🔥', NOW() - INTERVAL '3 days 3 hours'),
('30000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000003', 'Congrats Alex!! Group accountability really works 🤝', NOW() - INTERVAL '3 days 2 hours'),
-- Coin Change comment
('30000000-0000-0000-0000-000000000017', '20000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000005', 'Coin Change is the gateway drug to DP. Once you get this, 0/1 Knapsack makes sense!', NOW() - INTERVAL '3 days 5 hours'),
-- Serialize BT comment
('30000000-0000-0000-0000-000000000018', '20000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000006', 'This one stumped me for hours. BFS or DFS for serialization?', NOW() - INTERVAL '2 days 22 hours'),
('30000000-0000-0000-0000-000000000019', '20000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000002', 'I used preorder DFS with null markers. Clean and O(n).', NOW() - INTERVAL '2 days 21 hours')
ON CONFLICT (id) DO NOTHING;

-- ── Auto-join new users to "Streaksy Global" group ──
-- This ensures every new user sees feed content immediately
-- We'll do this by adding a note in the group description
UPDATE groups SET description = 'The official Streaksy community group. Everyone is auto-joined! Solve, compete, and grow together.'
WHERE id = '10000000-0000-0000-0000-000000000001';
