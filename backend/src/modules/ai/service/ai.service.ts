import { env } from '../../../config/env';
import { logger } from '../../../config/logger';

// ── Shared AI call helper ──

interface AIChatOptions {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

async function callAI(options: AIChatOptions): Promise<string | null> {
  if (!env.ai.apiKey) {
    logger.warn('NVIDIA_API_KEY not configured — skipping AI call');
    return null;
  }

  const response = await fetch(`${env.ai.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.ai.apiKey}`,
    },
    body: JSON.stringify({
      model: env.ai.model,
      messages: [
        { role: 'system', content: options.system },
        { role: 'user', content: options.prompt },
      ],
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 2048,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error({ status: response.status, body: text }, 'AI API request failed');
    return null;
  }

  const data = await response.json() as {
    choices?: { message?: { content?: string } }[];
  };

  let content = data.choices?.[0]?.message?.content;
  if (!content) {
    logger.error({ data }, 'AI API returned empty content');
    return null;
  }

  // Strip thinking tags (DeepSeek R1 style)
  content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  return content;
}

function extractJSON(content: string): Record<string, unknown> | null {
  // Strip markdown code fences
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}

// ── Revision Notes ──

export interface RevisionNotes {
  keyTakeaway: string;
  approach: string;
  intuition: string;
  pointsToRemember: string[];
  timeComplexity: string;
  spaceComplexity: string;
}

export async function generateRevisionNotes(
  problemTitle: string,
  difficulty: string,
  userCode: string,
  language: string,
  tags: string[]
): Promise<RevisionNotes | null> {
  const prompt = `You are a coding interview coach. Analyze the following LeetCode solution and produce a concise revision note in JSON.

Problem: "${problemTitle}" (${difficulty})
Tags: ${tags.length > 0 ? tags.join(', ') : 'N/A'}
Language: ${language}

\`\`\`${language}
${userCode}
\`\`\`

Respond with ONLY valid JSON (no markdown, no code fences) matching this exact schema:
{
  "keyTakeaway": "<1-2 sentence core insight>",
  "approach": "<name of the algorithm/technique used, e.g. Two Pointers, BFS, Dynamic Programming>",
  "intuition": "<2-3 sentences explaining WHY this approach works for this problem>",
  "pointsToRemember": ["<point 1>", "<point 2>", "<point 3>"],
  "timeComplexity": "<e.g. O(n)>",
  "spaceComplexity": "<e.g. O(1)>"
}

Guidelines:
- keyTakeaway should capture the single most important thing to remember
- pointsToRemember should have 3-5 bullet points covering edge cases, tricky parts, or common mistakes
- Be concise and specific to THIS solution, not generic advice`;

  try {
    const content = await callAI({
      system: 'You are a concise coding interview coach. Always respond with valid JSON only. No markdown fences.',
      prompt,
    });
    if (!content) return null;

    const parsed = extractJSON(content) as unknown as RevisionNotes;
    if (!parsed || !parsed.keyTakeaway || !parsed.approach || !parsed.intuition || !Array.isArray(parsed.pointsToRemember)) {
      logger.error({ content }, 'AI revision notes: incomplete data');
      return null;
    }

    return {
      keyTakeaway: String(parsed.keyTakeaway),
      approach: String(parsed.approach),
      intuition: String(parsed.intuition),
      pointsToRemember: parsed.pointsToRemember.map(String).slice(0, 5),
      timeComplexity: String(parsed.timeComplexity || ''),
      spaceComplexity: String(parsed.spaceComplexity || ''),
    };
  } catch (err) {
    logger.error({ err }, 'Failed to generate revision notes via AI');
    return null;
  }
}

// ── Hints ──

export interface Hint {
  level: number;
  hint: string;
}

export async function generateHints(
  problemTitle: string,
  difficulty: string,
  tags: string[],
  userCode?: string,
  language?: string
): Promise<Hint[] | null> {
  const codeSection = userCode && language
    ? `\nThe user has attempted the problem. Their current code:\n\`\`\`${language}\n${userCode}\n\`\`\`\nTailor hints to help them progress from where they're stuck.`
    : '\nThe user has NOT started coding yet. Give general algorithmic hints.';

  const prompt = `Problem: "${problemTitle}" (${difficulty})
Tags: ${tags.length > 0 ? tags.join(', ') : 'N/A'}
${codeSection}

Generate 3 progressive hints — from subtle nudge to nearly giving it away, but NEVER reveal the full solution.

Respond with ONLY valid JSON:
{
  "hints": [
    { "level": 1, "hint": "<gentle nudge — mention the data structure or technique category>" },
    { "level": 2, "hint": "<stronger hint — describe the key insight or state transition>" },
    { "level": 3, "hint": "<almost there — outline the algorithm steps without code>" }
  ]
}`;

  try {
    const content = await callAI({
      system: 'You are a patient coding mentor. Give progressive hints that guide without spoiling. Always respond with valid JSON only.',
      prompt,
      maxTokens: 1024,
    });
    if (!content) return null;

    const parsed = extractJSON(content) as { hints?: Hint[] } | null;
    if (!parsed?.hints || !Array.isArray(parsed.hints) || parsed.hints.length === 0) {
      logger.error({ content }, 'AI hints: incomplete data');
      return null;
    }

    return parsed.hints.slice(0, 3).map((h, i) => ({
      level: i + 1,
      hint: String(h.hint),
    }));
  } catch (err) {
    logger.error({ err }, 'Failed to generate hints via AI');
    return null;
  }
}

// ── Problem Explanation ──

export interface ProblemExplanation {
  overview: string;
  approaches: {
    name: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    pros: string[];
    cons: string[];
  }[];
  bestApproach: string;
  commonMistakes: string[];
  relatedPatterns: string[];
}

export async function generateExplanation(
  problemTitle: string,
  difficulty: string,
  tags: string[]
): Promise<ProblemExplanation | null> {
  const prompt = `Problem: "${problemTitle}" (${difficulty})
Tags: ${tags.length > 0 ? tags.join(', ') : 'N/A'}

Explain this problem thoroughly for someone preparing for coding interviews.

Respond with ONLY valid JSON:
{
  "overview": "<2-3 sentences explaining the problem and why it's interesting>",
  "approaches": [
    {
      "name": "<e.g. Brute Force>",
      "description": "<2-3 sentences explaining the approach>",
      "timeComplexity": "<e.g. O(n^2)>",
      "spaceComplexity": "<e.g. O(1)>",
      "pros": ["<pro 1>"],
      "cons": ["<con 1>"]
    }
  ],
  "bestApproach": "<name of the optimal approach and 1 sentence why>",
  "commonMistakes": ["<mistake 1>", "<mistake 2>"],
  "relatedPatterns": ["<pattern 1>", "<pattern 2>"]
}

Guidelines:
- List 2-3 approaches from brute force to optimal
- Be specific to THIS problem, not generic
- commonMistakes should list 2-4 pitfalls specific to this problem
- relatedPatterns should reference DSA patterns like "Two Pointers", "Sliding Window", etc.`;

  try {
    const content = await callAI({
      system: 'You are an expert DSA instructor. Explain problems clearly with multiple approaches. Always respond with valid JSON only.',
      prompt,
      maxTokens: 3072,
    });
    if (!content) return null;

    const parsed = extractJSON(content) as unknown as ProblemExplanation;
    if (!parsed?.overview || !Array.isArray(parsed.approaches) || parsed.approaches.length === 0) {
      logger.error({ content }, 'AI explanation: incomplete data');
      return null;
    }

    return {
      overview: String(parsed.overview),
      approaches: parsed.approaches.slice(0, 4).map(a => ({
        name: String(a.name),
        description: String(a.description),
        timeComplexity: String(a.timeComplexity || ''),
        spaceComplexity: String(a.spaceComplexity || ''),
        pros: Array.isArray(a.pros) ? a.pros.map(String) : [],
        cons: Array.isArray(a.cons) ? a.cons.map(String) : [],
      })),
      bestApproach: String(parsed.bestApproach || ''),
      commonMistakes: Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes.map(String).slice(0, 5) : [],
      relatedPatterns: Array.isArray(parsed.relatedPatterns) ? parsed.relatedPatterns.map(String).slice(0, 5) : [],
    };
  } catch (err) {
    logger.error({ err }, 'Failed to generate explanation via AI');
    return null;
  }
}

// ── Code Review ──

export interface CodeReview {
  rating: number;
  summary: string;
  strengths: string[];
  issues: {
    severity: 'critical' | 'warning' | 'suggestion';
    description: string;
    fix: string;
  }[];
  optimizedApproach?: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export async function reviewCode(
  problemTitle: string,
  difficulty: string,
  userCode: string,
  language: string,
  tags: string[]
): Promise<CodeReview | null> {
  const prompt = `Problem: "${problemTitle}" (${difficulty})
Tags: ${tags.length > 0 ? tags.join(', ') : 'N/A'}
Language: ${language}

\`\`\`${language}
${userCode}
\`\`\`

Review this code like a senior engineer in a coding interview. Be constructive and specific.

Respond with ONLY valid JSON:
{
  "rating": <1-10 integer>,
  "summary": "<1-2 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "issues": [
    {
      "severity": "critical|warning|suggestion",
      "description": "<what's wrong>",
      "fix": "<how to fix it>"
    }
  ],
  "optimizedApproach": "<describe a better approach if one exists, or null if already optimal>",
  "timeComplexity": "<actual complexity of this code>",
  "spaceComplexity": "<actual complexity of this code>"
}

Guidelines:
- rating: 1-3 = needs major rework, 4-6 = acceptable with issues, 7-8 = good, 9-10 = excellent
- List 1-3 strengths
- List real issues — bugs, edge cases, inefficiencies, readability
- severity: "critical" = bugs/wrong answers, "warning" = performance/edge cases, "suggestion" = style/readability
- If the code is already optimal, set optimizedApproach to null`;

  try {
    const content = await callAI({
      system: 'You are a senior software engineer doing code review. Be constructive, specific, and fair. Always respond with valid JSON only.',
      prompt,
      maxTokens: 2048,
    });
    if (!content) return null;

    const parsed = extractJSON(content) as unknown as CodeReview;
    if (!parsed?.summary || typeof parsed.rating !== 'number') {
      logger.error({ content }, 'AI code review: incomplete data');
      return null;
    }

    return {
      rating: Math.max(1, Math.min(10, Math.round(parsed.rating))),
      summary: String(parsed.summary),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String).slice(0, 5) : [],
      issues: Array.isArray(parsed.issues) ? parsed.issues.slice(0, 8).map(i => ({
        severity: (['critical', 'warning', 'suggestion'].includes(i.severity) ? i.severity : 'suggestion') as 'critical' | 'warning' | 'suggestion',
        description: String(i.description),
        fix: String(i.fix),
      })) : [],
      optimizedApproach: parsed.optimizedApproach ? String(parsed.optimizedApproach) : undefined,
      timeComplexity: String(parsed.timeComplexity || ''),
      spaceComplexity: String(parsed.spaceComplexity || ''),
    };
  } catch (err) {
    logger.error({ err }, 'Failed to generate code review via AI');
    return null;
  }
}
