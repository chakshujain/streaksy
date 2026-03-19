-- ============================================================
-- Streaksy: Complete Sheet Population Seed
-- Fixes Blind 75, NeetCode 150, and adds problems to
-- Striver SDE Sheet and Love Babbar 450
-- ============================================================
BEGIN;

-- ══════════════════════════════════════════════════════════════
-- STEP 1: Insert any new problems not yet in the DB
-- ══════════════════════════════════════════════════════════════
INSERT INTO problems (title, slug, difficulty, url) VALUES
('Combination Sum IV', 'combination-sum-iv', 'medium', 'https://leetcode.com/problems/combination-sum-iv/'),
('Max Area of Island', 'max-area-of-island', 'medium', 'https://leetcode.com/problems/max-area-of-island/'),
('Longest Increasing Path in a Matrix', 'longest-increasing-path-in-a-matrix', 'hard', 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/'),
('Reverse Integer', 'reverse-integer', 'medium', 'https://leetcode.com/problems/reverse-integer/'),
('Coin Change II', 'coin-change-ii', 'medium', 'https://leetcode.com/problems/coin-change-ii/'),
('Flood Fill', 'flood-fill', 'easy', 'https://leetcode.com/problems/flood-fill/'),
('Implement strStr', 'find-the-index-of-the-first-occurrence-in-a-string', 'easy', 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/'),
('Boundary of Binary Tree', 'boundary-of-binary-tree', 'medium', 'https://leetcode.com/problems/boundary-of-binary-tree/'),
('Inorder Successor in BST', 'inorder-successor-in-bst', 'medium', 'https://leetcode.com/problems/inorder-successor-in-bst/'),
('Kth Smallest Element in a Sorted Matrix', 'kth-smallest-element-in-a-sorted-matrix', 'medium', 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/'),
('Minimum Number of Jumps to Reach End', 'jump-game-ii', 'medium', 'https://leetcode.com/problems/jump-game-ii/'),
('Reverse String', 'reverse-string', 'easy', 'https://leetcode.com/problems/reverse-string/'),
('First and Last Position of Element in Sorted Array', 'find-first-and-last-position-of-element-in-sorted-array', 'medium', 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/'),
('Majority Element', 'majority-element', 'easy', 'https://leetcode.com/problems/majority-element/'),
('4Sum II', 'four-sum-ii', 'medium', 'https://leetcode.com/problems/4sum-ii/'),
('Chocolate Distribution Problem', 'minimum-difference-between-largest-and-smallest-value-in-three-moves', 'medium', 'https://leetcode.com/problems/minimum-difference-between-largest-and-smallest-value-in-three-moves/'),
('Smallest Subarray with Sum Greater than Given Value', 'minimum-size-subarray-sum', 'medium', 'https://leetcode.com/problems/minimum-size-subarray-sum/'),
('Remove Duplicates from Sorted Linked List', 'remove-duplicates-from-sorted-list', 'easy', 'https://leetcode.com/problems/remove-duplicates-from-sorted-list/'),
('Remove Duplicates from Sorted Linked List II', 'remove-duplicates-from-sorted-list-ii', 'medium', 'https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/'),
('Add Two Numbers II', 'add-two-numbers-ii', 'medium', 'https://leetcode.com/problems/add-two-numbers-ii/'),
('Reverse Level Order Traversal', 'binary-tree-level-order-traversal-ii', 'medium', 'https://leetcode.com/problems/binary-tree-level-order-traversal-ii/'),
('Minimum Depth of Binary Tree', 'minimum-depth-of-binary-tree', 'easy', 'https://leetcode.com/problems/minimum-depth-of-binary-tree/'),
('Lowest Common Ancestor of Binary Tree', 'lowest-common-ancestor-of-a-binary-tree', 'medium', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/'),
('Check Completeness of a Binary Tree', 'check-completeness-of-a-binary-tree', 'medium', 'https://leetcode.com/problems/check-completeness-of-a-binary-tree/'),
('Binary Tree Paths', 'binary-tree-paths', 'easy', 'https://leetcode.com/problems/binary-tree-paths/'),
('Maximum Level Sum of Binary Tree', 'maximum-level-sum-of-a-binary-tree', 'medium', 'https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/'),
('Find All Duplicates in an Array', 'find-all-duplicates-in-an-array', 'medium', 'https://leetcode.com/problems/find-all-duplicates-in-an-array/'),
('Sort Array By Parity', 'sort-array-by-parity', 'easy', 'https://leetcode.com/problems/sort-array-by-parity/'),
('Maximum Length of Pair Chain', 'maximum-length-of-pair-chain', 'medium', 'https://leetcode.com/problems/maximum-length-of-pair-chain/'),
('Ones and Zeroes', 'ones-and-zeroes', 'medium', 'https://leetcode.com/problems/ones-and-zeroes/'),
('Maximum Length of Repeated Subarray', 'maximum-length-of-repeated-subarray', 'medium', 'https://leetcode.com/problems/maximum-length-of-repeated-subarray/'),
('Rotate Array', 'rotate-array', 'medium', 'https://leetcode.com/problems/rotate-array/'),
('Move Zeroes', 'move-zeroes', 'easy', 'https://leetcode.com/problems/move-zeroes/'),
('Squares of a Sorted Array', 'squares-of-a-sorted-array', 'easy', 'https://leetcode.com/problems/squares-of-a-sorted-array/'),
('Number of Provinces', 'number-of-provinces', 'medium', 'https://leetcode.com/problems/number-of-provinces/'),
('Shortest Bridge', 'shortest-bridge', 'medium', 'https://leetcode.com/problems/shortest-bridge/'),
('01 Matrix', 'zero-one-matrix', 'medium', 'https://leetcode.com/problems/01-matrix/'),
('Keys and Rooms', 'keys-and-rooms', 'medium', 'https://leetcode.com/problems/keys-and-rooms/'),
('Longest Palindrome', 'longest-palindrome', 'easy', 'https://leetcode.com/problems/longest-palindrome/'),
('String to Integer atoi', 'string-to-integer-atoi', 'medium', 'https://leetcode.com/problems/string-to-integer-atoi/'),
('Group Anagrams', 'group-anagrams', 'medium', 'https://leetcode.com/problems/group-anagrams/'),
('Minimum Remove to Make Valid Parentheses', 'minimum-remove-to-make-valid-parentheses', 'medium', 'https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/'),
('Word Pattern', 'word-pattern', 'easy', 'https://leetcode.com/problems/word-pattern/'),
('Isomorphic Strings', 'isomorphic-strings', 'easy', 'https://leetcode.com/problems/isomorphic-strings/'),
('Longest Word in Dictionary through Deleting', 'longest-word-in-dictionary-through-deleting', 'medium', 'https://leetcode.com/problems/longest-word-in-dictionary-through-deleting/'),
('Minimum Window Substring', 'minimum-window-substring', 'hard', 'https://leetcode.com/problems/minimum-window-substring/'),
('Valid Number', 'valid-number', 'hard', 'https://leetcode.com/problems/valid-number/'),
('Integer to English Words', 'integer-to-english-words', 'hard', 'https://leetcode.com/problems/integer-to-english-words/'),
('Simplify Path', 'simplify-path', 'medium', 'https://leetcode.com/problems/simplify-path/'),
('Decode String', 'decode-string', 'medium', 'https://leetcode.com/problems/decode-string/'),
('Next Greater Element II', 'next-greater-element-ii', 'medium', 'https://leetcode.com/problems/next-greater-element-ii/'),
('Maximum Frequency Stack', 'maximum-frequency-stack', 'hard', 'https://leetcode.com/problems/maximum-frequency-stack/'),
('Implement Circular Queue', 'design-circular-queue', 'medium', 'https://leetcode.com/problems/design-circular-queue/'),
('Implement Circular Deque', 'design-circular-deque', 'medium', 'https://leetcode.com/problems/design-circular-deque/'),
('Queue using Two Stacks', 'implement-queue-using-stacks', 'easy', 'https://leetcode.com/problems/implement-queue-using-stacks/'),
('Binary Search', 'binary-search', 'easy', 'https://leetcode.com/problems/binary-search/'),
('Search Insert Position', 'search-insert-position', 'easy', 'https://leetcode.com/problems/search-insert-position/'),
('Peak Index in Mountain Array', 'peak-index-in-a-mountain-array', 'medium', 'https://leetcode.com/problems/peak-index-in-a-mountain-array/'),
('Find Minimum in Rotated Sorted Array II', 'find-minimum-in-rotated-sorted-array-ii', 'hard', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/'),
('Count Complete Tree Nodes', 'count-complete-tree-nodes', 'easy', 'https://leetcode.com/problems/count-complete-tree-nodes/'),
('Recover Binary Search Tree', 'recover-binary-search-tree', 'medium', 'https://leetcode.com/problems/recover-binary-search-tree/'),
('Unique Binary Search Trees', 'unique-binary-search-trees', 'medium', 'https://leetcode.com/problems/unique-binary-search-trees/'),
('Unique Binary Search Trees II', 'unique-binary-search-trees-ii', 'medium', 'https://leetcode.com/problems/unique-binary-search-trees-ii/'),
('House Robber III', 'house-robber-iii', 'medium', 'https://leetcode.com/problems/house-robber-iii/'),
('Longest Substring with At Least K Repeating Characters', 'longest-substring-with-at-least-k-repeating-characters', 'medium', 'https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/'),
('Palindrome Pairs', 'palindrome-pairs', 'hard', 'https://leetcode.com/problems/palindrome-pairs/'),
('Largest Number', 'largest-number', 'medium', 'https://leetcode.com/problems/largest-number/'),
('Sort Characters By Frequency', 'sort-characters-by-frequency', 'medium', 'https://leetcode.com/problems/sort-characters-by-frequency/'),
('Top K Frequent Words', 'top-k-frequent-words', 'medium', 'https://leetcode.com/problems/top-k-frequent-words/'),
('Ugly Number II', 'ugly-number-ii', 'medium', 'https://leetcode.com/problems/ugly-number-ii/'),
('Minimum Cost to Hire K Workers', 'minimum-cost-to-hire-k-workers', 'hard', 'https://leetcode.com/problems/minimum-cost-to-hire-k-workers/'),
('Number of Matching Subsequences', 'number-of-matching-subsequences', 'medium', 'https://leetcode.com/problems/number-of-matching-subsequences/'),
('Shortest Path Visiting All Nodes', 'shortest-path-visiting-all-nodes', 'hard', 'https://leetcode.com/problems/shortest-path-visiting-all-nodes/'),
('Possible Bipartition', 'possible-bipartition', 'medium', 'https://leetcode.com/problems/possible-bipartition/'),
('Cheapest Flights Within K Stops', 'cheapest-flights-within-k-stops', 'medium', 'https://leetcode.com/problems/cheapest-flights-within-k-stops/'),
('Minimum Height Trees', 'minimum-height-trees', 'medium', 'https://leetcode.com/problems/minimum-height-trees/'),
('Topological Sort', 'course-schedule-ii', 'medium', 'https://leetcode.com/problems/course-schedule-ii/'),
('Strongly Connected Components', 'critical-connections-in-a-network', 'hard', 'https://leetcode.com/problems/critical-connections-in-a-network/'),
('All Paths From Source to Target', 'all-paths-from-source-to-target', 'medium', 'https://leetcode.com/problems/all-paths-from-source-to-target/'),
('Longest Path With Different Adjacent Characters', 'longest-path-with-different-adjacent-characters', 'hard', 'https://leetcode.com/problems/longest-path-with-different-adjacent-characters/'),
('Palindrome Partitioning III', 'palindrome-partitioning-iii', 'hard', 'https://leetcode.com/problems/palindrome-partitioning-iii/'),
('Minimum Falling Path Sum', 'minimum-falling-path-sum', 'medium', 'https://leetcode.com/problems/minimum-falling-path-sum/'),
('Perfect Squares', 'perfect-squares', 'medium', 'https://leetcode.com/problems/perfect-squares/'),
('Longest String Chain', 'longest-string-chain', 'medium', 'https://leetcode.com/problems/longest-string-chain/'),
('Delete and Earn', 'delete-and-earn', 'medium', 'https://leetcode.com/problems/delete-and-earn/'),
('Uncrossed Lines', 'uncrossed-lines', 'medium', 'https://leetcode.com/problems/uncrossed-lines/'),
('Stone Game', 'stone-game', 'medium', 'https://leetcode.com/problems/stone-game/'),
('Minimum Cost Tree From Leaf Values', 'minimum-cost-tree-from-leaf-values', 'medium', 'https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/'),
('Scramble String', 'scramble-string', 'hard', 'https://leetcode.com/problems/scramble-string/'),
('Maximal Square', 'maximal-square', 'medium', 'https://leetcode.com/problems/maximal-square/'),
('Maximum Sum Circular Subarray', 'maximum-sum-circular-subarray', 'medium', 'https://leetcode.com/problems/maximum-sum-circular-subarray/'),
('Maximum Profit in Job Scheduling', 'maximum-profit-in-job-scheduling', 'hard', 'https://leetcode.com/problems/maximum-profit-in-job-scheduling/'),
('Best Time to Buy and Sell Stock with Transaction Fee', 'best-time-to-buy-and-sell-stock-with-transaction-fee', 'medium', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/'),
('Implement Trie', 'implement-trie-prefix-tree', 'medium', 'https://leetcode.com/problems/implement-trie-prefix-tree/'),
('Map Sum Pairs', 'map-sum-pairs', 'medium', 'https://leetcode.com/problems/map-sum-pairs/'),
('Replace Words', 'replace-words', 'medium', 'https://leetcode.com/problems/replace-words/')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  url = COALESCE(EXCLUDED.url, problems.url);

-- ══════════════════════════════════════════════════════════════
-- STEP 2: Ensure tags exist
-- ══════════════════════════════════════════════════════════════
INSERT INTO tags (name) VALUES
('Array'), ('String'), ('Linked List'), ('Tree'), ('Binary Search'),
('Dynamic Programming'), ('Graph'), ('Greedy'), ('Stack'), ('Queue'),
('Heap'), ('Trie'), ('Backtracking'), ('Bit Manipulation'),
('Math'), ('Two Pointers'), ('Sliding Window'), ('Hash Table'),
('Sorting'), ('Matrix'), ('Depth-First Search'), ('Breadth-First Search'),
('Union Find'), ('Design'), ('Recursion'), ('Divide and Conquer'),
('Monotonic Stack'), ('Interval')
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- STEP 3: Add problem-tag associations for new problems
-- ══════════════════════════════════════════════════════════════
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'combination-sum-iv' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'combination-sum-iv' AND t.name = 'Array'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'max-area-of-island' AND t.name = 'Depth-First Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'max-area-of-island' AND t.name = 'Graph'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'longest-increasing-path-in-a-matrix' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'longest-increasing-path-in-a-matrix' AND t.name = 'Depth-First Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'reverse-integer' AND t.name = 'Math'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'flood-fill' AND t.name = 'Depth-First Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'flood-fill' AND t.name = 'Graph'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'boundary-of-binary-tree' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'inorder-successor-in-bst' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'inorder-successor-in-bst' AND t.name = 'Binary Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'number-of-provinces' AND t.name = 'Graph'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'number-of-provinces' AND t.name = 'Union Find'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'shortest-bridge' AND t.name = 'Graph'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'shortest-bridge' AND t.name = 'Breadth-First Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'zero-one-matrix' AND t.name = 'Breadth-First Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'zero-one-matrix' AND t.name = 'Matrix'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'keys-and-rooms' AND t.name = 'Graph'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'keys-and-rooms' AND t.name = 'Depth-First Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'find-all-duplicates-in-an-array' AND t.name = 'Array'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'rotate-array' AND t.name = 'Array'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'move-zeroes' AND t.name = 'Array'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'move-zeroes' AND t.name = 'Two Pointers'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'squares-of-a-sorted-array' AND t.name = 'Array'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'squares-of-a-sorted-array' AND t.name = 'Two Pointers'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'reverse-string' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'reverse-string' AND t.name = 'Two Pointers'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'find-first-and-last-position-of-element-in-sorted-array' AND t.name = 'Binary Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'find-first-and-last-position-of-element-in-sorted-array' AND t.name = 'Array'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'remove-duplicates-from-sorted-list' AND t.name = 'Linked List'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'remove-duplicates-from-sorted-list-ii' AND t.name = 'Linked List'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'add-two-numbers-ii' AND t.name = 'Linked List'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'binary-tree-level-order-traversal-ii' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'binary-tree-level-order-traversal-ii' AND t.name = 'Breadth-First Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'minimum-depth-of-binary-tree' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'check-completeness-of-a-binary-tree' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'binary-tree-paths' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'maximum-level-sum-of-a-binary-tree' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'count-complete-tree-nodes' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'recover-binary-search-tree' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'unique-binary-search-trees' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'unique-binary-search-trees' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'unique-binary-search-trees-ii' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'house-robber-iii' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'house-robber-iii' AND t.name = 'Tree'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'simplify-path' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'simplify-path' AND t.name = 'Stack'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'decode-string' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'decode-string' AND t.name = 'Stack'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'next-greater-element-ii' AND t.name = 'Stack'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'maximum-frequency-stack' AND t.name = 'Stack'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'maximum-frequency-stack' AND t.name = 'Design'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'design-circular-queue' AND t.name = 'Design'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'design-circular-deque' AND t.name = 'Design'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'search-insert-position' AND t.name = 'Binary Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'peak-index-in-a-mountain-array' AND t.name = 'Binary Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'find-minimum-in-rotated-sorted-array-ii' AND t.name = 'Binary Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'kth-smallest-element-in-a-sorted-matrix' AND t.name = 'Binary Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'kth-smallest-element-in-a-sorted-matrix' AND t.name = 'Matrix'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'sort-array-by-parity' AND t.name = 'Array'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'minimum-size-subarray-sum' AND t.name = 'Array'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'minimum-size-subarray-sum' AND t.name = 'Sliding Window'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'word-pattern' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'word-pattern' AND t.name = 'Hash Table'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'isomorphic-strings' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'isomorphic-strings' AND t.name = 'Hash Table'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'longest-palindrome' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'longest-palindrome' AND t.name = 'Hash Table'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'minimum-remove-to-make-valid-parentheses' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'minimum-remove-to-make-valid-parentheses' AND t.name = 'Stack'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'valid-number' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'integer-to-english-words' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'integer-to-english-words' AND t.name = 'Math'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'largest-number' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'largest-number' AND t.name = 'Sorting'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'sort-characters-by-frequency' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'sort-characters-by-frequency' AND t.name = 'Sorting'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'top-k-frequent-words' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'top-k-frequent-words' AND t.name = 'Heap'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'ugly-number-ii' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'ugly-number-ii' AND t.name = 'Heap'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'possible-bipartition' AND t.name = 'Graph'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'minimum-height-trees' AND t.name = 'Graph'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'minimum-height-trees' AND t.name = 'Breadth-First Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'all-paths-from-source-to-target' AND t.name = 'Graph'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'all-paths-from-source-to-target' AND t.name = 'Backtracking'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'perfect-squares' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'minimum-falling-path-sum' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'minimum-falling-path-sum' AND t.name = 'Matrix'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'longest-string-chain' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'delete-and-earn' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'maximal-square' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'maximal-square' AND t.name = 'Matrix'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'maximum-sum-circular-subarray' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'maximum-sum-circular-subarray' AND t.name = 'Array'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'maximum-profit-in-job-scheduling' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'maximum-profit-in-job-scheduling' AND t.name = 'Binary Search'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'best-time-to-buy-and-sell-stock-with-transaction-fee' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'best-time-to-buy-and-sell-stock-with-transaction-fee' AND t.name = 'Greedy'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'scramble-string' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'scramble-string' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'stone-game' AND t.name = 'Dynamic Programming'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'map-sum-pairs' AND t.name = 'Trie'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'replace-words' AND t.name = 'Trie'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'replace-words' AND t.name = 'String'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'palindrome-pairs' AND t.name = 'Trie'
UNION ALL SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'palindrome-pairs' AND t.name = 'String'
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- STEP 4: Fix BLIND 75 sheet (target: 75)
-- Currently 74 problems, missing: combination-sum-iv
-- The original Blind 75 has combination-sum-iv not combination-sum
-- Also needs: valid-palindrome, coin-change,
-- number-of-connected-components-in-an-undirected-graph,
-- construct-binary-tree-from-preorder-and-inorder-traversal
-- ══════════════════════════════════════════════════════════════

INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT '63c15594-e232-45cd-9045-f91ea0fe6d65', p.id, 74
FROM problems p WHERE p.slug = 'combination-sum-iv'
AND NOT EXISTS (SELECT 1 FROM sheet_problems WHERE sheet_id = '63c15594-e232-45cd-9045-f91ea0fe6d65' AND problem_id = p.id)
ON CONFLICT DO NOTHING;

INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT '63c15594-e232-45cd-9045-f91ea0fe6d65', p.id, 75
FROM problems p WHERE p.slug = 'valid-palindrome'
AND NOT EXISTS (SELECT 1 FROM sheet_problems WHERE sheet_id = '63c15594-e232-45cd-9045-f91ea0fe6d65' AND problem_id = p.id)
ON CONFLICT DO NOTHING;

INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT '63c15594-e232-45cd-9045-f91ea0fe6d65', p.id, 76
FROM problems p WHERE p.slug = 'coin-change'
AND NOT EXISTS (SELECT 1 FROM sheet_problems WHERE sheet_id = '63c15594-e232-45cd-9045-f91ea0fe6d65' AND problem_id = p.id)
ON CONFLICT DO NOTHING;

INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT '63c15594-e232-45cd-9045-f91ea0fe6d65', p.id, 77
FROM problems p WHERE p.slug = 'number-of-connected-components-in-an-undirected-graph'
AND NOT EXISTS (SELECT 1 FROM sheet_problems WHERE sheet_id = '63c15594-e232-45cd-9045-f91ea0fe6d65' AND problem_id = p.id)
ON CONFLICT DO NOTHING;

INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT '63c15594-e232-45cd-9045-f91ea0fe6d65', p.id, 78
FROM problems p WHERE p.slug = 'construct-binary-tree-from-preorder-and-inorder-traversal'
AND NOT EXISTS (SELECT 1 FROM sheet_problems WHERE sheet_id = '63c15594-e232-45cd-9045-f91ea0fe6d65' AND problem_id = p.id)
ON CONFLICT DO NOTHING;

-- Remove non-Blind-75 problems that were incorrectly added
-- coin-change-2 should be just coin-change in Blind 75
-- palindrome-number is not in Blind 75
-- construct-binary-tree-from-inorder-and-postorder-traversal -> should be preorder-and-inorder
DELETE FROM sheet_problems
WHERE sheet_id = '63c15594-e232-45cd-9045-f91ea0fe6d65'
AND problem_id IN (
  SELECT id FROM problems WHERE slug = 'palindrome-number'
);

DELETE FROM sheet_problems
WHERE sheet_id = '63c15594-e232-45cd-9045-f91ea0fe6d65'
AND problem_id IN (
  SELECT id FROM problems WHERE slug = 'construct-binary-tree-from-inorder-and-postorder-traversal'
);

DELETE FROM sheet_problems
WHERE sheet_id = '63c15594-e232-45cd-9045-f91ea0fe6d65'
AND problem_id IN (
  SELECT id FROM problems WHERE slug = 'coin-change-2'
);

DELETE FROM sheet_problems
WHERE sheet_id = '63c15594-e232-45cd-9045-f91ea0fe6d65'
AND problem_id IN (
  SELECT id FROM problems WHERE slug = 'combination-sum'
);

-- ══════════════════════════════════════════════════════════════
-- STEP 5: Fix NEETCODE 150 sheet (target: 150)
-- Remove 7 wrong problems, add 7 correct ones
-- ══════════════════════════════════════════════════════════════

DELETE FROM sheet_problems
WHERE sheet_id = '8743ed8a-5f94-486a-885b-3777eb6d81a9'
AND problem_id IN (
  SELECT id FROM problems WHERE slug IN (
    'accounts-merge',
    'combination-sum-iii',
    'find-eventual-safe-states',
    'is-graph-bipartite',
    'number-of-enclaves',
    'open-the-lock',
    'snakes-and-ladders'
  )
);

INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT '8743ed8a-5f94-486a-885b-3777eb6d81a9', p.id,
  CASE p.slug
    WHEN 'best-time-to-buy-and-sell-stock-with-cooldown' THEN 151
    WHEN 'longest-increasing-path-in-a-matrix' THEN 152
    WHEN 'max-area-of-island' THEN 153
    WHEN 'multiply-strings' THEN 154
    WHEN 'palindrome-partitioning' THEN 155
    WHEN 'powx-n' THEN 156
    WHEN 'reverse-integer' THEN 157
  END
FROM problems p WHERE p.slug IN (
  'best-time-to-buy-and-sell-stock-with-cooldown',
  'longest-increasing-path-in-a-matrix',
  'max-area-of-island',
  'multiply-strings',
  'palindrome-partitioning',
  'powx-n',
  'reverse-integer'
)
AND NOT EXISTS (SELECT 1 FROM sheet_problems WHERE sheet_id = '8743ed8a-5f94-486a-885b-3777eb6d81a9' AND problem_id = p.id)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- STEP 6: STRIVER SDE SHEET (target: 191+)
-- Add missing problems from the official list
-- ══════════════════════════════════════════════════════════════

INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT 'c8b2b1fb-1f95-43b3-9fce-11e87353b1d6', p.id, row_number() OVER (ORDER BY p.title) + 173
FROM problems p WHERE p.slug IN (
  'kth-largest-element-in-an-array',
  'kth-largest-element-in-a-stream',
  'flood-fill',
  'word-ladder',
  'number-of-provinces',
  'possible-bipartition',
  'shortest-bridge',
  'boundary-of-binary-tree',
  'inorder-successor-in-bst',
  'minimum-insertion-steps-to-make-a-string-palindrome',
  'regular-expression-matching',
  'max-area-of-island',
  'subsets',
  'counting-bits',
  'power-of-two',
  'implement-trie-prefix-tree',
  'longest-increasing-subsequence',
  'maximum-product-subarray',
  'ones-and-zeroes',
  'maximum-length-of-repeated-subarray',
  'zero-one-matrix',
  'keys-and-rooms',
  'minimum-height-trees',
  'all-paths-from-source-to-target',
  'valid-anagram',
  'count-and-say',
  'compare-version-numbers',
  'find-the-index-of-the-first-occurrence-in-a-string'
)
AND NOT EXISTS (SELECT 1 FROM sheet_problems sp WHERE sp.sheet_id = 'c8b2b1fb-1f95-43b3-9fce-11e87353b1d6' AND sp.problem_id = p.id)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- STEP 7: LOVE BABBAR 450 (target: 280+)
-- Add many more LeetCode-mappable problems
-- ══════════════════════════════════════════════════════════════

INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT 'b67f7f3d-7d74-4996-89cc-359a04539fcb', p.id, row_number() OVER (ORDER BY p.title) + 218
FROM problems p WHERE p.slug IN (
  'reverse-string',
  'find-all-duplicates-in-an-array',
  'sort-array-by-parity',
  'rotate-array',
  'move-zeroes',
  'squares-of-a-sorted-array',
  'minimum-size-subarray-sum',
  'find-first-and-last-position-of-element-in-sorted-array',
  'four-sum-ii',
  'remove-duplicates-from-sorted-list',
  'remove-duplicates-from-sorted-list-ii',
  'add-two-numbers-ii',
  'binary-tree-level-order-traversal-ii',
  'minimum-depth-of-binary-tree',
  'check-completeness-of-a-binary-tree',
  'binary-tree-paths',
  'maximum-level-sum-of-a-binary-tree',
  'count-complete-tree-nodes',
  'recover-binary-search-tree',
  'unique-binary-search-trees',
  'unique-binary-search-trees-ii',
  'house-robber-iii',
  'longest-substring-with-at-least-k-repeating-characters',
  'word-pattern',
  'isomorphic-strings',
  'longest-palindrome',
  'minimum-remove-to-make-valid-parentheses',
  'valid-number',
  'integer-to-english-words',
  'simplify-path',
  'decode-string',
  'next-greater-element-ii',
  'maximum-frequency-stack',
  'design-circular-queue',
  'search-insert-position',
  'peak-index-in-a-mountain-array',
  'find-minimum-in-rotated-sorted-array-ii',
  'kth-smallest-element-in-a-sorted-matrix',
  'largest-number',
  'sort-characters-by-frequency',
  'top-k-frequent-words',
  'ugly-number-ii',
  'number-of-provinces',
  'shortest-bridge',
  'possible-bipartition',
  'minimum-height-trees',
  'all-paths-from-source-to-target',
  'perfect-squares',
  'minimum-falling-path-sum',
  'longest-string-chain',
  'delete-and-earn',
  'maximal-square',
  'maximum-sum-circular-subarray',
  'maximum-profit-in-job-scheduling',
  'best-time-to-buy-and-sell-stock-with-transaction-fee',
  'scramble-string',
  'stone-game',
  'palindrome-pairs',
  'map-sum-pairs',
  'replace-words',
  'flood-fill',
  'max-area-of-island',
  'zero-one-matrix',
  'keys-and-rooms',
  'combination-sum-iv',
  'longest-increasing-path-in-a-matrix',
  'reverse-integer',
  'palindrome-partitioning-iii',
  'uncrossed-lines',
  'minimum-cost-tree-from-leaf-values',
  'longest-word-in-dictionary-through-deleting',
  'maximum-length-of-pair-chain',
  'find-minimum-in-rotated-sorted-array',
  'koko-eating-bananas'
)
AND NOT EXISTS (SELECT 1 FROM sheet_problems sp WHERE sp.sheet_id = 'b67f7f3d-7d74-4996-89cc-359a04539fcb' AND sp.problem_id = p.id)
ON CONFLICT DO NOTHING;

COMMIT;
