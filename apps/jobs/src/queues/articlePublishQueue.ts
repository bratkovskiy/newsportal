import { Queue } from 'bullmq';
import { redisConnection } from './connection';

export const articlePublishQueue = new Queue('article-publish', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 1, // Publishing should be a final, single-attempt action
    // For idempotency, the jobId should be the unique ID of the article.
    // e.g., jobId: `publish:${articleId}`
  },
});
