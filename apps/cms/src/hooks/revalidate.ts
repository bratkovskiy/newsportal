import type { CollectionAfterChangeHook } from 'payload';
import crypto from 'crypto';

// This hook is triggered after a document in the 'articles' collection is changed.
// It sends a revalidation request to the frontend (Astro) to rebuild relevant pages.
export const revalidateArticle: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!req.payload) return doc; // Ensure payload is available
  const { payload } = req;


  // A collection of paths to revalidate.
  const pathsToRevalidate: string[] = [];

  // Add the article's own path
  // Assumes a URL structure of /article/YYYY/MM/slug
  if (doc.slug && doc.publishedDate) {
    const date = new Date(doc.publishedDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    pathsToRevalidate.push(`/article/${year}/${month}/${doc.slug}`);
  }

  // Add paths for all categories related to the article
  if (doc.categories && doc.categories.length > 0) {
    for (const category of doc.categories) {
      // Assuming category is an object with a slug property
      if (typeof category === 'object' && category !== null && 'slug' in category) {
        pathsToRevalidate.push(`/category/${category.slug}`);
      } else {
        // If category is just an ID, we need to fetch it first
        try {
          const categoryDoc: any = await payload.findByID({
            collection: 'categories',
            id: category,
          });
          const slug = categoryDoc?.slug as string | undefined;
          if (slug) {
            pathsToRevalidate.push(`/category/${slug}`);
          }
        } catch (error) {
          payload.logger.error(`Error fetching category details for revalidation: ${error}`);
        }
      }
    }
  }

  // If there are no paths, no need to send a request.
  if (pathsToRevalidate.length === 0) {
    payload.logger.info('No paths to revalidate for the recent change.');
    return;
  }

  try {
    const revalidationUrl = process.env.REVALIDATION_URL;
    const revalidationSecret = process.env.REVALIDATION_SECRET;

    if (!revalidationUrl || !revalidationSecret) {
        payload.logger.error('REVALIDATION_URL or REVALIDATION_SECRET is not defined. Skipping revalidation.');
        return;
    }

    const uniquePaths = Array.from(new Set(pathsToRevalidate)); // Ensure unique paths
    const body = JSON.stringify({ paths: uniquePaths });
    const signature = crypto
      .createHmac('sha256', revalidationSecret)
      .update(body)
      .digest('hex');

    const res = await fetch(revalidationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidation-signature': signature,
      },
      body,
    });

    if (res.ok) {
      payload.logger.info(`Successfully sent revalidation request for paths: ${pathsToRevalidate.join(', ')}`);
    } else {
      const errorText = await res.text();
      payload.logger.error(`Failed to send revalidation request. Status: ${res.status}. Body: ${errorText}`);
    }
  } catch (err: unknown) {
    payload.logger.error(`Error sending revalidation request: ${err}`);
  }
};
