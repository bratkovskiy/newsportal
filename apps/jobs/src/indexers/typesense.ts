import Typesense from 'typesense';
import { Client as PgClient } from 'pg';

// Initialize Typesense client
const typesense = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST || 'localhost',
    port: parseInt(process.env.TYPESENSE_PORT || '8108'),
    protocol: process.env.TYPESENSE_PROTOCOL || 'http',
  }],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
});

// Initialize PostgreSQL client
const pg = new PgClient({
  connectionString: process.env.DATABASE_URI,
});

async function indexArticles() {
  console.log('Starting article indexing...');

  try {
    await pg.connect();

    // In a real app, you would fetch articles from your database
    // const res = await pg.query('SELECT * FROM articles WHERE status = \'published\'');
    // const articles = res.rows;

    // Placeholder data
    const articles = [
      {
        id: '1',
        title: '10 Fall Trends You Need to Know',
        excerpt: '...',
        content: '...',
        category: 'Trends',
        tags: ['fall', 'fashion'],
        author: 'Jane Doe',
        published_at: Math.floor(new Date('2025-12-01').getTime() / 1000),
      },
    ];

    console.log(`Found ${articles.length} articles to index.`);

    // Index documents in Typesense
    const results = await typesense.collections('articles').documents().import(articles, { action: 'upsert' });
    console.log('Indexing results:', results);

  } catch (error) {
    console.error('Error indexing articles:', error);
  } finally {
    await pg.end();
    console.log('Indexing finished.');
  }
}

indexArticles();
