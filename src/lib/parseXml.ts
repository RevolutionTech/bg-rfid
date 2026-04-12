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
    const thumbnailEl = item.querySelector("thumbnail");
    const thumbnail = thumbnailEl?.textContent?.trim() || undefined;

    if (id && name) {
      games.push({ id, name, thumbnail });
    }
  });

  return games;
}
