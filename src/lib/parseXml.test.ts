import { describe, it, expect } from "vitest";
import { parseSearchResults, parseThingResults } from "./parseXml";

describe("parseSearchResults", () => {
  it("returns correctly shaped BggGame[] from a valid search XML response", () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <items total="2">
      <item type="boardgame" id="13">
        <name type="primary" value="Catan"/>
        <yearpublished value="1995"/>
      </item>
      <item type="boardgame" id="42">
        <name type="primary" value="Catan: Seafarers"/>
        <yearpublished value="1997"/>
      </item>
    </items>`;

    const results = parseSearchResults(xml);
    expect(results).toEqual([
      { id: "13", name: "Catan" },
      { id: "42", name: "Catan: Seafarers" },
    ]);
  });

  it('returns an empty array for an <items total="0"> response', () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <items total="0"></items>`;

    const results = parseSearchResults(xml);
    expect(results).toEqual([]);
  });

  it("handles a missing primary name element gracefully", () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <items total="2">
      <item type="boardgame" id="13">
        <name type="alternate" value="Die Siedler von Catan"/>
      </item>
      <item type="boardgame" id="42">
        <name type="primary" value="Catan: Seafarers"/>
      </item>
    </items>`;

    const results = parseSearchResults(xml);
    expect(results).toEqual([{ id: "42", name: "Catan: Seafarers" }]);
  });
});

describe("parseThingResults", () => {
  it("returns a correct { [id]: ThingResult } map from a valid thing XML response", () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <items>
      <item type="boardgame" id="13">
        <thumbnail>https://cf.geekdo-images.com/catan_thumb.jpg</thumbnail>
      </item>
      <item type="boardgame" id="42">
        <thumbnail>https://cf.geekdo-images.com/seafarers_thumb.jpg</thumbnail>
      </item>
    </items>`;

    const result = parseThingResults(xml);
    expect(result).toEqual({
      "13": {
        thumbnail: "https://cf.geekdo-images.com/catan_thumb.jpg",
        type: "boardgame",
      },
      "42": {
        thumbnail: "https://cf.geekdo-images.com/seafarers_thumb.jpg",
        type: "boardgame",
      },
    });
  });

  it("handles a missing <thumbnail> element gracefully — includes the id with type but no thumbnail", () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <items>
      <item type="boardgame" id="13">
        <thumbnail>https://cf.geekdo-images.com/catan_thumb.jpg</thumbnail>
      </item>
      <item type="boardgame" id="42">
        <name type="primary" value="Catan: Seafarers"/>
      </item>
    </items>`;

    const result = parseThingResults(xml);
    expect(result).toEqual({
      "13": {
        thumbnail: "https://cf.geekdo-images.com/catan_thumb.jpg",
        type: "boardgame",
      },
      "42": { type: "boardgame" },
    });
  });

  it("includes items of different types without filtering", () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <items>
      <item type="boardgame" id="13">
        <thumbnail>https://cf.geekdo-images.com/catan_thumb.jpg</thumbnail>
      </item>
      <item type="boardgameexpansion" id="99">
        <thumbnail>https://cf.geekdo-images.com/expansion_thumb.jpg</thumbnail>
      </item>
    </items>`;

    const result = parseThingResults(xml);
    expect(result).toEqual({
      "13": {
        thumbnail: "https://cf.geekdo-images.com/catan_thumb.jpg",
        type: "boardgame",
      },
      "99": {
        thumbnail: "https://cf.geekdo-images.com/expansion_thumb.jpg",
        type: "boardgameexpansion",
      },
    });
  });
});
