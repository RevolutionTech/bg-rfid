import type { BggGame } from "@/types/bgg";

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

export function parseThingResults(xml: string): Record<string, string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const items = doc.querySelectorAll("item");
  const thumbnails: Record<string, string> = {};

  items.forEach((item) => {
    const id = item.getAttribute("id");
    const thumbnailEl = item.querySelector("thumbnail");
    const thumbnail = thumbnailEl?.textContent?.trim();

    if (id && thumbnail) {
      thumbnails[id] = thumbnail;
    }
  });

  return thumbnails;
}
