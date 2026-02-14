// client/src/api/urlApi.js
// Client-side API layer: provides a centralized wrapper around backend URL endpoints.
// Keeps fetch logic isolated from UI components and normalizes success/error handling.

/**
 * Internal helper: performs a fetch request and safely parses the response.
 * - Parses JSON when available
 * - Falls back to text when needed
 * - Throws normalized Error for non-OK responses
 */
async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);

  let data = null;
  const contentType = res.headers.get('content-type') || '';

  // Parse JSON if available
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    // Fallback to text (useful for debugging server errors)
    const text = await res.text();
    data = text ? { message: text } : null;
  }

  // Normalize errors
  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed (${res.status} ${res.statusText})`;

    throw new Error(message);
  }

  return data;
}

/**
 * GET all saved URLs
 * Backend: GET /api/url
 * Response: { urls: Url[] }
 */
export async function getAllUrls() {
  return fetchJson('/api/url');
}

/**
 * POST create a new short URL
 * Backend: POST /api/url
 * Body: { longUrl: string }
 * Response: { message: string, url: Url }
 */
export async function createUrl(longUrl) {
  return fetchJson('/api/url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ longUrl }),
  });
}

/**
 * PUT update an existing URL record
 * Backend: PUT /api/url/:id
 * Body: { longUrl: string }
 * Response: { url: Url }
 */
export async function updateUrl(id, longUrl) {
  return fetchJson(`/api/url/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ longUrl }),
  });
}

/**
 * DELETE remove a URL record
 * Backend: DELETE /api/url/:id
 * Response: { message: string }
 */
export async function deleteUrl(id) {
  return fetchJson(`/api/url/${id}`, {
    method: 'DELETE',
  });
}
