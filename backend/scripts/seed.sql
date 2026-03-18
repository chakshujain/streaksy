-- Seed problem sheets
INSERT INTO sheets (name, slug, description) VALUES
  ('LeetCode Top 150', 'leetcode-top-150', 'Top 150 interview questions from LeetCode'),
  ('Striver Sheet', 'striver-sheet', 'Striver SDE Sheet for interview preparation'),
  ('Love Babbar Sheet', 'love-babbar-sheet', 'Love Babbar 450 DSA Sheet')
ON CONFLICT (slug) DO NOTHING;

-- Seed common tags
INSERT INTO tags (name) VALUES
  ('array'), ('string'), ('hash-table'), ('dynamic-programming'),
  ('math'), ('sorting'), ('greedy'), ('depth-first-search'),
  ('binary-search'), ('tree'), ('breadth-first-search'), ('matrix'),
  ('two-pointers'), ('stack'), ('linked-list'), ('graph'),
  ('sliding-window'), ('backtracking'), ('heap'), ('bit-manipulation'),
  ('recursion'), ('divide-and-conquer'), ('trie'), ('union-find')
ON CONFLICT (name) DO NOTHING;

-- Seed sample problems (a subset — in production, bulk import via script)
INSERT INTO problems (title, slug, difficulty, url) VALUES
  ('Two Sum', 'two-sum', 'easy', 'https://leetcode.com/problems/two-sum/'),
  ('Add Two Numbers', 'add-two-numbers', 'medium', 'https://leetcode.com/problems/add-two-numbers/'),
  ('Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'medium', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'),
  ('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'hard', 'https://leetcode.com/problems/median-of-two-sorted-arrays/'),
  ('Longest Palindromic Substring', 'longest-palindromic-substring', 'medium', 'https://leetcode.com/problems/longest-palindromic-substring/'),
  ('Reverse Integer', 'reverse-integer', 'medium', 'https://leetcode.com/problems/reverse-integer/'),
  ('Container With Most Water', 'container-with-most-water', 'medium', 'https://leetcode.com/problems/container-with-most-water/'),
  ('3Sum', '3sum', 'medium', 'https://leetcode.com/problems/3sum/'),
  ('Valid Parentheses', 'valid-parentheses', 'easy', 'https://leetcode.com/problems/valid-parentheses/'),
  ('Merge Two Sorted Lists', 'merge-two-sorted-lists', 'easy', 'https://leetcode.com/problems/merge-two-sorted-lists/'),
  ('Maximum Subarray', 'maximum-subarray', 'medium', 'https://leetcode.com/problems/maximum-subarray/'),
  ('Climbing Stairs', 'climbing-stairs', 'easy', 'https://leetcode.com/problems/climbing-stairs/'),
  ('Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'easy', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'),
  ('Binary Tree Inorder Traversal', 'binary-tree-inorder-traversal', 'easy', 'https://leetcode.com/problems/binary-tree-inorder-traversal/'),
  ('Symmetric Tree', 'symmetric-tree', 'easy', 'https://leetcode.com/problems/symmetric-tree/')
ON CONFLICT (slug) DO NOTHING;

-- Link sample problems to sheets (LeetCode Top 150)
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, row_number() OVER (ORDER BY p.title)
FROM sheets s, problems p
WHERE s.slug = 'leetcode-top-150'
ON CONFLICT DO NOTHING;
