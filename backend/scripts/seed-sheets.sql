-- ============================================================
-- Streaksy: Comprehensive Problem & Sheet Seed Data
-- Sheets: Blind 75, NeetCode 150, Striver SDE, Love Babbar
-- ============================================================

-- ── Create Sheets ──
INSERT INTO sheets (name, slug, description) VALUES
('Blind 75', 'blind-75', 'The original 75 LeetCode problems curated by a Meta engineer. The gold standard for interview prep.'),
('NeetCode 150', 'neetcode-150', 'Blind 75 + 75 more problems. Covers all patterns and topics for coding interviews.'),
('Striver SDE Sheet', 'striver-sde', 'Striver''s curated list of 180+ problems for Software Development Engineer interviews at top companies.'),
('Love Babbar 450', 'love-babbar-450', 'Love Babbar''s DSA Cracker sheet with 450 problems covering all DSA topics comprehensively.'),
('Grind 75', 'grind-75', 'Updated version of Blind 75 by the original author. Optimized ordering for maximum interview prep efficiency.')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- ── Create Tags ──
INSERT INTO tags (name) VALUES
('Array'), ('String'), ('Hash Table'), ('Dynamic Programming'), ('Math'),
('Sorting'), ('Greedy'), ('Binary Search'), ('Tree'), ('Depth-First Search'),
('Breadth-First Search'), ('Matrix'), ('Bit Manipulation'), ('Two Pointers'),
('Stack'), ('Heap'), ('Graph'), ('Linked List'), ('Sliding Window'),
('Backtracking'), ('Trie'), ('Union Find'), ('Divide and Conquer'),
('Monotonic Stack'), ('Recursion'), ('Design'), ('Interval')
ON CONFLICT (name) DO NOTHING;

-- ── Insert Problems ──
-- Format: slug, title, difficulty, url

INSERT INTO problems (title, slug, difficulty, url) VALUES
('Two Sum', 'two-sum', 'easy', 'https://leetcode.com/problems/two-sum/'),
('Contains Duplicate', 'contains-duplicate', 'easy', 'https://leetcode.com/problems/contains-duplicate/'),
('Valid Anagram', 'valid-anagram', 'easy', 'https://leetcode.com/problems/valid-anagram/'),
('Group Anagrams', 'group-anagrams', 'medium', 'https://leetcode.com/problems/group-anagrams/'),
('Top K Frequent Elements', 'top-k-frequent-elements', 'medium', 'https://leetcode.com/problems/top-k-frequent-elements/'),
('Product of Array Except Self', 'product-of-array-except-self', 'medium', 'https://leetcode.com/problems/product-of-array-except-self/'),
('Valid Sudoku', 'valid-sudoku', 'medium', 'https://leetcode.com/problems/valid-sudoku/'),
('Longest Consecutive Sequence', 'longest-consecutive-sequence', 'medium', 'https://leetcode.com/problems/longest-consecutive-sequence/'),
('Encode and Decode Strings', 'encode-and-decode-strings', 'medium', 'https://leetcode.com/problems/encode-and-decode-strings/'),
('Sort Colors', 'sort-colors', 'medium', 'https://leetcode.com/problems/sort-colors/'),
('Next Permutation', 'next-permutation', 'medium', 'https://leetcode.com/problems/next-permutation/'),
('Pascals Triangle', 'pascals-triangle', 'easy', 'https://leetcode.com/problems/pascals-triangle/'),
('Set Matrix Zeroes', 'set-matrix-zeroes', 'medium', 'https://leetcode.com/problems/set-matrix-zeroes/'),
('Rotate Image', 'rotate-image', 'medium', 'https://leetcode.com/problems/rotate-image/'),
('Spiral Matrix', 'spiral-matrix', 'medium', 'https://leetcode.com/problems/spiral-matrix/'),
('Merge Intervals', 'merge-intervals', 'medium', 'https://leetcode.com/problems/merge-intervals/'),
('Merge Sorted Array', 'merge-sorted-array', 'easy', 'https://leetcode.com/problems/merge-sorted-array/'),
('Find the Duplicate Number', 'find-the-duplicate-number', 'medium', 'https://leetcode.com/problems/find-the-duplicate-number/'),
('Majority Element', 'majority-element', 'easy', 'https://leetcode.com/problems/majority-element/'),
('Majority Element II', 'majority-element-ii', 'medium', 'https://leetcode.com/problems/majority-element-ii/'),
('Unique Paths', 'unique-paths', 'medium', 'https://leetcode.com/problems/unique-paths/'),
('Reverse Pairs', 'reverse-pairs', 'hard', 'https://leetcode.com/problems/reverse-pairs/'),
('4Sum', '4sum', 'medium', 'https://leetcode.com/problems/4sum/'),
('Maximum Subarray', 'maximum-subarray', 'medium', 'https://leetcode.com/problems/maximum-subarray/'),
('Maximum Product Subarray', 'maximum-product-subarray', 'medium', 'https://leetcode.com/problems/maximum-product-subarray/'),
('Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'easy', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'),
('Remove Duplicates from Sorted Array', 'remove-duplicates-from-sorted-array', 'easy', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/'),
('Max Consecutive Ones', 'max-consecutive-ones', 'easy', 'https://leetcode.com/problems/max-consecutive-ones/'),
('Pow(x, n)', 'powx-n', 'medium', 'https://leetcode.com/problems/powx-n/'),
('3Sum', '3sum', 'medium', 'https://leetcode.com/problems/3sum/'),
('Container With Most Water', 'container-with-most-water', 'medium', 'https://leetcode.com/problems/container-with-most-water/'),
('Trapping Rain Water', 'trapping-rain-water', 'hard', 'https://leetcode.com/problems/trapping-rain-water/'),
('Valid Palindrome', 'valid-palindrome', 'easy', 'https://leetcode.com/problems/valid-palindrome/'),
('Two Sum II', 'two-sum-ii-input-array-is-sorted', 'medium', 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/'),
('Assign Cookies', 'assign-cookies', 'easy', 'https://leetcode.com/problems/assign-cookies/'),
('Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'medium', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'),
('Longest Repeating Character Replacement', 'longest-repeating-character-replacement', 'medium', 'https://leetcode.com/problems/longest-repeating-character-replacement/'),
('Permutation in String', 'permutation-in-string', 'medium', 'https://leetcode.com/problems/permutation-in-string/'),
('Minimum Window Substring', 'minimum-window-substring', 'hard', 'https://leetcode.com/problems/minimum-window-substring/'),
('Sliding Window Maximum', 'sliding-window-maximum', 'hard', 'https://leetcode.com/problems/sliding-window-maximum/'),
('Valid Parentheses', 'valid-parentheses', 'easy', 'https://leetcode.com/problems/valid-parentheses/'),
('Min Stack', 'min-stack', 'medium', 'https://leetcode.com/problems/min-stack/'),
('Evaluate Reverse Polish Notation', 'evaluate-reverse-polish-notation', 'medium', 'https://leetcode.com/problems/evaluate-reverse-polish-notation/'),
('Generate Parentheses', 'generate-parentheses', 'medium', 'https://leetcode.com/problems/generate-parentheses/'),
('Daily Temperatures', 'daily-temperatures', 'medium', 'https://leetcode.com/problems/daily-temperatures/'),
('Car Fleet', 'car-fleet', 'medium', 'https://leetcode.com/problems/car-fleet/'),
('Largest Rectangle in Histogram', 'largest-rectangle-in-histogram', 'hard', 'https://leetcode.com/problems/largest-rectangle-in-histogram/'),
('Next Greater Element I', 'next-greater-element-i', 'easy', 'https://leetcode.com/problems/next-greater-element-i/'),
('Implement Stack using Queues', 'implement-stack-using-queues', 'easy', 'https://leetcode.com/problems/implement-stack-using-queues/'),
('Implement Queue using Stacks', 'implement-queue-using-stacks', 'easy', 'https://leetcode.com/problems/implement-queue-using-stacks/'),
('Online Stock Span', 'online-stock-span', 'medium', 'https://leetcode.com/problems/online-stock-span/'),
('LFU Cache', 'lfu-cache', 'hard', 'https://leetcode.com/problems/lfu-cache/'),
('Rotting Oranges', 'rotting-oranges', 'medium', 'https://leetcode.com/problems/rotting-oranges/'),
('Binary Search', 'binary-search', 'easy', 'https://leetcode.com/problems/binary-search/'),
('Search a 2D Matrix', 'search-a-2d-matrix', 'medium', 'https://leetcode.com/problems/search-a-2d-matrix/'),
('Koko Eating Bananas', 'koko-eating-bananas', 'medium', 'https://leetcode.com/problems/koko-eating-bananas/'),
('Find Minimum in Rotated Sorted Array', 'find-minimum-in-rotated-sorted-array', 'medium', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'),
('Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'medium', 'https://leetcode.com/problems/search-in-rotated-sorted-array/'),
('Time Based Key Value Store', 'time-based-key-value-store', 'medium', 'https://leetcode.com/problems/time-based-key-value-store/'),
('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'hard', 'https://leetcode.com/problems/median-of-two-sorted-arrays/'),
('Single Element in a Sorted Array', 'single-element-in-a-sorted-array', 'medium', 'https://leetcode.com/problems/single-element-in-a-sorted-array/'),
('Find Median from Data Stream', 'find-median-from-data-stream', 'hard', 'https://leetcode.com/problems/find-median-from-data-stream/'),
('Reverse Linked List', 'reverse-linked-list', 'easy', 'https://leetcode.com/problems/reverse-linked-list/'),
('Merge Two Sorted Lists', 'merge-two-sorted-lists', 'easy', 'https://leetcode.com/problems/merge-two-sorted-lists/'),
('Reorder List', 'reorder-list', 'medium', 'https://leetcode.com/problems/reorder-list/'),
('Remove Nth Node From End of List', 'remove-nth-node-from-end-of-list', 'medium', 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'),
('Copy List with Random Pointer', 'copy-list-with-random-pointer', 'medium', 'https://leetcode.com/problems/copy-list-with-random-pointer/'),
('Add Two Numbers', 'add-two-numbers', 'medium', 'https://leetcode.com/problems/add-two-numbers/'),
('Linked List Cycle', 'linked-list-cycle', 'easy', 'https://leetcode.com/problems/linked-list-cycle/'),
('Linked List Cycle II', 'linked-list-cycle-ii', 'medium', 'https://leetcode.com/problems/linked-list-cycle-ii/'),
('LRU Cache', 'lru-cache', 'medium', 'https://leetcode.com/problems/lru-cache/'),
('Merge K Sorted Lists', 'merge-k-sorted-lists', 'hard', 'https://leetcode.com/problems/merge-k-sorted-lists/'),
('Reverse Nodes in K Group', 'reverse-nodes-in-k-group', 'hard', 'https://leetcode.com/problems/reverse-nodes-in-k-group/'),
('Middle of the Linked List', 'middle-of-the-linked-list', 'easy', 'https://leetcode.com/problems/middle-of-the-linked-list/'),
('Delete Node in a Linked List', 'delete-node-in-a-linked-list', 'medium', 'https://leetcode.com/problems/delete-node-in-a-linked-list/'),
('Intersection of Two Linked Lists', 'intersection-of-two-linked-lists', 'easy', 'https://leetcode.com/problems/intersection-of-two-linked-lists/'),
('Palindrome Linked List', 'palindrome-linked-list', 'easy', 'https://leetcode.com/problems/palindrome-linked-list/'),
('Rotate List', 'rotate-list', 'medium', 'https://leetcode.com/problems/rotate-list/'),
('Invert Binary Tree', 'invert-binary-tree', 'easy', 'https://leetcode.com/problems/invert-binary-tree/'),
('Maximum Depth of Binary Tree', 'maximum-depth-of-binary-tree', 'easy', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'),
('Diameter of Binary Tree', 'diameter-of-binary-tree', 'easy', 'https://leetcode.com/problems/diameter-of-binary-tree/'),
('Balanced Binary Tree', 'balanced-binary-tree', 'easy', 'https://leetcode.com/problems/balanced-binary-tree/'),
('Same Tree', 'same-tree', 'easy', 'https://leetcode.com/problems/same-tree/'),
('Subtree of Another Tree', 'subtree-of-another-tree', 'easy', 'https://leetcode.com/problems/subtree-of-another-tree/'),
('Lowest Common Ancestor of a BST', 'lowest-common-ancestor-of-a-binary-search-tree', 'medium', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/'),
('Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal', 'medium', 'https://leetcode.com/problems/binary-tree-level-order-traversal/'),
('Binary Tree Right Side View', 'binary-tree-right-side-view', 'medium', 'https://leetcode.com/problems/binary-tree-right-side-view/'),
('Count Good Nodes in Binary Tree', 'count-good-nodes-in-binary-tree', 'medium', 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/'),
('Validate Binary Search Tree', 'validate-binary-search-tree', 'medium', 'https://leetcode.com/problems/validate-binary-search-tree/'),
('Kth Smallest Element in a BST', 'kth-smallest-element-in-a-bst', 'medium', 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/'),
('Construct Binary Tree from Preorder and Inorder', 'construct-binary-tree-from-preorder-and-inorder-traversal', 'medium', 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/'),
('Binary Tree Maximum Path Sum', 'binary-tree-maximum-path-sum', 'hard', 'https://leetcode.com/problems/binary-tree-maximum-path-sum/'),
('Serialize and Deserialize Binary Tree', 'serialize-and-deserialize-binary-tree', 'hard', 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/'),
('Binary Tree Inorder Traversal', 'binary-tree-inorder-traversal', 'easy', 'https://leetcode.com/problems/binary-tree-inorder-traversal/'),
('Binary Tree Preorder Traversal', 'binary-tree-preorder-traversal', 'easy', 'https://leetcode.com/problems/binary-tree-preorder-traversal/'),
('Binary Tree Postorder Traversal', 'binary-tree-postorder-traversal', 'easy', 'https://leetcode.com/problems/binary-tree-postorder-traversal/'),
('Symmetric Tree', 'symmetric-tree', 'easy', 'https://leetcode.com/problems/symmetric-tree/'),
('Binary Tree Zigzag Level Order Traversal', 'binary-tree-zigzag-level-order-traversal', 'medium', 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/'),
('Flatten Binary Tree to Linked List', 'flatten-binary-tree-to-linked-list', 'medium', 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/'),
('Construct Binary Tree from Inorder and Postorder', 'construct-binary-tree-from-inorder-and-postorder-traversal', 'medium', 'https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/'),
('Maximum Width of Binary Tree', 'maximum-width-of-binary-tree', 'medium', 'https://leetcode.com/problems/maximum-width-of-binary-tree/'),
('Vertical Order Traversal of a Binary Tree', 'vertical-order-traversal-of-a-binary-tree', 'hard', 'https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/'),
('Lowest Common Ancestor of a Binary Tree', 'lowest-common-ancestor-of-a-binary-tree', 'medium', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/'),
('Search in a Binary Search Tree', 'search-in-a-binary-search-tree', 'easy', 'https://leetcode.com/problems/search-in-a-binary-search-tree/'),
('Convert Sorted Array to Binary Search Tree', 'convert-sorted-array-to-binary-search-tree', 'easy', 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/'),
('Construct BST from Preorder Traversal', 'construct-binary-search-tree-from-preorder-traversal', 'medium', 'https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/'),
('Two Sum IV - Input is a BST', 'two-sum-iv-input-is-a-bst', 'easy', 'https://leetcode.com/problems/two-sum-iv-input-is-a-bst/'),
('Binary Search Tree Iterator', 'binary-search-tree-iterator', 'medium', 'https://leetcode.com/problems/binary-search-tree-iterator/'),
('Populating Next Right Pointers', 'populating-next-right-pointers-in-each-node', 'medium', 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/'),
('Implement Trie', 'implement-trie-prefix-tree', 'medium', 'https://leetcode.com/problems/implement-trie-prefix-tree/'),
('Design Add and Search Words', 'design-add-and-search-words-data-structure', 'medium', 'https://leetcode.com/problems/design-add-and-search-words-data-structure/'),
('Word Search II', 'word-search-ii', 'hard', 'https://leetcode.com/problems/word-search-ii/'),
('Number of Islands', 'number-of-islands', 'medium', 'https://leetcode.com/problems/number-of-islands/'),
('Clone Graph', 'clone-graph', 'medium', 'https://leetcode.com/problems/clone-graph/'),
('Pacific Atlantic Water Flow', 'pacific-atlantic-water-flow', 'medium', 'https://leetcode.com/problems/pacific-atlantic-water-flow/'),
('Course Schedule', 'course-schedule', 'medium', 'https://leetcode.com/problems/course-schedule/'),
('Course Schedule II', 'course-schedule-ii', 'medium', 'https://leetcode.com/problems/course-schedule-ii/'),
('Number of Connected Components', 'number-of-connected-components-in-an-undirected-graph', 'medium', 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/'),
('Graph Valid Tree', 'graph-valid-tree', 'medium', 'https://leetcode.com/problems/graph-valid-tree/'),
('Word Ladder', 'word-ladder', 'hard', 'https://leetcode.com/problems/word-ladder/'),
('Surrounded Regions', 'surrounded-regions', 'medium', 'https://leetcode.com/problems/surrounded-regions/'),
('Redundant Connection', 'redundant-connection', 'medium', 'https://leetcode.com/problems/redundant-connection/'),
('Walls and Gates', 'walls-and-gates', 'medium', 'https://leetcode.com/problems/walls-and-gates/'),
('Cheapest Flights Within K Stops', 'cheapest-flights-within-k-stops', 'medium', 'https://leetcode.com/problems/cheapest-flights-within-k-stops/'),
('Network Delay Time', 'network-delay-time', 'medium', 'https://leetcode.com/problems/network-delay-time/'),
('Swim in Rising Water', 'swim-in-rising-water', 'hard', 'https://leetcode.com/problems/swim-in-rising-water/'),
('Alien Dictionary', 'alien-dictionary', 'hard', 'https://leetcode.com/problems/alien-dictionary/'),
('Min Cost to Connect All Points', 'min-cost-to-connect-all-points', 'medium', 'https://leetcode.com/problems/min-cost-to-connect-all-points/'),
('Climbing Stairs', 'climbing-stairs', 'easy', 'https://leetcode.com/problems/climbing-stairs/'),
('Min Cost Climbing Stairs', 'min-cost-climbing-stairs', 'easy', 'https://leetcode.com/problems/min-cost-climbing-stairs/'),
('House Robber', 'house-robber', 'medium', 'https://leetcode.com/problems/house-robber/'),
('House Robber II', 'house-robber-ii', 'medium', 'https://leetcode.com/problems/house-robber-ii/'),
('Longest Palindromic Substring', 'longest-palindromic-substring', 'medium', 'https://leetcode.com/problems/longest-palindromic-substring/'),
('Palindromic Substrings', 'palindromic-substrings', 'medium', 'https://leetcode.com/problems/palindromic-substrings/'),
('Decode Ways', 'decode-ways', 'medium', 'https://leetcode.com/problems/decode-ways/'),
('Coin Change', 'coin-change', 'medium', 'https://leetcode.com/problems/coin-change/'),
('Coin Change II', 'coin-change-2', 'medium', 'https://leetcode.com/problems/coin-change-2/'),
('Word Break', 'word-break', 'medium', 'https://leetcode.com/problems/word-break/'),
('Longest Increasing Subsequence', 'longest-increasing-subsequence', 'medium', 'https://leetcode.com/problems/longest-increasing-subsequence/'),
('Longest Common Subsequence', 'longest-common-subsequence', 'medium', 'https://leetcode.com/problems/longest-common-subsequence/'),
('Partition Equal Subset Sum', 'partition-equal-subset-sum', 'medium', 'https://leetcode.com/problems/partition-equal-subset-sum/'),
('Unique Paths II', 'unique-paths-ii', 'medium', 'https://leetcode.com/problems/unique-paths-ii/'),
('Jump Game', 'jump-game', 'medium', 'https://leetcode.com/problems/jump-game/'),
('Jump Game II', 'jump-game-ii', 'medium', 'https://leetcode.com/problems/jump-game-ii/'),
('Target Sum', 'target-sum', 'medium', 'https://leetcode.com/problems/target-sum/'),
('Interleaving String', 'interleaving-string', 'medium', 'https://leetcode.com/problems/interleaving-string/'),
('Edit Distance', 'edit-distance', 'medium', 'https://leetcode.com/problems/edit-distance/'),
('Distinct Subsequences', 'distinct-subsequences', 'hard', 'https://leetcode.com/problems/distinct-subsequences/'),
('Burst Balloons', 'burst-balloons', 'hard', 'https://leetcode.com/problems/burst-balloons/'),
('Regular Expression Matching', 'regular-expression-matching', 'hard', 'https://leetcode.com/problems/regular-expression-matching/'),
('Minimum Insertion Steps to Make a String Palindrome', 'minimum-insertion-steps-to-make-a-string-palindrome', 'hard', 'https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/'),
('Combination Sum', 'combination-sum', 'medium', 'https://leetcode.com/problems/combination-sum/'),
('Combination Sum II', 'combination-sum-ii', 'medium', 'https://leetcode.com/problems/combination-sum-ii/'),
('Sum of Two Integers', 'sum-of-two-integers', 'medium', 'https://leetcode.com/problems/sum-of-two-integers/'),
('Number of 1 Bits', 'number-of-1-bits', 'easy', 'https://leetcode.com/problems/number-of-1-bits/'),
('Counting Bits', 'counting-bits', 'easy', 'https://leetcode.com/problems/counting-bits/'),
('Missing Number', 'missing-number', 'easy', 'https://leetcode.com/problems/missing-number/'),
('Reverse Bits', 'reverse-bits', 'easy', 'https://leetcode.com/problems/reverse-bits/'),
('Single Number', 'single-number', 'easy', 'https://leetcode.com/problems/single-number/'),
('Longest Common Prefix', 'longest-common-prefix', 'easy', 'https://leetcode.com/problems/longest-common-prefix/'),
('Reverse Words in a String', 'reverse-words-in-a-string', 'medium', 'https://leetcode.com/problems/reverse-words-in-a-string/'),
('Roman to Integer', 'roman-to-integer', 'easy', 'https://leetcode.com/problems/roman-to-integer/'),
('String to Integer (atoi)', 'string-to-integer-atoi', 'medium', 'https://leetcode.com/problems/string-to-integer-atoi/'),
('Count and Say', 'count-and-say', 'medium', 'https://leetcode.com/problems/count-and-say/'),
('Compare Version Numbers', 'compare-version-numbers', 'medium', 'https://leetcode.com/problems/compare-version-numbers/'),
('Palindrome Number', 'palindrome-number', 'easy', 'https://leetcode.com/problems/palindrome-number/'),
('Repeated String Match', 'repeated-string-match', 'medium', 'https://leetcode.com/problems/repeated-string-match/'),
('Insert Interval', 'insert-interval', 'medium', 'https://leetcode.com/problems/insert-interval/'),
('Non-overlapping Intervals', 'non-overlapping-intervals', 'medium', 'https://leetcode.com/problems/non-overlapping-intervals/'),
('Meeting Rooms', 'meeting-rooms', 'easy', 'https://leetcode.com/problems/meeting-rooms/'),
('Meeting Rooms II', 'meeting-rooms-ii', 'medium', 'https://leetcode.com/problems/meeting-rooms-ii/'),
('Minimum Interval to Include Each Query', 'minimum-interval-to-include-each-query', 'hard', 'https://leetcode.com/problems/minimum-interval-to-include-each-query/'),
('Subsets', 'subsets', 'medium', 'https://leetcode.com/problems/subsets/'),
('Subsets II', 'subsets-ii', 'medium', 'https://leetcode.com/problems/subsets-ii/'),
('Permutations', 'permutations', 'medium', 'https://leetcode.com/problems/permutations/'),
('Permutation Sequence', 'permutation-sequence', 'hard', 'https://leetcode.com/problems/permutation-sequence/'),
('Word Search', 'word-search', 'medium', 'https://leetcode.com/problems/word-search/'),
('N-Queens', 'n-queens', 'hard', 'https://leetcode.com/problems/n-queens/'),
('Sudoku Solver', 'sudoku-solver', 'hard', 'https://leetcode.com/problems/sudoku-solver/'),
('Letter Combinations of a Phone Number', 'letter-combinations-of-a-phone-number', 'medium', 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/'),
('Combination Sum III', 'combination-sum-iii', 'medium', 'https://leetcode.com/problems/combination-sum-iii/'),
('Kth Largest Element in a Stream', 'kth-largest-element-in-a-stream', 'easy', 'https://leetcode.com/problems/kth-largest-element-in-a-stream/'),
('Last Stone Weight', 'last-stone-weight', 'easy', 'https://leetcode.com/problems/last-stone-weight/'),
('K Closest Points to Origin', 'k-closest-points-to-origin', 'medium', 'https://leetcode.com/problems/k-closest-points-to-origin/'),
('Kth Largest Element in an Array', 'kth-largest-element-in-an-array', 'medium', 'https://leetcode.com/problems/kth-largest-element-in-an-array/'),
('Task Scheduler', 'task-scheduler', 'medium', 'https://leetcode.com/problems/task-scheduler/'),
('Design Twitter', 'design-twitter', 'medium', 'https://leetcode.com/problems/design-twitter/'),
('Gas Station', 'gas-station', 'medium', 'https://leetcode.com/problems/gas-station/'),
('Hand of Straights', 'hand-of-straights', 'medium', 'https://leetcode.com/problems/hand-of-straights/'),
('Merge Triplets to Form Target Triplet', 'merge-triplets-to-form-target-triplet', 'medium', 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/'),
('Partition Labels', 'partition-labels', 'medium', 'https://leetcode.com/problems/partition-labels/'),
('Valid Parenthesis String', 'valid-parenthesis-string', 'medium', 'https://leetcode.com/problems/valid-parenthesis-string/'),
('Happy Number', 'happy-number', 'easy', 'https://leetcode.com/problems/happy-number/'),
('Plus One', 'plus-one', 'easy', 'https://leetcode.com/problems/plus-one/'),
('Detect Squares', 'detect-squares', 'medium', 'https://leetcode.com/problems/detect-squares/'),
('Maximum Length of Repeated Subarray', 'maximum-length-of-repeated-subarray', 'medium', 'https://leetcode.com/problems/maximum-length-of-repeated-subarray/'),
('0/1 Knapsack Problem', 'ones-and-zeroes', 'medium', 'https://leetcode.com/problems/ones-and-zeroes/')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, difficulty = EXCLUDED.difficulty, url = COALESCE(EXCLUDED.url, problems.url);

-- ── Link problems to Blind 75 sheet ──
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, row_number() OVER (ORDER BY p.title) - 1
FROM sheets s, problems p
WHERE s.slug = 'blind-75' AND p.slug IN (
  'two-sum','contains-duplicate','valid-anagram','group-anagrams','top-k-frequent-elements',
  'product-of-array-except-self','longest-consecutive-sequence','best-time-to-buy-and-sell-stock',
  'maximum-subarray','maximum-product-subarray','find-minimum-in-rotated-sorted-array',
  'search-in-rotated-sorted-array','3sum','container-with-most-water',
  'sum-of-two-integers','number-of-1-bits','counting-bits','missing-number','reverse-bits',
  'climbing-stairs','coin-change-2','longest-increasing-subsequence','longest-common-subsequence',
  'word-break','combination-sum','house-robber','house-robber-ii','decode-ways','unique-paths','jump-game',
  'clone-graph','course-schedule','pacific-atlantic-water-flow','number-of-islands',
  'longest-consecutive-sequence','alien-dictionary','graph-valid-tree',
  'insert-interval','merge-intervals','non-overlapping-intervals','meeting-rooms','meeting-rooms-ii',
  'reverse-linked-list','linked-list-cycle','merge-two-sorted-lists','merge-k-sorted-lists',
  'remove-nth-node-from-end-of-list','reorder-list',
  'set-matrix-zeroes','spiral-matrix','rotate-image','word-search',
  'longest-substring-without-repeating-characters','longest-repeating-character-replacement',
  'minimum-window-substring','valid-anagram','group-anagrams','valid-parentheses',
  'palindrome-number','longest-palindromic-substring','palindromic-substrings','encode-and-decode-strings',
  'maximum-depth-of-binary-tree','same-tree','invert-binary-tree','binary-tree-maximum-path-sum',
  'binary-tree-level-order-traversal','serialize-and-deserialize-binary-tree','subtree-of-another-tree',
  'construct-binary-tree-from-inorder-and-postorder-traversal','validate-binary-search-tree',
  'kth-smallest-element-in-a-bst','lowest-common-ancestor-of-a-binary-search-tree',
  'implement-trie-prefix-tree','design-add-and-search-words-data-structure','word-search-ii',
  'find-median-from-data-stream'
)
ON CONFLICT (sheet_id, problem_id) DO NOTHING;

-- ── Link problems to NeetCode 150 sheet ──
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, row_number() OVER (ORDER BY p.title) - 1
FROM sheets s, problems p
WHERE s.slug = 'neetcode-150' AND p.slug IN (
  'two-sum','contains-duplicate','valid-anagram','group-anagrams','top-k-frequent-elements',
  'product-of-array-except-self','valid-sudoku','longest-consecutive-sequence','encode-and-decode-strings',
  'valid-palindrome','two-sum-ii-input-array-is-sorted','3sum','container-with-most-water','trapping-rain-water',
  'valid-parentheses','min-stack','evaluate-reverse-polish-notation','generate-parentheses',
  'daily-temperatures','car-fleet','largest-rectangle-in-histogram',
  'binary-search','search-a-2d-matrix','koko-eating-bananas','find-minimum-in-rotated-sorted-array',
  'search-in-rotated-sorted-array','time-based-key-value-store','median-of-two-sorted-arrays',
  'best-time-to-buy-and-sell-stock','longest-substring-without-repeating-characters',
  'longest-repeating-character-replacement','permutation-in-string','minimum-window-substring','sliding-window-maximum',
  'reverse-linked-list','merge-two-sorted-lists','reorder-list','remove-nth-node-from-end-of-list',
  'copy-list-with-random-pointer','add-two-numbers','linked-list-cycle','find-the-duplicate-number',
  'lru-cache','merge-k-sorted-lists','reverse-nodes-in-k-group',
  'invert-binary-tree','maximum-depth-of-binary-tree','diameter-of-binary-tree','balanced-binary-tree',
  'same-tree','subtree-of-another-tree','lowest-common-ancestor-of-a-binary-search-tree',
  'binary-tree-level-order-traversal','binary-tree-right-side-view','count-good-nodes-in-binary-tree',
  'validate-binary-search-tree','kth-smallest-element-in-a-bst',
  'construct-binary-tree-from-preorder-and-inorder-traversal','binary-tree-maximum-path-sum',
  'serialize-and-deserialize-binary-tree',
  'implement-trie-prefix-tree','design-add-and-search-words-data-structure','word-search-ii',
  'kth-largest-element-in-a-stream','last-stone-weight','k-closest-points-to-origin',
  'kth-largest-element-in-an-array','task-scheduler','design-twitter','find-median-from-data-stream',
  'subsets','combination-sum','subsets-ii','permutations','combination-sum-ii',
  'word-search','letter-combinations-of-a-phone-number','n-queens','combination-sum-iii',
  'number-of-islands','clone-graph','pacific-atlantic-water-flow','course-schedule','course-schedule-ii',
  'redundant-connection','number-of-connected-components-in-an-undirected-graph','graph-valid-tree',
  'word-ladder','surrounded-regions','rotting-oranges','walls-and-gates',
  'cheapest-flights-within-k-stops','network-delay-time','swim-in-rising-water','alien-dictionary',
  'min-cost-to-connect-all-points',
  'climbing-stairs','min-cost-climbing-stairs','house-robber','house-robber-ii',
  'longest-palindromic-substring','palindromic-substrings','decode-ways','coin-change','maximum-product-subarray',
  'word-break','longest-increasing-subsequence','partition-equal-subset-sum','unique-paths',
  'longest-common-subsequence','target-sum','interleaving-string','coin-change-2','edit-distance',
  'distinct-subsequences','burst-balloons','regular-expression-matching',
  'maximum-subarray','jump-game','jump-game-ii','gas-station','hand-of-straights',
  'merge-triplets-to-form-target-triplet','partition-labels','valid-parenthesis-string',
  'insert-interval','merge-intervals','non-overlapping-intervals','meeting-rooms','meeting-rooms-ii',
  'minimum-interval-to-include-each-query',
  'rotate-image','spiral-matrix','set-matrix-zeroes','happy-number','plus-one','detect-squares',
  'sum-of-two-integers','number-of-1-bits','counting-bits','missing-number','reverse-bits','single-number'
)
ON CONFLICT (sheet_id, problem_id) DO NOTHING;

-- ── Link problems to Striver SDE Sheet ──
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, row_number() OVER (ORDER BY p.title) - 1
FROM sheets s, problems p
WHERE s.slug = 'striver-sde' AND p.slug IN (
  'set-matrix-zeroes','pascals-triangle','next-permutation','sort-colors','best-time-to-buy-and-sell-stock',
  'rotate-image','merge-intervals','merge-sorted-array','find-the-duplicate-number',
  'search-a-2d-matrix','powx-n','majority-element','majority-element-ii','unique-paths','reverse-pairs',
  'two-sum','4sum','longest-consecutive-sequence','longest-substring-without-repeating-characters',
  'reverse-linked-list','middle-of-the-linked-list','merge-two-sorted-lists','remove-nth-node-from-end-of-list',
  'add-two-numbers','delete-node-in-a-linked-list','intersection-of-two-linked-lists','linked-list-cycle',
  'reverse-nodes-in-k-group','palindrome-linked-list','linked-list-cycle-ii','rotate-list',
  'copy-list-with-random-pointer','3sum','trapping-rain-water','remove-duplicates-from-sorted-array',
  'max-consecutive-ones','assign-cookies','coin-change',
  'subsets-ii','combination-sum','combination-sum-ii','permutation-sequence','permutations',
  'n-queens','sudoku-solver',
  'single-element-in-a-sorted-array','search-in-rotated-sorted-array','median-of-two-sorted-arrays',
  'find-median-from-data-stream','top-k-frequent-elements',
  'implement-stack-using-queues','implement-queue-using-stacks','valid-parentheses','next-greater-element-i',
  'lfu-cache','largest-rectangle-in-histogram','sliding-window-maximum','min-stack',
  'online-stock-span','rotting-oranges',
  'reverse-words-in-a-string','longest-palindromic-substring','roman-to-integer','string-to-integer-atoi',
  'longest-common-prefix','repeated-string-match','valid-anagram','count-and-say','compare-version-numbers',
  'minimum-insertion-steps-to-make-a-string-palindrome',
  'binary-tree-inorder-traversal','binary-tree-preorder-traversal','binary-tree-postorder-traversal',
  'binary-tree-right-side-view','vertical-order-traversal-of-a-binary-tree','maximum-width-of-binary-tree',
  'binary-tree-level-order-traversal','maximum-depth-of-binary-tree','diameter-of-binary-tree',
  'balanced-binary-tree','lowest-common-ancestor-of-a-binary-tree','same-tree',
  'binary-tree-zigzag-level-order-traversal','binary-tree-maximum-path-sum',
  'construct-binary-tree-from-preorder-and-inorder-traversal','construct-binary-tree-from-inorder-and-postorder-traversal',
  'symmetric-tree','flatten-binary-tree-to-linked-list',
  'populating-next-right-pointers-in-each-node','search-in-a-binary-search-tree',
  'convert-sorted-array-to-binary-search-tree','construct-binary-search-tree-from-preorder-traversal',
  'validate-binary-search-tree','lowest-common-ancestor-of-a-binary-search-tree',
  'kth-smallest-element-in-a-bst','two-sum-iv-input-is-a-bst','binary-search-tree-iterator',
  'number-of-islands','clone-graph','course-schedule','word-ladder',
  'climbing-stairs','coin-change','coin-change-2','longest-increasing-subsequence','longest-common-subsequence',
  'word-break','house-robber','edit-distance','maximum-subarray',
  'implement-trie-prefix-tree'
)
ON CONFLICT (sheet_id, problem_id) DO NOTHING;

-- ── Link problems to Love Babbar 450 sheet (LeetCode subset) ──
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, row_number() OVER (ORDER BY p.title) - 1
FROM sheets s, problems p
WHERE s.slug = 'love-babbar-450' AND p.slug IN (
  'reverse-linked-list','reverse-bits','find-the-duplicate-number','sort-colors',
  'maximum-subarray','merge-intervals','next-permutation','counting-bits',
  'best-time-to-buy-and-sell-stock','contains-duplicate','product-of-array-except-self',
  'set-matrix-zeroes','rotate-image','spiral-matrix','two-sum','3sum','4sum',
  'longest-consecutive-sequence','trapping-rain-water','merge-sorted-array',
  'majority-element','powx-n','missing-number','single-number',
  'valid-parentheses','min-stack','sliding-window-maximum','largest-rectangle-in-histogram',
  'binary-search','search-in-rotated-sorted-array','find-minimum-in-rotated-sorted-array',
  'median-of-two-sorted-arrays','kth-largest-element-in-an-array',
  'reverse-linked-list','merge-two-sorted-lists','linked-list-cycle','linked-list-cycle-ii',
  'remove-nth-node-from-end-of-list','add-two-numbers','palindrome-linked-list',
  'intersection-of-two-linked-lists','reverse-nodes-in-k-group','merge-k-sorted-lists',
  'invert-binary-tree','maximum-depth-of-binary-tree','same-tree','balanced-binary-tree',
  'binary-tree-level-order-traversal','binary-tree-zigzag-level-order-traversal',
  'binary-tree-inorder-traversal','binary-tree-preorder-traversal','binary-tree-postorder-traversal',
  'lowest-common-ancestor-of-a-binary-tree','validate-binary-search-tree',
  'kth-smallest-element-in-a-bst','diameter-of-binary-tree','binary-tree-maximum-path-sum',
  'serialize-and-deserialize-binary-tree',
  'number-of-islands','course-schedule','clone-graph','word-ladder',
  'surrounded-regions','pacific-atlantic-water-flow',
  'climbing-stairs','house-robber','house-robber-ii','coin-change','longest-increasing-subsequence',
  'longest-common-subsequence','word-break','edit-distance','unique-paths','jump-game',
  'partition-equal-subset-sum','target-sum','combination-sum',
  'longest-substring-without-repeating-characters','longest-repeating-character-replacement',
  'minimum-window-substring','permutation-in-string',
  'longest-palindromic-substring','valid-anagram','group-anagrams','longest-common-prefix',
  'implement-trie-prefix-tree','word-search','word-search-ii',
  'subsets','subsets-ii','permutations','n-queens','sudoku-solver',
  'number-of-1-bits','counting-bits','reverse-bits','missing-number','sum-of-two-integers',
  'find-median-from-data-stream','top-k-frequent-elements','task-scheduler',
  'insert-interval','non-overlapping-intervals','merge-intervals'
)
ON CONFLICT (sheet_id, problem_id) DO NOTHING;

-- ── Link problems to Grind 75 sheet (same as Blind 75 + extras) ──
INSERT INTO sheet_problems (sheet_id, problem_id, position)
SELECT s.id, p.id, row_number() OVER (ORDER BY p.title) - 1
FROM sheets s, problems p
WHERE s.slug = 'grind-75' AND p.slug IN (
  'two-sum','valid-parentheses','merge-two-sorted-lists','best-time-to-buy-and-sell-stock',
  'valid-palindrome','invert-binary-tree','valid-anagram','binary-search','linked-list-cycle',
  'maximum-depth-of-binary-tree','single-number','climbing-stairs','balanced-binary-tree',
  'reverse-linked-list','majority-element','add-two-numbers','contains-duplicate',
  'maximum-subarray','3sum','product-of-array-except-self','longest-substring-without-repeating-characters',
  'group-anagrams','coin-change','number-of-islands','min-stack','evaluate-reverse-polish-notation',
  'implement-trie-prefix-tree','course-schedule','validate-binary-search-tree',
  'binary-tree-level-order-traversal','lowest-common-ancestor-of-a-binary-search-tree',
  'kth-smallest-element-in-a-bst','word-break','clone-graph','insert-interval',
  'merge-intervals','sort-colors','combination-sum','subsets','permutations',
  'binary-tree-right-side-view','longest-palindromic-substring','unique-paths',
  'construct-binary-tree-from-preorder-and-inorder-traversal','container-with-most-water',
  'letter-combinations-of-a-phone-number','find-minimum-in-rotated-sorted-array',
  'longest-repeating-character-replacement','house-robber','search-in-rotated-sorted-array',
  'decode-ways','longest-increasing-subsequence','coin-change-2','target-sum',
  'partition-equal-subset-sum','word-search','top-k-frequent-elements','pacific-atlantic-water-flow',
  'minimum-window-substring','serialize-and-deserialize-binary-tree','trapping-rain-water',
  'find-median-from-data-stream','word-search-ii','alien-dictionary',
  'binary-tree-maximum-path-sum','merge-k-sorted-lists','largest-rectangle-in-histogram',
  'task-scheduler','lru-cache','kth-largest-element-in-an-array',
  'daily-temperatures','gas-station','diameter-of-binary-tree','happy-number'
)
ON CONFLICT (sheet_id, problem_id) DO NOTHING;

-- ── Add tag associations for common problems ──
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'two-sum' AND t.name = 'Array'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'two-sum' AND t.name = 'Hash Table'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'valid-anagram' AND t.name = 'String'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'valid-anagram' AND t.name = 'Hash Table'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'binary-search' AND t.name = 'Binary Search'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'reverse-linked-list' AND t.name = 'Linked List'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'invert-binary-tree' AND t.name = 'Tree'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'number-of-islands' AND t.name = 'Graph'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'climbing-stairs' AND t.name = 'Dynamic Programming'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'valid-parentheses' AND t.name = 'Stack'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'implement-trie-prefix-tree' AND t.name = 'Trie'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'coin-change' AND t.name = 'Dynamic Programming'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = '3sum' AND t.name = 'Two Pointers'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'sliding-window-maximum' AND t.name = 'Sliding Window'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'n-queens' AND t.name = 'Backtracking'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'find-median-from-data-stream' AND t.name = 'Heap'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'merge-intervals' AND t.name = 'Interval'
ON CONFLICT DO NOTHING;
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t WHERE p.slug = 'single-number' AND t.name = 'Bit Manipulation'
ON CONFLICT DO NOTHING;
