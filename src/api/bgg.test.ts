import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { searchGames, fetchThumbnails } from "./bgg";

describe("searchGames", () => {
  it("resolves with a parsed BggGame[] on a 200 response", async () => {
    const results = await searchGames("catan", "test-token");
    expect(results).toEqual([
      { id: "13", name: "Catan" },
      { id: "42", name: "Catan: Seafarers" },
      { id: "99", name: "Catan: Cities & Knights" },
    ]);
  });

  it("throws a retryable error on a 202 response", async () => {
    server.use(
      http.get("/api/bgg/search", () => {
        return new HttpResponse("", { status: 202 });
      }),
    );

    await expect(searchGames("catan", "test-token")).rejects.toThrow(
      "BGG is still processing the request",
    );
  });

  it("throws on a network error", async () => {
    server.use(
      http.get("/api/bgg/search", () => {
        return HttpResponse.error();
      }),
    );

    await expect(searchGames("catan", "test-token")).rejects.toThrow();
  });
});

describe("fetchThumbnails", () => {
  it("resolves with a correct Record<string, ThingResult> on a 200 response", async () => {
    const result = await fetchThumbnails(["13", "42", "99"], "test-token");
    expect(result).toEqual({
      "13": {
        thumbnail: "https://cf.geekdo-images.com/catan_thumb.jpg",
        type: "boardgame",
      },
      "42": {
        thumbnail: "https://cf.geekdo-images.com/seafarers_thumb.jpg",
        type: "boardgame",
      },
      "99": {
        thumbnail: "https://cf.geekdo-images.com/cities_thumb.jpg",
        type: "boardgameexpansion",
      },
    });
  });

  it("throws on a network error", async () => {
    server.use(
      http.get("/api/bgg/thing", () => {
        return HttpResponse.error();
      }),
    );

    await expect(fetchThumbnails(["13"], "test-token")).rejects.toThrow();
  });
});
