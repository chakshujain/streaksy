// ─────────────────────────────────────────────────────────────────────────────
// patterns-data.ts  –  The core data file powering the Streaksy patterns system
// ─────────────────────────────────────────────────────────────────────────────

// ── Visualization-specific interfaces ────────────────────────────────────────

export interface TreeNodeData {
  val: string | number;
  left?: TreeNodeData | null;
  right?: TreeNodeData | null;
  color?: 'default' | 'active' | 'visited' | 'found' | 'queued';
  label?: string;
}

export interface GNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: 'default' | 'active' | 'visited' | 'queued';
}

export interface GEdge {
  from: string;
  to: string;
  directed?: boolean;
  highlighted?: boolean;
  label?: string;
}

export interface LLNode {
  val: string | number;
  color?: 'default' | 'active' | 'visited' | 'found';
  label?: string;
}

export interface DPCell {
  value: string | number;
  color?: 'default' | 'active' | 'computed' | 'optimal';
}

export interface TrieData {
  words: string[];
  highlightPath?: string;
  endNodes?: string[];
}

// ── Pedagogical interfaces ──────────────────────────────────────────────────

export interface PracticeProblem {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  why: string;
}

export interface CommonMistake {
  mistake: string;
  explanation: string;
}

export interface PatternSignal {
  signal: string;
  example: string;
}

// ── Code & simulation interfaces ─────────────────────────────────────────────

export interface CodeSolution {
  language: 'python' | 'javascript' | 'java' | 'cpp';
  label: string;
  code: string;
}

export interface SimulationStep {
  description: string;
  array?: (number | string)[];
  highlights?: number[];
  pointers?: Record<string, number>;
  variables?: Record<string, string | number | boolean>;
  result?: string;
  stack?: (number | string)[];
  queue?: (number | string)[];
  grid?: (number | string)[][];
  gridHighlights?: [number, number][];
  windowRange?: [number, number];
  treeData?: TreeNodeData;
  graphNodes?: GNode[];
  graphEdges?: GEdge[];
  linkedList?: LLNode[];
  linkedListCycle?: number | null;
  dpTable?: DPCell[][];
  dpRowLabels?: string[];
  dpColLabels?: string[];
  trieData?: TrieData;
  stackVertical?: boolean;
  codeLine?: number;
  action: string;
  reason: string;
  state?: string;
}

// ── Pattern interfaces ───────────────────────────────────────────────────────

export interface PatternExample {
  title: string;
  problem: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  input: string;
  output: string;
  codes: CodeSolution[];
  steps: SimulationStep[];
  timeComplexity: string;
  spaceComplexity: string;
  dryRun?: string[];
}

export interface Pattern {
  slug: string;
  name: string;
  category: string;
  icon: string;
  color: string;

  // Backward compat (used by detail page)
  description: string;
  whatIsThis: string;
  realWorldAnalogy: string;
  whenToUse: string[];
  commonProblems: string[];

  // Section 1: Intuition (Real-Life Analogy)
  analogy: string;

  // Section 2: Problem It Solves
  problemItSolves: string;
  signals: PatternSignal[];

  // Section 3: Core Idea
  coreIdea: string;

  // Section 4-5: Simulation (inside examples)
  examples: PatternExample[];

  // Section 8: Common Mistakes
  commonMistakes: CommonMistake[];

  // Section 9: Pattern Recognition Tips
  recognitionTips: string[];

  // Section 10: Practice Problems
  practiceProblems: PracticeProblem[];

  // Keep existing
  relatedPatterns: string[];
  keyInsight: string;

  // Visual type hint for the listing page
  visualType: string;
}

// ── Categories ───────────────────────────────────────────────────────────────

export const patternCategories = [
  { name: 'Arrays & Strings', color: 'emerald' },
  { name: 'Linked Lists', color: 'blue' },
  { name: 'Trees & Graphs', color: 'purple' },
  { name: 'Dynamic Programming', color: 'amber' },
  { name: 'Advanced', color: 'red' },
];

// ── Patterns ─────────────────────────────────────────────────────────────────

export const patterns: Pattern[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  //  ARRAYS & STRINGS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 1. Two Pointers ────────────────────────────────────────────────────────
  {
    slug: 'two-pointers',
    name: 'Two Pointers',
    category: 'Arrays & Strings',
    icon: '👆',
    color: 'emerald',
    description:
      'Use two pointers moving towards each other or in the same direction to solve problems on sorted arrays or linked lists in O(n) time.',
    whatIsThis: `The Two Pointers technique is one of the most fundamental and widely-used patterns in coding interviews. The idea is simple: instead of using a single index to scan through an array, you use two indices (pointers) that move through the data in a coordinated way. This lets you compare or combine elements from different positions without needing expensive nested loops.

There are two main flavors. In the "opposite direction" version, you start one pointer at the beginning and the other at the end, and they walk toward each other until they meet. This is perfect for sorted arrays where you want to find pairs. In the "same direction" version, both pointers start at the beginning but one moves faster or under different conditions — great for removing duplicates or partitioning data.

The beauty of Two Pointers is that it reduces what would normally be an O(n squared) brute force approach down to O(n), because each pointer only moves forward (or backward) and never backtracks. Once you recognize the pattern, it shows up everywhere.`,
    realWorldAnalogy:
      'Imagine two people standing at opposite ends of a hallway lined with numbered lockers. They walk toward each other, and at each step they check whether the sum of their locker numbers hits a target. If the sum is too big, the person at the higher end steps toward the middle; if too small, the person at the lower end steps forward. They never backtrack, so they meet in the middle after just one pass.',
    analogy: `Imagine you and a friend are searching for each other in a long hallway. You start at opposite ends and walk towards each other, calling out numbers written on the doors as you go. Your goal is to find two doors whose numbers add up to a magic number. If the sum of your current two doors is too big, your friend (at the higher end) takes a step towards you. If the sum is too small, you take a step forward. You never need to backtrack because the hallway is sorted — moving inward always nudges the sum in the right direction.

Now picture a different scenario: you are both starting at the same end of the hallway, but one of you is the "scout" moving ahead quickly while the other stays behind to mark things. The scout races forward looking for something interesting, and when they find it, the person behind catches up. This is the "same direction" flavor — one pointer moves faster or conditionally while the other lags behind.

The magic is that neither of you ever walks backward. In a brute-force world, you would have to try every possible pair of doors — that is like having one person stand still while the other walks the entire hallway, then moving one step and repeating. Two Pointers slashes that from O(n squared) down to O(n) by being smart about which direction to step.`,
    problemItSolves: 'Two Pointers handles problems where you need to find pairs, triplets, or subarrays in a sorted (or sortable) dataset that satisfy some condition. It also excels at in-place array modifications like removing duplicates, partitioning, or comparing sequences from both ends.',
    signals: [
      { signal: '"sorted array" or "sort the array first"', example: 'Two Sum II, 3Sum, Container With Most Water' },
      { signal: '"find a pair/triplet that satisfies a condition"', example: 'Two Sum II, 3Sum, Pair with Target Sum' },
      { signal: '"compare elements from both ends"', example: 'Valid Palindrome, Trapping Rain Water' },
      { signal: '"remove duplicates in-place"', example: 'Remove Duplicates from Sorted Array' },
      { signal: '"partition or rearrange array"', example: 'Sort Colors (Dutch National Flag), Move Zeroes' },
    ],
    coreIdea: `Here is the core idea, step by step. You have a sorted array and you want to find two numbers that add up to a target. The brute force way would be to try every possible pair — that means two nested loops, which is O(n squared). Can we do better?

Yes! Because the array is sorted, we can be clever. Place one pointer at the very beginning (the smallest number) and another at the very end (the largest number). Calculate their sum.

If the sum equals the target, we are done — we found our pair. If the sum is too small, we need a bigger number. Since the array is sorted, the only way to increase the sum is to move the left pointer one step to the right (towards bigger numbers). If the sum is too big, we need a smaller number, so we move the right pointer one step to the left (towards smaller numbers).

Each step eliminates one element from consideration, and the two pointers never cross each other. When they meet, we have checked every meaningful pair. The total number of steps is at most n, giving us O(n) time.

For the "same direction" variant, think of it like a slow pointer and a fast pointer both starting at the beginning. The fast pointer scans ahead, and whenever it finds something useful, the slow pointer records it. For example, to remove duplicates in-place, the slow pointer marks the position for the next unique element, and the fast pointer skips over duplicates. Both pointers only move forward, so it is still O(n).`,
    visualType: 'array',
    whenToUse: [
      'Array or string is sorted (or can be sorted)',
      'Need to find pairs that satisfy a condition',
      'Need to compare elements from both ends',
      'Removing duplicates in-place',
    ],
    keyInsight:
      'By maintaining two pointers, we eliminate the need for nested loops, reducing O(n squared) to O(n).',
    examples: [
      {
        title: 'Two Sum II (Sorted Array)',
        problem: 'Given a sorted array, find two numbers that add up to a target.',
        difficulty: 'Medium',
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[1, 2]',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def twoSum(nums, target):
    # Start with two pointers at opposite ends
    left, right = 0, len(nums) - 1
    # Keep searching until the pointers meet
    while left < right:
        # Calculate the sum of the two pointed-at elements
        curr_sum = nums[left] + nums[right]
        if curr_sum == target:
            # Found it! Return 1-indexed positions
            return [left + 1, right + 1]
        elif curr_sum < target:
            # Sum too small — move left pointer right for a bigger number
            left += 1
        else:
            # Sum too big — move right pointer left for a smaller number
            right -= 1`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function twoSum(nums, target) {
  // Start with two pointers at opposite ends
  let left = 0, right = nums.length - 1;
  // Keep searching until the pointers meet
  while (left < right) {
    // Calculate the sum of the two pointed-at elements
    const sum = nums[left] + nums[right];
    if (sum === target) {
      // Found it! Return 1-indexed positions
      return [left + 1, right + 1];
    } else if (sum < target) {
      // Sum too small — move left pointer right for a bigger number
      left++;
    } else {
      // Sum too big — move right pointer left for a smaller number
      right--;
    }
  }
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public int[] twoSum(int[] nums, int target) {
    // Start with two pointers at opposite ends
    int left = 0, right = nums.length - 1;
    // Keep searching until the pointers meet
    while (left < right) {
        // Calculate the sum of the two pointed-at elements
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[]{left + 1, right + 1};
        else if (sum < target) left++;   // Need bigger sum
        else right--;                     // Need smaller sum
    }
    return new int[]{};
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `vector<int> twoSum(vector<int>& nums, int target) {
    // Start with two pointers at opposite ends
    int left = 0, right = nums.size() - 1;
    // Keep searching until the pointers meet
    while (left < right) {
        // Calculate the sum of the two pointed-at elements
        int sum = nums[left] + nums[right];
        if (sum == target) return {left + 1, right + 1};
        else if (sum < target) left++;   // Need bigger sum
        else right--;                     // Need smaller sum
    }
    return {};
}`,
          },
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        dryRun: [
          'Line 1: left=0 (pointing at 2), right=3 (pointing at 15). Target is 9.',
          'Line 4: curr_sum = nums[0] + nums[3] = 2 + 15 = 17. Not equal to 9.',
          'Line 8: 17 > 9, so we enter the else branch. right decrements to 2.',
          'Line 4: curr_sum = nums[0] + nums[2] = 2 + 11 = 13. Still > 9.',
          'Line 8: right decrements to 1.',
          'Line 4: curr_sum = nums[0] + nums[1] = 2 + 7 = 9. Equals target!',
          'Line 5-6: Return [0+1, 1+1] = [1, 2]. Done in just 3 iterations.',
        ],
        steps: [
          {
            description:
              'We start by placing one pointer at the very beginning (left = 0, pointing at 2) and another at the very end (right = 3, pointing at 15). Our target is 9. Think of it like two people starting at opposite ends of a sorted line of numbers.',
            action: 'Initialize two pointers at opposite ends of the array',
            reason: 'We need to examine pairs from both ends, moving inward based on the sum',
            state: 'left=0 (value 2), right=3 (value 15), target=9',
            array: [2, 7, 11, 15],
            pointers: { left: 0, right: 3 },
            variables: { target: 9, sum: '—' },
          },
          {
            description:
              'Now we check: 2 + 15 = 17. That is bigger than our target 9. Since the array is sorted, the only way to make the sum smaller is to move the right pointer one step to the left. The left number is already as small as possible, so the right number must come down.',
            action: 'Calculate sum and compare with target',
            reason: 'The current sum (17) is bigger than our target (9), so we need a smaller number on the right side',
            state: 'sum = 2 + 15 = 17 > 9, move right pointer left',
            array: [2, 7, 11, 15],
            pointers: { left: 0, right: 3 },
            highlights: [0, 3],
            variables: { target: 9, sum: 17 },
          },
          {
            description:
              'Right pointer moves to index 2. Now we check: 2 + 11 = 13. Still bigger than 9! Same logic applies — we need a smaller right number. Move right pointer left again.',
            action: 'Move the right pointer one step to the left',
            reason: 'The current sum (13) is still bigger than our target (9), so we need an even smaller right number',
            state: 'left=0 (value 2), right=2 (value 11), sum=13',
            array: [2, 7, 11, 15],
            pointers: { left: 0, right: 2 },
            highlights: [0, 2],
            variables: { target: 9, sum: 13 },
          },
          {
            description:
              'Right pointer is now at index 1. We check: 2 + 7 = 9. That is exactly our target! We found the pair. Return their 1-indexed positions: [1, 2]. Notice we only needed 3 checks instead of trying all 6 possible pairs.',
            action: 'Check sum — it matches the target!',
            reason: '2 + 7 = 9 equals our target, so we found the answer',
            state: 'left=0 (value 2), right=1 (value 7), sum=9 = target!',
            array: [2, 7, 11, 15],
            pointers: { left: 0, right: 1 },
            highlights: [0, 1],
            variables: { target: 9, sum: 9 },
            result: 'Return [1, 2]',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Forgetting the array must be sorted', explanation: 'Two Pointers from opposite ends only works on sorted data. If the array is unsorted, sort it first or use a hash map instead.' },
      { mistake: 'Using left <= right instead of left < right', explanation: 'If you use <=, both pointers can point to the same element, which would pair an element with itself. Use < to ensure they point to different elements.' },
      { mistake: 'Moving the wrong pointer', explanation: 'When the sum is too small, move the LEFT pointer right (to get a bigger number). When too big, move the RIGHT pointer left. Mixing these up leads to infinite loops or wrong answers.' },
      { mistake: 'Forgetting to handle duplicates in 3Sum', explanation: 'In 3Sum, after finding a valid triplet, you need to skip duplicate values for both pointers to avoid duplicate triplets in the result.' },
      { mistake: 'Returning 0-indexed when problem asks for 1-indexed', explanation: 'Some problems (like Two Sum II on LeetCode) use 1-based indexing. Always check what the problem expects and add 1 if needed.' },
    ],
    recognitionTips: [
      'The problem involves a sorted array (or one that can be sorted without losing information).',
      'You need to find pairs or triplets that meet a sum/difference condition.',
      'The problem asks to do something "in-place" with O(1) extra space.',
      'You see phrases like "two elements," "pair," "from both ends," or "partition."',
      'A brute-force approach would use nested loops over the same array.',
    ],
    practiceProblems: [
      { name: 'Valid Palindrome', difficulty: 'Easy', why: 'Classic two-pointer from both ends — compare characters moving inward.' },
      { name: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', why: 'The textbook opposite-direction two-pointer problem on a sorted array.' },
      { name: '3Sum', difficulty: 'Medium', why: 'Extends two pointers with an outer loop — great for mastering duplicate skipping.' },
      { name: 'Container With Most Water', difficulty: 'Medium', why: 'Two pointers from both ends with a non-obvious greedy shrinking logic.' },
      { name: 'Trapping Rain Water', difficulty: 'Hard', why: 'Advanced two-pointer that tracks left-max and right-max while moving inward.' },
    ],
    relatedPatterns: ['sliding-window', 'fast-slow-pointers'],
    commonProblems: [
      'Two Sum II',
      'Container With Most Water',
      '3Sum',
      'Trapping Rain Water',
      'Valid Palindrome',
    ],
  },

  // ── 2. Sliding Window ──────────────────────────────────────────────────────
  {
    slug: 'sliding-window',
    name: 'Sliding Window',
    category: 'Arrays & Strings',
    icon: '🪟',
    color: 'emerald',
    description:
      'Maintain a window that slides over data to track a subset of elements, converting nested loops into a single pass.',
    whatIsThis: `The Sliding Window pattern is all about efficiency. Instead of repeatedly recalculating something from scratch as you scan through an array or string, you keep a "window" — a contiguous chunk of elements — and update it incrementally as it slides one position at a time.

Picture a rectangular magnifying glass that you slide across a line of numbers. As the window moves right by one position, one element enters on the right side and one leaves on the left side. You update your running calculation by adding the new element and removing the old one. This turns what could be an O(n times k) operation into just O(n).

There are two flavors: fixed-size windows (where k stays constant) and variable-size windows (where you expand or shrink the window based on some condition, like "the window must contain at most 2 distinct characters"). Variable windows typically use a hashmap to track what is inside the window.`,
    realWorldAnalogy:
      'Think of looking at a train through a narrow window from a platform. You can only see 3 cars at a time. As the train moves, one car disappears off one side and a new one appears on the other. You never need to re-examine all the cars you have already seen — you just note what changed.',
    analogy: `Imagine you are looking through a window on a moving train. The window shows you a fixed portion of the scenery outside — say, three buildings at a time. As the train moves forward, a new building slides into view on the right while an old one disappears on the left. You do not need to study all the buildings from scratch each time — you just note the one that appeared and the one that left.

Now imagine your job is to find the most beautiful stretch of three consecutive buildings. Instead of stopping the train, getting off, walking the entire route, writing down every group of three, and comparing them all — you simply keep track of the current "beauty score" as the window slides. When a new building enters, add its score. When one leaves, subtract it. Update your best-so-far after each slide.

That is exactly what Sliding Window does with arrays and strings. The window is a contiguous chunk of elements. For fixed-size problems (like "max sum of k elements"), the window always has k items. For variable-size problems (like "shortest substring containing all characters"), the window grows and shrinks based on conditions. Either way, the key insight is that you only do O(1) work per slide instead of O(k) work, turning an O(n times k) brute force into a sleek O(n) pass.`,
    problemItSolves: 'Sliding Window solves problems involving contiguous subarrays or substrings where you need to find a maximum, minimum, or specific condition. It replaces the brute force of checking every possible subarray with an efficient single-pass approach that updates incrementally.',
    signals: [
      { signal: '"contiguous subarray/substring"', example: 'Maximum Sum Subarray, Minimum Window Substring' },
      { signal: '"of size k" or "window of length k"', example: 'Max Sum Subarray of Size K, Max of All Subarrays of Size K' },
      { signal: '"longest/shortest substring with condition"', example: 'Longest Substring Without Repeating Characters' },
      { signal: '"at most k distinct characters"', example: 'Longest Substring with At Most K Distinct Characters' },
      { signal: '"permutation/anagram in string"', example: 'Find All Anagrams in a String, Permutation in String' },
    ],
    coreIdea: `The core idea is beautifully simple: instead of recalculating from scratch every time you shift your view by one position, just update what changed.

For a fixed-size window of size k: First, compute the answer for the initial window (elements 0 through k-1). Then, slide the window one step right. The new element entering is at position k, and the element leaving is at position 0. Update your answer by adding the new one and subtracting the old one. Repeat until you reach the end.

For a variable-size window, the logic is slightly different. You maintain a "left" and "right" pointer. You expand the window by moving "right" forward, adding the new element to your tracking structure (often a hashmap). If the window violates a condition (like having too many distinct characters), you shrink it by moving "left" forward and removing that element from your tracking.

The reason this works so well is the overlap between consecutive windows. A window at position [i, i+k-1] and the next window at [i+1, i+k] share k-1 elements. Recalculating all k elements from scratch wastes work on those shared elements. By only processing the one element that enters and the one that leaves, each element is processed at most twice (once entering, once leaving), giving us O(n) total.

Think of it like a conveyor belt in a factory: items enter on one end and leave on the other, and the inspector only needs to note additions and removals rather than re-inspecting every item each second.`,
    visualType: 'array',
    whenToUse: [
      'Find max/min subarray or substring of size K',
      'Longest/shortest substring with a condition',
      'Contiguous sequence problems',
      'String permutation or anagram checks',
    ],
    keyInsight:
      'Instead of recalculating from scratch for each window position, add the new element and remove the old one.',
    examples: [
      {
        title: 'Maximum Sum Subarray of Size K',
        problem: 'Find the maximum sum of any contiguous subarray of size k.',
        difficulty: 'Easy',
        input: 'nums = [2, 1, 5, 1, 3, 2], k = 3',
        output: '9',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def maxSum(nums, k):
    # Build the first window: sum of elements 0..k-1
    window_sum = sum(nums[:k])
    # This is our initial best
    max_sum = window_sum
    # Slide the window from position k to the end
    for i in range(k, len(nums)):
        # Add the new element entering, subtract the one leaving
        window_sum += nums[i] - nums[i - k]
        # Update our best if this window is better
        max_sum = max(max_sum, window_sum)
    return max_sum`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function maxSum(nums, k) {
  // Build the first window: sum of elements 0..k-1
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  // This is our initial best
  let maxSum = windowSum;
  // Slide the window from position k to the end
  for (let i = k; i < nums.length; i++) {
    // Add the new element entering, subtract the one leaving
    windowSum += nums[i] - nums[i - k];
    // Update our best if this window is better
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public int maxSum(int[] nums, int k) {
    // Build the first window: sum of elements 0..k-1
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    // This is our initial best
    int maxSum = windowSum;
    // Slide the window from position k to the end
    for (int i = k; i < nums.length; i++) {
        // Add entering element, subtract leaving element
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `int maxSum(vector<int>& nums, int k) {
    // Build the first window: sum of elements 0..k-1
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    // This is our initial best
    int maxSum = windowSum;
    // Slide the window from position k to the end
    for (int i = k; i < (int)nums.size(); i++) {
        // Add entering element, subtract leaving element
        windowSum += nums[i] - nums[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`,
          },
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        dryRun: [
          'Line 2: window_sum = sum([2,1,5]) = 8. This is our first window.',
          'Line 3: max_sum = 8.',
          'Line 5: i=3. window_sum = 8 + nums[3] - nums[0] = 8 + 1 - 2 = 7. max_sum stays 8.',
          'Line 5: i=4. window_sum = 7 + nums[4] - nums[1] = 7 + 3 - 1 = 9. max_sum updates to 9!',
          'Line 5: i=5. window_sum = 9 + nums[5] - nums[2] = 9 + 2 - 5 = 6. max_sum stays 9.',
          'Line 8: Return 9. The window [5, 1, 3] had the maximum sum.',
        ],
        steps: [
          {
            description:
              'First, we build our initial window covering the first 3 elements: [2, 1, 5]. Their sum is 2 + 1 + 5 = 8. This is our starting max. The blue window range shows which elements are currently "inside" our window.',
            action: 'Build the first window of size k=3',
            reason: 'We need a starting point — the sum of the first k elements gives us our initial window',
            state: 'Window = [2, 1, 5], sum = 8, maxSum = 8',
            array: [2, 1, 5, 1, 3, 2],
            windowRange: [0, 2],
            highlights: [0, 1, 2],
            variables: { windowSum: 8, maxSum: 8, k: 3 },
          },
          {
            description:
              'Now we slide the window one step right. The element entering is nums[3] = 1, and the element leaving is nums[0] = 2. So our new sum = 8 + 1 - 2 = 7. That is less than our max of 8, so maxSum stays at 8.',
            action: 'Slide window right by one position',
            reason: 'We need to check all possible windows, so we slide forward and update the sum incrementally',
            state: 'Window = [1, 5, 1], entering = 1, leaving = 2, sum = 7',
            array: [2, 1, 5, 1, 3, 2],
            windowRange: [1, 3],
            highlights: [1, 2, 3],
            variables: { windowSum: 7, maxSum: 8, entering: 1, leaving: 2 },
          },
          {
            description:
              'Slide again. Entering: nums[4] = 3, leaving: nums[1] = 1. New sum = 7 + 3 - 1 = 9. That is bigger than 8! Update maxSum to 9. This window [5, 1, 3] is the best so far.',
            action: 'Slide window right — new maximum found!',
            reason: 'The new window sum (9) exceeds our previous best (8), so we update maxSum',
            state: 'Window = [5, 1, 3], entering = 3, leaving = 1, sum = 9, NEW MAX!',
            array: [2, 1, 5, 1, 3, 2],
            windowRange: [2, 4],
            highlights: [2, 3, 4],
            variables: { windowSum: 9, maxSum: 9, entering: 3, leaving: 1 },
          },
          {
            description:
              'One last slide. Entering: nums[5] = 2, leaving: nums[2] = 5. New sum = 9 + 2 - 5 = 6. That is less than 9, so maxSum stays. We have reached the end of the array.',
            action: 'Slide window right — last position',
            reason: 'We must check every window, but this one (sum = 6) is not better than our best (9)',
            state: 'Window = [1, 3, 2], sum = 6, maxSum still 9',
            array: [2, 1, 5, 1, 3, 2],
            windowRange: [3, 5],
            highlights: [3, 4, 5],
            variables: { windowSum: 6, maxSum: 9, entering: 2, leaving: 5 },
          },
          {
            description:
              'Done! The maximum sum window was [5, 1, 3] with sum 9. Notice we never recomputed the full sum — we just added and removed one element each step, making this O(n) instead of O(n times k).',
            action: 'Return the maximum sum found',
            reason: 'We have checked all windows and [5, 1, 3] at indices 2-4 gave the highest sum of 9',
            state: 'Best window = [5, 1, 3] at indices 2-4, maxSum = 9',
            array: [2, 1, 5, 1, 3, 2],
            windowRange: [2, 4],
            highlights: [2, 3, 4],
            variables: { maxSum: 9 },
            result: 'Return 9',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Recalculating the entire window sum from scratch each time', explanation: 'This defeats the purpose of the sliding window. Always update incrementally: add the new element and subtract the leaving element.' },
      { mistake: 'Off-by-one errors on window boundaries', explanation: 'The window [i-k+1, i] has k elements. Be careful with the index of the leaving element: it is nums[i-k], not nums[i-k+1].' },
      { mistake: 'Forgetting to handle the initial window separately', explanation: 'You must build the first window before you start sliding. Jumping straight into the sliding loop often causes index-out-of-bounds or wrong initial values.' },
      { mistake: 'Not shrinking the variable window correctly', explanation: 'In variable-size windows, when a condition is violated, you must shrink from the left AND update your tracking structure (e.g., decrement counts in the hashmap).' },
      { mistake: 'Confusing fixed vs variable window templates', explanation: 'Fixed windows always have exactly k elements. Variable windows grow/shrink based on conditions. Using the wrong template leads to subtle bugs.' },
    ],
    recognitionTips: [
      'The problem mentions "contiguous subarray" or "substring" with a size constraint.',
      'You see phrases like "maximum/minimum sum of k consecutive elements."',
      'The problem asks for "longest/shortest substring" satisfying some property.',
      'An anagram or permutation check within a larger string.',
      'You find yourself writing nested loops where the inner loop re-processes overlapping elements.',
    ],
    practiceProblems: [
      { name: 'Maximum Average Subarray I', difficulty: 'Easy', why: 'Straightforward fixed-size window — the purest form of the pattern.' },
      { name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', why: 'Classic variable-size window using a set to track characters in the window.' },
      { name: 'Permutation in String', difficulty: 'Medium', why: 'Fixed-size window with frequency counting — tests your ability to compare window contents.' },
      { name: 'Minimum Window Substring', difficulty: 'Hard', why: 'Variable window with complex shrinking logic — the hardest standard sliding window problem.' },
      { name: 'Sliding Window Maximum', difficulty: 'Hard', why: 'Combines sliding window with a monotonic deque — tests advanced understanding.' },
    ],
    relatedPatterns: ['two-pointers', 'prefix-sum'],
    commonProblems: [
      'Maximum Sum Subarray of Size K',
      'Longest Substring Without Repeating Characters',
      'Minimum Window Substring',
      'Permutation in String',
      'Sliding Window Maximum',
    ],
  },

  // ── 3. Fast & Slow Pointers ────────────────────────────────────────────────
  {
    slug: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers',
    category: 'Linked Lists',
    icon: '🐢',
    color: 'blue',
    description:
      "Floyd's Tortoise and Hare algorithm — use two pointers moving at different speeds to detect cycles, find midpoints, and more.",
    whatIsThis: `The Fast and Slow Pointers technique (also called Floyd's Tortoise and Hare) is a clever way to detect cycles and find special positions in linked lists without using any extra memory. The core idea is that you have two pointers: one "slow" pointer that moves one step at a time, and one "fast" pointer that moves two steps at a time.

If there is no cycle, the fast pointer will reach the end of the list. But if there IS a cycle, something magical happens — the fast pointer will eventually "lap" the slow pointer, and they will meet at the same node. It is like two runners on a circular track: the faster runner will always catch up to the slower one eventually.

This pattern is incredibly useful because it solves problems in O(1) space that would otherwise need O(n) space (like storing visited nodes in a hash set). Beyond cycle detection, you can use it to find the middle of a linked list (when fast reaches the end, slow is at the middle) or to find the start of a cycle.`,
    realWorldAnalogy:
      'Imagine two runners on a track. One jogs at normal speed, the other sprints at double speed. If the track is straight, the sprinter simply finishes first. But if the track loops back on itself (a cycle), the sprinter will eventually lap the jogger and they will meet — proving the loop exists.',
    analogy: `Imagine two friends jogging around a park. One is a casual jogger (the tortoise) taking one step at a time. The other is a sprinter (the hare) taking two steps at a time. If the park path is a straight line from point A to point B, the sprinter simply reaches the end first and stops. No surprises there.

But what if the path loops back on itself — a circular track? Now something interesting happens. The sprinter laps the jogger. No matter how big the circle is, the sprinter is closing the gap by one step every iteration (gaining 2 - 1 = 1 step per turn). Eventually, they collide at the same spot. This collision is PROOF that a loop exists. If they were on a straight path, the fast pointer would have hit the end (null) and stopped.

Here is a bonus trick: once you detect the cycle (the meeting point), you can find WHERE the cycle starts. Reset one pointer to the head and keep the other at the meeting point. Now move both one step at a time. The point where they meet again is the start of the cycle. This works because of a beautiful mathematical property involving the distances traveled. And for finding the middle of a list? When the fast pointer reaches the end (having moved 2n steps), the slow pointer has moved n steps — exactly the middle!`,
    problemItSolves: 'Fast & Slow Pointers detects cycles in linked lists and sequences, finds the middle element of a list, determines the start of a cycle, and solves number-theory problems like the Happy Number problem — all in O(1) extra space.',
    signals: [
      { signal: '"detect a cycle" or "is there a loop"', example: 'Linked List Cycle, Linked List Cycle II' },
      { signal: '"find the middle" of a linked list', example: 'Middle of the Linked List, Reorder List' },
      { signal: '"find the start of the cycle"', example: 'Linked List Cycle II, Find the Duplicate Number' },
      { signal: '"happy number" or repeating sequence detection', example: 'Happy Number' },
    ],
    coreIdea: `Here is the idea broken down simply. You have two pointers, both starting at the head of the list. The slow pointer moves one node at a time. The fast pointer moves two nodes at a time.

Scenario 1: No cycle. The fast pointer will eventually reach null (the end of the list). As soon as fast or fast.next is null, you know there is no cycle. Done.

Scenario 2: There IS a cycle. The fast pointer enters the cycle first and starts looping. The slow pointer eventually enters the cycle too. Now they are both going around the loop, but the fast pointer is gaining one step on the slow pointer with each iteration. Think of it like a clock — the minute hand eventually catches the hour hand.

The distance between them decreases by 1 each step, so they MUST meet. The number of steps until they meet is at most the length of the cycle.

To find the MIDDLE of a list (no cycle): when fast reaches the end (or the node before the end), slow is exactly at the middle. This works because fast traveled twice as far as slow.

To find the START of a cycle: after detecting the cycle (slow == fast), reset one pointer to head. Move both pointers one step at a time. They will meet at the cycle start. The math behind this is elegant: the distance from head to cycle start equals the distance from the meeting point to cycle start (going around the cycle).`,
    visualType: 'linkedList',
    whenToUse: [
      'Detect a cycle in a linked list',
      'Find the middle of a linked list',
      'Find the start of a cycle',
      'Determine if a number is happy',
    ],
    keyInsight:
      'If there is a cycle, the fast pointer will eventually meet the slow pointer. The meeting point reveals structural properties.',
    examples: [
      {
        title: 'Linked List Cycle Detection',
        problem: 'Determine if a linked list has a cycle.',
        difficulty: 'Easy',
        input: 'List: 3 -> 2 -> 0 -> -4 -> (back to node 2)',
        output: 'true',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def hasCycle(head):
    # Both pointers start at the head
    slow = fast = head
    # Move until fast reaches the end (no cycle) or they meet (cycle!)
    while fast and fast.next:
        slow = slow.next          # Tortoise: one step
        fast = fast.next.next     # Hare: two steps
        if slow == fast:          # They met — cycle detected!
            return True
    return False                  # Fast hit the end — no cycle`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function hasCycle(head) {
  // Both pointers start at the head
  let slow = head, fast = head;
  // Move until fast reaches the end or they meet
  while (fast && fast.next) {
    slow = slow.next;          // Tortoise: one step
    fast = fast.next.next;     // Hare: two steps
    if (slow === fast) return true;  // Cycle detected!
  }
  return false;  // Fast hit the end — no cycle
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public boolean hasCycle(ListNode head) {
    // Both pointers start at the head
    ListNode slow = head, fast = head;
    // Move until fast reaches the end or they meet
    while (fast != null && fast.next != null) {
        slow = slow.next;          // Tortoise: one step
        fast = fast.next.next;     // Hare: two steps
        if (slow == fast) return true;  // Cycle detected!
    }
    return false;  // Fast hit the end — no cycle
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `bool hasCycle(ListNode* head) {
    // Both pointers start at the head
    ListNode* slow = head;
    ListNode* fast = head;
    // Move until fast reaches the end or they meet
    while (fast && fast->next) {
        slow = slow->next;          // Tortoise: one step
        fast = fast->next->next;     // Hare: two steps
        if (slow == fast) return true;  // Cycle detected!
    }
    return false;  // Fast hit the end — no cycle
}`,
          },
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        dryRun: [
          'Line 2: slow = fast = node(3). Both start at the head.',
          'Line 4-5: slow moves to node(2), fast moves to node(0). slow != fast.',
          'Line 4-5: slow moves to node(0), fast moves from 0 -> -4 -> 2 (cycle!). fast is now at node(2). slow != fast.',
          'Line 4-5: slow moves to node(-4), fast moves from 2 -> 0 -> -4. fast is now at node(-4). slow == fast!',
          'Line 6: Return True. Cycle detected at node(-4).',
        ],
        steps: [
          {
            description:
              'Both the slow pointer (the tortoise) and the fast pointer (the hare) start at the head of the list, which is node 3. The linked list has a cycle: after node -4, it loops back to node 2.',
            action: 'Initialize both pointers at the head',
            reason: 'We start both pointers together and let speed differences reveal the cycle',
            state: 'slow = node(3), fast = node(3)',
            linkedList: [
              { val: 3, color: 'active', label: 'slow & fast' },
              { val: 2, color: 'default' },
              { val: 0, color: 'default' },
              { val: -4, color: 'default' },
            ],
            linkedListCycle: 1,
            variables: { slow: 3, fast: 3 },
          },
          {
            description:
              'Slow moves one step to node 2. Fast moves two steps to node 0. They have not met yet, so no cycle confirmed. Notice how the fast pointer is pulling ahead.',
            action: 'Move slow one step, fast two steps',
            reason: 'By moving at different speeds, if there is a cycle, fast will eventually lap slow',
            state: 'slow = node(2), fast = node(0)',
            linkedList: [
              { val: 3, color: 'visited' },
              { val: 2, color: 'active', label: 'slow' },
              { val: 0, color: 'active', label: 'fast' },
              { val: -4, color: 'default' },
            ],
            linkedListCycle: 1,
            variables: { slow: 2, fast: 0 },
          },
          {
            description:
              'Slow moves to node 0. Fast moves two steps: from 0 to -4, then -4 wraps back (because of the cycle) to node 2. The fast pointer has entered the cycle and is now behind the slow pointer within the loop.',
            action: 'Move slow one step, fast two steps (fast wraps around the cycle)',
            reason: 'Fast has entered the cycle and is now chasing slow from behind — gap is closing',
            state: 'slow = node(0), fast = node(2) [wrapped around]',
            linkedList: [
              { val: 3, color: 'visited' },
              { val: 2, color: 'active', label: 'fast' },
              { val: 0, color: 'active', label: 'slow' },
              { val: -4, color: 'visited' },
            ],
            linkedListCycle: 1,
            variables: { slow: 0, fast: 2 },
          },
          {
            description:
              'Slow moves to node -4. Fast moves two steps from node 2: to 0, then to -4. They are now at the same node! When slow equals fast, we have proven a cycle exists.',
            action: 'Pointers meet at the same node — cycle confirmed!',
            reason: 'The fast pointer caught up to the slow pointer, which is only possible if there is a loop',
            state: 'slow = node(-4), fast = node(-4) — COLLISION!',
            linkedList: [
              { val: 3, color: 'visited' },
              { val: 2, color: 'visited' },
              { val: 0, color: 'visited' },
              { val: -4, color: 'found', label: 'slow & fast' },
            ],
            linkedListCycle: 1,
            variables: { slow: -4, fast: -4 },
            result: 'Cycle detected! Return true',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Checking fast == slow before the first move', explanation: 'Both start at head, so they are trivially equal at the start. Always move them FIRST, then compare. Put the equality check after the move statements.' },
      { mistake: 'Not checking both fast AND fast.next for null', explanation: 'Fast moves two steps, so you need both fast != null and fast.next != null in the while condition. Missing either causes null pointer exceptions.' },
      { mistake: 'Using extra space (hash set) instead of two pointers', explanation: 'A hash set of visited nodes works but uses O(n) space. The whole point of this pattern is O(1) space. Interviewers expect the Floyd approach.' },
      { mistake: 'Confusing cycle detection with finding cycle start', explanation: 'Detection is simpler (just check if they meet). Finding the start requires an extra step: reset one pointer to head and move both at speed 1 until they meet again.' },
    ],
    recognitionTips: [
      'The problem involves a linked list and asks about cycles or the middle element.',
      'You see "detect cycle" or "find where the cycle begins."',
      'The problem involves a sequence that might eventually repeat (like Happy Number).',
      'You need O(1) space and cannot use a visited set.',
    ],
    practiceProblems: [
      { name: 'Middle of the Linked List', difficulty: 'Easy', why: 'When fast reaches the end, slow is at the middle — the simplest use of this pattern.' },
      { name: 'Linked List Cycle', difficulty: 'Easy', why: 'The classic cycle detection problem using Floyd\'s algorithm.' },
      { name: 'Happy Number', difficulty: 'Easy', why: 'Apply the pattern to number sequences instead of linked lists — same cycle detection logic.' },
      { name: 'Linked List Cycle II', difficulty: 'Medium', why: 'Not just detecting the cycle, but finding exactly where it starts.' },
      { name: 'Find the Duplicate Number', difficulty: 'Medium', why: 'Disguised cycle detection — treat array indices as a linked list.' },
    ],
    relatedPatterns: ['two-pointers'],
    commonProblems: [
      'Linked List Cycle',
      'Linked List Cycle II',
      'Find the Duplicate Number',
      'Middle of the Linked List',
      'Happy Number',
    ],
  },

  // ── 4. Merge Intervals ─────────────────────────────────────────────────────
  {
    slug: 'merge-intervals',
    name: 'Merge Intervals',
    category: 'Arrays & Strings',
    icon: '📊',
    color: 'emerald',
    description:
      'Sort intervals by start time, then merge overlapping ones by comparing each interval with the last merged result.',
    whatIsThis: `The Merge Intervals pattern deals with problems involving ranges or time periods that might overlap. The fundamental idea is: first sort all intervals by their start time, then walk through them one by one. For each interval, you check whether it overlaps with the last interval you added to your result. If they overlap, you merge them into a single wider interval. If not, you start a new one.

Two intervals overlap when the start of the second one is less than or equal to the end of the first one. When merging, you take the earlier start and the later end. After sorting, you only ever need to compare with the most recently merged interval, which makes this very efficient.

This pattern appears in scheduling problems, calendar applications, and anywhere you need to consolidate overlapping ranges. The sorting step takes O(n log n) and the merging pass is O(n), so the overall complexity is O(n log n).`,
    realWorldAnalogy:
      'Imagine you have a stack of meeting time cards scattered on a desk. You first sort them by start time, then go through them in order. If the next meeting starts before the current one ends, you extend the current block. If there is a gap, you start a new time block. By the end, you have the minimum number of non-overlapping blocks.',
    analogy: `Imagine you are a secretary managing a conference room for the day. People have booked overlapping time slots, and you need to figure out when the room is actually in use. The booking slips are scattered all over your desk: 9am-11am, 10am-12pm, 1pm-3pm, 2pm-4pm.

Step one: sort them by start time. Now they are in order: [9-11], [10-12], [1-3], [2-4]. Step two: walk through them. The first slot is 9-11. The next one starts at 10, which is BEFORE 11 ends — overlap! Merge them into 9-12 (take the later end time). Next is 1-3. Does 1 overlap with 12? No, there is a gap. Start a new block. Then 2-4 overlaps with 1-3, so merge into 1-4.

Result: the room is booked 9am-12pm and 1pm-4pm. Two blocks instead of four. You only needed to look at each slip once (after sorting), and you only ever compared with the most recent merged block. That is the elegance of this pattern — sorting makes everything fall into place, and one pass through handles all the merging.`,
    problemItSolves: 'Merge Intervals handles problems where you have a collection of ranges or time periods and need to combine overlapping ones, find gaps, count overlaps, or determine the minimum resources needed to handle all intervals simultaneously.',
    signals: [
      { signal: '"merge overlapping intervals"', example: 'Merge Intervals, Insert Interval' },
      { signal: '"meeting rooms" or "schedule conflicts"', example: 'Meeting Rooms, Meeting Rooms II' },
      { signal: '"find free time" or "gaps between intervals"', example: 'Employee Free Time' },
      { signal: '"minimum number of rooms/resources"', example: 'Meeting Rooms II, Minimum Platforms' },
      { signal: '"interval intersection"', example: 'Interval List Intersections' },
    ],
    coreIdea: `The core algorithm is delightfully simple once you understand the key insight: after sorting by start time, overlapping intervals are always adjacent.

Step 1: Sort all intervals by their start time. This is crucial — it ensures that if two intervals overlap, they will be next to each other (or very close) in the sorted order.

Step 2: Initialize your result with the first interval.

Step 3: For each remaining interval, compare it with the last interval in your result. There are only two possibilities. Either the current interval overlaps with the last one (its start is less than or equal to the last one's end), in which case you merge them by extending the end to the maximum of both ends. Or there is a gap (the current start is greater than the last end), in which case you just add the current interval as a new entry.

Why does sorting make this work? Without sorting, you would need to compare every interval with every other interval — O(n squared). But after sorting, you only need to compare with the most recent merged interval. This is because if interval C does not overlap with interval B (the most recent merged), then C cannot overlap with anything before B either (since they all have earlier start times and B already absorbed any that overlapped with it).

The total time is O(n log n) for sorting plus O(n) for the merge pass = O(n log n) overall.`,
    visualType: 'array',
    whenToUse: [
      'Overlapping intervals (merge, insert, intersect)',
      'Scheduling/calendar problems',
      'Finding free time slots',
      'Minimum number of meeting rooms',
    ],
    keyInsight:
      'After sorting by start, you only need to check if the current interval overlaps with the last merged interval.',
    examples: [
      {
        title: 'Merge Intervals',
        problem: 'Merge all overlapping intervals.',
        difficulty: 'Medium',
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def merge(intervals):
    # Sort by start time — this ensures overlaps are adjacent
    intervals.sort(key=lambda x: x[0])
    # Start with the first interval in our result
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        # Does this interval overlap with the last merged one?
        if start <= merged[-1][1]:
            # Yes — extend the end to cover both
            merged[-1][1] = max(merged[-1][1], end)
        else:
            # No overlap — add as a new separate interval
            merged.append([start, end])
    return merged`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function merge(intervals) {
  // Sort by start time — this ensures overlaps are adjacent
  intervals.sort((a, b) => a[0] - b[0]);
  // Start with the first interval in our result
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      // Overlap — extend the end to cover both
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      // No overlap — add as a new separate interval
      merged.push(intervals[i]);
    }
  }
  return merged;
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public int[][] merge(int[][] intervals) {
    // Sort by start time
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        if (intervals[i][0] <= last[1]) {
            // Overlap — extend end
            last[1] = Math.max(last[1], intervals[i][1]);
        } else {
            // No overlap — new interval
            merged.add(intervals[i]);
        }
    }
    return merged.toArray(new int[0][]);
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    // Sort by start time
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged = {intervals[0]};
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= merged.back()[1]) {
            // Overlap — extend end
            merged.back()[1] = max(merged.back()[1], intervals[i][1]);
        } else {
            // No overlap — new interval
            merged.push_back(intervals[i]);
        }
    }
    return merged;
}`,
          },
        ],
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        dryRun: [
          'Line 2: Sort intervals by start time. Already sorted: [[1,3],[2,6],[8,10],[15,18]].',
          'Line 3: merged = [[1,3]]. Start with the first interval.',
          'Line 4-5: [2,6] — start 2 <= end 3? Yes, overlap! merged[-1][1] = max(3, 6) = 6. merged = [[1,6]].',
          'Line 4-5: [8,10] — start 8 <= end 6? No, gap. Append. merged = [[1,6],[8,10]].',
          'Line 4-5: [15,18] — start 15 <= end 10? No, gap. Append. merged = [[1,6],[8,10],[15,18]].',
          'Line 8: Return [[1,6],[8,10],[15,18]]. Four intervals merged into three.',
        ],
        steps: [
          {
            description:
              'The intervals are already sorted by start time: [1,3], [2,6], [8,10], [15,18]. We put the first interval [1,3] into our merged list to start.',
            action: 'Sort intervals and initialize with the first one',
            reason: 'Sorting ensures overlapping intervals are adjacent, making them easy to merge in one pass',
            state: 'merged = [[1,3]], remaining: [2,6], [8,10], [15,18]',
            array: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'],
            highlights: [0],
            variables: { merged: '[[1,3]]' },
          },
          {
            description:
              'Next interval is [2,6]. Does it overlap with the last merged interval [1,3]? Yes, because 2 (start) is less than or equal to 3 (end of last). So we merge them: keep start 1, take the bigger end max(3, 6) = 6. Result: [1,6].',
            action: 'Merge [2,6] with [1,3] — they overlap!',
            reason: 'Start of [2,6] is 2, which is <= 3 (end of last merged), so these intervals overlap',
            state: 'merged = [[1,6]] after extending end from 3 to 6',
            array: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'],
            highlights: [0, 1],
            variables: { merged: '[[1,6]]', overlap: true },
          },
          {
            description:
              'Next is [8,10]. Does 8 overlap with [1,6]? No, because 8 > 6. There is a clear gap between these intervals. So we just add [8,10] as a new separate interval in our result.',
            action: 'Add [8,10] as a new interval — no overlap with [1,6]',
            reason: 'Start of [8,10] is 8, which is > 6 (end of last merged), so there is a gap',
            state: 'merged = [[1,6],[8,10]]',
            array: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'],
            highlights: [2],
            variables: { merged: '[[1,6],[8,10]]', overlap: false },
          },
          {
            description:
              'Last one: [15,18]. Does 15 overlap with [8,10]? No, 15 > 10. Add it as a new interval. We have now processed everything. Three merged intervals remain from the original four.',
            action: 'Add [15,18] — no overlap. All intervals processed!',
            reason: 'Start 15 > end 10 means a gap. We are done — return the result',
            state: 'merged = [[1,6],[8,10],[15,18]]',
            array: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'],
            highlights: [3],
            variables: { merged: '[[1,6],[8,10],[15,18]]' },
            result: 'Return [[1,6],[8,10],[15,18]]',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Forgetting to sort intervals first', explanation: 'Without sorting, overlapping intervals may not be adjacent, causing you to miss merges. Always sort by start time before merging.' },
      { mistake: 'Using start instead of max(end) when merging', explanation: 'When merging [1,6] with [2,4], the merged interval is [1,6] not [1,4]. Always take the max of both ends.' },
      { mistake: 'Comparing with the original interval instead of the last merged one', explanation: 'You must compare with the last interval in your RESULT (which may have been extended by previous merges), not with the previous input interval.' },
      { mistake: 'Not handling the edge case of a single interval', explanation: 'If there is only one interval, return it as-is. Your merge loop should handle this naturally if initialized correctly.' },
    ],
    recognitionTips: [
      'The problem deals with ranges, time periods, or intervals.',
      'You see words like "overlapping," "merge," "intersect," or "schedule."',
      'The problem asks about the minimum number of resources to handle all events.',
      'You need to find gaps or free time between scheduled events.',
    ],
    practiceProblems: [
      { name: 'Meeting Rooms', difficulty: 'Easy', why: 'Simply check if any two intervals overlap — great warm-up for interval problems.' },
      { name: 'Merge Intervals', difficulty: 'Medium', why: 'The canonical interval merging problem — master this one first.' },
      { name: 'Insert Interval', difficulty: 'Medium', why: 'Merge with a twist — you must insert a new interval into an already-sorted list.' },
      { name: 'Non-overlapping Intervals', difficulty: 'Medium', why: 'Find the minimum number of intervals to remove to eliminate all overlaps.' },
      { name: 'Meeting Rooms II', difficulty: 'Medium', why: 'Count the maximum overlap depth — requires a sweep line or min-heap approach.' },
    ],
    relatedPatterns: ['two-pointers'],
    commonProblems: [
      'Merge Intervals',
      'Insert Interval',
      'Non-overlapping Intervals',
      'Meeting Rooms II',
      'Interval List Intersections',
    ],
  },

  // ── 5. Binary Search ───────────────────────────────────────────────────────
  {
    slug: 'binary-search',
    name: 'Modified Binary Search',
    category: 'Arrays & Strings',
    icon: '🔍',
    color: 'emerald',
    description:
      'Apply binary search beyond simple sorted arrays — rotated arrays, search spaces, and finding boundaries.',
    whatIsThis: `Binary Search is one of the most powerful techniques in computer science. The basic idea is dead simple: if you have a sorted collection and you are looking for a specific value, you can cut the search space in half with every comparison. Instead of checking every element (O(n)), you only need about log2(n) checks.

But the "Modified" in Modified Binary Search means we go way beyond just "find this number in a sorted array." The real power shows up when you apply binary search to non-obvious situations: searching in a rotated sorted array, finding the first or last occurrence of a value, searching on an answer space (like "what is the minimum speed at which Koko can eat all bananas?"), or finding boundaries in complex conditions.

The key mental model is: can you define a condition where everything to the left is "true" and everything to the right is "false" (or vice versa)? If yes, binary search applies. This boundary-finding perspective makes binary search applicable to a huge range of problems beyond simple lookups.`,
    realWorldAnalogy:
      'Think of the classic number-guessing game. "I am thinking of a number between 1 and 100." Each time you guess, I say "higher" or "lower." You would never guess 1, 2, 3, 4... sequentially. You would start at 50, then 25 or 75, cutting the possibilities in half each time. That is binary search.',
    analogy: `Imagine you are playing the number-guessing game with a friend. They are thinking of a number between 1 and 100. You could guess 1, then 2, then 3... but that could take up to 100 tries. Instead, you guess 50. "Higher!" OK, guess 75. "Lower!" Guess 62. Each guess cuts the remaining possibilities in half. You will find ANY number in at most 7 guesses (log2 of 100).

Now imagine a trickier version: the numbers 1-100 are written on cards arranged in a circle, and someone rotated the circle so it starts at, say, 45. The sequence looks like 45, 46, 47... 99, 100, 1, 2, 3... 44. Can you still use the halving strategy? Yes! At each step, you can determine which half is "properly sorted" and decide if your target falls in that half. This is the rotated array variant.

Even cooler: imagine the game is not about finding a specific number but finding a BOUNDARY. "What is the minimum number of workers needed to finish this job on time?" You cannot just look it up — you need to test different numbers. But if 5 workers is enough, then 6 is definitely enough too. There is a clear boundary between "not enough" and "enough." Binary search finds that boundary in O(log n) time, even though there is no sorted array anywhere in sight.`,
    problemItSolves: 'Modified Binary Search handles searching in sorted, rotated, or infinite arrays; finding boundaries (first/last occurrence, minimum satisfying value); and searching on answer spaces where you need to minimize or maximize a value subject to a condition.',
    signals: [
      { signal: '"sorted array" or "search for target"', example: 'Binary Search, Search Insert Position' },
      { signal: '"rotated sorted array"', example: 'Search in Rotated Sorted Array, Find Minimum in Rotated Sorted Array' },
      { signal: '"find the first/last occurrence"', example: 'First and Last Position of Element in Sorted Array' },
      { signal: '"minimum speed/capacity/value such that..."', example: 'Koko Eating Bananas, Capacity to Ship Packages' },
      { signal: '"find peak" or boundary in a bitonic sequence', example: 'Find Peak Element, Mountain Array' },
    ],
    coreIdea: `The fundamental idea is halving the search space with each decision. Here is how it works in different scenarios.

Classic binary search: You have a sorted array and a target. Set lo = 0, hi = length - 1. Calculate mid = (lo + hi) / 2. If nums[mid] equals target, you found it. If nums[mid] < target, the answer must be in the right half, so set lo = mid + 1. If nums[mid] > target, look in the left half: hi = mid - 1. Repeat until lo > hi.

Rotated sorted array: The array was sorted but then rotated, like [4,5,6,7,0,1,2]. The trick is that at least one half is always properly sorted. Check which half is sorted (compare nums[lo] with nums[mid]), then determine if the target falls in that sorted half. If yes, search there. If not, search the other half.

Search on answer space: Sometimes you are not searching an array at all. For "Koko Eating Bananas," you binary search on the SPEED (1 to max pile size). For each candidate speed, check if Koko can finish in time. The answer space has a boundary: below some speed it is impossible, at or above that speed it is possible. Binary search finds that boundary.

The unifying principle: whenever you can split possibilities into "works" and "does not work" with a clear boundary, binary search finds that boundary in O(log n) time.`,
    visualType: 'array',
    whenToUse: [
      'Sorted or rotated sorted array',
      'Finding boundary (first/last occurrence)',
      'Searching in infinite/unknown-size arrays',
      'Minimizing/maximizing a function (search on answer)',
    ],
    keyInsight:
      'Binary search works whenever you can split the search space into "valid" and "invalid" halves based on a condition.',
    examples: [
      {
        title: 'Search in Rotated Sorted Array',
        problem: 'Find target in a rotated sorted array.',
        difficulty: 'Medium',
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        # Found the target
        if nums[mid] == target:
            return mid
        # Check if the left half is sorted
        if nums[lo] <= nums[mid]:
            # Target is in the sorted left half?
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            # Right half must be sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    // Check if left half is sorted
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;  // Avoids integer overflow
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {    // Left half sorted
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {                         // Right half sorted
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `int search(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;  // Avoids integer overflow
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {    // Left half sorted
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {                         // Right half sorted
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
          },
        ],
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        dryRun: [
          'lo=0, hi=6, mid=3. nums[3]=7, not target. Left half [4,5,6,7] sorted (4<=7). Is 0 in [4,7)? No. Set lo=4.',
          'lo=4, hi=6, mid=5. nums[5]=1, not target. Left half [0,1] sorted (0<=1). Is 0 in [0,1)? Yes! Set hi=4.',
          'lo=4, hi=4, mid=4. nums[4]=0. Found it! Return 4.',
        ],
        steps: [
          {
            description: 'We have a sorted array that has been rotated: [4,5,6,7,0,1,2]. We set lo=0, hi=6, and calculate mid=3. nums[3]=7, which is not our target 0.',
            action: 'Initialize lo, hi, and calculate mid',
            reason: 'We need to start binary search — mid splits the array in half for us to decide which side to search',
            state: 'lo=0, hi=6, mid=3, nums[mid]=7, target=0',
            array: [4, 5, 6, 7, 0, 1, 2],
            pointers: { lo: 0, mid: 3, hi: 6 },
            highlights: [3],
            variables: { target: 0 },
          },
          {
            description: 'Is the left half sorted? nums[lo]=4 <= nums[mid]=7, so yes. Is our target 0 in the range [4, 7)? No, 0 < 4. So the target must be in the right half. Move lo to mid+1 = 4.',
            action: 'Left half is sorted but target is not in it — search right half',
            reason: 'Target 0 is not in the sorted range [4, 7), so it must be in the unsorted right portion',
            state: 'lo=4, hi=6 — searching right half now',
            array: [4, 5, 6, 7, 0, 1, 2],
            pointers: { lo: 4, mid: 3, hi: 6 },
            variables: { target: 0, leftSorted: true },
          },
          {
            description: 'Now lo=4, hi=6, mid=5. nums[5]=1, not our target. Is the left half [0,1] sorted? nums[4]=0 <= nums[5]=1, yes. Is target 0 in range [0, 1)? Yes! So we go left: hi = mid-1 = 4.',
            action: 'Left half sorted and target is in it — search left',
            reason: '0 falls in the range [0, 1), so we narrow to the left portion',
            state: 'lo=4, hi=4 — nearly found it',
            array: [4, 5, 6, 7, 0, 1, 2],
            pointers: { lo: 4, mid: 5, hi: 6 },
            highlights: [5],
            variables: { target: 0 },
          },
          {
            description: 'Now lo=4, hi=4, mid=4. nums[4]=0. That is our target! Found it at index 4. Even though the array was rotated, binary search still found it in just 3 steps.',
            action: 'Found the target at index 4!',
            reason: 'nums[mid] == target, so we return mid immediately',
            state: 'nums[4] = 0 = target. Done!',
            array: [4, 5, 6, 7, 0, 1, 2],
            pointers: { lo: 4, mid: 4, hi: 4 },
            highlights: [4],
            result: 'Return index 4',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Using (lo + hi) / 2 which can overflow in Java/C++', explanation: 'Use lo + (hi - lo) / 2 instead. In Python/JS this is not an issue, but in Java and C++ integer addition can overflow.' },
      { mistake: 'Off-by-one errors with lo <= hi vs lo < hi', explanation: 'Use lo <= hi when you want to check the element at lo == hi. Use lo < hi when converging to a boundary. Know which template you are using.' },
      { mistake: 'Wrong boundary updates (lo = mid vs lo = mid + 1)', explanation: 'If you set lo = mid (without +1), you can get infinite loops when lo == mid. Always ensure the search space strictly shrinks each iteration.' },
      { mistake: 'Not identifying which half is sorted in rotated arrays', explanation: 'In a rotated array, ALWAYS check which half is sorted before deciding where the target might be. Forgetting this leads to wrong comparisons.' },
      { mistake: 'Not recognizing binary search on answer space problems', explanation: 'If a problem asks to "minimize the maximum" or "find the minimum value such that," think binary search on the answer. The array may not even exist — you search on possible answers.' },
    ],
    recognitionTips: [
      'The input array is sorted (or was sorted before rotation).',
      'The problem asks to "find" something with O(log n) time complexity.',
      'You see "minimize the maximum" or "find the minimum value such that" — search on answer.',
      'The problem involves finding a boundary between two states (possible/impossible, true/false).',
      'The brute force would linearly scan through a sorted or monotonic space.',
    ],
    practiceProblems: [
      { name: 'Binary Search', difficulty: 'Easy', why: 'The pure basic template — make sure you can write it bug-free before tackling variants.' },
      { name: 'Search in Rotated Sorted Array', difficulty: 'Medium', why: 'The classic modified binary search — determining which half is sorted is the key twist.' },
      { name: 'Find First and Last Position', difficulty: 'Medium', why: 'Teaches boundary-finding binary search — finding the leftmost and rightmost occurrence.' },
      { name: 'Koko Eating Bananas', difficulty: 'Medium', why: 'Binary search on answer space — you are not searching an array but a range of possible speeds.' },
      { name: 'Median of Two Sorted Arrays', difficulty: 'Hard', why: 'Extremely tricky binary search on partition positions — the hardest standard binary search problem.' },
    ],
    relatedPatterns: ['two-pointers'],
    commonProblems: [
      'Search in Rotated Sorted Array',
      'Find Minimum in Rotated Sorted Array',
      'Find Peak Element',
      'Koko Eating Bananas',
      'Median of Two Sorted Arrays',
    ],
  },

  // ── 6. Prefix Sum ──────────────────────────────────────────────────────────
  {
    slug: 'prefix-sum',
    name: 'Prefix Sum',
    category: 'Arrays & Strings',
    icon: '➕',
    color: 'emerald',
    description:
      'Precompute cumulative sums to answer range-sum queries in O(1) after O(n) preprocessing.',
    whatIsThis: `The Prefix Sum technique is a preprocessing trick that is incredibly useful for range queries. The idea is to build an auxiliary array where each element stores the running total of all elements up to that index. Once you have this prefix sum array, you can calculate the sum of ANY subarray in constant time — just subtract two prefix sums.

For example, if prefix[5] = 20 and prefix[2] = 8, then the sum of elements from index 2 to 4 is 20 - 8 = 12. No need to loop through those elements. This turns repeated range queries from O(n) each to O(1) each.

A powerful extension combines prefix sums with a hash map. If you want to count how many subarrays sum to a target k, you can use the fact that if prefix[j] - prefix[i] = k, then the subarray from i to j has sum k. By storing prefix sums in a hash map as you go, you can check for matching pairs on the fly, solving the problem in a single O(n) pass.`,
    realWorldAnalogy:
      'Imagine a bank statement that shows your running balance after each transaction. If you want to know how much you spent between Tuesday and Friday, you just subtract Tuesday morning\'s balance from Friday evening\'s balance. You do not need to add up every individual transaction — the running totals already capture that information.',
    analogy: `Imagine you are tracking your daily running distance over a month. Each day, instead of just writing down that day's distance, you also write down the TOTAL distance you have run so far. Day 1: 3 miles (total: 3). Day 2: 5 miles (total: 8). Day 3: 2 miles (total: 10). Day 4: 4 miles (total: 14).

Now your coach asks: "How far did you run from Day 2 to Day 4?" Without running totals, you would add 5 + 2 + 4 = 11 miles. But with running totals, it is instant: total through Day 4 (14) minus total through Day 1 (3) = 11 miles. One subtraction instead of adding three numbers.

Now imagine a trickier question: "On how many stretches of consecutive days did you run exactly 7 miles?" As you scan through your running totals, at each day you ask "Is there an earlier day where the running total was exactly 7 less than today's?" If today's total is 14 and you previously saw a total of 7, then the days between those two points sum to exactly 7. By keeping a hashmap of all totals you have seen, you answer this in one pass — O(n) time, no nested loops. This is the prefix sum plus hashmap combination, and it is incredibly powerful.`,
    problemItSolves: 'Prefix Sum solves problems involving range queries (sum of elements between two indices), counting subarrays with a given sum, finding equilibrium points, and any problem where you need to repeatedly compute sums of contiguous segments.',
    signals: [
      { signal: '"sum of subarray" or "range sum query"', example: 'Range Sum Query, Subarray Sum Equals K' },
      { signal: '"count subarrays with sum equal to k"', example: 'Subarray Sum Equals K, Continuous Subarray Sum' },
      { signal: '"product of array except self"', example: 'Product of Array Except Self' },
      { signal: '"equilibrium index" or "pivot index"', example: 'Find Pivot Index' },
    ],
    coreIdea: `The idea is to precompute running totals so that any range sum becomes a simple subtraction.

Step 1: Build the prefix sum array. prefix[0] = nums[0]. prefix[1] = nums[0] + nums[1]. prefix[i] = nums[0] + nums[1] + ... + nums[i]. Each entry stores the cumulative sum up to that index.

Step 2: To find the sum of elements from index i to j, compute prefix[j] - prefix[i-1]. This gives you the sum of that range in O(1), because the cumulative sum through j minus the cumulative sum before i leaves exactly the elements from i to j.

The hashmap extension is where it gets really clever. Suppose you want to count subarrays that sum to exactly k. As you compute the running prefix sum, you store each sum in a hashmap. At each position j, you check if (prefix[j] - k) exists in the map. If it does, it means there is some earlier position i where prefix[i] = prefix[j] - k, which means the subarray from i+1 to j sums to exactly k.

You initialize the map with {0: 1} because a prefix sum of 0 exists before the array starts (the empty prefix). This handles the case where a subarray starting from index 0 sums to k.

The beauty: each element is visited exactly once, giving O(n) time with O(n) space for the hashmap.`,
    visualType: 'array',
    whenToUse: [
      'Range sum queries',
      'Subarray sum equals K',
      'Count subarrays with given sum',
      'Equilibrium index problems',
    ],
    keyInsight:
      'prefix[j] - prefix[i] gives the sum of elements from index i to j-1. Combined with a hashmap, find target subarrays in O(n).',
    examples: [
      {
        title: 'Subarray Sum Equals K',
        problem: 'Count subarrays whose sum equals k.',
        difficulty: 'Medium',
        input: 'nums = [1, 1, 1], k = 2',
        output: '2',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def subarraySum(nums, k):
    count = 0           # Number of valid subarrays found
    prefix = 0          # Running prefix sum
    seen = {0: 1}       # Map of prefix_sum -> how many times we have seen it
    for num in nums:
        prefix += num   # Extend the running sum
        # If (prefix - k) was seen before, those are valid subarrays
        count += seen.get(prefix - k, 0)
        # Record this prefix sum in the map
        seen[prefix] = seen.get(prefix, 0) + 1
    return count`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function subarraySum(nums, k) {
  let count = 0, prefix = 0;
  // Map stores how many times each prefix sum has occurred
  const seen = new Map([[0, 1]]);  // Empty prefix sum = 0 seen once
  for (const num of nums) {
    prefix += num;  // Extend the running sum
    // Check if (prefix - k) was seen before
    count += seen.get(prefix - k) || 0;
    // Record this prefix sum
    seen.set(prefix, (seen.get(prefix) || 0) + 1);
  }
  return count;
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public int subarraySum(int[] nums, int k) {
    int count = 0, prefix = 0;
    Map<Integer, Integer> seen = new HashMap<>();
    seen.put(0, 1);  // Empty prefix
    for (int num : nums) {
        prefix += num;
        count += seen.getOrDefault(prefix - k, 0);
        seen.put(prefix, seen.getOrDefault(prefix, 0) + 1);
    }
    return count;
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `int subarraySum(vector<int>& nums, int k) {
    int count = 0, prefix = 0;
    unordered_map<int, int> seen;
    seen[0] = 1;  // Empty prefix
    for (int num : nums) {
        prefix += num;
        count += seen[prefix - k];  // 0 if not found
        seen[prefix]++;
    }
    return count;
}`,
          },
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        dryRun: [
          'Initialize: prefix=0, count=0, seen={0:1}.',
          'num=1: prefix=1. prefix-k=1-2=-1. Not in seen. count=0. seen={0:1, 1:1}.',
          'num=1: prefix=2. prefix-k=2-2=0. In seen with count 1! count=1. seen={0:1, 1:1, 2:1}.',
          'num=1: prefix=3. prefix-k=3-2=1. In seen with count 1! count=2. seen={0:1, 1:1, 2:1, 3:1}.',
          'Return 2. The two subarrays are [1,1] (indices 0-1) and [1,1] (indices 1-2).',
        ],
        steps: [
          {
            description: 'We initialize: prefix sum = 0, count = 0, and a hashmap seen = {0: 1}. The 0 in the map is crucial — it represents the "empty prefix" so we can detect subarrays that start from the beginning.',
            action: 'Initialize prefix sum and hashmap with the empty prefix',
            reason: 'The entry {0: 1} handles subarrays starting at index 0 — without it we would miss those cases',
            state: 'prefix=0, count=0, seen={0:1}, k=2',
            array: [1, 1, 1],
            variables: { prefix: 0, count: 0, seen: '{0:1}', k: 2 },
          },
          {
            description: 'Process first element: num=1. prefix becomes 0+1=1. We check: is prefix-k = 1-2 = -1 in our map? No. So no subarray ending here sums to 2. Add prefix 1 to seen.',
            action: 'Process num=1, update prefix to 1, check for (prefix-k) in map',
            reason: 'prefix-k = -1 is not in seen, meaning no subarray ending at this index sums to 2',
            state: 'prefix=1, count=0, seen={0:1, 1:1}',
            array: [1, 1, 1],
            highlights: [0],
            variables: { prefix: 1, count: 0, seen: '{0:1, 1:1}' },
          },
          {
            description: 'Process second element: num=1. prefix becomes 1+1=2. Check: prefix-k = 2-2 = 0. Is 0 in seen? Yes, with count 1! That means the subarray from the start to here [1,1] sums to 2. count becomes 1.',
            action: 'Process num=1, prefix=2, found match! prefix-k=0 is in the map',
            reason: 'prefix-k=0 appears once in seen, meaning one subarray ending here has sum exactly k=2',
            state: 'prefix=2, count=1, found subarray [1,1] (indices 0-1)',
            array: [1, 1, 1],
            highlights: [0, 1],
            variables: { prefix: 2, count: 1, seen: '{0:1, 1:1, 2:1}' },
          },
          {
            description: 'Process third element: num=1. prefix becomes 2+1=3. Check: prefix-k = 3-2 = 1. Is 1 in seen? Yes, with count 1! Another subarray sums to 2: [1,1] from index 1 to 2. count becomes 2. Done!',
            action: 'Process num=1, prefix=3, another match! prefix-k=1 is in the map',
            reason: 'prefix-k=1 was seen at index 0, so the subarray from index 1 to 2 has sum 2',
            state: 'prefix=3, count=2, found subarray [1,1] (indices 1-2)',
            array: [1, 1, 1],
            highlights: [0, 1, 2],
            variables: { prefix: 3, count: 2, seen: '{0:1, 1:1, 2:1, 3:1}' },
            result: 'Return 2',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Forgetting to initialize the hashmap with {0: 1}', explanation: 'Without this, you miss subarrays that start at index 0. The empty prefix sum of 0 must be pre-seeded.' },
      { mistake: 'Using prefix sums for subarray problems on unsorted arrays with sliding window', explanation: 'Sliding window only works when elements are positive (window sum is monotonic). For arrays with negative numbers, use prefix sum + hashmap.' },
      { mistake: 'Off-by-one in range queries (prefix[j] - prefix[i])', explanation: 'prefix[j] - prefix[i] gives the sum from index i to j-1, NOT i to j. Be precise about inclusive/exclusive boundaries.' },
      { mistake: 'Storing prefix sums after checking instead of before', explanation: 'You must check (prefix-k) in the map BEFORE adding the current prefix. Otherwise you might match the current position with itself.' },
    ],
    recognitionTips: [
      'The problem involves summing contiguous portions of an array.',
      'You need to answer multiple "sum from i to j" queries efficiently.',
      'The problem asks to count subarrays with a specific sum.',
      'You see "subarray sum" and the array may contain negative numbers (ruling out sliding window).',
    ],
    practiceProblems: [
      { name: 'Running Sum of 1d Array', difficulty: 'Easy', why: 'The most basic prefix sum — just compute the running total.' },
      { name: 'Find Pivot Index', difficulty: 'Easy', why: 'Use prefix sums to compare left sum vs right sum at each index.' },
      { name: 'Subarray Sum Equals K', difficulty: 'Medium', why: 'The classic prefix sum + hashmap problem — a must-know.' },
      { name: 'Continuous Subarray Sum', difficulty: 'Medium', why: 'Prefix sum with modular arithmetic — tests deeper understanding.' },
      { name: 'Product of Array Except Self', difficulty: 'Medium', why: 'Prefix and suffix products — a creative application of the cumulative idea.' },
    ],
    relatedPatterns: ['sliding-window', 'two-pointers'],
    commonProblems: [
      'Subarray Sum Equals K',
      'Range Sum Query',
      'Continuous Subarray Sum',
      'Product of Array Except Self',
    ],
  },

  // ── 7. Cyclic Sort ─────────────────────────────────────────────────────────
  {
    slug: 'cyclic-sort',
    name: 'Cyclic Sort',
    category: 'Arrays & Strings',
    icon: '🔃',
    color: 'emerald',
    description:
      'When array contains numbers in range [1, n], place each number at its correct index by swapping.',
    whatIsThis: `Cyclic Sort is a beautiful and efficient technique for problems where the array contains numbers in a known range, typically 1 to n (where n is the array length). The insight is simple but powerful: if the numbers are from 1 to n, then in a perfectly sorted array, the number k should be at index k-1. So number 1 goes to index 0, number 2 goes to index 1, and so on.

The algorithm works by iterating through the array and, for each element, checking if it is at its "correct" position. If not, you swap it with whatever is sitting at its correct position. You keep swapping until the current position holds the right number, then move on. After this pass, every number that is present will be at its correct index.

The magic happens after the sort: any position where the number does not match the expected value reveals a missing or duplicate number. This lets you solve problems like "find all missing numbers" or "find the duplicate" in O(n) time with O(1) extra space — no hash set needed.`,
    realWorldAnalogy:
      'Imagine numbered seats at a theater where some people are sitting in wrong seats. You go seat by seat: if the person in seat 3 has ticket number 7, you send them to seat 7 and whoever is in seat 7 comes to seat 3. Keep doing this until seat 3 has the right person. Empty seats afterwards tell you who is missing.',
    analogy: `Imagine a classroom with 8 desks numbered 1 through 8. Students walk in with name tags numbered 1 through 8, but they sit randomly. Your job is to get everyone in their correct seat (student 1 in desk 1, student 2 in desk 2, etc.) using a simple rule: check who is at each desk and swap them to their correct desk.

You start at desk 1. Student #4 is sitting there. You say "You belong at desk 4" and swap them with whoever is at desk 4 (student #7). Now desk 1 has student #7. Still wrong! Swap #7 to desk 7. Keep swapping until desk 1 has student #1 (or you realize #1 is absent). Then move to desk 2 and repeat.

Here is the clever part: after this process, every present student is at their correct desk. Any desk with the WRONG student tells you something is off — either that student is a duplicate (they showed up twice) or the rightful student is missing. You can detect missing and duplicate numbers just by scanning the desks! This entire process takes O(n) swaps total because each student is moved at most once to their final position.`,
    problemItSolves: 'Cyclic Sort solves problems involving arrays that contain numbers in a consecutive range (like 1 to n). It finds missing numbers, duplicate numbers, or the first missing positive in O(n) time and O(1) space by placing each number at its "home" index.',
    signals: [
      { signal: '"numbers from 1 to n" or "range [0, n]"', example: 'Find All Numbers Disappeared, Find the Duplicate Number' },
      { signal: '"find the missing number"', example: 'Missing Number, Find All Disappeared Numbers' },
      { signal: '"find the duplicate"', example: 'Find the Duplicate Number, Find All Duplicates' },
      { signal: '"first missing positive"', example: 'First Missing Positive' },
    ],
    coreIdea: `The core idea is: if the numbers in the array are supposed to go from 1 to n, then each number has a "home" — number k belongs at index k-1.

Step 1: Walk through the array. At each position i, check if nums[i] is at its correct index (nums[i] - 1). If it is, move on. If not, swap nums[i] to its home position. But do not move to the next index yet — the number that got swapped INTO position i might also be wrong, so keep swapping at position i until it has the correct number (or a duplicate that cannot be placed).

Step 2: After the sort pass, do a final scan. Any index i where nums[i] != i + 1 reveals something: the number i + 1 is missing from the array, and nums[i] is either a duplicate or misplaced.

Why is this O(n) even though there is a while loop inside the for loop? Because each number is swapped at most once to its final position. Think of it like a game of musical chairs where each chair gets its occupant exactly once. Even if one position triggers a chain of swaps, the total number of swaps across the entire array is at most n.

The beauty is that this achieves O(1) extra space. No hash set, no boolean array, no sorting — just in-place swaps.`,
    visualType: 'array',
    whenToUse: [
      'Array contains numbers from 1 to n',
      'Find missing/duplicate numbers',
      'First missing positive',
    ],
    keyInsight:
      'If nums[i] should be at index nums[i]-1, swap it there. After one pass, misplaced elements reveal answers.',
    examples: [
      {
        title: 'Find All Missing Numbers',
        problem: 'Find all numbers in [1,n] missing from the array.',
        difficulty: 'Easy',
        input: 'nums = [4, 3, 2, 7, 8, 2, 3, 1]',
        output: '[5, 6]',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def findDisappearedNumbers(nums):
    i = 0
    while i < len(nums):
        # Where should nums[i] go? At index nums[i] - 1
        correct = nums[i] - 1
        # If it is not already at its home and the home is different, swap
        if nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1  # This position is settled, move on
    # Now scan: any mismatch reveals a missing number
    return [i+1 for i in range(len(nums)) if nums[i] != i+1]`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function findDisappearedNumbers(nums) {
  let i = 0;
  while (i < nums.length) {
    const correct = nums[i] - 1;  // Home index for nums[i]
    if (nums[i] !== nums[correct]) {
      // Swap nums[i] to its home
      [nums[i], nums[correct]] = [nums[correct], nums[i]];
    } else {
      i++;  // Position settled
    }
  }
  // Scan for mismatches — those positions have missing numbers
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) result.push(i + 1);
  }
  return result;
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public List<Integer> findDisappearedNumbers(int[] nums) {
    int i = 0;
    while (i < nums.length) {
        int correct = nums[i] - 1;
        if (nums[i] != nums[correct]) {
            // Swap to home position
            int tmp = nums[i]; nums[i] = nums[correct]; nums[correct] = tmp;
        } else {
            i++;
        }
    }
    List<Integer> result = new ArrayList<>();
    for (int j = 0; j < nums.length; j++) {
        if (nums[j] != j + 1) result.add(j + 1);
    }
    return result;
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `vector<int> findDisappearedNumbers(vector<int>& nums) {
    int i = 0;
    while (i < (int)nums.size()) {
        int correct = nums[i] - 1;
        if (nums[i] != nums[correct]) swap(nums[i], nums[correct]);
        else i++;
    }
    vector<int> result;
    for (int j = 0; j < (int)nums.size(); j++) {
        if (nums[j] != j + 1) result.push_back(j + 1);
    }
    return result;
}`,
          },
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        dryRun: [
          'i=0: nums[0]=4, correct=3. nums[0]!=nums[3] (4!=7). Swap. Array: [7,3,2,4,8,2,3,1].',
          'i=0: nums[0]=7, correct=6. nums[0]!=nums[6] (7!=3). Swap. Array: [3,3,2,4,8,2,7,1].',
          'i=0: nums[0]=3, correct=2. nums[0]!=nums[2] (3!=2). Swap. Array: [2,3,2,4,8,2,7,1]... continues swapping.',
          'Eventually: [1,2,3,4,3,2,7,8]. Each present number is at its home index.',
          'Scan: index 4 has 3 (should be 5), index 5 has 2 (should be 6). Missing: [5, 6].',
        ],
        steps: [
          {
            description: 'Start at i=0. nums[0]=4 should be at index 3 (since 4-1=3). The number at index 3 is 7, which is different from 4, so we swap positions 0 and 3.',
            action: 'Swap nums[0]=4 to its home at index 3',
            reason: 'Number 4 belongs at index 3 (its home), and the home has a different number, so we swap',
            state: 'i=0, swapping 4 to index 3, bringing 7 to index 0',
            array: [4, 3, 2, 7, 8, 2, 3, 1],
            highlights: [0, 3],
            pointers: { i: 0 },
            variables: { 'nums[i]': 4, correctIndex: 3 },
          },
          {
            description: 'After the swap, nums becomes [7,3,2,4,8,2,3,1]. Now nums[0]=7 should be at index 6. Swap positions 0 and 6. We keep swapping at position 0 until the right number lands here.',
            action: 'Swap nums[0]=7 to its home at index 6',
            reason: 'The number that arrived (7) is also not at its home, so we keep swapping at the same position',
            state: 'i=0 still, swapping 7 to index 6, bringing 3 to index 0',
            array: [7, 3, 2, 4, 8, 2, 3, 1],
            highlights: [0, 6],
            pointers: { i: 0 },
            variables: { 'nums[i]': 7, correctIndex: 6 },
          },
          {
            description: 'After many swaps, the array settles into [1,2,3,4,3,2,7,8]. Each number from 1-8 that IS present has found its home. But indices 4 and 5 have "wrong" numbers — duplicates are squatting in the seats of missing numbers.',
            action: 'Cyclic sort complete — all present numbers are at their home indices',
            reason: 'Each swap placed at least one number at its correct index, so the process terminates in O(n) total swaps',
            state: 'Array = [1,2,3,4,3,2,7,8]. Indices 4 and 5 have duplicates.',
            array: [1, 2, 3, 4, 3, 2, 7, 8],
            variables: { note: 'Numbers placed at correct indices' },
          },
          {
            description: 'Final scan: index 4 has value 3, but should have 5. Index 5 has value 2, but should have 6. Those mismatches tell us 5 and 6 are the missing numbers. Elegant — no extra data structure needed!',
            action: 'Scan for mismatches to find missing numbers',
            reason: 'Any index where nums[i] != i+1 means the number i+1 is missing from the array',
            state: 'index 4: has 3, expects 5. index 5: has 2, expects 6. Missing = [5, 6]',
            array: [1, 2, 3, 4, 3, 2, 7, 8],
            highlights: [4, 5],
            result: 'Return [5, 6]',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Moving to the next index too early', explanation: 'After a swap, the new value at position i might also need swapping. Stay at i and keep swapping until the position is settled.' },
      { mistake: 'Infinite loop when duplicates exist', explanation: 'If nums[i] == nums[correct], both positions have the same value. Moving i forward avoids an infinite swap loop. This also reveals the duplicate.' },
      { mistake: 'Off-by-one between 0-indexed and 1-indexed', explanation: 'Number k belongs at index k-1 (for 1-to-n ranges). Mixing up 0-indexed and 1-indexed leads to wrong placements.' },
      { mistake: 'Using this pattern when numbers are not in range [1,n]', explanation: 'Cyclic sort only works when each number has a "home" index. If numbers are arbitrary, use a hash set instead.' },
    ],
    recognitionTips: [
      'The array contains numbers in a consecutive range (1 to n, or 0 to n).',
      'The problem asks about missing or duplicate numbers.',
      'You need O(1) space and the array can be modified in-place.',
      'The phrase "first missing positive" — even though numbers can be any positive integer, you only care about range [1, n].',
    ],
    practiceProblems: [
      { name: 'Missing Number', difficulty: 'Easy', why: 'Find a single missing number from [0,n] — the simplest cyclic sort application.' },
      { name: 'Find All Numbers Disappeared in an Array', difficulty: 'Easy', why: 'Find ALL missing numbers — the classic cyclic sort problem.' },
      { name: 'Find the Duplicate Number', difficulty: 'Medium', why: 'Can be solved with cyclic sort OR fast-slow pointers — good to compare approaches.' },
      { name: 'Find All Duplicates in an Array', difficulty: 'Medium', why: 'After cyclic sort, duplicates sit at wrong positions — one scan reveals them all.' },
      { name: 'First Missing Positive', difficulty: 'Hard', why: 'Tricky because you must handle numbers outside [1,n] and negative numbers.' },
    ],
    relatedPatterns: ['two-pointers'],
    commonProblems: [
      'Find All Disappeared Numbers',
      'Find the Duplicate Number',
      'Find All Duplicates',
      'First Missing Positive',
      'Set Mismatch',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  TREES & GRAPHS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 8. BFS ─────────────────────────────────────────────────────────────────
  {
    slug: 'bfs',
    name: 'BFS (Breadth-First Search)',
    category: 'Trees & Graphs',
    icon: '🌊',
    color: 'purple',
    description:
      'Explore level by level using a queue. Ideal for shortest path in unweighted graphs and level-order traversals.',
    whatIsThis: `Breadth-First Search (BFS) is a graph and tree traversal algorithm that explores nodes level by level — like ripples spreading outward when you drop a stone in water. It visits all nodes at distance 1 from the start, then all nodes at distance 2, then distance 3, and so on.

BFS uses a queue (first-in, first-out) data structure. You start by adding the root or starting node to the queue. Then you repeatedly take the front node off the queue, process it, and add all its unvisited neighbors to the back of the queue. Because queues preserve order, nodes get processed in the exact order they were discovered.

The most important property of BFS is that it guarantees the shortest path in unweighted graphs. The first time BFS reaches a node, it found the shortest route there. This makes BFS the go-to algorithm for "minimum steps" problems, level-order tree traversals, and anything where you need to explore outward in layers.`,
    realWorldAnalogy:
      'Think of a fire spreading from a single point. It burns everything 1 meter away first, then 2 meters, then 3 meters — always expanding uniformly in all directions. BFS explores a graph the same way: closest nodes first, farthest nodes last.',
    analogy: `Imagine dropping a stone into a perfectly still pond. Ripples spread outward in concentric circles. The first ring of ripples hits everything 1 meter away. The second ring hits everything 2 meters away. Each ring must complete before the next one begins. Nothing far away gets reached before everything nearby has been touched.

Now imagine you are organizing a phone tree to spread urgent news. You call 3 friends (level 1). Each of those 3 friends calls their own 3 friends (level 2 — 9 people). Then those 9 each call 3 more (level 3 — 27 people). The news spreads outward in waves, and everyone at the same "distance" from you hears it at the same time. If you wanted to find the SHORTEST chain of calls to reach a specific person, BFS gives you that — because it explores the closest people first.

In code, the "pond" is your data structure (tree or graph), and the "ripples" are managed by a queue. You put the starting node in the queue. Then you repeatedly pull from the front, process it, and push its neighbors to the back. The queue's first-in-first-out nature guarantees level-by-level exploration. When BFS first reaches any node, that path is guaranteed to be the shortest (in terms of number of edges).`,
    problemItSolves: 'BFS solves shortest-path problems in unweighted graphs, level-order tree traversals, finding all nodes at a given distance, and multi-source spreading problems like "rotting oranges" or "walls and gates."',
    signals: [
      { signal: '"shortest path" or "minimum steps" in unweighted graph', example: 'Word Ladder, Shortest Path in Binary Matrix' },
      { signal: '"level order traversal"', example: 'Binary Tree Level Order Traversal, Zigzag Level Order' },
      { signal: '"minimum number of moves/operations"', example: 'Open the Lock, Minimum Genetic Mutation' },
      { signal: '"spreading/infection" — multi-source BFS', example: 'Rotting Oranges, Walls and Gates' },
      { signal: '"all nodes at distance k"', example: 'All Nodes Distance K in Binary Tree' },
    ],
    coreIdea: `BFS works by exploring nodes in order of their distance from the source. Here is the step-by-step:

Step 1: Create a queue and add the starting node (the root of a tree, or any starting vertex in a graph). Mark it as visited.

Step 2: While the queue is not empty, pull the front node out. Process it (add its value to the result, check if it is the target, etc.).

Step 3: Add all unvisited neighbors of that node to the back of the queue. Mark them as visited so you do not process them again.

Step 4: Repeat steps 2-3 until the queue is empty.

For level-order traversal, there is a useful trick: at the start of each iteration, note the queue's current size. Process exactly that many nodes (they are all on the same level), and any new nodes added during this processing belong to the next level. This lets you group nodes by level.

Why does BFS find shortest paths? Because the queue processes nodes in the order they were discovered. Nodes at distance 1 are all discovered before nodes at distance 2. So when you first reach any node, you arrived via the shortest possible path. This property does NOT hold for DFS, which dives deep before exploring nearby alternatives.

Time complexity is O(V + E) where V is vertices and E is edges — you visit every node and examine every edge exactly once.`,
    visualType: 'tree',
    whenToUse: [
      'Shortest path in unweighted graph',
      'Level-order tree traversal',
      'Finding all nodes at distance K',
      'Minimum steps/moves problems',
    ],
    keyInsight:
      'BFS guarantees the first time you reach a node is via the shortest path (in unweighted graphs).',
    examples: [
      {
        title: 'Binary Tree Level Order Traversal',
        problem: 'Return level order traversal of a binary tree.',
        difficulty: 'Medium',
        input: 'Tree: [3, 9, 20, null, null, 15, 7]',
        output: '[[3], [9, 20], [15, 7]]',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def levelOrder(root):
    if not root: return []
    result, queue = [], [root]    # Start with root in queue
    while queue:
        level = []                 # Collect this level's values
        for _ in range(len(queue)):  # Process exactly this level's nodes
            node = queue.pop(0)    # Take from front
            level.append(node.val)
            if node.left:  queue.append(node.left)   # Add children for next level
            if node.right: queue.append(node.right)
        result.append(level)       # Store this level
    return result`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [], size = queue.length;  // Snapshot size for this level
    for (let i = 0; i < size; i++) {
      const node = queue.shift();           // Take from front
      level.push(node.val);
      if (node.left)  queue.push(node.left);   // Children for next level
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        List<Integer> level = new ArrayList<>();
        int size = queue.size();  // Snapshot for this level
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null)  queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        result.add(level);
    }
    return result;
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        vector<int> level;
        int size = q.size();  // Snapshot for this level
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}`,
          },
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        dryRun: [
          'queue = [3]. result = [].',
          'Level 0: size=1. Dequeue 3, add children 9 and 20. level=[3]. queue=[9,20]. result=[[3]].',
          'Level 1: size=2. Dequeue 9 (no children). Dequeue 20, add 15 and 7. level=[9,20]. result=[[3],[9,20]].',
          'Level 2: size=2. Dequeue 15 (leaf). Dequeue 7 (leaf). level=[15,7]. result=[[3],[9,20],[15,7]].',
          'Queue empty. Return [[3],[9,20],[15,7]].',
        ],
        steps: [
          {
            description: 'We start with the root node 3 in our queue. This is level 0 of the tree.',
            action: 'Initialize queue with the root node',
            reason: 'BFS starts from the root and explores outward level by level',
            state: 'queue = [3], result = [], processing level 0',
            treeData: {
              val: 3, color: 'active',
              left: { val: 9, color: 'default', left: null, right: null },
              right: { val: 20, color: 'default', left: { val: 15, color: 'default', left: null, right: null }, right: { val: 7, color: 'default', left: null, right: null } },
            },
            queue: [3],
            variables: { result: '[]', level: '[]' },
          },
          {
            description: 'We process level 0. Take 3 out of the queue and add it to the current level. Then add its children (9 and 20) to the queue for the next level. Level 0 complete: [3].',
            action: 'Process node 3, enqueue its children 9 and 20',
            reason: 'Node 3 is the only node at level 0. Its children belong to level 1.',
            state: 'Processed: 3. Queue now has level 1 nodes: [9, 20]',
            treeData: {
              val: 3, color: 'visited',
              left: { val: 9, color: 'queued', left: null, right: null },
              right: { val: 20, color: 'queued', left: { val: 15, color: 'default', left: null, right: null }, right: { val: 7, color: 'default', left: null, right: null } },
            },
            queue: [9, 20],
            variables: { result: '[[3]]', level: '[3]' },
          },
          {
            description: 'Now process level 1. Dequeue 9 (no children to add) and dequeue 20 (add children 15 and 7). Level 1 complete: [9, 20]. Notice how we process ALL nodes at the same depth before going deeper.',
            action: 'Process level 1: nodes 9 and 20',
            reason: 'We snapshot the queue size (2) and process exactly 2 nodes — all of level 1',
            state: 'Processed: 9, 20. Queue now has level 2: [15, 7]',
            treeData: {
              val: 3, color: 'visited',
              left: { val: 9, color: 'visited', left: null, right: null },
              right: { val: 20, color: 'visited', left: { val: 15, color: 'queued', left: null, right: null }, right: { val: 7, color: 'queued', left: null, right: null } },
            },
            queue: [15, 7],
            variables: { result: '[[3],[9,20]]', level: '[9,20]' },
          },
          {
            description: 'Process level 2. Dequeue 15 and 7 — they are both leaves with no children. Queue is now empty, so we are done! The result captures each level as its own subarray.',
            action: 'Process level 2: nodes 15 and 7 (leaves). Queue empty — done!',
            reason: 'These are leaf nodes with no children, so no new nodes are enqueued. BFS complete.',
            state: 'All nodes visited. Result = [[3],[9,20],[15,7]]',
            treeData: {
              val: 3, color: 'visited',
              left: { val: 9, color: 'visited', left: null, right: null },
              right: { val: 20, color: 'visited', left: { val: 15, color: 'visited', left: null, right: null }, right: { val: 7, color: 'visited', left: null, right: null } },
            },
            queue: [],
            variables: { result: '[[3],[9,20],[15,7]]', level: '[15,7]' },
            result: 'Return [[3],[9,20],[15,7]]',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Forgetting to mark nodes as visited in graph BFS', explanation: 'In trees, each node has one parent so you cannot revisit. In graphs, you MUST track visited nodes or you will loop forever.' },
      { mistake: 'Not snapshotting the queue size for level grouping', explanation: 'If you do not save queue.size() at the start of each level, new children get mixed into the current level\'s processing.' },
      { mistake: 'Using a stack instead of a queue', explanation: 'A stack (LIFO) gives you DFS, not BFS. BFS requires a queue (FIFO) to ensure level-by-level exploration.' },
      { mistake: 'Using BFS when DFS would be more space-efficient', explanation: 'BFS uses O(width) space, which can be O(n) for wide trees. DFS uses O(height), which is often O(log n). Choose based on the problem.' },
    ],
    recognitionTips: [
      'The problem asks for "shortest path" or "minimum steps" in an unweighted graph.',
      'You need to process a tree level by level.',
      'The problem involves spreading or infection from multiple sources simultaneously.',
      'You see "minimum operations to transform X into Y" — think BFS on state space.',
    ],
    practiceProblems: [
      { name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', why: 'The canonical BFS tree problem — master the level-grouping technique.' },
      { name: 'Rotting Oranges', difficulty: 'Medium', why: 'Multi-source BFS — infection spreads from multiple oranges simultaneously.' },
      { name: 'Word Ladder', difficulty: 'Hard', why: 'BFS on a word graph — shortest transformation sequence.' },
      { name: 'Shortest Path in Binary Matrix', difficulty: 'Medium', why: 'BFS on a grid — classic shortest path application.' },
      { name: 'Open the Lock', difficulty: 'Medium', why: 'BFS on state space — each state is a 4-digit combination.' },
    ],
    relatedPatterns: ['dfs', 'topological-sort'],
    commonProblems: [
      'Level Order Traversal',
      'Rotting Oranges',
      'Word Ladder',
      'Shortest Path in Binary Matrix',
      'Number of Islands',
    ],
  },

  // ── 9. DFS ─────────────────────────────────────────────────────────────────
  {
    slug: 'dfs',
    name: 'DFS (Depth-First Search)',
    category: 'Trees & Graphs',
    icon: '🌲',
    color: 'purple',
    description: 'Explore as deep as possible before backtracking. Use recursion or an explicit stack.',
    whatIsThis: `Depth-First Search (DFS) is the opposite strategy from BFS. Instead of exploring level by level, DFS dives as deep as possible down one path before backing up and trying another. Think of it as exploring a maze by always turning left — you follow one path to its dead end, then backtrack to the last intersection and try a different direction.

DFS can be implemented with recursion (which uses the call stack) or with an explicit stack data structure. The recursive version is usually cleaner and more natural to write. At each node, you process it, then recursively visit its neighbors (or children) one at a time, going all the way down before coming back up.

DFS is perfect for problems where you need to explore entire branches, detect cycles, find all paths, or work with connected components. In trees, DFS gives you preorder, inorder, and postorder traversals depending on when you process the node relative to its children. DFS uses O(h) space where h is the maximum depth, which can be much less than O(n) for balanced structures.`,
    realWorldAnalogy: 'Imagine exploring a cave system. You pick one tunnel and follow it as deep as it goes. When you hit a dead end, you backtrack to the last fork and try the next unexplored tunnel. You keep doing this until you have explored every passage.',
    analogy: `Imagine you are exploring a massive cave system with a ball of string. At the entrance, you tie the string and pick the leftmost tunnel. You walk as far as it goes, always choosing the leftmost path at every fork. When you hit a dead end, you follow your string back to the most recent fork and try the next tunnel you have not explored yet.

This is exactly how DFS works. The "string" is your call stack (or explicit stack). Each recursive call goes deeper into the cave. When a call returns (dead end), you "backtrack" to the previous fork. You keep doing this until every tunnel has been explored.

Now imagine a practical application: you are looking at a map of islands (a grid of 1s and 0s). When you find a piece of land (a "1"), you launch a DFS expedition to explore the entire island — walking north, south, east, west, marking each land cell as visited. Every connected piece of land gets explored in one expedition. When the DFS returns, that whole island is mapped. You count how many times you had to launch a new expedition — that is your number of islands. DFS is perfect for this because it naturally explores everything reachable from a starting point before moving on.`,
    problemItSolves: 'DFS solves problems involving path finding, connected components, cycle detection, tree traversals (preorder/inorder/postorder), flood fill, and any problem where you need to exhaustively explore one branch before trying another.',
    signals: [
      { signal: '"find all paths" or "does a path exist"', example: 'Path Sum, All Paths from Source to Target' },
      { signal: '"connected components" or "flood fill"', example: 'Number of Islands, Flood Fill' },
      { signal: '"detect cycle" in a directed graph', example: 'Course Schedule (cycle detection)' },
      { signal: '"tree traversal" (preorder, inorder, postorder)', example: 'Binary Tree Inorder Traversal' },
      { signal: '"grid exploration" with visited marking', example: 'Number of Islands, Max Area of Island' },
    ],
    coreIdea: `DFS explores as deep as possible before backtracking. Here is how it works:

For trees, the recursive pattern is simple: visit a node, then recursively visit each child. The order in which you "visit" versus "recurse" gives you different traversals — preorder (visit then recurse), inorder (left, visit, right), or postorder (recurse then visit).

For grids, DFS is like a flood fill. Start at a cell, mark it visited, then recursively explore all four (or eight) neighbors. Each neighbor that is valid and unvisited triggers its own DFS, which explores ITS neighbors, and so on. When all reachable cells from the starting point are visited, the DFS naturally unwinds.

For graphs, DFS is the same idea but you need to track visited nodes explicitly (since graphs can have cycles, unlike trees). From a node, recurse into each unvisited neighbor. If you encounter a node that is currently "in progress" (on the current DFS path), you have found a cycle.

The key difference from BFS: DFS does NOT find shortest paths. It finds A path (and can find ALL paths), but it does not guarantee the shortest one. Use BFS for shortest paths and DFS for exhaustive exploration.

Space complexity is O(h) for trees (height of tree) and O(V) for graphs (in the worst case, the entire graph forms a single path). For balanced trees, O(h) = O(log n), which is much better than BFS's O(n) width.`,
    visualType: 'grid',
    whenToUse: [
      'Path finding / all paths between nodes',
      'Detecting cycles in graphs',
      'Tree traversals (preorder, inorder, postorder)',
      'Connected components',
      'Exhaustive search / permutations',
    ],
    keyInsight: 'DFS uses O(h) space where h is depth. Use it when you need to explore entire branches or detect back-edges.',
    examples: [
      {
        title: 'Number of Islands',
        problem: 'Count the number of islands in a 2D grid.',
        difficulty: 'Medium',
        input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
        output: '2',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def numIslands(grid):
    count = 0
    def dfs(r, c):
        # Base case: out of bounds or water
        if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != '1':
            return
        grid[r][c] = '0'   # Mark as visited (sink the land)
        # Explore all 4 directions
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':    # Found unvisited land!
                dfs(r, c)            # Explore entire island
                count += 1           # Count this island
    return count`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function numIslands(grid) {
  let count = 0;
  function dfs(r, c) {
    // Base case: out of bounds or water
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0';  // Mark visited
    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);  // 4 directions
  }
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') { dfs(r, c); count++; }
    }
  }
  return count;
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                dfs(grid, r, c);  // Explore entire island
                count++;
            }
        }
    }
    return count;
}
private void dfs(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
    grid[r][c] = '0';  // Mark visited
    dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for (int r = 0; r < grid.size(); r++) {
        for (int c = 0; c < grid[0].size(); c++) {
            if (grid[r][c] == '1') {
                dfs(grid, r, c);
                count++;
            }
        }
    }
    return count;
}
void dfs(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);
}`,
          },
        ],
        timeComplexity: 'O(m * n)',
        spaceComplexity: 'O(m * n)',
        dryRun: [
          'Scan grid. (0,0) = "1" — land! Launch DFS. count = 1.',
          'DFS from (0,0): mark "0". Go right to (0,1): mark "0". Go down to (1,0): mark "0". All neighbors are water or visited.',
          'DFS complete. Island 1 fully explored: cells (0,0), (0,1), (1,0).',
          'Continue scanning. (2,2) = "1" — new island! Launch DFS. count = 2.',
          'DFS from (2,2): mark "0". No land neighbors. Island 2 is just one cell.',
          'Scan complete. Return 2.',
        ],
        steps: [
          {
            description: 'We scan the grid from top-left. At position (0,0) we find a "1" — land! This is the start of island #1. We launch a DFS from here to explore and mark all connected land cells.',
            action: 'Found land at (0,0) — launch DFS to explore island #1',
            reason: 'Every time we find unvisited land, it is a new island. DFS will explore all connected land.',
            state: 'Starting DFS at (0,0). count = 1.',
            grid: [['1', '1', '0'], ['1', '0', '0'], ['0', '0', '1']],
            gridHighlights: [[0, 0]],
            variables: { count: 1 },
          },
          {
            description: 'DFS explores from (0,0): it visits (0,0), then goes right to (0,1), then tries (1,0). Each visited cell gets marked as "0" so we never count it again. This "flood fill" finds all land connected to our starting point.',
            action: 'DFS flood-fills island #1: marks (0,0), (0,1), (1,0) as visited',
            reason: 'By marking cells "0", we prevent revisiting them and ensure each island is counted exactly once',
            state: 'Visited: (0,0), (0,1), (1,0). All marked as "0".',
            grid: [['0', '0', '0'], ['0', '0', '0'], ['0', '0', '1']],
            gridHighlights: [[0, 0], [0, 1], [1, 0]],
            variables: { count: 1, visited: '(0,0), (0,1), (1,0)' },
          },
          {
            description: 'We continue scanning. Cells (0,2), (1,1), (1,2), (2,0), (2,1) are all water. Then we reach (2,2) — another "1"! This is a separate island. Island #2 found.',
            action: 'Found land at (2,2) — launch DFS for island #2',
            reason: 'This "1" was not reachable from island #1, so it must be a separate island',
            state: 'Starting DFS at (2,2). count = 2.',
            grid: [['0', '0', '0'], ['0', '0', '0'], ['0', '0', '1']],
            gridHighlights: [[2, 2]],
            variables: { count: 2 },
          },
          {
            description: 'DFS from (2,2) marks it visited. It is a single cell with no land neighbors. Scan completes — no more "1" cells. We found exactly 2 islands.',
            action: 'DFS complete. All cells scanned. Return count = 2.',
            reason: 'Every piece of land has been explored and assigned to an island. The total is 2.',
            state: 'All cells visited. 2 islands found.',
            grid: [['0', '0', '0'], ['0', '0', '0'], ['0', '0', '0']],
            gridHighlights: [[2, 2]],
            variables: { count: 2 },
            result: 'Return 2',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Forgetting to mark cells/nodes as visited', explanation: 'Without marking, DFS will revisit the same nodes endlessly. In grids, set the cell to "0" or use a visited set. In graphs, use a visited boolean array.' },
      { mistake: 'Stack overflow on large inputs due to deep recursion', explanation: 'For very large grids (1000x1000), recursive DFS may exceed the call stack limit. Use iterative DFS with an explicit stack in those cases.' },
      { mistake: 'Not handling all 4 directions in grid DFS', explanation: 'You must explore up, down, left, and right. Forgetting one direction means some connected cells will not be visited.' },
      { mistake: 'Using DFS for shortest path problems', explanation: 'DFS does NOT find shortest paths. It finds A path. If you need the shortest path in an unweighted graph, use BFS.' },
    ],
    recognitionTips: [
      'The problem asks you to explore all connected cells/nodes from a starting point.',
      'You see "number of islands," "connected components," or "flood fill."',
      'The problem involves tree traversals (preorder, inorder, postorder).',
      'You need to find all paths or check if any path exists between two nodes.',
      'The problem involves cycle detection in directed graphs.',
    ],
    practiceProblems: [
      { name: 'Flood Fill', difficulty: 'Easy', why: 'The simplest grid DFS — paint connected cells from a starting point.' },
      { name: 'Number of Islands', difficulty: 'Medium', why: 'The classic grid DFS problem — count connected components.' },
      { name: 'Max Area of Island', difficulty: 'Medium', why: 'Like Number of Islands but track the size of each island during DFS.' },
      { name: 'Clone Graph', difficulty: 'Medium', why: 'DFS on a graph with node creation — tests understanding of visited tracking.' },
      { name: 'Course Schedule', difficulty: 'Medium', why: 'DFS cycle detection in a directed graph using three states (unvisited/in-progress/done).' },
    ],
    relatedPatterns: ['bfs', 'backtracking', 'topological-sort'],
    commonProblems: [
      'Number of Islands',
      'Max Area of Island',
      'Path Sum',
      'Clone Graph',
      'Course Schedule',
    ],
  },

  // ── 10. Backtracking / Subsets ─────────────────────────────────────────────
  {
    slug: 'backtracking',
    name: 'Subsets / Backtracking',
    category: 'Trees & Graphs',
    icon: '🔄',
    color: 'purple',
    description: 'Build solutions incrementally — explore each choice, recurse, then undo (backtrack) to try the next choice.',
    whatIsThis: `Backtracking is a systematic way to try all possible solutions by building them one step at a time and "undoing" choices that lead to dead ends. You can visualize it as exploring a decision tree: at each node, you pick one option, go deeper, and when you return, you undo that pick and try the next option.

The three key actions in backtracking are: CHOOSE (pick an option and add it to your current solution), EXPLORE (recurse to make the next choice), and UN-CHOOSE (remove what you just added and try the next option). This choose-explore-unchoose cycle is what makes backtracking work. It systematically explores the entire solution space without missing anything.

Backtracking is especially powerful when combined with pruning — skipping branches that you know will not lead to valid solutions. For example, if you are finding combinations that sum to a target and your current sum already exceeds the target, you can skip the entire subtree. This can dramatically reduce the actual runtime even though the worst case is exponential.`,
    realWorldAnalogy: 'Think of solving a maze by trial and error. At each fork, you pick a path and walk down it. If you hit a dead end, you walk back to the last fork and try a different path. You keep doing this until you find the exit.',
    analogy: `Imagine you are trying on outfits for a party. You have 3 shirts, 3 pants, and 3 hats. You want to try every possible combination. You start with shirt 1. Then you try it with pants 1. Then hat 1 — full outfit! Take a mental photo. Now REMOVE the hat (un-choose) and try hat 2. Photo. Remove hat 2, try hat 3. Photo. Now all hats tried with shirt 1 + pants 1. Remove pants 1 (backtrack one more level), try pants 2, and go through all hats again.

This is backtracking: make a choice, go deeper, undo the choice, try the next option. The decision tree looks like a real tree where each branch represents a choice, and you explore every branch by going deep, coming back, and trying the next one.

Now imagine a constraint: your red shirt clashes with your green pants. As soon as you put on the red shirt and reach for the green pants, you SKIP that entire branch — you do not need to try all 3 hats with a clashing combination. This is pruning, and it is what makes backtracking practical for real problems. Without pruning, you try all N! or 2^N combinations. With pruning, you cut huge chunks of the search tree and often finish much faster.`,
    problemItSolves: 'Backtracking solves problems where you need to generate all possible configurations — subsets, permutations, combinations, and constraint satisfaction problems like Sudoku and N-Queens. It systematically explores the solution space while pruning invalid branches.',
    signals: [
      { signal: '"generate all subsets/combinations/permutations"', example: 'Subsets, Permutations, Combination Sum' },
      { signal: '"find all valid configurations"', example: 'N-Queens, Sudoku Solver' },
      { signal: '"letter combinations" or "word search"', example: 'Letter Combinations of Phone Number, Word Search' },
      { signal: '"partition into valid parts"', example: 'Palindrome Partitioning, Restore IP Addresses' },
    ],
    coreIdea: `Backtracking follows a simple three-step pattern at each level of recursion:

Step 1 — CHOOSE: Pick one option from the remaining choices and add it to your current partial solution. For example, add a number to your current subset.

Step 2 — EXPLORE: Recurse with the updated partial solution. This goes deeper into the decision tree, making more choices.

Step 3 — UN-CHOOSE: After the recursive call returns, remove what you just added. This "undoes" the choice so you can try the next option at this level.

For subsets, the pattern looks like: start with an empty set. At each position, you have two choices — include the current element or skip it. The "include" path adds the element and recurses. When it returns, you remove the element (un-choose) and take the "skip" path.

For permutations, at each position you try placing every unused element, recurse, then remove it and try the next.

Pruning is the secret weapon: before making a choice, check if it could possibly lead to a valid solution. If not, skip it entirely. For Combination Sum, if the current sum already exceeds the target, prune the branch. For N-Queens, if placing a queen creates a conflict, skip that column.

The base case is when you have made enough choices to form a complete solution (or run out of options). At the base case, you record the current solution and return.`,
    visualType: 'tree',
    whenToUse: [
      'Generate all subsets / combinations / permutations',
      'Constraint satisfaction (Sudoku, N-Queens)',
      'Decision tree exploration',
      'Finding all valid configurations',
    ],
    keyInsight: 'At each step you make a choice, recurse, then undo. Prune invalid branches early to avoid exponential blowup.',
    examples: [
      {
        title: 'Subsets',
        problem: 'Generate all possible subsets of a set of distinct integers.',
        difficulty: 'Medium',
        input: 'nums = [1, 2, 3]',
        output: '[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def subsets(nums):
    result = []
    def backtrack(start, current):
        result.append(current[:])  # Add a copy of current subset
        for i in range(start, len(nums)):
            current.append(nums[i])       # CHOOSE
            backtrack(i + 1, current)      # EXPLORE
            current.pop()                  # UN-CHOOSE
    backtrack(0, [])
    return result`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function subsets(nums) {
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);  // Add a copy of current subset
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);       // CHOOSE
      backtrack(i + 1, current);   // EXPLORE
      current.pop();               // UN-CHOOSE
    }
  }
  backtrack(0, []);
  return result;
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}
private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
    result.add(new ArrayList<>(current));  // Add copy
    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);              // CHOOSE
        backtrack(nums, i + 1, current, result);  // EXPLORE
        current.remove(current.size() - 1);       // UN-CHOOSE
    }
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result;
    vector<int> current;
    function<void(int)> backtrack = [&](int start) {
        result.push_back(current);  // Add copy
        for (int i = start; i < nums.size(); i++) {
            current.push_back(nums[i]);  // CHOOSE
            backtrack(i + 1);            // EXPLORE
            current.pop_back();          // UN-CHOOSE
        }
    };
    backtrack(0);
    return result;
}`,
          },
        ],
        timeComplexity: 'O(n * 2^n)',
        spaceComplexity: 'O(n)',
        dryRun: [
          'backtrack(0, []): Add [] to result. result = [[]].',
          'i=0: CHOOSE 1. backtrack(1, [1]): Add [1]. result = [[], [1]].',
          'i=1: CHOOSE 2. backtrack(2, [1,2]): Add [1,2]. result = [[], [1], [1,2]].',
          'i=2: CHOOSE 3. backtrack(3, [1,2,3]): Add [1,2,3]. Base case (start=3=len). UN-CHOOSE 3, UN-CHOOSE 2.',
          'Back at [1], i=2: CHOOSE 3. Add [1,3]. UN-CHOOSE 3, UN-CHOOSE 1.',
          'Continue with start=1: CHOOSE 2 -> [2], then [2,3]. CHOOSE 3 -> [3]. Total: 8 subsets.',
        ],
        steps: [
          {
            description: 'We start with an empty subset []. This is the root of our decision tree. First, we add the empty set to our result.',
            action: 'Start with empty subset [], add to result',
            reason: 'The empty set is a valid subset — we record it before making any choices',
            state: 'current = [], result = [[]]',
            treeData: {
              val: '[]', color: 'active', label: 'start',
              left: { val: '[1]', color: 'default', left: null, right: null },
              right: { val: 'skip 1', color: 'default', left: null, right: null },
            },
            variables: { current: '[]', result: '[[]]' },
          },
          {
            description: 'CHOOSE: we add 1 to our current subset, making [1]. Add it to result. Now we recurse — from this point, we can add 2 or 3 (but not 1 again, since we use start index to avoid duplicates).',
            action: 'CHOOSE 1: current becomes [1], add to result, then recurse',
            reason: 'We explore the branch where 1 is included, starting deeper choices from index 1',
            state: 'current = [1], result = [[], [1]]',
            treeData: {
              val: '[]', color: 'visited',
              left: { val: '[1]', color: 'active', left: { val: '[1,2]', color: 'default', left: null, right: null }, right: { val: '[1,3]', color: 'default', left: null, right: null } },
              right: null,
            },
            array: [1, 2, 3],
            highlights: [0],
            variables: { current: '[1]', result: '[[],[1]]' },
          },
          {
            description: 'Continuing deeper: add 2 to get [1,2], add to result. Then add 3 to get [1,2,3], add to result. Now we have reached the end — no more numbers to add. Time to backtrack! Pop 3, then pop 2.',
            action: 'Go deep: [1] -> [1,2] -> [1,2,3], then backtrack',
            reason: 'We explore every branch to its maximum depth, recording each state, then undo choices',
            state: 'Explored [1,2,3]. Backtracking to try [1,3] next.',
            treeData: {
              val: '[1]', color: 'visited',
              left: { val: '[1,2]', color: 'visited', left: { val: '[1,2,3]', color: 'active', left: null, right: null }, right: null },
              right: { val: '[1,3]', color: 'default', left: null, right: null },
            },
            array: [1, 2, 3],
            highlights: [0, 1, 2],
            variables: { current: '[1,2,3]', result: '[[],[1],[1,2],[1,2,3]]' },
          },
          {
            description: 'Back at [1], we try the next option: add 3 to get [1,3]. Add to result. Then pop 1 and start fresh with 2: [2], [2,3]. Then [3]. All paths explored!',
            action: 'Backtrack and explore remaining branches: [1,3], [2], [2,3], [3]',
            reason: 'After each un-choose, we try the next option at that level until all branches are exhausted',
            state: 'All 8 subsets generated',
            treeData: {
              val: '[]', color: 'visited',
              left: { val: '[1]...', color: 'visited', left: null, right: null },
              right: { val: '[2]...', color: 'active', left: null, right: null },
            },
            array: [1, 2, 3],
            variables: { result: '8 subsets total' },
            result: 'Return all 8 subsets: [],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Forgetting to make a COPY when adding to result', explanation: 'If you do result.append(current) without copying, all entries in result will be references to the same list, which gets modified. Always copy: current[:] or [...current].' },
      { mistake: 'Not undoing the choice (missing the pop/remove)', explanation: 'The "un-choose" step is critical. Without it, your current path accumulates all elements and subsets are wrong.' },
      { mistake: 'Wrong start index causing duplicates or missing elements', explanation: 'For subsets/combinations, use start=i+1 to avoid using the same element twice. For permutations, use a "used" array instead.' },
      { mistake: 'Not pruning when possible', explanation: 'For problems with constraints (like target sum), always check if the current path can possibly lead to a valid solution before recursing. Pruning dramatically reduces runtime.' },
    ],
    recognitionTips: [
      'The problem asks to "generate all" or "find all" possible configurations.',
      'You see "subsets," "permutations," "combinations," or "partitions."',
      'The solution space is exponential (2^n or n!) but the problem still asks for all solutions.',
      'The problem involves placing items under constraints (N-Queens, Sudoku).',
    ],
    practiceProblems: [
      { name: 'Subsets', difficulty: 'Medium', why: 'The purest backtracking template — generate all 2^n subsets.' },
      { name: 'Permutations', difficulty: 'Medium', why: 'Backtracking with a "used" set instead of a start index.' },
      { name: 'Combination Sum', difficulty: 'Medium', why: 'Backtracking with pruning — skip branches where the sum exceeds the target.' },
      { name: 'Palindrome Partitioning', difficulty: 'Medium', why: 'Backtracking with a validity check (is this substring a palindrome?) at each step.' },
      { name: 'N-Queens', difficulty: 'Hard', why: 'The classic constraint-satisfaction backtracking problem.' },
    ],
    relatedPatterns: ['dfs'],
    commonProblems: [
      'Subsets',
      'Permutations',
      'Combination Sum',
      'N-Queens',
      'Letter Combinations of Phone Number',
    ],
  },

  // ── 11. Topological Sort ───────────────────────────────────────────────────
  {
    slug: 'topological-sort',
    name: 'Topological Sort',
    category: 'Trees & Graphs',
    icon: '📋',
    color: 'purple',
    description: "Order nodes in a DAG so every directed edge u->v has u before v. Use Kahn's algorithm (BFS) or DFS postorder.",
    whatIsThis: `Topological Sort is an algorithm for ordering the nodes of a Directed Acyclic Graph (DAG) so that for every directed edge from node A to node B, A comes before B in the ordering. In plain English: if task B depends on task A, then A must appear first in the sorted order.

The most intuitive approach is Kahn's algorithm, which works like peeling an onion layer by layer. You find all nodes with no incoming edges (no dependencies) — these can be done first. You add them to a queue, process them, and "remove" their outgoing edges. This might free up more nodes to have zero dependencies, so you add those to the queue too. You keep going until the queue is empty.

If you process all nodes, great — you have a valid topological order. If some nodes remain unprocessed, it means there is a cycle (circular dependency), which makes topological sorting impossible. This cycle detection property is why topological sort also shows up in problems asking "is it possible to complete all courses given these prerequisites?"`,
    realWorldAnalogy: 'Think about getting dressed in the morning. You must put on underwear before pants, socks before shoes, shirt before jacket. There are dependencies, but no cycles. Topological sort figures out one valid order.',
    analogy: `Imagine you are a project manager planning a building construction. Some tasks depend on others: you cannot paint walls before building them, and you cannot build walls before laying the foundation. You draw an arrow from each task to every task that depends on it. Your job: find an order to do everything so that no task starts before its dependencies are complete.

Here is Kahn's approach: look at all tasks and find the ones with NO prerequisites (like "clear the land" or "order materials"). Those can start immediately — put them in your "ready" pile. Pick one, do it, and cross off all the arrows going out from it. Now check: did removing those arrows free up any new tasks (tasks whose prerequisites are all done)? If so, add them to the "ready" pile. Repeat until everything is done.

If at some point the "ready" pile is empty but tasks remain, you have a circular dependency — task A needs B, B needs C, and C needs A. Impossible! In code, this is detected by checking if the number of processed nodes equals the total number of nodes. Topological sort is essentially the algorithm behind package managers (npm, pip), build systems (Make), and university course planners.`,
    problemItSolves: 'Topological Sort handles task scheduling with dependencies, determining if a valid ordering exists (cycle detection in DAGs), course prerequisite ordering, and build system dependency resolution.',
    signals: [
      { signal: '"prerequisites" or "dependencies"', example: 'Course Schedule, Course Schedule II' },
      { signal: '"order tasks given constraints"', example: 'Alien Dictionary, Task Scheduler' },
      { signal: '"is it possible to finish all tasks"', example: 'Course Schedule (cycle detection)' },
      { signal: '"directed acyclic graph" or "DAG"', example: 'Parallel Courses, Longest Path in DAG' },
    ],
    coreIdea: `Kahn's algorithm is the most intuitive way to do topological sort. Here is how:

Step 1: Build the graph and compute in-degrees. For each node, count how many edges point TO it (in-degree). Nodes with in-degree 0 have no dependencies.

Step 2: Add all nodes with in-degree 0 to a queue. These are "ready" — they can be processed first.

Step 3: While the queue is not empty, dequeue a node and add it to the result. For each of its outgoing neighbors, decrement their in-degree by 1 (we "removed" an edge). If any neighbor's in-degree drops to 0, add it to the queue.

Step 4: After the loop, check if the result contains all nodes. If yes, the topological order is valid. If not, there is a cycle.

The intuition: we always process nodes that have no remaining dependencies. Removing a processed node's edges may free up new nodes. It is like a domino chain — removing one dependency can unlock the next task.

Time complexity is O(V + E) because we visit every node once and examine every edge once. Space is O(V + E) for the graph and queue.`,
    visualType: 'graph',
    whenToUse: [
      'Task scheduling with dependencies',
      'Course prerequisites ordering',
      'Build system dependency resolution',
      'Detecting cycles in directed graphs',
    ],
    keyInsight: "Kahn's: repeatedly remove nodes with in-degree 0. If you can't process all nodes, there's a cycle.",
    examples: [
      {
        title: 'Course Schedule II',
        problem: 'Find an ordering of courses given prerequisites.',
        difficulty: 'Medium',
        input: 'numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]',
        output: '[0,1,2,3] or [0,2,1,3]',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def findOrder(numCourses, prerequisites):
    from collections import defaultdict, deque
    graph = defaultdict(list)  # Adjacency list
    in_degree = [0] * numCourses
    # Build graph: prereq -> course (edge means "must come before")
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    # Start with all courses that have no prerequisites
    queue = deque(i for i in range(numCourses) if in_degree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        # "Remove" this node's edges — decrement neighbors' in-degrees
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:  # Neighbor is now free!
                queue.append(neighbor)
    return order if len(order) == numCourses else []`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function findOrder(numCourses, prerequisites) {
  const graph = Array.from({length: numCourses}, () => []);
  const inDegree = new Array(numCourses).fill(0);
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);  // No prerequisites
  }
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node]) {
      if (--inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return order.length === numCourses ? order : [];
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    int[] inDegree = new int[numCourses];
    for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
    for (int[] pre : prerequisites) {
        graph.get(pre[1]).add(pre[0]);
        inDegree[pre[0]]++;
    }
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) queue.add(i);
    }
    int[] order = new int[numCourses];
    int idx = 0;
    while (!queue.isEmpty()) {
        int node = queue.poll();
        order[idx++] = node;
        for (int neighbor : graph.get(node)) {
            if (--inDegree[neighbor] == 0) queue.add(neighbor);
        }
    }
    return idx == numCourses ? order : new int[]{};
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> inDegree(numCourses, 0);
    for (auto& p : prerequisites) {
        graph[p[1]].push_back(p[0]);
        inDegree[p[0]]++;
    }
    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) q.push(i);
    }
    vector<int> order;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int neighbor : graph[node]) {
            if (--inDegree[neighbor] == 0) q.push(neighbor);
        }
    }
    return order.size() == numCourses ? order : vector<int>{};
}`,
          },
        ],
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V + E)',
        dryRun: [
          'Build graph: 0->[1,2], 1->[3], 2->[3]. in_degree = [0,1,1,2].',
          'Queue starts with node 0 (in-degree 0). order = [].',
          'Process 0: order=[0]. Decrement in-degrees of 1 and 2. in_degree=[0,0,0,2]. Enqueue 1,2.',
          'Process 1: order=[0,1]. Decrement 3. in_degree=[0,0,0,1].',
          'Process 2: order=[0,1,2]. Decrement 3. in_degree=[0,0,0,0]. Enqueue 3.',
          'Process 3: order=[0,1,2,3]. All 4 processed. Return [0,1,2,3].',
        ],
        steps: [
          {
            description: 'First, we build the graph and count in-degrees. Course 0 has no prerequisites (in-degree 0). Courses 1 and 2 each depend on course 0. Course 3 depends on both 1 and 2.',
            action: 'Build the dependency graph and compute in-degrees',
            reason: 'In-degrees tell us which courses have unmet prerequisites. Nodes with in-degree 0 are ready.',
            state: 'in-degree: [0,1,1,2]. Node 0 has no dependencies.',
            graphNodes: [
              { id: '0', label: '0', x: 150, y: 50, color: 'active' },
              { id: '1', label: '1', x: 75, y: 150, color: 'default' },
              { id: '2', label: '2', x: 225, y: 150, color: 'default' },
              { id: '3', label: '3', x: 150, y: 250, color: 'default' },
            ],
            graphEdges: [
              { from: '0', to: '1', directed: true },
              { from: '0', to: '2', directed: true },
              { from: '1', to: '3', directed: true },
              { from: '2', to: '3', directed: true },
            ],
            queue: [0],
            variables: { inDegree: '[0,1,1,2]', order: '[]' },
          },
          {
            description: 'Process course 0. Removing it reduces in-degrees of courses 1 and 2. Now both have in-degree 0 — they enter the queue.',
            action: 'Process course 0, unlock courses 1 and 2',
            reason: 'Course 0 had no prerequisites, so we take it first. Removing it frees up courses 1 and 2.',
            state: 'order = [0]. Courses 1 and 2 now have in-degree 0.',
            graphNodes: [
              { id: '0', label: '0', x: 150, y: 50, color: 'visited' },
              { id: '1', label: '1', x: 75, y: 150, color: 'queued' },
              { id: '2', label: '2', x: 225, y: 150, color: 'queued' },
              { id: '3', label: '3', x: 150, y: 250, color: 'default' },
            ],
            graphEdges: [
              { from: '0', to: '1', directed: true, highlighted: true },
              { from: '0', to: '2', directed: true, highlighted: true },
              { from: '1', to: '3', directed: true },
              { from: '2', to: '3', directed: true },
            ],
            queue: [1, 2],
            variables: { inDegree: '[0,0,0,2]', order: '[0]' },
          },
          {
            description: 'Process courses 1 and 2. Each reduces course 3 in-degree by 1. After both, course 3 has in-degree 0 and enters the queue.',
            action: 'Process courses 1 and 2, unlock course 3',
            reason: 'Course 3 depends on BOTH 1 and 2. Only after both are processed does its in-degree reach 0.',
            state: 'order = [0,1,2]. Course 3 now has in-degree 0.',
            graphNodes: [
              { id: '0', label: '0', x: 150, y: 50, color: 'visited' },
              { id: '1', label: '1', x: 75, y: 150, color: 'visited' },
              { id: '2', label: '2', x: 225, y: 150, color: 'visited' },
              { id: '3', label: '3', x: 150, y: 250, color: 'queued' },
            ],
            graphEdges: [
              { from: '0', to: '1', directed: true, highlighted: true },
              { from: '0', to: '2', directed: true, highlighted: true },
              { from: '1', to: '3', directed: true, highlighted: true },
              { from: '2', to: '3', directed: true, highlighted: true },
            ],
            queue: [3],
            variables: { inDegree: '[0,0,0,0]', order: '[0,1,2]' },
          },
          {
            description: 'Process course 3. All 4 courses processed — valid ordering exists with no cycle.',
            action: 'Process course 3. All courses completed!',
            reason: 'We processed all 4 courses, confirming there is no cycle. The ordering is valid.',
            state: 'order = [0,1,2,3]. All nodes processed.',
            graphNodes: [
              { id: '0', label: '0', x: 150, y: 50, color: 'visited' },
              { id: '1', label: '1', x: 75, y: 150, color: 'visited' },
              { id: '2', label: '2', x: 225, y: 150, color: 'visited' },
              { id: '3', label: '3', x: 150, y: 250, color: 'visited' },
            ],
            graphEdges: [
              { from: '0', to: '1', directed: true, highlighted: true },
              { from: '0', to: '2', directed: true, highlighted: true },
              { from: '1', to: '3', directed: true, highlighted: true },
              { from: '2', to: '3', directed: true, highlighted: true },
            ],
            queue: [],
            variables: { order: '[0,1,2,3]' },
            result: 'Return [0,1,2,3]',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Building the edge direction backwards', explanation: 'For prerequisites [course, prereq], the edge goes FROM prereq TO course. Reversing this gives wrong in-degrees and wrong order.' },
      { mistake: 'Forgetting to check for cycles', explanation: 'If processed count != total nodes, there is a cycle. Return empty array. Not checking this misses invalid inputs.' },
      { mistake: 'Using DFS without proper 3-state coloring for cycle detection', explanation: 'In DFS-based topo sort, you need WHITE (unvisited), GRAY (in progress), BLACK (done). Encountering a GRAY node means cycle.' },
      { mistake: 'Assuming only one valid topological order exists', explanation: 'Multiple valid orderings may exist. The algorithm gives ONE valid order, not the only one.' },
    ],
    recognitionTips: [
      'The problem involves dependencies or prerequisites.',
      'You need to find an ordering where dependencies are satisfied.',
      'The problem asks "is it possible to complete all tasks?" — cycle detection.',
      'You see a DAG (directed acyclic graph) and need to process nodes in dependency order.',
    ],
    practiceProblems: [
      { name: 'Course Schedule', difficulty: 'Medium', why: 'Just detect if a valid ordering exists — the simpler version.' },
      { name: 'Course Schedule II', difficulty: 'Medium', why: 'Actually return the ordering — the full topological sort.' },
      { name: 'Alien Dictionary', difficulty: 'Hard', why: 'Build the graph from character comparisons, then topo sort.' },
      { name: 'Parallel Courses', difficulty: 'Medium', why: 'Topo sort with level tracking — find the minimum number of semesters.' },
      { name: 'Minimum Height Trees', difficulty: 'Medium', why: 'Reverse topological peeling — remove leaves layer by layer.' },
    ],
    relatedPatterns: ['bfs', 'dfs'],
    commonProblems: [
      'Course Schedule',
      'Course Schedule II',
      'Alien Dictionary',
      'Parallel Courses',
      'Minimum Height Trees',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  DYNAMIC PROGRAMMING
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 12. DP: 0/1 Knapsack ──────────────────────────────────────────────────
  {
    slug: 'dp-knapsack',
    name: 'DP: 0/1 Knapsack',
    category: 'Dynamic Programming',
    icon: '🎒',
    color: 'amber',
    description: 'For each item, decide to include or exclude it. Build solution bottom-up from smaller capacities.',
    whatIsThis: `The 0/1 Knapsack pattern is one of the most fundamental dynamic programming techniques. The classic problem is: you have a backpack with limited weight capacity, and a set of items each with a weight and a value. You want to maximize the total value of items you pack without exceeding the weight limit. The "0/1" means each item is all-or-nothing — you either take it or leave it.

The DP approach builds a table where dp[i][w] represents the maximum value achievable using the first i items with a weight capacity of w. For each item, you have two choices: skip it (dp[i][w] = dp[i-1][w]) or take it if it fits (dp[i][w] = dp[i-1][w-weight[i]] + value[i]). You pick whichever gives more value.

This pattern shows up in many disguised forms: can you partition an array into two equal-sum halves? Can you make a target sum from a subset? Counting the number of ways to reach a sum? All of these are knapsack variants. The space can often be optimized from O(n*W) to O(W) by using a 1D array and iterating backwards.`,
    realWorldAnalogy: 'You are packing for a hiking trip and your backpack can only hold 10 kg. Each item has a weight and a "usefulness" score. You cannot take half a tent — it is all or nothing. You try different combinations to maximize total usefulness without going over 10 kg.',
    analogy: `Imagine you are a contestant on a game show. You have a shopping cart with a weight limit of 50 pounds, and you are in a store full of items — each with a weight and a dollar value. You want to maximize your total value without exceeding the weight limit. The catch: you cannot take half of an item. Each item is either IN the cart or NOT.

How would you think about this systematically? Start with just the first item and ask: "For every possible weight limit from 0 to 50, what is the best I can do with just this item?" Then add the second item: "For every weight limit, should I take item 2 or skip it?" The answer depends on what you could achieve WITHOUT item 2 at a reduced weight.

This is the 0/1 Knapsack pattern. You build a table, row by row (one row per item), column by column (one column per weight). Each cell asks: "Include this item or not?" If including it gives a better total, include it. Otherwise skip. The bottom-right cell gives your answer. The 1D optimization is clever: process the DP array right-to-left for each item, so you never accidentally use the same item twice in one row.`,
    problemItSolves: 'The 0/1 Knapsack pattern handles optimization problems where you select a subset of items (include or exclude each one) subject to a capacity constraint, aiming to maximize or minimize some value. Also covers subset-sum and partition problems.',
    signals: [
      { signal: '"select subset to maximize/minimize value under constraint"', example: '0/1 Knapsack, Partition Equal Subset Sum' },
      { signal: '"can you partition into two equal subsets"', example: 'Partition Equal Subset Sum' },
      { signal: '"number of ways to make a target sum"', example: 'Target Sum, Coin Change 2 (bounded)' },
      { signal: '"each item can be used at most once"', example: '0/1 Knapsack, Last Stone Weight II' },
    ],
    coreIdea: `The core recurrence is elegantly simple. For each item i and each possible capacity w:

Option 1 — Skip item i: dp[i][w] = dp[i-1][w]. The best value is whatever we could achieve without this item.

Option 2 — Take item i (only if it fits): dp[i][w] = dp[i-1][w - weight[i]] + value[i]. We use capacity weight[i] for this item and get its value, plus the best we could do with the remaining capacity using previous items.

We take the max of both options: dp[i][w] = max(skip, take).

For the 1D space optimization: instead of a 2D table, use a single row and iterate right-to-left. Why right-to-left? Because dp[j] depends on dp[j - weight[i]] from the PREVIOUS row. If we iterate left-to-right, we would overwrite dp[j - weight[i]] with the CURRENT row's value before we need the old value. Right-to-left ensures we always read from the previous row's values.

Base case: dp[0] = True (or 0) — we can always achieve a sum/capacity of 0 by taking nothing.

This pattern is incredibly versatile: Partition Equal Subset Sum, Target Sum, Last Stone Weight II, and Ones and Zeroes are all 0/1 Knapsack in disguise.`,
    visualType: 'dpTable',
    whenToUse: [
      'Subset with maximum/minimum value under constraint',
      'Partition into two equal-sum subsets',
      'Target sum / coin change (bounded)',
      'Counting subsets with given sum',
    ],
    keyInsight: 'dp[i][w] = best value using first i items with capacity w. Transition: take the item or skip it.',
    examples: [
      {
        title: 'Partition Equal Subset Sum',
        problem: 'Can we partition array into two subsets with equal sum?',
        difficulty: 'Medium',
        input: 'nums = [1, 5, 11, 5]',
        output: 'true (subsets: [1,5,5] and [11])',
        codes: [
          {
            language: 'python',
            label: 'Python',
            code: `def canPartition(nums):
    total = sum(nums)
    if total % 2: return False       # Odd total can't be split evenly
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True                     # Sum of 0 is always achievable
    for num in nums:
        # Iterate backwards to avoid using same number twice
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return dp[target]`,
          },
          {
            language: 'javascript',
            label: 'JavaScript',
            code: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;  // Empty subset sums to 0
  for (const num of nums) {
    for (let j = target; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
  }
  return dp[target];
}`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `public boolean canPartition(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target];
}`,
          },
          {
            language: 'cpp',
            label: 'C++',
            code: `bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2) return false;
    int target = total / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target];
}`,
          },
        ],
        timeComplexity: 'O(n * target)',
        spaceComplexity: 'O(target)',
        dryRun: [
          'Total = 22. target = 11. dp = [T, F, F, F, F, F, F, F, F, F, F, F].',
          'num=1: j from 11 to 1. dp[1] = dp[1] or dp[0] = T. dp = [T, T, F, F, F, F, F, F, F, F, F, F].',
          'num=5: dp[6] = dp[6] or dp[1] = T. dp[5] = dp[5] or dp[0] = T. Achievable: {0,1,5,6}.',
          'num=11: dp[11] = dp[11] or dp[0] = T! We can make 11. Return true.',
        ],
        steps: [
          {
            description: 'Total = 1+5+11+5 = 22. Half is 11. Can we find a subset summing to 11? We create a boolean DP array. dp[0] = True (empty subset).',
            action: 'Compute target = total/2 = 11, initialize DP array',
            reason: 'If we can find a subset summing to half the total, the rest automatically sums to the other half',
            state: 'target = 11, dp[0] = True, all others False',
            dpTable: [[{ value: 'T', color: 'computed' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }]],
            dpColLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
            dpRowLabels: ['init'],
            variables: { target: 11, total: 22 },
          },
          {
            description: 'Process num=1. Iterate j from 11 down to 1. dp[1] = dp[1] OR dp[0] = True. Now sums 0 and 1 are achievable.',
            action: 'Process num=1: dp[1] becomes True',
            reason: 'With number 1, we can achieve sum 0 (take nothing) and sum 1 (take the 1)',
            state: 'Achievable sums: {0, 1}',
            dpTable: [[{ value: 'T', color: 'computed' }, { value: 'T', color: 'active' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }]],
            dpColLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
            dpRowLabels: ['num=1'],
            variables: { num: 1, achievable: '{0, 1}' },
          },
          {
            description: 'Process num=5. dp[6] = T (from dp[1]), dp[5] = T (from dp[0]). Achievable: {0, 1, 5, 6}.',
            action: 'Process num=5: dp[5] and dp[6] become True',
            reason: 'Adding 5 to previously achievable sums (0 and 1) gives us 5 and 6',
            state: 'Achievable sums: {0, 1, 5, 6}',
            dpTable: [[{ value: 'T', color: 'computed' }, { value: 'T', color: 'computed' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'T', color: 'active' }, { value: 'T', color: 'active' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }]],
            dpColLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
            dpRowLabels: ['num=5'],
            variables: { num: 5, achievable: '{0, 1, 5, 6}' },
          },
          {
            description: 'Process num=11. dp[11] = dp[11] OR dp[0] = True! We can make 11. The answer is True — partition into [11] and [1,5,5].',
            action: 'Process num=11: dp[11] becomes True!',
            reason: 'Number 11 alone gives us sum 11, which is our target. Partition is possible!',
            state: 'dp[11] = True. Partition: [11] and [1, 5, 5].',
            dpTable: [[{ value: 'T', color: 'computed' }, { value: 'T', color: 'computed' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'T', color: 'computed' }, { value: 'T', color: 'computed' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'F', color: 'default' }, { value: 'T', color: 'optimal' }]],
            dpColLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
            dpRowLabels: ['num=11'],
            variables: { num: 11 },
            result: 'dp[11] = True! Return true. Partition: [11] and [1,5,5]',
          },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Iterating left-to-right in the 1D optimization', explanation: 'Left-to-right allows using the same item multiple times (unbounded knapsack). For 0/1 knapsack, iterate right-to-left.' },
      { mistake: 'Forgetting to check if the total is odd', explanation: 'For partition problems, an odd total cannot be split into two equal halves. Return false immediately.' },
      { mistake: 'Not recognizing a problem as knapsack', explanation: 'Many problems are disguised knapsacks: "can a subset sum to X?" is knapsack with boolean values. "minimize difference between two subsets" is knapsack.' },
      { mistake: 'Using 2D table when 1D suffices', explanation: 'The 1D optimization saves space from O(n*W) to O(W). Only the previous row is needed, and right-to-left iteration simulates it with a single row.' },
    ],
    recognitionTips: [
      'The problem asks about selecting a subset of items with a capacity/weight/sum constraint.',
      'You see "partition into two subsets" or "can a subset sum to target."',
      'Each element is either included or excluded (binary choice).',
      'The problem can be framed as "maximize value within a budget" or "is target achievable."',
    ],
    practiceProblems: [
      { name: 'Partition Equal Subset Sum', difficulty: 'Medium', why: 'Classic knapsack in disguise — can we find a subset summing to total/2?' },
      { name: 'Target Sum', difficulty: 'Medium', why: 'Assign + or - to each number to reach a target — reduces to a subset sum problem.' },
      { name: 'Last Stone Weight II', difficulty: 'Medium', why: 'Minimize the remaining stone weight — equivalent to partitioning into two groups with minimum difference.' },
      { name: 'Ones and Zeroes', difficulty: 'Medium', why: '2D knapsack — limited by both the number of 0s and 1s.' },
      { name: 'Coin Change 2', difficulty: 'Medium', why: 'Unbounded variant (left-to-right) — count the number of ways to make a target sum.' },
    ],
    relatedPatterns: ['dp-lis', 'dp-lcs'],
    commonProblems: ['Partition Equal Subset Sum', '0/1 Knapsack', 'Target Sum', 'Last Stone Weight II', 'Ones and Zeroes'],
  },

  // ── 13. DP: Longest Increasing Subsequence ─────────────────────────────────
  {
    slug: 'dp-lis',
    name: 'DP: Longest Increasing Subsequence',
    category: 'Dynamic Programming',
    icon: '📈',
    color: 'amber',
    description: 'Find the longest subsequence where each element is strictly greater than the previous. O(n log n) with binary search.',
    whatIsThis: `The Longest Increasing Subsequence (LIS) problem asks: given an array of numbers, what is the longest subsequence you can find where each number is strictly larger than the one before it? A subsequence does not have to be contiguous — you can skip elements, as long as the ones you pick are in order and strictly increasing.

The naive DP approach uses O(n squared): for each element, check all previous elements to find the longest subsequence ending there. But there is a brilliant O(n log n) optimization using a "tails" array. The idea is to maintain an array where tails[i] holds the smallest possible tail element for an increasing subsequence of length i+1.

For each new number, you use binary search to find where it belongs in the tails array. If it is bigger than everything, append it (the LIS just got longer). If not, replace the first element in tails that is greater than or equal to it. This replacement does not change the current LIS length but keeps the tails array optimally small, leaving room for future elements to extend longer subsequences.`,
    realWorldAnalogy: 'Imagine stacking books on a shelf where each book must be taller than the previous one. When a medium-height book arrives, you might swap it for a taller book — keeping room for even taller books later.',
    analogy: `Imagine you are building the tallest possible tower of blocks, but each block you place must be taller than the one below it. Blocks arrive one at a time in random order. When a new block arrives, you have a choice: if it is taller than your current tallest tower's top block, great — place it on top and the tower grows! But if it is shorter, you do something clever: you look at all your towers and replace the shortest block that is taller than this new one. Why? Because a shorter replacement keeps more room for future blocks.

You maintain a lineup of "towers" (the tails array), each representing the best ending element for subsequences of different lengths. The lineup is always sorted (shorter endings for shorter subsequences). When a new number arrives, use binary search to find its spot. If it extends the longest tower, append. If not, replace the first tower end that is greater or equal. The length of the lineup IS the answer.

This is the patience sorting analogy. Imagine playing solitaire and sorting cards into piles where each pile's top card is in decreasing order. The number of piles at the end is the LIS length. The binary search optimization makes this O(n log n) — a beautiful blend of DP and binary search.`,
    problemItSolves: 'LIS solves problems involving finding the longest increasing (or decreasing) subsequence, minimum chains to cover a sequence, and envelope/box stacking problems that reduce to multi-dimensional LIS.',
    signals: [
      { signal: '"longest increasing/decreasing subsequence"', example: 'Longest Increasing Subsequence, Longest Decreasing Subsequence' },
      { signal: '"minimum number of chains/envelopes"', example: 'Russian Doll Envelopes' },
      { signal: '"patience sorting" or "pile counting"', example: 'LIS, Longest String Chain' },
    ],
    coreIdea: `The O(n log n) approach maintains a "tails" array where tails[i] is the smallest possible tail element for an increasing subsequence of length i+1.

For each number in the input: use binary search to find its position in tails. If the number is bigger than all elements in tails, append it — the LIS just got one longer. Otherwise, replace the first element in tails that is >= the number. This keeps tails as small as possible, maximizing future opportunities.

Why does this work? Replacing a larger tail with a smaller one never makes the LIS shorter (the length stays the same) but opens up possibilities for future elements. If a number 5 arrives and you replace a 7 in tails with 5, any future number between 5 and 7 can now extend the subsequence — something that was impossible when 7 was there.

The tails array is always sorted, which is why binary search works. The final answer is simply the length of the tails array.

Note: tails does NOT contain the actual LIS — it represents the BEST POSSIBLE ending values. To reconstruct the actual subsequence, you need to track predecessors separately.`,
    visualType: 'array',
    whenToUse: ['Longest increasing/decreasing subsequence', 'Minimum number of chains/sequences', 'Box stacking / Russian doll envelopes', 'Patience sorting'],
    keyInsight: 'Maintain a "tails" array where tails[i] is the smallest tail element for an increasing subsequence of length i+1.',
    examples: [
      {
        title: 'Longest Increasing Subsequence',
        problem: 'Find length of the longest strictly increasing subsequence.',
        difficulty: 'Medium',
        input: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]',
        output: '4 (subsequence: [2, 3, 7, 18])',
        codes: [
          { language: 'python', label: 'Python', code: `def lengthOfLIS(nums):
    from bisect import bisect_left
    tails = []  # Smallest tail for each subsequence length
    for num in nums:
        pos = bisect_left(tails, num)  # Binary search
        if pos == len(tails):
            tails.append(num)   # Extend the LIS
        else:
            tails[pos] = num    # Replace to keep tails small
    return len(tails)` },
          { language: 'javascript', label: 'JavaScript', code: `function lengthOfLIS(nums) {
  const tails = [];
  for (const num of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {  // Binary search for insertion point
      const mid = (lo + hi) >> 1;
      if (tails[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = num;  // Replace or append
  }
  return tails.length;
}` },
          { language: 'java', label: 'Java', code: `public int lengthOfLIS(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int num : nums) {
        int lo = 0, hi = size;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (tails[mid] < num) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = num;
        if (lo == size) size++;
    }
    return size;
}` },
          { language: 'cpp', label: 'C++', code: `int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int num : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), num);
        if (it == tails.end()) tails.push_back(num);
        else *it = num;
    }
    return tails.size();
}` },
        ],
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        dryRun: [
          'num=10: tails empty, append. tails=[10].',
          'num=9: bisect finds pos=0 (9<10). Replace. tails=[9].',
          'num=2: pos=0. Replace. tails=[2]. num=5: pos=1 (5>2). Append. tails=[2,5].',
          'num=3: pos=1 (3<5). Replace 5 with 3. tails=[2,3]. num=7: pos=2. Append. tails=[2,3,7].',
          'num=101: pos=3. Append. tails=[2,3,7,101]. num=18: pos=3 (18<101). Replace. tails=[2,3,7,18].',
          'Return 4.',
        ],
        steps: [
          { description: 'Process num=10. Tails is empty, so append. Then num=9: 9 < 10, so replace 10 with 9. Then num=2: replace 9 with 2. LIS length still 1, but tail is optimally small.',
            action: 'Process 10, 9, 2 — replacing tails to keep them minimal',
            reason: 'Smaller tails leave more room for future numbers to extend the subsequence',
            state: 'tails = [2] after processing first 3 elements',
            array: [10, 9, 2, 5, 3, 7, 101, 18], highlights: [0, 1, 2], variables: { tails: '[2]', length: 1 } },
          { description: 'num=5: 5 > 2, append. tails=[2,5]. LIS length 2! num=3: 3 < 5, replace 5 with 3. tails=[2,3]. Still length 2 but smaller tail.',
            action: 'Process 5 (extend) and 3 (replace 5 to keep tail small)',
            reason: 'Appending 5 extends the LIS. Replacing 5 with 3 keeps the door open for numbers between 3 and 5.',
            state: 'tails = [2, 3] after processing 5 elements',
            array: [10, 9, 2, 5, 3, 7, 101, 18], highlights: [3, 4], variables: { tails: '[2, 3]', length: 2 } },
          { description: 'num=7: 7 > 3, append. tails=[2,3,7]. Length 3! num=101: 101 > 7, append. tails=[2,3,7,101]. Length 4!',
            action: 'Process 7 and 101 — both extend the LIS',
            reason: 'Each number is larger than all existing tails, so they extend the subsequence',
            state: 'tails = [2, 3, 7, 101], LIS length = 4',
            array: [10, 9, 2, 5, 3, 7, 101, 18], highlights: [5, 6], variables: { tails: '[2, 3, 7, 101]', length: 4 } },
          { description: 'num=18: 18 < 101, replace 101 with 18. tails=[2,3,7,18]. Length stays 4. One valid LIS is [2,3,7,18].',
            action: 'Process 18: replace 101 to keep tail small',
            reason: '18 is smaller than 101, so replacing it makes the tail more accommodating for future numbers',
            state: 'tails = [2, 3, 7, 18]. Final LIS length = 4.',
            array: [10, 9, 2, 5, 3, 7, 101, 18], highlights: [7], variables: { tails: '[2, 3, 7, 18]', length: 4 }, result: 'Return 4' },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Using the tails array as the actual LIS', explanation: 'The tails array gives the LENGTH of the LIS but may not contain the actual subsequence. To reconstruct it, track predecessor indices.' },
      { mistake: 'Using bisect_right instead of bisect_left', explanation: 'For strictly increasing, use bisect_left (lower_bound). bisect_right would allow equal elements, giving non-strictly increasing.' },
      { mistake: 'Confusing subsequence with subarray', explanation: 'A subsequence can skip elements; a subarray must be contiguous. LIS is about subsequences.' },
    ],
    recognitionTips: [
      'The problem asks about the longest increasing (or decreasing) subsequence.',
      'You see "subsequence" (not subarray) with an ordering condition.',
      'The problem involves stacking or nesting objects by dimensions.',
    ],
    practiceProblems: [
      { name: 'Longest Increasing Subsequence', difficulty: 'Medium', why: 'The fundamental LIS problem — master both O(n^2) and O(n log n) approaches.' },
      { name: 'Longest String Chain', difficulty: 'Medium', why: 'LIS variant where "increasing" means one character can be inserted.' },
      { name: 'Russian Doll Envelopes', difficulty: 'Hard', why: '2D LIS — sort by width, then find LIS on heights.' },
      { name: 'Number of Longest Increasing Subsequences', difficulty: 'Medium', why: 'Count ALL LIS of maximum length — requires tracking counts alongside lengths.' },
      { name: 'Maximum Length of Pair Chain', difficulty: 'Medium', why: 'Greedy/LIS on intervals sorted by end time.' },
    ],
    relatedPatterns: ['binary-search', 'dp-knapsack'],
    commonProblems: ['Longest Increasing Subsequence', 'Russian Doll Envelopes', 'Number of Longest Increasing Subsequences', 'Longest String Chain'],
  },

  // ── 14. DP: Longest Common Subsequence ─────────────────────────────────────
  {
    slug: 'dp-lcs',
    name: 'DP: Longest Common Subsequence',
    category: 'Dynamic Programming',
    icon: '🔗',
    color: 'amber',
    description: 'Compare two sequences and find their longest common subsequence using a 2D DP table.',
    whatIsThis: `The Longest Common Subsequence (LCS) problem asks: given two strings, what is the longest sequence of characters that appears in both strings in the same relative order (but not necessarily contiguously)? For example, "ace" is a common subsequence of "abcde" and "ace".

The solution uses a 2D table where dp[i][j] represents the length of the LCS of the first i characters of text1 and the first j characters of text2. The recurrence is elegant: if the characters match (text1[i-1] == text2[j-1]), then dp[i][j] = dp[i-1][j-1] + 1 — we extend the best solution from before both characters. If they don't match, dp[i][j] = max(dp[i-1][j], dp[i][j-1]) — we take the better of skipping either character.

LCS is a foundational DP pattern. Once you understand it, you can solve many related problems: edit distance, shortest common supersequence, diff algorithms for comparing files, and even DNA sequence alignment in bioinformatics.`,
    realWorldAnalogy: 'Imagine two playlists of songs. The LCS is the longest sequence of songs appearing in both playlists in the same order, though other songs might be between them.',
    analogy: `Imagine two friends comparing their road trip routes. Alice drove through cities A, B, C, D, E. Bob drove through A, C, E, F, G. What is the longest sequence of cities they both visited in the same order? A, C, E — three cities in order. That is the LCS.

Picture a 2D grid. Rows represent Alice's cities, columns represent Bob's cities. Each cell asks: "What is the longest common route using Alice's first i cities and Bob's first j cities?" If Alice's i-th city matches Bob's j-th city, we extend the previous best (go diagonally). If not, we take the better of dropping Alice's last city or Bob's last city.

This grid fills in from top-left to bottom-right. The bottom-right cell gives the answer. The visual is a table where matches create diagonal jumps (adding +1) and non-matches carry forward the best from above or left. It is like finding the "common thread" between two sequences.

This same technique powers the "diff" command that shows differences between two files, spell-check algorithms that suggest corrections, and DNA alignment tools that find similarities between gene sequences.`,
    problemItSolves: 'LCS solves problems comparing two sequences to find their longest shared subsequence. It is the basis for edit distance, diff algorithms, shortest common supersequence, and DNA sequence alignment.',
    signals: [
      { signal: '"longest common subsequence"', example: 'Longest Common Subsequence' },
      { signal: '"edit distance" or "minimum operations to transform"', example: 'Edit Distance, Delete Operation for Two Strings' },
      { signal: '"compare two strings/sequences"', example: 'Shortest Common Supersequence, Minimum ASCII Delete Sum' },
    ],
    coreIdea: `Build a 2D table where dp[i][j] = length of the LCS of text1[0..i-1] and text2[0..j-1].

The recurrence has two cases:

Case 1 — Characters match (text1[i-1] == text2[j-1]): dp[i][j] = dp[i-1][j-1] + 1. We found a common character! The LCS extends by 1 from the state where neither character was considered yet.

Case 2 — Characters differ: dp[i][j] = max(dp[i-1][j], dp[i][j-1]). We cannot use both characters, so we take the better result from either dropping text1's character or text2's character.

Base case: dp[0][j] = dp[i][0] = 0 for all i, j. Comparing any string with an empty string gives LCS of length 0.

The answer is in dp[m][n] where m and n are the lengths of the two strings.

To reconstruct the actual LCS (not just its length), trace back from dp[m][n]: if the characters matched, go diagonally and include that character. If not, go to the cell with the larger value (up or left). This gives you the LCS string.`,
    visualType: 'dpTable',
    whenToUse: ['Longest common subsequence/substring', 'Edit distance / string matching', 'Diff algorithms', 'DNA sequence alignment'],
    keyInsight: 'If chars match, dp[i][j] = dp[i-1][j-1]+1. Otherwise, take the max of skipping either character.',
    examples: [
      {
        title: 'Longest Common Subsequence',
        problem: 'Find length of the longest common subsequence of two strings.',
        difficulty: 'Medium',
        input: 'text1 = "abcde", text2 = "ace"',
        output: '3 (LCS = "ace")',
        codes: [
          { language: 'python', label: 'Python', code: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:       # Characters match!
                dp[i][j] = dp[i-1][j-1] + 1    # Extend the LCS
            else:                                # No match
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # Best of skipping either
    return dp[m][n]` },
          { language: 'javascript', label: 'JavaScript', code: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}` },
          { language: 'java', label: 'Java', code: `public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i-1) == text2.charAt(j-1))
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}` },
          { language: 'cpp', label: 'C++', code: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i-1] == text2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}` },
        ],
        timeComplexity: 'O(m * n)',
        spaceComplexity: 'O(m * n)',
        dryRun: [
          'Initialize 6x4 table of zeros. text1="abcde", text2="ace".',
          'i=1 (a), j=1 (a): match! dp[1][1] = dp[0][0]+1 = 1. j=2 (c): no match. dp[1][2] = max(0,1) = 1. j=3 (e): no match. dp[1][3] = 1.',
          'i=2 (b): no matches with a,c,e. All carry forward as 1.',
          'i=3 (c), j=2 (c): match! dp[3][2] = dp[2][1]+1 = 2. LCS is now "ac".',
          'i=5 (e), j=3 (e): match! dp[5][3] = dp[4][2]+1 = 3. LCS is "ace". Return 3.',
        ],
        steps: [
          { description: 'Build the table with text1="abcde" on rows and text2="ace" on columns. First row and column are zeros (empty string comparison).',
            action: 'Initialize the DP table with zeros',
            reason: 'Comparing any string with an empty string gives LCS of 0',
            state: 'Table initialized. Ready to fill row by row.',
            dpTable: [
              [{ value: 0, color: 'computed' }, { value: 0, color: 'computed' }, { value: 0, color: 'computed' }, { value: 0, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
            ],
            dpRowLabels: ['', 'a', 'b', 'c', 'd', 'e'], dpColLabels: ['', 'a', 'c', 'e'],
            variables: { text1: 'abcde', text2: 'ace' } },
          { description: 'Row "a": compare "a" with each char in "ace". "a"=="a" match! dp[1][1]=1. Others carry forward as 1.',
            action: 'Fill row for "a": match with "a" gives LCS length 1',
            reason: '"a" matches "a" in text2 — the LCS of "a" and "a" is length 1',
            state: 'LCS("a", "a")=1, LCS("a", "ac")=1, LCS("a", "ace")=1',
            dpTable: [
              [{ value: 0, color: 'computed' }, { value: 0, color: 'computed' }, { value: 0, color: 'computed' }, { value: 0, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: 1, color: 'active' }, { value: 1, color: 'computed' }, { value: 1, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
            ],
            dpRowLabels: ['', 'a', 'b', 'c', 'd', 'e'], dpColLabels: ['', 'a', 'c', 'e'] },
          { description: 'Rows "b","c": "b" has no matches, values stay 1. "c" matches "c": dp[3][2] = dp[2][1]+1 = 2. LCS grows to "ac"!',
            action: 'Fill rows b and c: "c" matches "c", LCS extends to length 2',
            reason: '"c" in text1 matches "c" in text2 — we extend the LCS from "a" to "ac"',
            state: 'LCS("abc", "ac") = 2. The subsequence is "ac".',
            dpTable: [
              [{ value: 0, color: 'computed' }, { value: 0, color: 'computed' }, { value: 0, color: 'computed' }, { value: 0, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: 1, color: 'computed' }, { value: 1, color: 'computed' }, { value: 1, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: 1, color: 'computed' }, { value: 1, color: 'computed' }, { value: 1, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: 1, color: 'computed' }, { value: 2, color: 'active' }, { value: 2, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
              [{ value: 0, color: 'computed' }, { value: '', color: 'default' }, { value: '', color: 'default' }, { value: '', color: 'default' }],
            ],
            dpRowLabels: ['', 'a', 'b', 'c', 'd', 'e'], dpColLabels: ['', 'a', 'c', 'e'] },
          { description: 'Row "d" has no matches. Row "e": "e" matches "e"! dp[5][3] = dp[4][2]+1 = 3. Final answer: LCS = "ace", length 3.',
            action: 'Fill remaining rows: "e" matches "e", LCS reaches length 3!',
            reason: '"e" matches "e" — the full LCS is "ace" with length 3',
            state: 'dp[5][3] = 3. LCS = "ace".',
            dpTable: [
              [{ value: 0, color: 'computed' }, { value: 0, color: 'computed' }, { value: 0, color: 'computed' }, { value: 0, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: 1, color: 'computed' }, { value: 1, color: 'computed' }, { value: 1, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: 1, color: 'computed' }, { value: 1, color: 'computed' }, { value: 1, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: 1, color: 'computed' }, { value: 2, color: 'computed' }, { value: 2, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: 1, color: 'computed' }, { value: 2, color: 'computed' }, { value: 2, color: 'computed' }],
              [{ value: 0, color: 'computed' }, { value: 1, color: 'computed' }, { value: 2, color: 'computed' }, { value: 3, color: 'optimal' }],
            ],
            dpRowLabels: ['', 'a', 'b', 'c', 'd', 'e'], dpColLabels: ['', 'a', 'c', 'e'],
            result: 'Return 3 (LCS = "ace")' },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Confusing subsequence with substring', explanation: 'LCS allows skipping characters. Longest Common Substring requires contiguity and uses a different recurrence (reset to 0 on mismatch).' },
      { mistake: 'Off-by-one with string indexing', explanation: 'dp[i][j] compares text1[i-1] and text2[j-1] because dp has an extra row/column for the empty string base case.' },
      { mistake: 'Not considering the space optimization', explanation: 'Since each row only depends on the previous row, you can use O(min(m,n)) space with a 1D array.' },
    ],
    recognitionTips: [
      'The problem involves finding a common pattern between two sequences.',
      'You see "edit distance" or "minimum operations to transform one string to another."',
      'The problem asks to compare two strings/arrays and find shared structure.',
    ],
    practiceProblems: [
      { name: 'Longest Common Subsequence', difficulty: 'Medium', why: 'The foundational LCS problem — master the 2D DP table approach.' },
      { name: 'Edit Distance', difficulty: 'Medium', why: 'LCS variant with insert/delete/replace operations — same table structure.' },
      { name: 'Delete Operation for Two Strings', difficulty: 'Medium', why: 'Directly related to LCS: min deletions = m + n - 2 * LCS.' },
      { name: 'Shortest Common Supersequence', difficulty: 'Hard', why: 'Build the shortest string containing both inputs — requires LCS + reconstruction.' },
      { name: 'Minimum ASCII Delete Sum', difficulty: 'Medium', why: 'LCS variant where you maximize the sum of matched characters instead of count.' },
    ],
    relatedPatterns: ['dp-knapsack', 'dp-lis'],
    commonProblems: ['Longest Common Subsequence', 'Edit Distance', 'Minimum ASCII Delete Sum', 'Shortest Common Supersequence'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  ADVANCED
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 15. Monotonic Stack ────────────────────────────────────────────────────
  {
    slug: 'monotonic-stack',
    name: 'Monotonic Stack',
    category: 'Advanced',
    icon: '📚',
    color: 'red',
    description: 'Maintain a stack where elements are always in sorted order. Pop elements that violate the monotonic property.',
    whatIsThis: `A Monotonic Stack is a stack that maintains its elements in either strictly increasing or strictly decreasing order. Whenever a new element would violate this order, you pop elements from the top until the order is restored, then push the new element. The popped elements get "resolved" — they have found their answer.

The classic application is "Next Greater Element": for each element in an array, find the next element that is larger. A brute force approach checks every pair in O(n squared). With a monotonic stack, it is O(n). You push elements onto the stack, and when a new element is larger than the top, you pop — the popped element just found its next greater element (the new one).

The key insight is that each element is pushed and popped at most once, so even though there is a while loop inside the for loop, the total work is O(n). This amortized analysis trips people up but is elegant: n pushes + at most n pops = O(n) total operations.`,
    realWorldAnalogy: 'Imagine a line of people sorted by height. When a tall person arrives, anyone shorter at the back is immediately visible — the tall person "resolves" the view for everyone they tower over.',
    analogy: `Imagine you are standing in a line of people, all facing right. Each person wants to know: "How far ahead is the first person taller than me?" If you are 5'6" and the next person is 5'8", the answer is 1 — they are right there. But if the next three people are shorter than you, you have to wait until someone taller arrives.

A monotonic stack simulates this efficiently. As each person joins the line, anyone shorter at the back of the stack immediately gets their answer — the new person IS their "next taller person." You pop them off, record the answer, and keep going until everyone remaining on the stack is taller than the newcomer. Then push the newcomer.

At the end, anyone still on the stack never found a taller person — their answer is "none" (or 0, or -1, depending on the problem). The beauty is that each person is added to the stack once and removed at most once, giving O(n) total work despite the inner loop. This is amortized O(n) — one of the cleanest examples of amortized analysis in all of algorithms.`,
    problemItSolves: 'Monotonic Stack efficiently finds the next/previous greater/smaller element for every element in an array. It powers temperature problems, histogram calculations, stock span, and any problem involving "how far until something bigger/smaller."',
    signals: [
      { signal: '"next greater/smaller element"', example: 'Next Greater Element, Daily Temperatures' },
      { signal: '"largest rectangle in histogram"', example: 'Largest Rectangle in Histogram' },
      { signal: '"stock span" or "days until warmer"', example: 'Daily Temperatures, Stock Span Problem' },
      { signal: '"remove digits to make smallest number"', example: 'Remove K Digits' },
    ],
    coreIdea: `Maintain a stack of indices (or values). For each new element, pop all elements from the stack that are "resolved" by this new element (e.g., all elements smaller than it for "next greater"). Each popped element gets its answer. Then push the current element.

For "Next Greater Element": iterate left to right. For each element, while the stack is not empty and the current element is greater than the top of the stack, pop and record that the popped element's next greater is the current element. Push the current index.

For "Previous Greater Element": iterate left to right but maintain a decreasing stack. The stack top is always the previous greater element.

The stack maintains a monotonic order — either always increasing or always decreasing from bottom to top. The type of stack depends on the problem.

Each element is pushed once and popped at most once = O(n) total operations. Space is O(n) for the stack in the worst case.`,
    visualType: 'array',
    whenToUse: ['Next Greater/Smaller Element', 'Largest Rectangle in Histogram', 'Stock span / daily temperatures', 'Remove K digits to make smallest number'],
    keyInsight: 'Each element is pushed and popped at most once, so despite the inner while loop, total time is O(n).',
    examples: [
      {
        title: 'Daily Temperatures',
        problem: 'For each day, find how many days until a warmer temperature.',
        difficulty: 'Medium',
        input: 'temps = [73, 74, 75, 71, 69, 72, 76, 73]',
        output: '[1, 1, 4, 2, 1, 1, 0, 0]',
        codes: [
          { language: 'python', label: 'Python', code: `def dailyTemperatures(temps):
    result = [0] * len(temps)
    stack = []  # Stack of indices waiting for a warmer day
    for i, temp in enumerate(temps):
        # Pop all days that are colder than today
        while stack and temps[stack[-1]] < temp:
            idx = stack.pop()
            result[idx] = i - idx  # Days until warmer
        stack.append(i)  # Today waits for its warmer day
    return result` },
          { language: 'javascript', label: 'JavaScript', code: `function dailyTemperatures(temps) {
  const result = new Array(temps.length).fill(0);
  const stack = [];  // Stack of indices
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[stack[stack.length - 1]] < temps[i]) {
      const idx = stack.pop();
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}` },
          { language: 'java', label: 'Java', code: `public int[] dailyTemperatures(int[] temps) {
    int[] result = new int[temps.length];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < temps.length; i++) {
        while (!stack.isEmpty() && temps[stack.peek()] < temps[i]) {
            int idx = stack.pop();
            result[idx] = i - idx;
        }
        stack.push(i);
    }
    return result;
}` },
          { language: 'cpp', label: 'C++', code: `vector<int> dailyTemperatures(vector<int>& temps) {
    int n = temps.size();
    vector<int> result(n, 0);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && temps[st.top()] < temps[i]) {
            int idx = st.top(); st.pop();
            result[idx] = i - idx;
        }
        st.push(i);
    }
    return result;
}` },
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        dryRun: [
          'i=0: temp=73. Stack empty, push 0. stack=[0].',
          'i=1: temp=74 > 73. Pop 0: result[0]=1-0=1. Push 1. i=2: temp=75>74. Pop 1: result[1]=1. Push 2.',
          'i=3: temp=71 < 75. Push 3. i=4: temp=69 < 71. Push 4. stack=[2,3,4].',
          'i=5: temp=72 > 69. Pop 4: result[4]=1. 72>71, pop 3: result[3]=2. 72<75, stop. Push 5.',
          'i=6: temp=76 > 72, pop 5: result[5]=1. 76>75, pop 2: result[2]=4. Push 6.',
          'i=7: temp=73 < 76. Push 7. Days 6,7 stay on stack with result 0.',
        ],
        steps: [
          { description: 'Day 0: temp 73. Stack empty, push index 0. The stack holds indices of days waiting for a warmer day.',
            action: 'Push day 0 (73) onto the stack',
            reason: 'No previous days to compare with. Day 0 waits for a warmer day.',
            state: 'stack = [0:73], result = [0,0,0,0,0,0,0,0]',
            array: [73, 74, 75, 71, 69, 72, 76, 73], highlights: [0], stack: ['0:73'], stackVertical: true, variables: { result: '[0,0,0,0,0,0,0,0]' } },
          { description: 'Day 1: 74 > 73 (top). Pop 0, result[0]=1. Push 1. Day 2: 75 > 74. Pop 1, result[1]=1. Push 2.',
            action: 'Days 1 and 2 resolve previous days and get pushed',
            reason: 'Each warmer day resolves all cooler days on the stack — they found their next warmer day',
            state: 'stack = [2:75], result = [1,1,0,0,0,0,0,0]',
            array: [73, 74, 75, 71, 69, 72, 76, 73], highlights: [1, 2], stack: ['2:75'], stackVertical: true, variables: { result: '[1,1,0,0,0,0,0,0]' } },
          { description: 'Days 3-4: 71 and 69 are cooler. They stack up waiting. Stack: [2:75, 3:71, 4:69].',
            action: 'Push days 3 and 4 — they are cooler and must wait',
            reason: 'These days are not warmer than the stack top, so they join the waiting list',
            state: 'stack = [2:75, 3:71, 4:69]',
            array: [73, 74, 75, 71, 69, 72, 76, 73], highlights: [3, 4], stack: ['2:75', '3:71', '4:69'], stackVertical: true, variables: { result: '[1,1,0,0,0,0,0,0]' } },
          { description: 'Day 5: 72 pops 69 (result[4]=1) and 71 (result[3]=2). Day 6: 76 pops 72 (result[5]=1) and 75 (result[2]=4). Day 7: 73 < 76, push.',
            action: 'Days 5-7: chain of pops resolves multiple waiting days',
            reason: 'A warm day triggers a cascade — every cooler day on the stack gets resolved',
            state: 'stack = [6:76, 7:73], result = [1,1,4,2,1,1,0,0]',
            array: [73, 74, 75, 71, 69, 72, 76, 73], highlights: [5, 6, 7], stack: ['6:76', '7:73'], stackVertical: true, variables: { result: '[1,1,4,2,1,1,0,0]' }, result: 'Return [1,1,4,2,1,1,0,0]' },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Storing values instead of indices on the stack', explanation: 'You almost always need indices to compute distances (like "days until warmer"). Store indices and look up values via the array.' },
      { mistake: 'Using the wrong monotonic direction', explanation: 'For "next greater," use a decreasing stack. For "next smaller," use an increasing stack. The direction determines what gets popped.' },
      { mistake: 'Forgetting that remaining stack elements have no answer', explanation: 'After the loop, anything left on the stack never found its next greater/smaller. Their result should be 0 or -1.' },
    ],
    recognitionTips: [
      'The problem asks for "next greater" or "next smaller" for each element.',
      'You need to find how far until something bigger/smaller appears.',
      'The brute force would use nested loops scanning right from each element.',
      'The problem involves histograms, stock prices, or temperature patterns.',
    ],
    practiceProblems: [
      { name: 'Next Greater Element I', difficulty: 'Easy', why: 'The simplest monotonic stack problem — find next greater in a different array.' },
      { name: 'Daily Temperatures', difficulty: 'Medium', why: 'Classic "days until warmer" — the canonical monotonic stack problem.' },
      { name: 'Online Stock Span', difficulty: 'Medium', why: 'Previous greater element variant — count consecutive days of lower prices.' },
      { name: 'Largest Rectangle in Histogram', difficulty: 'Hard', why: 'The hardest monotonic stack application — find max area using two passes.' },
      { name: 'Remove K Digits', difficulty: 'Medium', why: 'Monotonic stack for building the smallest number — a creative application.' },
    ],
    relatedPatterns: ['two-pointers'],
    commonProblems: ['Daily Temperatures', 'Next Greater Element', 'Largest Rectangle in Histogram', 'Trapping Rain Water', 'Remove K Digits'],
  },

  // ── 16. Two Heaps ──────────────────────────────────────────────────────────
  {
    slug: 'two-heaps',
    name: 'Two Heaps',
    category: 'Advanced',
    icon: '⚖️',
    color: 'red',
    description: 'Use a max-heap and min-heap together to efficiently track the median or balance two halves of data.',
    whatIsThis: `The Two Heaps pattern uses a max-heap and a min-heap working in tandem to efficiently maintain the median of a data stream. The max-heap stores the smaller half of the numbers, and the min-heap stores the larger half. The median is always at or between the tops of the two heaps.

Here is the key invariant: we keep the heaps balanced so that the max-heap either has the same number of elements as the min-heap or one more. When a new number comes in, we first push it to the max-heap, then move the max-heap's top to the min-heap to ensure all elements in the max-heap are smaller than all elements in the min-heap. If the min-heap becomes larger, we move its top back to the max-heap.

This gives us O(log n) insertion and O(1) median retrieval. Without this pattern, finding the median would require sorting (O(n log n)) or using a balanced BST. The two-heap approach is elegant and practical.`,
    realWorldAnalogy: 'Imagine sorting students into two lines by height. The "short" line has its tallest at the front (max-heap), the "tall" line has its shortest at the front (min-heap). The median is between those two front people.',
    analogy: `Imagine you are a teacher lining up students by height. You split them into two groups: the shorter half and the taller half. In the shorter group, the tallest kid stands at the front. In the taller group, the shortest kid stands at the front. The median height is always between those two kids at the fronts.

When a new student arrives, you add them to the shorter group first (because max-heap naturally puts the biggest on top, making comparison easy). Then you move the tallest from the shorter group to the taller group (to maintain the property that everything in the shorter group is smaller). If the taller group now has more people, move its shortest back to the shorter group.

This constant rebalancing ensures the two groups differ in size by at most 1, and the median is always accessible from the tops of both groups. Adding a student takes O(log n) time (heap operations), but finding the median is O(1) — just peek at the tops. This pattern shows up in streaming analytics where data arrives continuously and you need running statistics.`,
    problemItSolves: 'Two Heaps maintains the median of a dynamic data stream in O(log n) per insertion and O(1) per query. Also handles sliding window medians and problems requiring balanced partitioning of data.',
    signals: [
      { signal: '"find median from data stream"', example: 'Find Median from Data Stream' },
      { signal: '"sliding window median"', example: 'Sliding Window Median' },
      { signal: '"balance two halves of data"', example: 'IPO, Maximize Capital' },
    ],
    coreIdea: `Maintain two heaps: a max-heap (small) for the lower half and a min-heap (large) for the upper half.

Invariant 1: Every element in small is <= every element in large. Invariant 2: small.size == large.size OR small.size == large.size + 1.

To add a number: push to small (max-heap). Move small's top to large. If large becomes bigger, move large's top back to small.

To find median: if heaps are equal size, median = (small.top + large.top) / 2. If small is bigger, median = small.top.

The reason this works: by always routing through small first, we ensure proper ordering. The rebalancing step ensures even distribution.`,
    visualType: 'tree',
    whenToUse: ['Find median from data stream', 'Sliding window median', 'Scheduling with priorities from both ends'],
    keyInsight: 'Max-heap holds the smaller half, min-heap holds the larger half. Median is at the top of one or both heaps.',
    examples: [
      {
        title: 'Find Median from Data Stream',
        problem: 'Design a data structure that supports addNum and findMedian.',
        difficulty: 'Hard',
        input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()',
        output: '1.5, 2.0',
        codes: [
          { language: 'python', label: 'Python', code: `import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # Max heap (negate values for Python)
        self.large = []  # Min heap

    def addNum(self, num):
        heapq.heappush(self.small, -num)                    # Push to max-heap
        heapq.heappush(self.large, -heapq.heappop(self.small))  # Move top to min-heap
        if len(self.large) > len(self.small):                # Rebalance if needed
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]                # Odd count: median is max-heap top
        return (-self.small[0] + self.large[0]) / 2  # Even: average of both tops` },
          { language: 'javascript', label: 'JavaScript', code: `// Simplified with sorted arrays for clarity
class MedianFinder {
  constructor() {
    this.small = []; // max-heap (sorted desc)
    this.large = []; // min-heap (sorted asc)
  }
  addNum(num) {
    this.small.push(num);
    this.small.sort((a, b) => b - a);
    this.large.push(this.small.shift());
    this.large.sort((a, b) => a - b);
    if (this.large.length > this.small.length) {
      this.small.unshift(this.large.shift());
    }
  }
  findMedian() {
    if (this.small.length > this.large.length) return this.small[0];
    return (this.small[0] + this.large[0]) / 2;
  }
}` },
          { language: 'java', label: 'Java', code: `class MedianFinder {
    PriorityQueue<Integer> small = new PriorityQueue<>(Collections.reverseOrder()); // max-heap
    PriorityQueue<Integer> large = new PriorityQueue<>();  // min-heap

    public void addNum(int num) {
        small.offer(num);
        large.offer(small.poll());  // Ensure ordering
        if (large.size() > small.size()) small.offer(large.poll());  // Rebalance
    }

    public double findMedian() {
        if (small.size() > large.size()) return small.peek();
        return (small.peek() + large.peek()) / 2.0;
    }
}` },
          { language: 'cpp', label: 'C++', code: `class MedianFinder {
    priority_queue<int> small;                             // max-heap
    priority_queue<int, vector<int>, greater<int>> large;  // min-heap
public:
    void addNum(int num) {
        small.push(num);
        large.push(small.top()); small.pop();
        if (large.size() > small.size()) {
            small.push(large.top()); large.pop();
        }
    }
    double findMedian() {
        if (small.size() > large.size()) return small.top();
        return (small.top() + large.top()) / 2.0;
    }
};` },
        ],
        timeComplexity: 'O(log n) per add',
        spaceComplexity: 'O(n)',
        dryRun: [
          'addNum(1): Push to small=[1]. Move top to large=[1]. large bigger, move back. small=[1], large=[].',
          'addNum(2): Push to small=[2,1]. Move top(2) to large=[2]. Equal sizes. small=[1], large=[2].',
          'findMedian(): Equal sizes. (1+2)/2 = 1.5.',
          'addNum(3): Push to small=[3,1]. Move top(3) to large=[2,3]. large bigger, move min(2) to small. small=[2,1], large=[3].',
          'findMedian(): small bigger. Return top = 2.0.',
        ],
        steps: [
          { description: 'addNum(1): After rebalancing, small=[1], large=[]. The max-heap has one element.',
            action: 'Add 1: route through small then large, rebalance',
            reason: 'With one element, it sits in the small (max) heap. Median is just 1.',
            state: 'small=[1], large=[], median=1',
            treeData: { val: 'small: [1]', color: 'active', left: null, right: { val: 'large: []', color: 'default', left: null, right: null } },
            variables: { small: '[1]', large: '[]', median: 1 } },
          { description: 'addNum(2): small=[1], large=[2]. Equal sizes. Median = (1+2)/2 = 1.5.',
            action: 'Add 2: after routing, small=[1], large=[2]',
            reason: 'Two elements split evenly. The median is the average of both tops.',
            state: 'small=[1], large=[2], median=1.5',
            treeData: { val: 'small: [1]', color: 'active', left: null, right: { val: 'large: [2]', color: 'active', left: null, right: null } },
            variables: { small: '[1]', large: '[2]', median: 1.5 } },
          { description: 'findMedian(): Both heaps have 1 element. Median = (1+2)/2 = 1.5.',
            action: 'Return median = average of tops = 1.5',
            reason: 'Even number of elements: median is average of max-heap top and min-heap top',
            state: 'Median = (1 + 2) / 2 = 1.5',
            treeData: { val: '1', color: 'found', label: 'max-heap top', left: null, right: { val: '2', color: 'found', label: 'min-heap top', left: null, right: null } },
            variables: { small: '[1]', large: '[2]' }, result: 'Median = 1.5' },
          { description: 'addNum(3): After rebalancing, small=[2,1], large=[3]. Odd count, median = small top = 2.0.',
            action: 'Add 3, rebalance. findMedian returns 2.0',
            reason: 'Odd number of elements: median is the top of the larger heap (small)',
            state: 'small=[2,1], large=[3], median=2.0',
            treeData: { val: '2', color: 'found', label: 'median', left: { val: '1', color: 'default', left: null, right: null }, right: { val: '3', color: 'default', left: null, right: null } },
            variables: { small: '[2,1]', large: '[3]', median: 2.0 }, result: 'Median = 2.0' },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Forgetting to negate values for max-heap in Python', explanation: 'Python only has min-heap (heapq). To simulate max-heap, negate values on push and negate again on pop.' },
      { mistake: 'Wrong rebalancing direction', explanation: 'Always ensure small.size >= large.size. If large becomes bigger after the routing step, move its top to small.' },
      { mistake: 'Not handling the odd/even case in findMedian', explanation: 'When heaps have equal size, average both tops. When small is bigger, return just small top.' },
    ],
    recognitionTips: [
      'The problem asks for a running/streaming median.',
      'You need to efficiently query a "middle" value as data arrives.',
      'The problem involves partitioning data into a lower and upper half.',
    ],
    practiceProblems: [
      { name: 'Find Median from Data Stream', difficulty: 'Hard', why: 'The canonical two-heaps problem — master the add + rebalance pattern.' },
      { name: 'Sliding Window Median', difficulty: 'Hard', why: 'Two heaps with element removal — harder because you need lazy deletion.' },
      { name: 'IPO', difficulty: 'Hard', why: 'Two heaps for capital management — min-heap for costs, max-heap for profits.' },
      { name: 'Maximize Capital', difficulty: 'Hard', why: 'Similar to IPO — greedily pick the most profitable affordable project.' },
      { name: 'Kth Largest Element in a Stream', difficulty: 'Easy', why: 'Single min-heap of size k — a stepping stone to two heaps.' },
    ],
    relatedPatterns: ['binary-search'],
    commonProblems: ['Find Median from Data Stream', 'Sliding Window Median', 'IPO', 'Maximize Capital'],
  },

  // ── 17. Trie (Prefix Tree) ─────────────────────────────────────────────────
  {
    slug: 'trie',
    name: 'Trie (Prefix Tree)',
    category: 'Advanced',
    icon: '🌳',
    color: 'red',
    description: 'A tree where each node represents a character. Efficiently stores and searches strings by their prefixes.',
    whatIsThis: `A Trie (pronounced "try") is a tree-shaped data structure designed specifically for storing and searching strings. Unlike a hash table that stores complete strings, a trie stores characters one per node, with each path from the root to a node representing a prefix. Words that share prefixes share the same initial path in the trie.

For example, if you insert "apple" and "app", the first three nodes (a -> p -> p) are shared. Then "app" ends with a special marker, and "apple" continues with l -> e. This sharing makes tries incredibly memory-efficient for dictionaries with many common prefixes, and makes prefix searches blazingly fast.

Every operation (insert, search, startsWith) takes O(m) time where m is the length of the word — completely independent of how many words are in the trie. This makes tries perfect for autocomplete systems, spell checkers, and word games.`,
    realWorldAnalogy: 'Think of a phone book organized by letter. All names starting with "A" are in one section, sub-organized by second letter, and so on. Common prefixes share the same initial path.',
    analogy: `Imagine a massive library filing system. Instead of storing each book title as a separate card, the librarian creates a tree of folders. The first level has 26 folders (A-Z). Inside "A" there are more folders for the second letter: "AP", "AR", etc. Inside "AP" you find "APP" and "APR". The word "APPLE" follows the path A -> P -> P -> L -> E, and "APP" follows A -> P -> P (with a flag saying "this is a complete word too").

When someone asks "Do you have any books starting with APP?", you just walk three levels deep: A, P, P. If that path exists, you have matches. You do not need to scan every title in the library — you navigate directly to the right branch. This is why tries power autocomplete in search engines: as you type each character, the system walks one level deeper in the trie and shows you all words below that node.

The key insight is PREFIX SHARING. If you have 1000 words starting with "un-" (undo, under, undo, ...), those 1000 words share just 2 nodes (u, n) at the top. Compared to a hash set that stores each word independently, a trie saves enormous memory on common prefixes and makes prefix queries trivial.`,
    problemItSolves: 'Tries handle prefix-based string operations: autocomplete, spell checking, prefix matching, word search on boards, and efficiently storing/querying dictionaries where many words share common prefixes.',
    signals: [
      { signal: '"prefix search" or "autocomplete"', example: 'Implement Trie, Search Suggestions System' },
      { signal: '"word search in a board/grid"', example: 'Word Search II' },
      { signal: '"dictionary" with insert/search/startsWith"', example: 'Implement Trie, Design Add and Search Words' },
    ],
    coreIdea: `A trie is a tree where each node has up to 26 children (for English lowercase), one per possible character. Each node optionally has an "isEnd" flag indicating a complete word ends here.

Insert: For each character in the word, if the child does not exist, create it. Move to the child. After the last character, set isEnd = true.

Search: For each character, if the child does not exist, return false. After the last character, return the isEnd flag.

StartsWith: Same as search, but return true after the last character regardless of isEnd.

Time complexity: O(m) per operation where m is the word/prefix length. This is independent of how many words are in the trie — whether you have 10 words or 10 million, a lookup for "apple" takes exactly 5 steps.

Space: O(total characters across all words) in the worst case, but prefix sharing often makes it much less.`,
    visualType: 'trie',
    whenToUse: ['Autocomplete / prefix search', 'Spell checking / dictionary', 'Word search in a board', 'Finding longest common prefix'],
    keyInsight: 'Shared prefixes share the same path in the trie, making prefix operations O(length) regardless of dictionary size.',
    examples: [
      {
        title: 'Implement Trie',
        problem: 'Implement insert, search, and startsWith for a Trie.',
        difficulty: 'Medium',
        input: 'insert("apple"), insert("app"), search("apple"), startsWith("app")',
        output: 'true, true',
        codes: [
          { language: 'python', label: 'Python', code: `class TrieNode:
    def __init__(self):
        self.children = {}      # Map from char to TrieNode
        self.is_end = False     # Does a word end here?

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()  # Create node if needed
            node = node.children[ch]              # Move down
        node.is_end = True                        # Mark word end

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children: return False
            node = node.children[ch]
        return node.is_end  # Must be a complete word

    def startsWith(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children: return False
            node = node.children[ch]
        return True  # Prefix exists regardless of is_end` },
          { language: 'javascript', label: 'JavaScript', code: `class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; }
}
class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
}` },
          { language: 'java', label: 'Java', code: `class Trie {
    private TrieNode root = new TrieNode();
    class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }
    public void insert(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.isEnd = true;
    }
    public boolean search(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (node.children[i] == null) return false;
            node = node.children[i];
        }
        return node.isEnd;
    }
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char ch : prefix.toCharArray()) {
            int i = ch - 'a';
            if (node.children[i] == null) return false;
            node = node.children[i];
        }
        return true;
    }
}` },
          { language: 'cpp', label: 'C++', code: `class Trie {
    struct TrieNode { TrieNode* children[26] = {}; bool isEnd = false; };
    TrieNode* root = new TrieNode();
public:
    void insert(string word) {
        auto node = root;
        for (char ch : word) {
            int i = ch - 'a';
            if (!node->children[i]) node->children[i] = new TrieNode();
            node = node->children[i];
        }
        node->isEnd = true;
    }
    bool search(string word) {
        auto node = root;
        for (char ch : word) { int i = ch-'a'; if (!node->children[i]) return false; node = node->children[i]; }
        return node->isEnd;
    }
    bool startsWith(string prefix) {
        auto node = root;
        for (char ch : prefix) { int i = ch-'a'; if (!node->children[i]) return false; node = node->children[i]; }
        return true;
    }
};` },
        ],
        timeComplexity: 'O(m) per operation',
        spaceComplexity: 'O(n * m)',
        dryRun: [
          'insert("apple"): Create path root->a->p->p->l->e. Mark e as isEnd=true.',
          'insert("app"): Follow existing path root->a->p->p. Mark second p as isEnd=true. No new nodes!',
          'search("apple"): Follow root->a->p->p->l->e. Exists and isEnd=true. Return true.',
          'startsWith("app"): Follow root->a->p->p. Path exists. Return true (isEnd irrelevant).',
        ],
        steps: [
          { description: 'insert("apple"): Create nodes for each character: root -> a -> p -> p -> l -> e. Mark "e" as end.',
            action: 'Insert "apple": create path of 5 new nodes',
            reason: 'First word builds the full path from scratch since the trie is empty',
            state: 'Trie contains: "apple"',
            trieData: { words: ['apple'], highlightPath: 'apple', endNodes: ['apple'] },
            variables: { action: 'insert', word: 'apple' } },
          { description: 'insert("app"): Follow existing path a -> p -> p. Mark second "p" as isEnd. No new nodes needed — prefix sharing!',
            action: 'Insert "app": reuse existing path, just mark end node',
            reason: '"app" shares the prefix "app" with "apple" — no new nodes needed',
            state: 'Trie contains: "apple", "app" (shared prefix)',
            trieData: { words: ['apple', 'app'], highlightPath: 'app', endNodes: ['app', 'apple'] },
            variables: { action: 'insert', word: 'app', newNodesCreated: 0 } },
          { description: 'search("apple"): Follow path to "e". isEnd=true. Return true.',
            action: 'Search "apple": traverse to "e" node, check isEnd',
            reason: 'The full path exists AND the end node is marked — "apple" is a complete word',
            state: 'Found "apple" in the trie',
            trieData: { words: ['apple', 'app'], highlightPath: 'apple', endNodes: ['app', 'apple'] },
            variables: { action: 'search', word: 'apple' }, result: 'Return true' },
          { description: 'startsWith("app"): Follow path to second "p". Path exists. Return true.',
            action: 'Check prefix "app": path exists, return true',
            reason: 'startsWith only checks if the path exists — isEnd does not matter',
            state: 'Prefix "app" exists in the trie',
            trieData: { words: ['apple', 'app'], highlightPath: 'app', endNodes: ['app', 'apple'] },
            variables: { action: 'startsWith', prefix: 'app' }, result: 'Return true' },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Confusing search with startsWith', explanation: 'search returns true only if the EXACT word exists (isEnd must be true). startsWith returns true if the prefix path exists, regardless of isEnd.' },
      { mistake: 'Not initializing children correctly', explanation: 'In array-based tries (26 children), all children start as null. In hashmap-based tries, check existence before accessing.' },
      { mistake: 'Memory leaks in C++ (not deleting nodes)', explanation: 'Trie nodes are heap-allocated. Implement a destructor or use smart pointers to avoid memory leaks.' },
    ],
    recognitionTips: [
      'The problem involves prefix-based operations on strings.',
      'You need autocomplete or "find all words with this prefix" functionality.',
      'Word Search II — using a trie avoids re-checking the same prefix for multiple words.',
      'You need O(word length) operations independent of dictionary size.',
    ],
    practiceProblems: [
      { name: 'Implement Trie', difficulty: 'Medium', why: 'Build the data structure from scratch — the foundation for all trie problems.' },
      { name: 'Design Add and Search Words', difficulty: 'Medium', why: 'Trie with wildcard matching using DFS — a great follow-up.' },
      { name: 'Replace Words', difficulty: 'Medium', why: 'Use a trie to find the shortest root for each word in a sentence.' },
      { name: 'Word Search II', difficulty: 'Hard', why: 'Combine trie with grid DFS — find all dictionary words in a grid.' },
      { name: 'Search Suggestions System', difficulty: 'Medium', why: 'Autocomplete using trie — return top 3 suggestions for each prefix.' },
    ],
    relatedPatterns: ['dfs', 'backtracking'],
    commonProblems: ['Implement Trie', 'Word Search II', 'Design Add and Search Words', 'Replace Words', 'Longest Word in Dictionary'],
  },

  // ── 18. Union Find ─────────────────────────────────────────────────────────
  {
    slug: 'union-find',
    name: 'Union Find (Disjoint Set)',
    category: 'Advanced',
    icon: '🔗',
    color: 'red',
    description: 'Track connected components with near-constant time union and find operations using path compression and union by rank.',
    whatIsThis: `Union Find (also called Disjoint Set Union or DSU) is a data structure that keeps track of elements partitioned into non-overlapping groups. It supports two operations: Find (which group does this element belong to?) and Union (merge two groups into one). With path compression and union by rank, both operations run in nearly O(1) amortized time.

Path compression means when you call Find, you make every node on the path point directly to the root. Union by rank attaches the shorter tree under the taller one. Together, these make the amortized cost O(alpha(n)) — the inverse Ackermann function, which is effectively constant.

Union Find is perfect for graph connectivity problems: are two nodes connected? How many connected components exist? It powers Kruskal's MST algorithm and problems like "accounts merge."`,
    realWorldAnalogy: 'Think of friend groups at a party. When two people become friends, their groups merge. Want to know if Alice and Bob are connected? Check if they share the same group leader.',
    analogy: `Imagine a school where students form clubs. Initially, every student is their own one-person club. When student A and student B want to merge their clubs, one club leader becomes the leader of both. To check if two students are in the same club, you ask each "Who is your leader?" and if they name the same person, they are in the same club.

Path compression is like a shortcut: when you walk up the chain to find the leader, you tell everyone along the way "Just point directly to the boss from now on." This flattens the hierarchy so future lookups are instant. Union by rank is like always making the leader of the BIGGER club the overall leader — keeping the hierarchy shallow.

With both optimizations, finding the leader and merging clubs both take effectively O(1) time. This makes Union Find incredibly efficient for processing edges in a graph: for each edge, union the two endpoints. At the end, count how many distinct leaders there are — that is your number of connected components. It is also how Kruskal's algorithm builds a minimum spanning tree: process edges in order of weight, and only add an edge if it connects two different components.`,
    problemItSolves: 'Union Find tracks dynamic connectivity — which elements are in the same group, merging groups, counting groups. It handles graph connectivity, cycle detection in undirected graphs, and grouping related items.',
    signals: [
      { signal: '"connected components" in undirected graph', example: 'Number of Connected Components, Friend Circles' },
      { signal: '"detect cycle" in undirected graph', example: 'Redundant Connection' },
      { signal: '"merge accounts/groups"', example: 'Accounts Merge, Longest Consecutive Sequence' },
      { signal: '"Kruskal\'s MST" or minimum spanning tree', example: 'Min Cost to Connect All Points' },
    ],
    coreIdea: `Two operations, two optimizations:

Find(x): Follow parent pointers from x to the root. With path compression, make every node on the path point directly to the root. This flattens the tree for future queries.

Union(x, y): Find the roots of x and y. If different, merge by making one root point to the other. With union by rank, attach the shorter tree under the taller one.

Implementation: an array parent[] where parent[i] is i's parent (initially parent[i] = i — everyone is their own root). A rank[] array tracks tree heights for union by rank. Optionally, a count variable tracks the number of components (starts at n, decrements on each successful union).

Cycle detection: before unioning two nodes, check if they already have the same root. If yes, this edge creates a cycle.`,
    visualType: 'graph',
    whenToUse: ['Detecting cycles in undirected graphs', 'Connected components / grouping', "Kruskal's MST algorithm", 'Accounts merge / friend circles'],
    keyInsight: 'Path compression + union by rank makes operations nearly O(1) amortized (inverse Ackermann).',
    examples: [
      {
        title: 'Number of Connected Components',
        problem: 'Find number of connected components in an undirected graph.',
        difficulty: 'Medium',
        input: 'n=5, edges=[[0,1],[1,2],[3,4]]',
        output: '2',
        codes: [
          { language: 'python', label: 'Python', code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))  # Each node is its own parent
        self.rank = [0] * n           # Tree height for union by rank
        self.count = n                # Number of components

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return           # Already same component
        if self.rank[px] < self.rank[py]: px, py = py, px  # Union by rank
        self.parent[py] = px
        if self.rank[px] == self.rank[py]: self.rank[px] += 1
        self.count -= 1` },
          { language: 'javascript', label: 'JavaScript', code: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({length: n}, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n;
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x, y) {
    let px = this.find(x), py = this.find(y);
    if (px === py) return;
    if (this.rank[px] < this.rank[py]) [px, py] = [py, px];
    this.parent[py] = px;
    if (this.rank[px] === this.rank[py]) this.rank[px]++;
    this.count--;
  }
}` },
          { language: 'java', label: 'Java', code: `class UnionFind {
    int[] parent, rank; int count;
    UnionFind(int n) {
        parent = new int[n]; rank = new int[n]; count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    void union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        if (rank[px] < rank[py]) { int t = px; px = py; py = t; }
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        count--;
    }
}` },
          { language: 'cpp', label: 'C++', code: `class UnionFind {
    vector<int> parent, rank_; int count;
public:
    UnionFind(int n) : parent(n), rank_(n, 0), count(n) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) { if (parent[x] != x) parent[x] = find(parent[x]); return parent[x]; }
    void unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        if (rank_[px] < rank_[py]) swap(px, py);
        parent[py] = px;
        if (rank_[px] == rank_[py]) rank_[px]++;
        count--;
    }
    int getCount() { return count; }
};` },
        ],
        timeComplexity: 'O(n * a(n)) ~ O(n)',
        spaceComplexity: 'O(n)',
        dryRun: [
          'Init: parent=[0,1,2,3,4], count=5.',
          'union(0,1): find(0)=0, find(1)=1. Different. parent[1]=0. count=4.',
          'union(1,2): find(1)->find(0)=0, find(2)=2. Different. parent[2]=0. count=3.',
          'union(3,4): find(3)=3, find(4)=4. Different. parent[4]=3. count=2.',
          'Return count = 2.',
        ],
        steps: [
          { description: 'Start with 5 nodes, each in its own group. 5 components.',
            action: 'Initialize: each node is its own parent',
            reason: 'Before any edges, every node is an isolated component',
            state: 'parent=[0,1,2,3,4], components=5',
            graphNodes: [
              { id: '0', label: '0', x: 50, y: 100, color: 'active' }, { id: '1', label: '1', x: 125, y: 100, color: 'active' },
              { id: '2', label: '2', x: 200, y: 100, color: 'active' }, { id: '3', label: '3', x: 275, y: 100, color: 'active' },
              { id: '4', label: '4', x: 350, y: 100, color: 'active' },
            ],
            graphEdges: [], variables: { parent: '[0,1,2,3,4]', components: 5 } },
          { description: 'union(0,1): Link 1 to 0. Components: 4.',
            action: 'Union nodes 0 and 1 — they are now in the same component',
            reason: 'Edge [0,1] connects these two nodes. We link 1 to 0.',
            state: 'parent=[0,0,2,3,4], components=4',
            graphNodes: [
              { id: '0', label: '0', x: 87, y: 50, color: 'visited' }, { id: '1', label: '1', x: 87, y: 150, color: 'visited' },
              { id: '2', label: '2', x: 200, y: 100, color: 'active' }, { id: '3', label: '3', x: 275, y: 100, color: 'active' },
              { id: '4', label: '4', x: 350, y: 100, color: 'active' },
            ],
            graphEdges: [{ from: '1', to: '0', highlighted: true }], variables: { parent: '[0,0,2,3,4]', components: 4 } },
          { description: 'union(1,2): find(1)=0, find(2)=2. Link 2 to 0. Components: 3.',
            action: 'Union nodes 1 and 2 (via roots 0 and 2)',
            reason: 'Edge [1,2]. find(1) returns root 0. So we link root 2 to root 0.',
            state: 'parent=[0,0,0,3,4], components=3',
            graphNodes: [
              { id: '0', label: '0', x: 125, y: 50, color: 'visited' }, { id: '1', label: '1', x: 75, y: 150, color: 'visited' },
              { id: '2', label: '2', x: 175, y: 150, color: 'visited' }, { id: '3', label: '3', x: 275, y: 100, color: 'active' },
              { id: '4', label: '4', x: 350, y: 100, color: 'active' },
            ],
            graphEdges: [{ from: '1', to: '0', highlighted: true }, { from: '2', to: '0', highlighted: true }],
            variables: { parent: '[0,0,0,3,4]', components: 3 } },
          { description: 'union(3,4): Link 4 to 3. Components: 2. Two groups: {0,1,2} and {3,4}.',
            action: 'Union nodes 3 and 4. Final: 2 connected components.',
            reason: 'Edge [3,4] connects the last two isolated nodes into a pair.',
            state: 'parent=[0,0,0,3,3], components=2. Groups: {0,1,2}, {3,4}.',
            graphNodes: [
              { id: '0', label: '0', x: 100, y: 50, color: 'visited' }, { id: '1', label: '1', x: 50, y: 150, color: 'visited' },
              { id: '2', label: '2', x: 150, y: 150, color: 'visited' }, { id: '3', label: '3', x: 300, y: 50, color: 'visited' },
              { id: '4', label: '4', x: 300, y: 150, color: 'visited' },
            ],
            graphEdges: [{ from: '1', to: '0', highlighted: true }, { from: '2', to: '0', highlighted: true }, { from: '4', to: '3', highlighted: true }],
            variables: { parent: '[0,0,0,3,3]', components: 2 }, result: 'Return 2' },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Forgetting path compression', explanation: 'Without path compression, find degenerates to O(n). Always update parent[x] during find to point directly to root.' },
      { mistake: 'Not using union by rank', explanation: 'Without rank, merging can create tall trees. Always attach shorter tree under taller one.' },
      { mistake: 'Applying to directed graphs', explanation: 'Union Find detects cycles in UNDIRECTED graphs only. For directed graphs, use DFS with coloring.' },
    ],
    recognitionTips: [
      'The problem involves grouping elements or tracking connected components.',
      'You need to determine if two elements are in the same group.',
      'The problem asks about redundant connections or cycle detection in undirected graphs.',
      'You see "merge" or "connect" operations on groups of elements.',
    ],
    practiceProblems: [
      { name: 'Number of Connected Components', difficulty: 'Medium', why: 'Classic UF application — union all edges, count remaining components.' },
      { name: 'Redundant Connection', difficulty: 'Medium', why: 'Find the edge that creates a cycle — the union that finds same root.' },
      { name: 'Accounts Merge', difficulty: 'Medium', why: 'Group emails by account — union emails that share an account.' },
      { name: 'Longest Consecutive Sequence', difficulty: 'Medium', why: 'Union consecutive numbers — the largest component is the answer.' },
      { name: 'Min Cost to Connect All Points', difficulty: 'Medium', why: 'Kruskal MST — sort edges by weight, union greedily.' },
    ],
    relatedPatterns: ['bfs', 'dfs'],
    commonProblems: ['Number of Connected Components', 'Redundant Connection', 'Accounts Merge', 'Longest Consecutive Sequence'],
  },

  // ── 19. Bit Manipulation ───────────────────────────────────────────────────
  {
    slug: 'bit-manipulation',
    name: 'Bit Manipulation',
    category: 'Advanced',
    icon: '⚡',
    color: 'red',
    description: 'Use bitwise operators (AND, OR, XOR, shifts) to solve problems in O(1) space with elegant bit tricks.',
    whatIsThis: `Bit Manipulation involves using bitwise operators — AND (&), OR (|), XOR (^), NOT (~), and bit shifts (<<, >>) — to solve problems at the binary level. These operations are incredibly fast because they map to single CPU instructions.

The most magical operator is XOR. It has the property that a ^ a = 0 and a ^ 0 = a. If you XOR all numbers in an array where every number appears twice except one, all pairs cancel out and you are left with the unique number. No hash set, no sorting — just one pass with O(1) space.

Other useful tricks: n & (n-1) clears the lowest set bit, n & (-n) isolates the lowest set bit, and n & (n-1) == 0 checks if n is a power of 2. Bit manipulation problems are not super common in interviews, but when they appear, they reward elegant solutions.`,
    realWorldAnalogy: 'Think of light switches — each either ON (1) or OFF (0). XOR is a toggle: flipping the same switch twice puts it back. Toggle for every number and only the unique one remains flipped.',
    analogy: `Imagine you are at a party where everyone must find their dance partner. People arrive one at a time, and you have a magic spotlight that works like this: when someone steps into the light, it toggles their silhouette on the wall. When they step in AGAIN, their silhouette disappears (toggles off). After everyone has arrived, the only silhouette remaining on the wall is the person who came ALONE — everyone else's silhouettes cancelled out in pairs.

That is XOR in action. 4 ^ 1 = 5, then 5 ^ 2 = 7, then 7 ^ 1 = 6 (the 1 cancels!), then 6 ^ 2 = 4 (the 2 cancels!). Only the unique number (4) remains. Each XOR flips bits, and doing it twice restores the original — so duplicates annihilate each other.

Beyond XOR, bits give you superpowers for specific problems. Want to check if a number is a power of 2? Powers of 2 have exactly one bit set (like 1000), so n & (n-1) clears that bit, giving 0. n & (n-1) == 0 is the test. Want to count the number of set bits? Keep doing n = n & (n-1) until n is 0 — each step clears one bit. These tricks are like cheat codes that turn complex operations into single-line solutions.`,
    problemItSolves: 'Bit Manipulation provides O(1) space solutions for finding unique elements (XOR), counting/manipulating bits, checking powers of 2, generating subsets via bitmasks, and performing efficient flag operations.',
    signals: [
      { signal: '"single number" or "find the unique element"', example: 'Single Number, Single Number II' },
      { signal: '"count bits" or "number of 1s"', example: 'Number of 1 Bits, Counting Bits' },
      { signal: '"power of two" or "power of four"', example: 'Power of Two, Power of Four' },
      { signal: '"missing number" (can use XOR alternative)', example: 'Missing Number' },
    ],
    coreIdea: `The key operations:

XOR (^): a ^ a = 0, a ^ 0 = a. XOR is associative and commutative, so order does not matter. XOR-ing all elements in an array cancels pairs, leaving the unique element.

AND (&): keeps only bits that are 1 in BOTH operands. n & (n-1) clears the lowest set bit. n & (-n) isolates the lowest set bit.

OR (|): sets a bit if it is 1 in EITHER operand. Useful for combining flags.

Shifts: left shift (<<) multiplies by 2, right shift (>>) divides by 2. Useful for examining individual bits.

Common patterns:
- Check if n is power of 2: n > 0 && (n & (n-1)) == 0
- Count set bits: while n: n = n & (n-1), count++
- Get i-th bit: (n >> i) & 1
- Set i-th bit: n | (1 << i)
- Clear i-th bit: n & ~(1 << i)
- Generate all subsets: for mask in range(1 << n)`,
    visualType: 'array',
    whenToUse: ['Finding single/missing numbers (XOR)', 'Counting bits / power of two checks', 'Subset generation via bitmasks', 'Toggling flags efficiently'],
    keyInsight: 'XOR is self-inverse: a^a=0, a^0=a. This eliminates duplicates. n&(n-1) clears the lowest set bit.',
    examples: [
      {
        title: 'Single Number',
        problem: 'Find the element that appears only once (all others appear twice).',
        difficulty: 'Easy',
        input: 'nums = [4, 1, 2, 1, 2]',
        output: '4',
        codes: [
          { language: 'python', label: 'Python', code: `def singleNumber(nums):
    result = 0          # Start with all bits off
    for num in nums:
        result ^= num   # XOR each number — duplicates cancel out
    return result       # Only the unique number remains` },
          { language: 'javascript', label: 'JavaScript', code: `function singleNumber(nums) {
  // XOR all numbers: duplicates cancel (a ^ a = 0), unique remains
  return nums.reduce((acc, num) => acc ^ num, 0);
}` },
          { language: 'java', label: 'Java', code: `public int singleNumber(int[] nums) {
    int result = 0;
    for (int num : nums) result ^= num; // Duplicates cancel
    return result;
}` },
          { language: 'cpp', label: 'C++', code: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int num : nums) result ^= num;
    return result;
}` },
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        dryRun: [
          'result = 0 (binary: 000).',
          'XOR 4: 000 ^ 100 = 100 (result = 4).',
          'XOR 1: 100 ^ 001 = 101 (result = 5). XOR 2: 101 ^ 010 = 111 (result = 7).',
          'XOR 1: 111 ^ 001 = 110 (result = 6). The second 1 cancels the first!',
          'XOR 2: 110 ^ 010 = 100 (result = 4). The second 2 cancels the first!',
          'Return 4. Only the unique number survives.',
        ],
        steps: [
          { description: 'Start with result = 0 (all bits off). XOR with 4: 000 ^ 100 = 100. Result is 4.',
            action: 'XOR result with 4: result becomes 100 (4)',
            reason: 'XOR with 0 gives the number itself — we are starting to build our fingerprint',
            state: 'result = 4 (binary: 100)',
            array: ['100 (4)', '001 (1)', '010 (2)', '001 (1)', '010 (2)'], highlights: [0], variables: { result: 4, binary: '100' } },
          { description: 'XOR with 1: 100 ^ 001 = 101. Result is 5. XOR with 2: 101 ^ 010 = 111. Result is 7.',
            action: 'XOR with 1 then 2: result becomes 111 (7)',
            reason: 'We incorporate all numbers — duplicates will cancel later',
            state: 'result = 7 (binary: 111) after incorporating 4, 1, 2',
            array: ['100 (4)', '001 (1)', '010 (2)', '001 (1)', '010 (2)'], highlights: [1, 2], variables: { result: 7, binary: '111' } },
          { description: 'XOR with 1 again: 111 ^ 001 = 110. The 1 cancels itself out! Result is 6.',
            action: 'XOR with 1 again: the duplicate 1 cancels out!',
            reason: 'a ^ a = 0: XOR-ing a number with itself zeroes those bits — the duplicate vanishes',
            state: 'result = 6 (binary: 110). The 1 has been cancelled.',
            array: ['100 (4)', '001 (1)', '010 (2)', '001 (1)', '010 (2)'], highlights: [3], variables: { result: 6, binary: '110' } },
          { description: 'XOR with 2: 110 ^ 010 = 100. The 2 cancels too! Result is 4 — the unique number.',
            action: 'XOR with 2: duplicate cancelled. Only 4 (the unique number) remains!',
            reason: 'All duplicates have been XOR-cancelled. The only surviving bits belong to the single number.',
            state: 'result = 4 (binary: 100). All duplicates cancelled!',
            array: ['100 (4)', '001 (1)', '010 (2)', '001 (1)', '010 (2)'], highlights: [4], variables: { result: 4, binary: '100' }, result: 'Return 4 — duplicates cancelled out!' },
        ],
      },
    ],
    commonMistakes: [
      { mistake: 'Forgetting that XOR only works for pairs of duplicates', explanation: 'Single Number works because all OTHER numbers appear exactly twice. If duplicates appear 3 times, you need a different approach (count bits modulo 3).' },
      { mistake: 'Operator precedence confusion', explanation: 'In many languages, bitwise operators have lower precedence than comparison. Use parentheses: (n & (n-1)) == 0, NOT n & (n-1) == 0.' },
      { mistake: 'Not considering negative numbers with bit shifts', explanation: 'Right shift behavior for negative numbers varies by language. In Java, >> is arithmetic shift (preserves sign), >>> is logical shift.' },
    ],
    recognitionTips: [
      'The problem asks to find a unique/missing element with O(1) space.',
      'You see "XOR" or "bitwise" in hints.',
      'The problem involves powers of 2 or counting binary digits.',
      'You need to generate all subsets and the set is small (n <= 20).',
    ],
    practiceProblems: [
      { name: 'Single Number', difficulty: 'Easy', why: 'The XOR trick in its purest form — one pass, O(1) space.' },
      { name: 'Number of 1 Bits', difficulty: 'Easy', why: 'Count set bits using n & (n-1) — a fundamental bit manipulation skill.' },
      { name: 'Missing Number', difficulty: 'Easy', why: 'XOR all indices and values — the missing number is what remains.' },
      { name: 'Counting Bits', difficulty: 'Easy', why: 'Count bits for all numbers 0 to n — uses the DP relation: bits[i] = bits[i & (i-1)] + 1.' },
      { name: 'Single Number II', difficulty: 'Medium', why: 'Every number appears 3 times except one — requires counting bits modulo 3.' },
    ],
    relatedPatterns: [],
    commonProblems: ['Single Number', 'Number of 1 Bits', 'Counting Bits', 'Missing Number', 'Reverse Bits'],
  },
];
