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
