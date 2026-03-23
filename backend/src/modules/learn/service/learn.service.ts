import { answerLessonQuestion } from '../../ai/service/ai.service';
import { checkAIRateLimit } from '../../../common/utils/aiRateLimit';
import { env } from '../../../config/env';
import { AppError } from '../../../common/errors/AppError';

export const learnService = {
  async askAI(userId: string, topic: string, lesson: string, question: string) {
    if (!env.ai.apiKey) {
      throw new AppError(503, 'AI generation is not available. NVIDIA_API_KEY is not configured.');
    }

    await checkAIRateLimit(userId);

    const answer = await answerLessonQuestion(topic, lesson, question);

    if (!answer) {
      throw new AppError(502, 'AI service failed to answer the question. Please try again later.');
    }

    return answer;
  },
};
