// src/api/urlApi.js
export async function getAllUrls() {
  const res = await fetch("/api/url");
  return res.json(); // expects { urls: [...] }
}

export async function createUrl(longUrl) {
  const res = await fetch("/api/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl }),
  });
  return res.json(); // expects { message, url }
}

export async function updateUrl(id, longUrl) {
  const res = await fetch(`/api/url/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl }),
  });
  return res.json(); // expects updated url object
}

export async function deleteUrl(id) {
  await fetch(`/api/url/${id}`, { method: "DELETE" });
}
