-- ============================================================
-- Streaksy: Complete sheet population
-- Adds missing problems and fills all sheets to proper counts
-- ============================================================

-- ── Add remaining problems not yet in DB ──
INSERT INTO problems (title, slug, difficulty, url) VALUES
-- Graph problems
('Number of Enclaves', 'number-of-enclaves', 'medium', 'https://leetcode.com/problems/number-of-enclaves/'),
('Is Graph Bipartite', 'is-graph-bipartite', 'medium', 'https://leetcode.com/problems/is-graph-bipartite/'),
('Accounts Merge', 'accounts-merge', 'medium', 'https://leetcode.com/problems/accounts-merge/'),
('Making A Large Island', 'making-a-large-island', 'hard', 'https://leetcode.com/problems/making-a-large-island/'),
('Shortest Path in Binary Matrix', 'shortest-path-in-binary-matrix', 'medium', 'https://leetcode.com/problems/shortest-path-in-binary-matrix/'),
('Word Ladder II', 'word-ladder-ii', 'hard', 'https://leetcode.com/problems/word-ladder-ii/'),
('Critical Connections in a Network', 'critical-connections-in-a-network', 'hard', 'https://leetcode.com/problems/critical-connections-in-a-network/'),
('Reconstruct Itinerary', 'reconstruct-itinerary', 'hard', 'https://leetcode.com/problems/reconstruct-itinerary/'),
('Evaluate Division', 'evaluate-division', 'medium', 'https://leetcode.com/problems/evaluate-division/'),
('Snakes and Ladders', 'snakes-and-ladders', 'medium', 'https://leetcode.com/problems/snakes-and-ladders/'),
('Open the Lock', 'open-the-lock', 'medium', 'https://leetcode.com/problems/open-the-lock/'),
('Find Eventual Safe States', 'find-eventual-safe-states', 'medium', 'https://leetcode.com/problems/find-eventual-safe-states/'),
-- DP problems
('Best Time to Buy and Sell Stock II', 'best-time-to-buy-and-sell-stock-ii', 'medium', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/'),
('Best Time to Buy and Sell Stock III', 'best-time-to-buy-and-sell-stock-iii', 'hard', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/'),
('Best Time to Buy and Sell Stock IV', 'best-time-to-buy-and-sell-stock-iv', 'hard', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/'),
('Best Time to Buy and Sell Stock with Cooldown', 'best-time-to-buy-and-sell-stock-with-cooldown', 'medium', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/'),
('Word Break II', 'word-break-ii', 'hard', 'https://leetcode.com/problems/word-break-ii/'),
('Palindrome Partitioning', 'palindrome-partitioning', 'medium', 'https://leetcode.com/problems/palindrome-partitioning/'),
('Palindrome Partitioning II', 'palindrome-partitioning-ii', 'hard', 'https://leetcode.com/problems/palindrome-partitioning-ii/'),
('Longest Palindromic Subsequence', 'longest-palindromic-subsequence', 'medium', 'https://leetcode.com/problems/longest-palindromic-subsequence/'),
('Minimum Path Sum', 'minimum-path-sum', 'medium', 'https://leetcode.com/problems/minimum-path-sum/'),
('Triangle', 'triangle', 'medium', 'https://leetcode.com/problems/triangle/'),
('Cherry Pickup II', 'cherry-pickup-ii', 'hard', 'https://leetcode.com/problems/cherry-pickup-ii/'),
('Wildcard Matching', 'wildcard-matching', 'hard', 'https://leetcode.com/problems/wildcard-matching/'),
('Shortest Common Supersequence', 'shortest-common-supersequence', 'hard', 'https://leetcode.com/problems/shortest-common-supersequence/'),
('Russian Doll Envelopes', 'russian-doll-envelopes', 'hard', 'https://leetcode.com/problems/russian-doll-envelopes/'),
('Number of Longest Increasing Subsequence', 'number-of-longest-increasing-subsequence', 'medium', 'https://leetcode.com/problems/number-of-longest-increasing-subsequence/'),
('Matrix Chain Multiplication', 'minimum-score-triangulation-of-polygon', 'medium', 'https://leetcode.com/problems/minimum-score-triangulation-of-polygon/'),
('Partition Array for Maximum Sum', 'partition-array-for-maximum-sum', 'medium', 'https://leetcode.com/problems/partition-array-for-maximum-sum/'),
('Rod Cutting', 'minimum-cost-to-cut-a-stick', 'hard', 'https://leetcode.com/problems/minimum-cost-to-cut-a-stick/'),
('Boolean Parenthesization', 'parsing-a-boolean-expression', 'hard', 'https://leetcode.com/problems/parsing-a-boolean-expression/'),
('Egg Drop', 'super-egg-drop', 'hard', 'https://leetcode.com/problems/super-egg-drop/'),
('Maximal Rectangle', 'maximal-rectangle', 'hard', 'https://leetcode.com/problems/maximal-rectangle/'),
('Count Square Submatrices', 'count-square-submatrices-with-all-ones', 'medium', 'https://leetcode.com/problems/count-square-submatrices-with-all-ones/'),
-- Tree extras
('Path Sum', 'path-sum', 'easy', 'https://leetcode.com/problems/path-sum/'),
('Path Sum II', 'path-sum-ii', 'medium', 'https://leetcode.com/problems/path-sum-ii/'),
('Path Sum III', 'path-sum-iii', 'medium', 'https://leetcode.com/problems/path-sum-iii/'),
('Binary Tree Cameras', 'binary-tree-cameras', 'hard', 'https://leetcode.com/problems/binary-tree-cameras/'),
('Sum Root to Leaf Numbers', 'sum-root-to-leaf-numbers', 'medium', 'https://leetcode.com/problems/sum-root-to-leaf-numbers/'),
('All Nodes Distance K in Binary Tree', 'all-nodes-distance-k-in-binary-tree', 'medium', 'https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/'),
('Maximum Sum BST in Binary Tree', 'maximum-sum-bst-in-binary-tree', 'hard', 'https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/'),
-- Array / String extras
('Longest Happy String', 'longest-happy-string', 'medium', 'https://leetcode.com/problems/longest-happy-string/'),
('Merge K Sorted Lists', 'merge-k-sorted-lists', 'hard', 'https://leetcode.com/problems/merge-k-sorted-lists/'),
('First Missing Positive', 'first-missing-positive', 'hard', 'https://leetcode.com/problems/first-missing-positive/'),
('Trapping Rain Water II', 'trapping-rain-water-ii', 'hard', 'https://leetcode.com/problems/trapping-rain-water-ii/'),
('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'hard', 'https://leetcode.com/problems/median-of-two-sorted-arrays/'),
('Subarray Sum Equals K', 'subarray-sum-equals-k', 'medium', 'https://leetcode.com/problems/subarray-sum-equals-k/'),
('Minimum Number of Arrows to Burst Balloons', 'minimum-number-of-arrows-to-burst-balloons', 'medium', 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/'),
('Longest Valid Parentheses', 'longest-valid-parentheses', 'hard', 'https://leetcode.com/problems/longest-valid-parentheses/'),
('Basic Calculator', 'basic-calculator', 'hard', 'https://leetcode.com/problems/basic-calculator/'),
('Basic Calculator II', 'basic-calculator-ii', 'medium', 'https://leetcode.com/problems/basic-calculator-ii/'),
('Asteroid Collision', 'asteroid-collision', 'medium', 'https://leetcode.com/problems/asteroid-collision/'),
('Remove K Digits', 'remove-k-digits', 'medium', 'https://leetcode.com/problems/remove-k-digits/'),
('Number of Visible People in a Queue', 'number-of-visible-people-in-a-queue', 'hard', 'https://leetcode.com/problems/number-of-visible-people-in-a-queue/'),
-- Linked List extras
('Sort List', 'sort-list', 'medium', 'https://leetcode.com/problems/sort-list/'),
('Flatten a Multilevel Doubly Linked List', 'flatten-a-multilevel-doubly-linked-list', 'medium', 'https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/'),
-- Binary Search extras
('Search in Rotated Sorted Array II', 'search-in-rotated-sorted-array-ii', 'medium', 'https://leetcode.com/problems/search-in-rotated-sorted-array-ii/'),
('Find Peak Element', 'find-peak-element', 'medium', 'https://leetcode.com/problems/find-peak-element/'),
('Capacity To Ship Packages Within D Days', 'capacity-to-ship-packages-within-d-days', 'medium', 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/'),
('Split Array Largest Sum', 'split-array-largest-sum', 'hard', 'https://leetcode.com/problems/split-array-largest-sum/'),
('Aggressive Cows', 'magnetic-force-between-two-balls', 'medium', 'https://leetcode.com/problems/magnetic-force-between-two-balls/'),
-- Greedy extras
('Minimum Platforms', 'minimum-number-of-platforms-required-for-a-railway', 'medium', 'https://leetcode.com/problems/minimum-number-of-platforms-required-for-a-railway/'),
('Activity Selection', 'maximum-number-of-events-that-can-be-attended', 'medium', 'https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/'),
('Candy', 'candy', 'hard', 'https://leetcode.com/problems/candy/'),
('Lemonade Change', 'lemonade-change', 'easy', 'https://leetcode.com/problems/lemonade-change/'),
-- Heap extras
('Reorganize String', 'reorganize-string', 'medium', 'https://leetcode.com/problems/reorganize-string/'),
('Furthest Building You Can Reach', 'furthest-building-you-can-reach', 'medium', 'https://leetcode.com/problems/furthest-building-you-can-reach/'),
('Maximum Performance of a Team', 'maximum-performance-of-a-team', 'hard', 'https://leetcode.com/problems/maximum-performance-of-a-team/'),
-- Bit Manipulation extras
('Power of Two', 'power-of-two', 'easy', 'https://leetcode.com/problems/power-of-two/'),
('Divide Two Integers', 'divide-two-integers', 'medium', 'https://leetcode.com/problems/divide-two-integers/'),
-- Math extras
('Count Primes', 'count-primes', 'medium', 'https://leetcode.com/problems/count-primes/'),
('Excel Sheet Column Number', 'excel-sheet-column-number', 'easy', 'https://leetcode.com/problems/excel-sheet-column-number/'),
('Factorial Trailing Zeroes', 'factorial-trailing-zeroes', 'medium', 'https://leetcode.com/problems/factorial-trailing-zeroes/'),
-- Design
('Design HashMap', 'design-hashmap', 'easy', 'https://leetcode.com/problems/design-hashmap/'),
('Design Linked List', 'design-linked-list', 'medium', 'https://leetcode.com/problems/design-linked-list/'),
-- String extras
('Longest Substring with At Most K Distinct Characters', 'longest-substring-with-at-most-k-distinct-characters', 'medium', 'https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/'),
('Implement strStr', 'find-the-index-of-the-first-occurrence-in-a-string', 'easy', 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/'),
('Multiply Strings', 'multiply-strings', 'medium', 'https://leetcode.com/problems/multiply-strings/'),
('Integer to Roman', 'integer-to-roman', 'medium', 'https://leetcode.com/problems/integer-to-roman/'),
('ZigZag Conversion', 'zigzag-conversion', 'medium', 'https://leetcode.com/problems/zigzag-conversion/'),
('Rabin Karp / Repeated DNA Sequences', 'repeated-dna-sequences', 'medium', 'https://leetcode.com/problems/repeated-dna-sequences/')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, url = COALESCE(EXCLUDED.url, problems.url);

-- ══════════════════════════════════════════════
-- Now properly fill each sheet
-- ══════════════════════════════════════════════

-- ── BLIND 75 (target: 75) ──
-- Add the one missing problem
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, 74
FROM sheets s, problems p
WHERE s.slug = 'blind-75' AND p.slug = 'word-search'
AND NOT EXISTS (SELECT 1 FROM sheet_problems WHERE sheet_id = s.id AND problem_id = p.id)
ON CONFLICT DO NOTHING;

-- ── NEETCODE 150 (target: 150) — add missing 7 ──
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, row_number() OVER (ORDER BY p.title) + 143
FROM sheets s, problems p
WHERE s.slug = 'neetcode-150' AND p.slug IN (
  'reconstruct-itinerary','snakes-and-ladders','open-the-lock',
  'accounts-merge','is-graph-bipartite','find-eventual-safe-states',
  'number-of-enclaves'
)
AND NOT EXISTS (SELECT 1 FROM sheet_problems sp WHERE sp.sheet_id = s.id AND sp.problem_id = p.id)
ON CONFLICT DO NOTHING;

-- ── STRIVER SDE SHEET (target: ~190) — add remaining graph, DP, trie, etc ──
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, row_number() OVER (ORDER BY p.title) + 110
FROM sheets s, problems p
WHERE s.slug = 'striver-sde' AND p.slug IN (
  -- Graphs remaining
  'number-of-enclaves','is-graph-bipartite','surrounded-regions','course-schedule-ii',
  'accounts-merge','making-a-large-island','shortest-path-in-binary-matrix',
  'cheapest-flights-within-k-stops','network-delay-time','critical-connections-in-a-network',
  'find-eventual-safe-states','evaluate-division','min-cost-to-connect-all-points',
  'swim-in-rising-water','redundant-connection',
  -- DP remaining
  'best-time-to-buy-and-sell-stock-ii','best-time-to-buy-and-sell-stock-iii',
  'best-time-to-buy-and-sell-stock-iv','best-time-to-buy-and-sell-stock-with-cooldown',
  'longest-palindromic-subsequence','minimum-path-sum','triangle','cherry-pickup-ii',
  'wildcard-matching','shortest-common-supersequence','russian-doll-envelopes',
  'number-of-longest-increasing-subsequence','palindrome-partitioning',
  'palindrome-partitioning-ii','partition-equal-subset-sum','target-sum',
  'coin-change-2','interleaving-string','distinct-subsequences',
  'minimum-insertion-steps-to-make-a-string-palindrome','burst-balloons',
  'super-egg-drop','minimum-score-triangulation-of-polygon','maximal-rectangle',
  'count-square-submatrices-with-all-ones','minimum-cost-to-cut-a-stick',
  'partition-array-for-maximum-sum','word-break-ii',
  -- Trees remaining
  'path-sum','path-sum-ii','path-sum-iii','all-nodes-distance-k-in-binary-tree',
  'binary-tree-cameras','sum-root-to-leaf-numbers','maximum-sum-bst-in-binary-tree',
  -- Trie remaining
  'design-add-and-search-words-data-structure','word-search-ii',
  -- Stack extras
  'asteroid-collision','remove-k-digits','longest-valid-parentheses','basic-calculator',
  -- Binary Search extras
  'find-peak-element','capacity-to-ship-packages-within-d-days','magnetic-force-between-two-balls',
  'split-array-largest-sum','search-in-rotated-sorted-array-ii',
  -- Greedy extras
  'candy','lemonade-change',
  -- Linked List extras
  'sort-list','flatten-a-multilevel-doubly-linked-list'
)
AND NOT EXISTS (SELECT 1 FROM sheet_problems sp WHERE sp.sheet_id = s.id AND sp.problem_id = p.id)
ON CONFLICT DO NOTHING;

-- ── LOVE BABBAR 450 (target: ~250 LeetCode mappable) — add tons more ──
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, row_number() OVER (ORDER BY p.title) + 99
FROM sheets s, problems p
WHERE s.slug = 'love-babbar-450' AND p.slug IN (
  -- Arrays
  'first-missing-positive','subarray-sum-equals-k','sort-colors','next-permutation',
  'maximum-product-subarray','merge-sorted-array','find-the-duplicate-number',
  'powx-n','unique-paths','unique-paths-ii','majority-element-ii','4sum','reverse-pairs',
  'pascals-triangle','longest-consecutive-sequence',
  -- String
  'reverse-words-in-a-string','roman-to-integer','integer-to-roman',
  'string-to-integer-atoi','longest-common-prefix','count-and-say','longest-palindromic-substring',
  'compare-version-numbers','multiply-strings','zigzag-conversion',
  'find-the-index-of-the-first-occurrence-in-a-string','repeated-dna-sequences',
  'palindromic-substrings','longest-palindromic-subsequence',
  -- Linked List
  'rotate-list','copy-list-with-random-pointer','add-two-numbers',
  'delete-node-in-a-linked-list','middle-of-the-linked-list',
  'sort-list','flatten-a-multilevel-doubly-linked-list',
  'linked-list-cycle-ii','reorder-list',
  -- Stack & Queue
  'next-greater-element-i','online-stock-span','lfu-cache','rotting-oranges',
  'implement-stack-using-queues','implement-queue-using-stacks',
  'asteroid-collision','remove-k-digits','basic-calculator-ii',
  'longest-valid-parentheses','min-stack',
  -- Binary Search
  'search-a-2d-matrix','single-element-in-a-sorted-array','find-peak-element',
  'capacity-to-ship-packages-within-d-days','magnetic-force-between-two-balls',
  'search-in-rotated-sorted-array-ii','split-array-largest-sum',
  -- Trees
  'binary-tree-right-side-view','vertical-order-traversal-of-a-binary-tree',
  'maximum-width-of-binary-tree','binary-tree-zigzag-level-order-traversal',
  'flatten-binary-tree-to-linked-list','symmetric-tree',
  'construct-binary-tree-from-preorder-and-inorder-traversal',
  'construct-binary-tree-from-inorder-and-postorder-traversal',
  'lowest-common-ancestor-of-a-binary-search-tree',
  'path-sum','path-sum-ii','path-sum-iii','all-nodes-distance-k-in-binary-tree',
  'sum-root-to-leaf-numbers','binary-tree-cameras',
  'populating-next-right-pointers-in-each-node',
  'search-in-a-binary-search-tree','convert-sorted-array-to-binary-search-tree',
  'construct-binary-search-tree-from-preorder-traversal',
  'validate-binary-search-tree','two-sum-iv-input-is-a-bst',
  'binary-search-tree-iterator','maximum-sum-bst-in-binary-tree',
  -- Graphs
  'surrounded-regions','course-schedule-ii','is-graph-bipartite',
  'accounts-merge','cheapest-flights-within-k-stops','network-delay-time',
  'critical-connections-in-a-network','find-eventual-safe-states',
  'number-of-enclaves','evaluate-division','min-cost-to-connect-all-points',
  'redundant-connection',
  -- DP
  'minimum-path-sum','triangle','best-time-to-buy-and-sell-stock-ii',
  'best-time-to-buy-and-sell-stock-iii','best-time-to-buy-and-sell-stock-with-cooldown',
  'longest-palindromic-subsequence','palindrome-partitioning','palindrome-partitioning-ii',
  'wildcard-matching','shortest-common-supersequence','interleaving-string',
  'distinct-subsequences','burst-balloons','regular-expression-matching',
  'minimum-insertion-steps-to-make-a-string-palindrome','coin-change-2',
  'super-egg-drop','maximal-rectangle','count-square-submatrices-with-all-ones',
  'number-of-longest-increasing-subsequence','russian-doll-envelopes',
  'decode-ways','jump-game-ii',
  -- Trie
  'design-add-and-search-words-data-structure','word-search-ii',
  -- Greedy
  'candy','lemonade-change','assign-cookies','gas-station',
  'minimum-number-of-arrows-to-burst-balloons',
  -- Heap
  'reorganize-string','furthest-building-you-can-reach','design-twitter',
  'kth-largest-element-in-a-stream','last-stone-weight','k-closest-points-to-origin',
  -- Bit Manipulation
  'power-of-two','divide-two-integers',
  -- Math
  'count-primes','excel-sheet-column-number','factorial-trailing-zeroes','happy-number','plus-one',
  -- Design
  'design-hashmap','design-linked-list','lru-cache'
)
AND NOT EXISTS (SELECT 1 FROM sheet_problems sp WHERE sp.sheet_id = s.id AND sp.problem_id = p.id)
ON CONFLICT DO NOTHING;

-- ── GRIND 75 (target: 75) — add 1 missing ──
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, 74
FROM sheets s, problems p
WHERE s.slug = 'grind-75' AND p.slug = 'accounts-merge'
AND NOT EXISTS (SELECT 1 FROM sheet_problems WHERE sheet_id = s.id AND problem_id = p.id)
ON CONFLICT DO NOTHING;
