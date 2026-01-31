// src/api/urlApi.js
// ---------------------------------------------
// API Layer (Client -> Server)
// ---------------------------------------------
// Purpose:
// - Provides a small, centralized wrapper around the backend endpoints.
// - Keeps fetch() usage out of UI components for readability and reuse.
//
// Notes:
// - All functions here return parsed JSON (when applicable).
// - For non-2xx HTTP responses, we throw an Error.
//   Components can catch and show user-friendly messages.
//
// Backend routes used:
// - GET    /api/url        -> { urls: Url[] }
// - POST   /api/url        -> { message: string, url: Url }
// - PUT    /api/url/:id    -> Url
// - DELETE /api/url/:id    -> (usually empty or a message)

async function fetchJson(url, options) {
  const res = await fetch(url, options);

  // Try to parse JSON if present (some endpoints might not return JSON)
  let data = null;
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    // If not JSON, attempt text (useful for debugging server errors)
    const text = await res.text();
    data = text ? { message: text } : null;
  }

  // Normalize errors: throw for non-OK responses
  if (!res.ok) {
    const message =
      (data && data.message) ||
      `Request failed (${res.status} ${res.statusText})`;
    throw new Error(message);
  }

  return data;
}

/**
 * GET all saved URLs
 * Response: { urls: Url[] }
 */
export async function getAllUrls() {
  return fetchJson("/api/url");
}

/**
 * POST create a new short URL
 * Body: { longUrl: string }
 * Response: { message: string, url: Url }
 */
export async function createUrl(longUrl) {
  return fetchJson("/api/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl }),
  });
}

/**
 * PUT update an existing URL record
 * Body: { longUrl: string }
 * Response: Url
 */
export async function updateUrl(id, longUrl) {
  return fetchJson(`/api/url/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl }),
  });
}

/**
 * DELETE remove a URL record
 * Response: usually empty or a message
 */
export async function deleteUrl(id) {
  return fetchJson(`/api/url/${id}`, { method: "DELETE" });
}
