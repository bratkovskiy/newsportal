import type { APIRoute } from 'astro';
import crypto from 'crypto';

// This is your API endpoint for handling revalidation requests from the CMS.
export const POST: APIRoute = async ({ request }) => {
  const revalidationSecret = import.meta.env.REVALIDATION_SECRET;

  // 1. Check for the secret key
  if (!revalidationSecret) {
    return new Response('Revalidation secret is not set.', { status: 500 });
  }

  // 2. Get the signature from the headers
  const signature = request.headers.get('x-revalidation-signature');
  if (!signature) {
    return new Response('Signature header is missing.', { status: 400 });
  }

  // 3. Read the request body
  const body = await request.text();
  if (!body) {
    return new Response('Request body is empty.', { status: 400 });
  }

  // 4. Verify the signature
  const expectedSignature = crypto
    .createHmac('sha256', revalidationSecret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return new Response('Invalid signature.', { status: 401 });
  }

  // 5. If signature is valid, process the revalidation
  try {
    const { paths } = JSON.parse(body);
    if (!Array.isArray(paths)) {
      return new Response('Invalid body format: paths should be an array.', { status: 400 });
    }

    // In a real-world scenario, you would trigger a rebuild or re-render for these paths.
    // For now, we'll just log them.
    console.log(`Revalidation triggered for paths: ${paths.join(', ')}`);

    // Here you might call a shell script, a CI/CD pipeline, or use Astro's specific API
    // if running in a mode that supports on-demand ISR (like with a Vercel/Netlify adapter).

    return new Response(JSON.stringify({ revalidated: true, paths }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error processing revalidation request: ${error.message}`, { status: 500 });
  }
};
