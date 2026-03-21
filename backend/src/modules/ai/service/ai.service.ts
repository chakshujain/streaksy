import { env } from '../../../config/env';
import { logger } from '../../../config/logger';

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
  if (!env.ai.apiKey) {
    logger.warn('NVIDIA_API_KEY not configured — skipping AI generation');
    return null;
  }

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
    const response = await fetch(`${env.ai.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.ai.apiKey}`,
      },
      body: JSON.stringify({
        model: env.ai.model,
        messages: [
          { role: 'system', content: 'You are a concise coding interview coach. Always respond with valid JSON only. No markdown fences.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2048,
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

    // DeepSeek R1 and similar models may wrap output in <think>...</think> tags
    // Strip the thinking section and only use the final answer
    content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    // Strip potential markdown code fences
    content = content
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Try to extract JSON from the response if there's extra text around it
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error({ content }, 'AI API response contains no JSON object');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]) as RevisionNotes;

    // Validate required fields
    if (!parsed.keyTakeaway || !parsed.approach || !parsed.intuition || !Array.isArray(parsed.pointsToRemember)) {
      logger.error({ parsed }, 'AI API returned incomplete data');
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
