import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { useBggSearch } from "./useBggSearch";
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
    const { result } = renderHook(() => useBggSearch("", "test-token"), {
      wrapper: createWrapper(),
    });

    // Should not be loading because the query is disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("fetches search results when query is non-empty", async () => {
    const { result } = renderHook(() => useBggSearch("catan", "test-token"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual([
      { id: "13", name: "Catan" },
      { id: "42", name: "Catan: Seafarers" },
    ]);
  });

  it("filters out expansions (result count is lower than total items in the mock response)", async () => {
    // The mock response has 3 items total (2 boardgame + 1 boardgameexpansion)
    // parseSearchResults filters to only boardgame type, so we get 2
    const { result } = renderHook(() => useBggSearch("catan", "test-token"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    // 3 items in the XML but only 2 returned (expansion filtered out)
    expect(result.current.data).toHaveLength(2);
  });

  it("returns correct totalPages for a result set larger than 20", async () => {
    // Create a response with 25 boardgame items
    const items = Array.from(
      { length: 25 },
      (_, i) =>
        `<item type="boardgame" id="${i + 1}"><name type="primary" value="Game ${i + 1}"/></item>`,
    ).join("");
    const xml = `<?xml version="1.0" encoding="utf-8"?><items total="25">${items}</items>`;

    server.use(http.get("/api/bgg/search", () => HttpResponse.xml(xml)));

    const { result } = renderHook(() => useBggSearch("games", "test-token"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    const PAGE_SIZE = 20;
    const totalPages = Math.ceil(result.current.data!.length / PAGE_SIZE);
    expect(totalPages).toBe(2);
  });
});

describe("useBggThumbnails", () => {
  it("fetches thumbnails only after search results are available (enabled: !!ids.length)", async () => {
    const { result, rerender } = renderHook(
      ({ ids }: { ids: string[] }) => useBggThumbnails(ids, "test-token"),
      {
        wrapper: createWrapper(),
        initialProps: { ids: [] },
      },
    );

    // With empty ids, the query should not fire
    expect(result.current.isLoading).toBe(false);
    expect(result.current.thumbnails).toEqual({});

    // Now provide ids
    rerender({ ids: ["13", "42"] });

    await waitFor(() =>
      expect(Object.keys(result.current.thumbnails).length).toBeGreaterThan(0),
    );
    expect(result.current.thumbnails).toEqual({
      "13": "https://cf.geekdo-images.com/catan_thumb.jpg",
      "42": "https://cf.geekdo-images.com/seafarers_thumb.jpg",
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
