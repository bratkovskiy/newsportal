import cronParser from 'cron-parser';

const CMS_URL = process.env.CMS_URL || 'http://localhost:3000';
const JOBS_API_KEY = process.env.JOBS_API_KEY || '';

interface FeedDoc {
  id: number;
  name: string;
  type?: 'rss' | 'json' | null;
  enabled?: boolean | null;
  cron?: string | null;
  lastImportedAt?: string | null;
}

interface CmsListResponse<T> {
  docs: T[];
}

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${CMS_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-jobs-key': JOBS_API_KEY,
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed ${res.status} ${res.statusText} for ${url}: ${text}`);
  }

  return (await res.json()) as T;
}

async function getEnabledFeeds(): Promise<FeedDoc[]> {
  const params =
    '?where[enabled][equals]=true&where[type][equals]=rss&limit=100&sort=id';
  const data = await fetchJSON<CmsListResponse<FeedDoc>>(`/api/feeds${params}`);
  return Array.isArray(data.docs) ? data.docs : [];
}

function shouldRunNow(feed: FeedDoc, now: Date): boolean {
  const cron = (feed.cron || '').trim();

  // Если cron не задан – автоимпорт выключен, фид обновляется только вручную
  if (!cron) {
    return false;
  }

  try {
    const interval = cronParser.parseExpression(cron, { currentDate: now });
    const prevTime = interval.prev().toDate();

    const lastImportedRaw = feed.lastImportedAt;
    if (!lastImportedRaw) return true;

    const lastImported = new Date(lastImportedRaw);
    if (Number.isNaN(lastImported.getTime())) return true;

    // Нужно запустить, если последний импорт был до последнего ожидаемого срабатывания cron
    return lastImported < prevTime;
  } catch (err) {
    console.error(
      `[feeds] Invalid cron expression for feed ${feed.id} (${feed.name}): ${cron}`,
      err,
    );
    return false;
  }
}

let isRunning = false;

async function runSchedulerCycle() {
  if (isRunning) {
    console.log('[feeds] Previous scheduler cycle is still running, skipping tick.');
    return;
  }

  isRunning = true;
  const startedAt = new Date();

  try {
    console.log(`\n[feeds] Scheduler tick at ${startedAt.toISOString()}`);

    const feeds = await getEnabledFeeds();
    if (!feeds.length) {
      console.log('[feeds] No enabled RSS feeds found.');
      return;
    }

    for (const feed of feeds) {
      if (feed.type && feed.type !== 'rss') {
        continue;
      }

      if (!shouldRunNow(feed, startedAt)) {
        continue;
      }

      console.log(`[feeds] Importing feed #${feed.id} (${feed.name})...`);

      try {
        const result = await fetchJSON<any>(`/api/feeds/${feed.id}/import`, {
          method: 'POST',
        });

        const created =
          result?.created ?? result?.feeds?.[0]?.created ?? result?.feeds?.created ?? 0;
        const skipped =
          result?.skipped ?? result?.feeds?.[0]?.skipped ?? result?.feeds?.skipped ?? 0;

        console.log(
          `[feeds] Feed #${feed.id} imported: created=${created}, skipped=${skipped}`,
        );
      } catch (err) {
        console.error(
          `[feeds] Import failed for feed #${feed.id} (${feed.name}):`,
          err,
        );
      }
    }
  } catch (err) {
    console.error('[feeds] Scheduler cycle failed:', err);
  } finally {
    isRunning = false;
  }
}

console.log('Jobs service started.');

const intervalMinutes = Number(process.env.FEEDS_IMPORT_INTERVAL_MINUTES || '1');
const intervalMs = Math.max(intervalMinutes, 1) * 60 * 1000;

// Первый запуск сразу после старта
runSchedulerCycle();

// Далее — по расписанию
setInterval(runSchedulerCycle, intervalMs);

const cleanup = () => {
  console.log('Shutting down jobs service...');
  process.exit(0);
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);
