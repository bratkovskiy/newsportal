import { Queue } from 'bullmq';
import { redisConnection } from './connection';

export const feedFetchQueue = new Queue('feed-fetch', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times
    backoff: {
      type: 'exponential',
      delay: 1000, // Start with 1s delay
    },
    // For idempotency, the jobId should be a unique identifier for the feed URL.
    // e.g., jobId: `fetch:${feedUrl}`
  },
});

// A separate worker would process this queue.
// Failed jobs after all retries will be moved to a 'failed' state.
// A separate process can monitor the failed queue and move jobs to a Dead Letter Queue (DLQ).
