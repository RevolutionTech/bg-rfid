import type { BggGame, ThingResult } from "@/types/bgg";

export function parseSearchResults(xml: string): BggGame[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const items = doc.querySelectorAll("item");
  const games: BggGame[] = [];

  items.forEach((item) => {
    const id = item.getAttribute("id");
    const nameEl = item.querySelector('name[type="primary"]');
    const name = nameEl?.getAttribute("value");

    if (id && name) {
      games.push({ id, name });
    }
  });

  return games;
}

export function parseThingResults(
  xml: string,
): Record<string, ThingResult> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const items = doc.querySelectorAll("item");
  const results: Record<string, ThingResult> = {};

  items.forEach((item) => {
    const id = item.getAttribute("id");
    const type = item.getAttribute("type");

    if (id && type) {
      const thumbnailEl = item.querySelector("thumbnail");
      const thumbnail = thumbnailEl?.textContent?.trim();

      results[id] = thumbnail ? { thumbnail, type } : { type };
    }
  });

  return results;
}
