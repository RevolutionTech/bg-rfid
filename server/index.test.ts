import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../src/test/setup";
import { app } from "./index";

const BGG_BASE = "https://boardgamegeek.com/xmlapi2";

describe("server proxy", () => {
  it("proxies GET /api/bgg/search?query=catan to BGG and returns the upstream XML response with status 200", async () => {
    server.use(
      http.get(`${BGG_BASE}/search`, () => {
        return HttpResponse.xml(
          `<?xml version="1.0" encoding="utf-8"?><items total="1"><item type="boardgame" id="13"><name type="primary" value="Catan"/></item></items>`,
        );
      }),
    );

    const res = await app.request("/api/bgg/search?query=catan");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("<items");
    expect(body).toContain("Catan");
  });

  it("forwards the Authorization header to the upstream request", async () => {
    server.use(
      http.get(`${BGG_BASE}/search`, ({ request }) => {
        const auth = request.headers.get("Authorization");
        return HttpResponse.xml(`<auth>${auth}</auth>`);
      }),
    );

    const res = await app.request("/api/bgg/search?query=catan", {
      headers: { Authorization: "Bearer my-secret-token" },
    });
    const body = await res.text();
    expect(body).toContain("Bearer my-secret-token");
  });

  it("forwards the User-Agent header to the upstream request", async () => {
    server.use(
      http.get(`${BGG_BASE}/search`, ({ request }) => {
        const ua = request.headers.get("User-Agent");
        return HttpResponse.xml(`<ua>${ua}</ua>`);
      }),
    );

    const res = await app.request("/api/bgg/search?query=catan", {
      headers: { "User-Agent": "TestAgent/1.0" },
    });
    const body = await res.text();
    expect(body).toContain("TestAgent/1.0");
  });

  it("does not forward the host header to the upstream request", async () => {
    server.use(
      http.get(`${BGG_BASE}/search`, ({ request }) => {
        const host = request.headers.get("host");
        return HttpResponse.xml(`<host>${host ?? "none"}</host>`);
      }),
    );

    const res = await app.request("/api/bgg/search?query=catan", {
      headers: { host: "my-evil-host.com" },
    });
    const body = await res.text();
    expect(body).not.toContain("my-evil-host.com");
  });

  it('returns 502 with body "Bad Gateway" when the upstream fetch throws', async () => {
    server.use(
      http.get(`${BGG_BASE}/search`, () => {
        return HttpResponse.error();
      }),
    );

    const res = await app.request("/api/bgg/search?query=catan");
    expect(res.status).toBe(502);
    const body = await res.text();
    expect(body).toBe("Bad Gateway");
  });

  it("does not include internal error details in the 502 response body", async () => {
    server.use(
      http.get(`${BGG_BASE}/search`, () => {
        return HttpResponse.error();
      }),
    );

    const res = await app.request("/api/bgg/search?query=catan");
    const body = await res.text();
    expect(body).toBe("Bad Gateway");
    expect(body).not.toContain("Error");
    expect(body).not.toContain("error");
    expect(body).not.toContain("stack");
  });
});
