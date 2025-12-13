import { Queue } from 'bullmq';
import { redisConnection } from './connection';

export const articleImagesQueue = new Queue('article-images', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 10000, // Image processing can be slow, so a longer delay
    },
    // For idempotency, the jobId should be the unique ID of the article.
    // e.g., jobId: `images:${articleId}`
  },
});
