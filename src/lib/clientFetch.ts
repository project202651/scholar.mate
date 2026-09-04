export async function aiFetch(endpoint: string, options: RequestInit = {}) {
  const customKey =
    typeof window !== "undefined"
      ? localStorage.getItem("scholarmate_gemini_key") || ""
      : "";

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (customKey) {
    headers.set("x-gemini-key", customKey);
  }

  return fetch(endpoint, {
    ...options,
    headers,
  });
}
