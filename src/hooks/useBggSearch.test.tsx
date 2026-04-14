import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { useBggSearch, PAGE_SIZE } from "./useBggSearch";
import { useBggThumbnails } from "./useBggThumbnails";
import type { ReactNode } from "react";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useBggSearch", () => {
  it("does not fetch when query is empty", async () => {
    const { result } = renderHook(
      () => useBggSearch("", "test-token", 1),
      { wrapper: createWrapper() },
    );

    // Should not be loading because the query is disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("fetches search results when query is non-empty", async () => {
    const { result } = renderHook(
      () => useBggSearch("catan", "test-token", 1),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual([
      { id: "13", name: "Catan" },
      { id: "42", name: "Catan: Seafarers" },
      { id: "99", name: "Catan: Cities & Knights" },
    ]);
  });

  it("filters out expansions and recalculates totalPages", async () => {
    const { result } = renderHook(
      () => useBggSearch("catan", "test-token", 1),
      { wrapper: createWrapper() },
    );

    // Wait for thing data to load so filtering happens
    await waitFor(() =>
      expect(Object.keys(result.current.thingResults).length).toBeGreaterThan(0),
    );

    // The default handler has 3 search results: 2 boardgames + 1 expansion
    // After filtering, only 2 remain
    expect(result.current.filteredData).toEqual([
      { id: "13", name: "Catan" },
      { id: "42", name: "Catan: Seafarers" },
    ]);
    expect(result.current.totalPages).toBe(1);
  });

  it("returns correct totalPages for a result set larger than 20", async () => {
    // Create a response with 25 boardgame items
    const items = Array.from(
      { length: 25 },
      (_, i) =>
        `<item type="boardgame" id="${i + 1}"><name type="primary" value="Game ${i + 1}"/></item>`,
    ).join("");
    const searchXml = `<?xml version="1.0" encoding="utf-8"?><items total="25">${items}</items>`;

    // Thing response: all are boardgames (no expansions)
    const thingItems = Array.from(
      { length: 25 },
      (_, i) =>
        `<item type="boardgame" id="${i + 1}"><thumbnail>https://example.com/${i + 1}.jpg</thumbnail></item>`,
    ).join("");
    const thingXml = `<?xml version="1.0" encoding="utf-8"?><items>${thingItems}</items>`;

    server.use(
      http.get("/api/bgg/search", () => HttpResponse.xml(searchXml)),
      http.get("/api/bgg/thing", () => HttpResponse.xml(thingXml)),
    );

    const { result } = renderHook(
      () => useBggSearch("games", "test-token", 1),
      { wrapper: createWrapper() },
    );

    await waitFor(() =>
      expect(Object.keys(result.current.thingResults).length).toBeGreaterThan(0),
    );
    expect(result.current.totalPages).toBe(Math.ceil(25 / PAGE_SIZE));
  });

  it("totalPages is at least 1 even when all results are filtered out", async () => {
    // All results are expansions
    const searchXml = `<?xml version="1.0" encoding="utf-8"?>
      <items total="2">
        <item type="boardgame" id="1"><name type="primary" value="Exp A"/></item>
        <item type="boardgame" id="2"><name type="primary" value="Exp B"/></item>
      </items>`;
    const thingXml = `<?xml version="1.0" encoding="utf-8"?>
      <items>
        <item type="boardgameexpansion" id="1"><thumbnail>https://example.com/1.jpg</thumbnail></item>
        <item type="boardgameexpansion" id="2"><thumbnail>https://example.com/2.jpg</thumbnail></item>
      </items>`;

    server.use(
      http.get("/api/bgg/search", () => HttpResponse.xml(searchXml)),
      http.get("/api/bgg/thing", () => HttpResponse.xml(thingXml)),
    );

    const { result } = renderHook(
      () => useBggSearch("exp", "test-token", 1),
      { wrapper: createWrapper() },
    );

    await waitFor(() =>
      expect(Object.keys(result.current.thingResults).length).toBeGreaterThan(0),
    );
    expect(result.current.filteredData).toEqual([]);
    expect(result.current.totalPages).toBe(1);
  });

  it("clamps currentPage when it exceeds totalPages after filtering", async () => {
    // 21 results, but 20 of them are expansions — only 1 boardgame remains (1 page)
    const searchItems = Array.from(
      { length: 21 },
      (_, i) =>
        `<item type="boardgame" id="${i + 1}"><name type="primary" value="Game ${i + 1}"/></item>`,
    ).join("");
    const searchXml = `<?xml version="1.0" encoding="utf-8"?><items total="21">${searchItems}</items>`;

    const thingItems = [
      `<item type="boardgame" id="1"><thumbnail>https://example.com/1.jpg</thumbnail></item>`,
      ...Array.from(
        { length: 20 },
        (_, i) =>
          `<item type="boardgameexpansion" id="${i + 2}"><thumbnail>https://example.com/${i + 2}.jpg</thumbnail></item>`,
      ),
    ].join("");
    const thingXml = `<?xml version="1.0" encoding="utf-8"?><items>${thingItems}</items>`;

    server.use(
      http.get("/api/bgg/search", () => HttpResponse.xml(searchXml)),
      http.get("/api/bgg/thing", () => HttpResponse.xml(thingXml)),
    );

    // User is on page 2, but only 1 page of filtered results exists
    const { result } = renderHook(
      () => useBggSearch("games", "test-token", 2),
      { wrapper: createWrapper() },
    );

    await waitFor(() =>
      expect(Object.keys(result.current.thingResults).length).toBeGreaterThan(0),
    );
    expect(result.current.totalPages).toBe(1);
    expect(result.current.clampedPage).toBe(1);
  });

  it("shows unfiltered totalPages while thing data is loading", async () => {
    // Delay the thing response
    const delayedThingXml = `<?xml version="1.0" encoding="utf-8"?>
      <items>
        <item type="boardgame" id="13">
          <thumbnail>https://cf.geekdo-images.com/catan_thumb.jpg</thumbnail>
        </item>
        <item type="boardgame" id="42">
          <thumbnail>https://cf.geekdo-images.com/seafarers_thumb.jpg</thumbnail>
        </item>
        <item type="boardgameexpansion" id="99">
          <thumbnail>https://cf.geekdo-images.com/cities_thumb.jpg</thumbnail>
        </item>
      </items>`;

    server.use(
      http.get("/api/bgg/thing", async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return HttpResponse.xml(delayedThingXml);
      }),
    );

    const { result } = renderHook(
      () => useBggSearch("catan", "test-token", 1),
      { wrapper: createWrapper() },
    );

    // Wait for search data but thing data is still loading
    await waitFor(() => expect(result.current.data).toBeDefined());
    // Before thing data arrives, totalPages is based on unfiltered data (3 items = 1 page)
    expect(result.current.totalPages).toBe(1);
    expect(result.current.isThingLoading).toBe(true);

    // After thing data arrives, filtered (2 items = 1 page)
    await waitFor(() => expect(result.current.isThingLoading).toBe(false));
    expect(result.current.totalPages).toBe(1);
  });
});

describe("useBggThumbnails", () => {
  it("fetches thumbnails only after search results are available (enabled: !!ids.length)", async () => {
    const { result, rerender } = renderHook(
      ({ ids }: { ids: string[] }) => useBggThumbnails(ids, "test-token"),
      {
        wrapper: createWrapper(),
        initialProps: { ids: [] as string[] },
      },
    );

    // With empty ids, the query should not fire
    expect(result.current.isLoading).toBe(false);
    expect(result.current.thumbnails).toEqual({});

    // Now provide ids
    rerender({ ids: ["13", "42", "99"] });

    await waitFor(() =>
      expect(Object.keys(result.current.thumbnails).length).toBeGreaterThan(0),
    );
    expect(result.current.thumbnails).toEqual({
      "13": "https://cf.geekdo-images.com/catan_thumb.jpg",
      "42": "https://cf.geekdo-images.com/seafarers_thumb.jpg",
      "99": "https://cf.geekdo-images.com/cities_thumb.jpg",
    });
  });

  it("isFetchingThumbnails is true while the thumbnail request is in flight", async () => {
    // Delay the response to ensure we can observe the loading state
    server.use(
      http.get("/api/bgg/thing", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.xml(`<?xml version="1.0" encoding="utf-8"?>
          <items>
            <item type="boardgame" id="13">
              <thumbnail>https://cf.geekdo-images.com/catan_thumb.jpg</thumbnail>
            </item>
          </items>`);
      }),
    );

    const { result } = renderHook(
      () => useBggThumbnails(["13"], "test-token"),
      { wrapper: createWrapper() },
    );

    // isLoading should be true initially while fetching
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.thumbnails).toEqual({
      "13": "https://cf.geekdo-images.com/catan_thumb.jpg",
    });
  });
});
