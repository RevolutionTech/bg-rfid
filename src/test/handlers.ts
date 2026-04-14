import { http, HttpResponse } from "msw";

const searchXml = `<?xml version="1.0" encoding="utf-8"?>
<items total="3" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
  <item type="boardgame" id="13">
    <name type="primary" value="Catan"/>
    <yearpublished value="1995"/>
  </item>
  <item type="boardgame" id="42">
    <name type="primary" value="Catan: Seafarers"/>
    <yearpublished value="1997"/>
  </item>
  <item type="boardgameexpansion" id="99">
    <name type="primary" value="Catan: Cities &amp; Knights"/>
    <yearpublished value="1998"/>
  </item>
</items>`;

const thingXml = `<?xml version="1.0" encoding="utf-8"?>
<items termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
  <item type="boardgame" id="13">
    <thumbnail>https://cf.geekdo-images.com/catan_thumb.jpg</thumbnail>
    <name type="primary" sortindex="1" value="Catan"/>
  </item>
  <item type="boardgame" id="42">
    <thumbnail>https://cf.geekdo-images.com/seafarers_thumb.jpg</thumbnail>
    <name type="primary" sortindex="1" value="Catan: Seafarers"/>
  </item>
</items>`;

export const handlers = [
  http.get("/api/bgg/search", () => {
    return HttpResponse.xml(searchXml);
  }),
  http.get("/api/bgg/thing", () => {
    return HttpResponse.xml(thingXml);
  }),
];
