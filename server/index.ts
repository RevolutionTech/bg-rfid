import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

import type { ContentfulStatusCode } from "hono/utils/http-status";

const app = new Hono();

app.all("/api/bgg/*", async (c) => {
  const path = c.req.path.replace(/^\/api\/bgg/, "");
  const queryString = new URL(c.req.url).search;
  const upstream = `https://boardgamegeek.com/xmlapi2${path}${queryString}`;

  try {
    const response = await fetch(upstream);
    const body = await response.text();
    return c.text(body, response.status as ContentfulStatusCode, {
      "Content-Type": "text/xml",
    });
  } catch (e) {
    console.error("Upstream fetch failed:", e instanceof Error ? e.message : "unknown error");
    return c.text("Bad Gateway", 502);
  }
});

export { app };
export const handler = handle(app);
