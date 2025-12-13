import { Queue } from 'bullmq';
import { redisConnection } from './connection';

export const feedParseQueue = new Queue('feed-parse', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2, // Parsing is less likely to fail due to network, so fewer retries
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    // For idempotency, the jobId should be a hash of the feed content.
    // e.g., jobId: `parse:${contentHash}`
  },
});
