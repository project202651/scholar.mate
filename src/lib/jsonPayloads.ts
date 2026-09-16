/**
 * ScholarMate JSONB Payload Utilities
 * Normalizes dynamic JSONB outputs (bullet points, question rubrics, flashcard decks, diagrams)
 * ensuring backward compatibility whether data is stored as native JSONB or stringified JSON.
 */

export function parseJsonPayload<T = any>(data: any, fallback: T): T {
  if (data === null || data === undefined) return fallback;
  if (typeof data === "object") return data as T;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function serializeJsonPayload(data: any): any {
  if (data === null || data === undefined) return [];
  return data;
}
