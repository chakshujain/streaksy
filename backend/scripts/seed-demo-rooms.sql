-- Seed demo room history for Arjun and Priya
-- 5 finished rooms + 1 waiting (active) room

-- Room 1: Friday Night Grind (3 days ago) - Two Sum - Arjun hosts, wins
INSERT INTO rooms (id, name, code, problem_id, host_id, status, time_limit_minutes, started_at, ended_at, created_at) VALUES
('30000000-0000-0000-0000-000000000001', 'Friday Night Grind', 'FNG12345',
 (SELECT id FROM problems WHERE slug = 'two-sum'),
 '00000000-0000-0000-0000-000000000002', 'finished', 30,
 NOW() - INTERVAL '3 days 2 hours',
 NOW() - INTERVAL '3 days 1 hour 40 minutes',
 NOW() - INTERVAL '3 days 3 hours')
ON CONFLICT (id) DO NOTHING;

-- Room 2: Weekend Warriors (5 days ago) - Valid Parentheses - Arjun hosts, wins
INSERT INTO rooms (id, name, code, problem_id, host_id, status, time_limit_minutes, started_at, ended_at, created_at) VALUES
('30000000-0000-0000-0000-000000000002', 'Weekend Warriors', 'WW234567',
 (SELECT id FROM problems WHERE slug = 'valid-parentheses'),
 '00000000-0000-0000-0000-000000000002', 'finished', 25,
 NOW() - INTERVAL '5 days 4 hours',
 NOW() - INTERVAL '5 days 3 hours 35 minutes',
 NOW() - INTERVAL '5 days 5 hours')
ON CONFLICT (id) DO NOTHING;

-- Room 3: Linked List Showdown (8 days ago) - Reverse Linked List - Priya hosts, Arjun wins
INSERT INTO rooms (id, name, code, problem_id, host_id, status, time_limit_minutes, started_at, ended_at, created_at) VALUES
('30000000-0000-0000-0000-000000000003', 'Linked List Showdown', 'LLS98765',
 (SELECT id FROM problems WHERE slug = 'reverse-linked-list'),
 '00000000-0000-0000-0000-000000000003', 'finished', 20,
 NOW() - INTERVAL '8 days 1 hour',
 NOW() - INTERVAL '8 days 38 minutes',
 NOW() - INTERVAL '8 days 2 hours')
ON CONFLICT (id) DO NOTHING;

-- Room 4: Lunch Break Challenge (10 days ago) - Climbing Stairs - Arjun hosts, Neha wins this one
INSERT INTO rooms (id, name, code, problem_id, host_id, status, time_limit_minutes, started_at, ended_at, created_at) VALUES
('30000000-0000-0000-0000-000000000004', 'Lunch Break Challenge', 'LBC54321',
 (SELECT id FROM problems WHERE slug = 'climbing-stairs'),
 '00000000-0000-0000-0000-000000000002', 'finished', 15,
 NOW() - INTERVAL '10 days 6 hours',
 NOW() - INTERVAL '10 days 5 hours 45 minutes',
 NOW() - INTERVAL '10 days 7 hours')
ON CONFLICT (id) DO NOTHING;

-- Room 5: Late Night Coding (13 days ago) - Binary Search - Priya hosts, Arjun wins
INSERT INTO rooms (id, name, code, problem_id, host_id, status, time_limit_minutes, started_at, ended_at, created_at) VALUES
('30000000-0000-0000-0000-000000000005', 'Late Night Coding', 'LNC67890',
 (SELECT id FROM problems WHERE slug = 'binary-search'),
 '00000000-0000-0000-0000-000000000003', 'finished', 30,
 NOW() - INTERVAL '13 days 22 hours',
 NOW() - INTERVAL '13 days 21 hours 30 minutes',
 NOW() - INTERVAL '13 days 23 hours')
ON CONFLICT (id) DO NOTHING;

-- Room 6: Merge Masters (active/waiting) - Merge Two Sorted Lists - Arjun hosts
INSERT INTO rooms (id, name, code, problem_id, host_id, status, time_limit_minutes, started_at, ended_at, created_at) VALUES
('30000000-0000-0000-0000-000000000006', 'Merge Masters', 'MM112233',
 (SELECT id FROM problems WHERE slug = 'merge-two-sorted-lists'),
 '00000000-0000-0000-0000-000000000002', 'waiting', 30,
 NULL, NULL,
 NOW() - INTERVAL '10 minutes')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PARTICIPANTS
-- ============================================================

-- Room 1: Friday Night Grind (Two Sum)
-- Arjun solves first (5 min), Priya solves (8 min), Rahul solves (12 min), Alex doesn't solve
INSERT INTO room_participants (room_id, user_id, status, solved_at, language, runtime_ms, memory_kb, joined_at) VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'solved',
 NOW() - INTERVAL '3 days 1 hour 55 minutes', 'Python3', 4, 16200,
 NOW() - INTERVAL '3 days 2 hours 30 minutes'),
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'solved',
 NOW() - INTERVAL '3 days 1 hour 52 minutes', 'Python3', 8, 16800,
 NOW() - INTERVAL '3 days 2 hours 25 minutes'),
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'solved',
 NOW() - INTERVAL '3 days 1 hour 48 minutes', 'JavaScript', 12, 17500,
 NOW() - INTERVAL '3 days 2 hours 20 minutes'),
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'joined',
 NULL, NULL, NULL, NULL,
 NOW() - INTERVAL '3 days 2 hours 15 minutes')
ON CONFLICT DO NOTHING;

-- Room 2: Weekend Warriors (Valid Parentheses)
-- Arjun solves (3 min), Neha solves (7 min), Rahul doesn't solve
INSERT INTO room_participants (room_id, user_id, status, solved_at, language, runtime_ms, memory_kb, joined_at) VALUES
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'solved',
 NOW() - INTERVAL '5 days 3 hours 57 minutes', 'Python3', 3, 16100,
 NOW() - INTERVAL '5 days 4 hours 30 minutes'),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'solved',
 NOW() - INTERVAL '5 days 3 hours 53 minutes', 'Java', 6, 42300,
 NOW() - INTERVAL '5 days 4 hours 20 minutes'),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'joined',
 NULL, NULL, NULL, NULL,
 NOW() - INTERVAL '5 days 4 hours 10 minutes')
ON CONFLICT DO NOTHING;

-- Room 3: Linked List Showdown (Reverse Linked List)
-- Arjun solves (4 min), Priya solves (6 min), Alex solves (10 min)
INSERT INTO room_participants (room_id, user_id, status, solved_at, language, runtime_ms, memory_kb, joined_at) VALUES
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'solved',
 NOW() - INTERVAL '8 days 56 minutes', 'Python3', 5, 16400,
 NOW() - INTERVAL '8 days 1 hour 30 minutes'),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'solved',
 NOW() - INTERVAL '8 days 54 minutes', 'Python3', 7, 16600,
 NOW() - INTERVAL '8 days 1 hour 25 minutes'),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', 'solved',
 NOW() - INTERVAL '8 days 50 minutes', 'C++', 2, 8200,
 NOW() - INTERVAL '8 days 1 hour 20 minutes')
ON CONFLICT DO NOTHING;

-- Room 4: Lunch Break Challenge (Climbing Stairs)
-- Neha solves first (3 min), Arjun solves (5 min), Priya solves (9 min)
INSERT INTO room_participants (room_id, user_id, status, solved_at, language, runtime_ms, memory_kb, joined_at) VALUES
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'solved',
 NOW() - INTERVAL '10 days 5 hours 55 minutes', 'Python3', 6, 16300,
 NOW() - INTERVAL '10 days 6 hours 30 minutes'),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'solved',
 NOW() - INTERVAL '10 days 5 hours 51 minutes', 'Python3', 10, 16900,
 NOW() - INTERVAL '10 days 6 hours 25 minutes'),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'solved',
 NOW() - INTERVAL '10 days 5 hours 57 minutes', 'Java', 4, 41800,
 NOW() - INTERVAL '10 days 6 hours 20 minutes')
ON CONFLICT DO NOTHING;

-- Room 5: Late Night Coding (Binary Search)
-- Arjun solves (6 min), Rahul solves (14 min), Alex doesn't solve
INSERT INTO room_participants (room_id, user_id, status, solved_at, language, runtime_ms, memory_kb, joined_at) VALUES
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'solved',
 NOW() - INTERVAL '13 days 21 hours 54 minutes', 'Python3', 5, 16200,
 NOW() - INTERVAL '13 days 22 hours 30 minutes'),
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 'solved',
 NOW() - INTERVAL '13 days 21 hours 46 minutes', 'JavaScript', 9, 17200,
 NOW() - INTERVAL '13 days 22 hours 20 minutes'),
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'joined',
 NULL, NULL, NULL, NULL,
 NOW() - INTERVAL '13 days 22 hours 10 minutes')
ON CONFLICT DO NOTHING;

-- Room 6: Merge Masters (waiting - just Arjun and Priya joined)
INSERT INTO room_participants (room_id, user_id, status, solved_at, language, runtime_ms, memory_kb, joined_at) VALUES
('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'joined',
 NULL, NULL, NULL, NULL,
 NOW() - INTERVAL '10 minutes'),
('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'joined',
 NULL, NULL, NULL, NULL,
 NOW() - INTERVAL '8 minutes')
ON CONFLICT DO NOTHING;

-- ============================================================
-- ROOM MESSAGES
-- ============================================================

-- Room 1 messages
INSERT INTO room_messages (id, room_id, user_id, content, created_at) VALUES
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000002', 'Used hash map approach, O(n) time!',
 NOW() - INTERVAL '3 days 1 hour 55 minutes'),
('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000003', 'Same! Almost had it with brute force first though',
 NOW() - INTERVAL '3 days 1 hour 52 minutes'),
('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000004', 'Nice one, the complement check is so clean',
 NOW() - INTERVAL '3 days 1 hour 48 minutes'),
('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000006', 'GG, I got stuck on the edge case with duplicates',
 NOW() - INTERVAL '3 days 1 hour 42 minutes')
ON CONFLICT (id) DO NOTHING;

-- Room 2 messages
INSERT INTO room_messages (id, room_id, user_id, content, created_at) VALUES
('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002',
 '00000000-0000-0000-0000-000000000002', 'Stack-based solution, classic pattern',
 NOW() - INTERVAL '5 days 3 hours 57 minutes'),
('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000002',
 '00000000-0000-0000-0000-000000000005', 'Used a map for bracket matching, works great in Java',
 NOW() - INTERVAL '5 days 3 hours 53 minutes'),
('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000002',
 '00000000-0000-0000-0000-000000000004', 'I kept getting tripped up by the empty string case',
 NOW() - INTERVAL '5 days 3 hours 40 minutes')
ON CONFLICT (id) DO NOTHING;

-- Room 3 messages
INSERT INTO room_messages (id, room_id, user_id, content, created_at) VALUES
('40000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000003',
 '00000000-0000-0000-0000-000000000002', 'Iterative approach with prev pointer swap',
 NOW() - INTERVAL '8 days 56 minutes'),
('40000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000003',
 '00000000-0000-0000-0000-000000000003', 'Went recursive first, then switched to iterative',
 NOW() - INTERVAL '8 days 54 minutes'),
('40000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000003',
 '00000000-0000-0000-0000-000000000006', 'C++ pointers make this feel natural honestly',
 NOW() - INTERVAL '8 days 50 minutes')
ON CONFLICT (id) DO NOTHING;

-- Room 4 messages
INSERT INTO room_messages (id, room_id, user_id, content, created_at) VALUES
('40000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000004',
 '00000000-0000-0000-0000-000000000005', 'DP with memo, got it quick this time!',
 NOW() - INTERVAL '10 days 5 hours 57 minutes'),
('40000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000004',
 '00000000-0000-0000-0000-000000000002', 'Nice Neha! I went bottom-up DP, two variables only',
 NOW() - INTERVAL '10 days 5 hours 55 minutes'),
('40000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000004',
 '00000000-0000-0000-0000-000000000003', 'Fibonacci pattern recognized, clean solution',
 NOW() - INTERVAL '10 days 5 hours 51 minutes')
ON CONFLICT (id) DO NOTHING;

-- Room 5 messages
INSERT INTO room_messages (id, room_id, user_id, content, created_at) VALUES
('40000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000005',
 '00000000-0000-0000-0000-000000000002', 'Standard binary search, watch for off-by-one!',
 NOW() - INTERVAL '13 days 21 hours 54 minutes'),
('40000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000005',
 '00000000-0000-0000-0000-000000000004', 'Finally got it, kept messing up the mid calculation',
 NOW() - INTERVAL '13 days 21 hours 46 minutes'),
('40000000-0000-0000-0000-000000000016', '30000000-0000-0000-0000-000000000005',
 '00000000-0000-0000-0000-000000000006', 'Ran out of time, was so close though',
 NOW() - INTERVAL '13 days 21 hours 32 minutes')
ON CONFLICT (id) DO NOTHING;
