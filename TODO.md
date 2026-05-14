**To improve project**:
* Track the number of clicks for each shortened URL.
* Allow users to create custom short URLs.
* User Authentication: Secure user login and registration.
* JWT Authentication: Ensures secure user authentication and authorization.
* Replace deprecated `shortid` with `nanoid`.
* Add rate limiting and abuse protection (both the API and redirect endpoints).
* Add URL expiration support.
* Add automated backend tests (Jest + Supertest).
* Reduce over-commenting across source files — keep only non-obvious WHY comments.
* Standardize API response envelope — GET returns `{ urls }`, POST `{ message, url }`, PUT `{ url }`, DELETE `{ message }`; normalize to a single shape so clients don't need `unwrapUrl()` hacks.
* Short-circuit no-op PUT — when the submitted `longUrl` equals the stored value, skip the DB save and return 200 immediately.
* Add client-side URL format validation (frontend only checks non-empty; server already rejects bad input but early feedback improves UX).
* Add CORS configuration for production — currently no CORS headers; required if frontend and backend are served from different origins.
* Add explicit field projection to `Url.find().lean()` — avoids fetching unused fields if schema grows (e.g. `find({}, 'urlCode longUrl shortUrl date')`).
* Decouple `.landing-form` CSS class from `UrlCreateForm` — the component currently relies on a class defined in `LandingPage.css`; rename to `.url-create-form` for proper encapsulation.
* Add inline save-success feedback to `UrlTable` — after a successful PUT, show a brief visual confirmation (e.g. flash the row or show a transient "Saved" badge) so the user knows the update persisted.
* Add pagination or virtual scrolling to `UrlsPage` — the current implementation fetches and renders all URLs; this will degrade once the list grows.
* Extract a shared error-message utility — `err?.message || 'Fallback'` is repeated across components; a small helper would centralize the fallback text and formatting.
* Rename `backendData` / clarify ambiguous variable names in `urlApi.js` — improve readability for future contributors.
