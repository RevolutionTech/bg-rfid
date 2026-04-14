import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchGames, fetchThumbnails } from "@/api/bgg";
import type { BggGame, ThingResult } from "@/types/bgg";

export const PAGE_SIZE = 20;

export function useBggSearch(query: string, token: string, currentPage: number) {
  const enabled = query.length > 0 && token.length > 0;

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError,
  } = useQuery({
    queryKey: ["bggSearch", query, token],
    queryFn: () => searchGames(query, token),
    enabled,
  });

  const allIds = useMemo(
    () => searchData?.map((g) => g.id) ?? [],
    [searchData],
  );

  const { data: thingData, isLoading: isThingLoading } = useQuery({
    queryKey: ["bggThings", allIds],
    queryFn: () => fetchThumbnails(allIds, token),
    enabled: allIds.length > 0 && token.length > 0,
  });

  // Combined loading: true until both requests have resolved
  const isLoading = enabled && (isSearchLoading || isThingLoading);

  const thingResults: Record<string, ThingResult> = useMemo(
    () => thingData ?? {},
    [thingData],
  );

  // Only compute filtered data once both responses are available
  const filteredData: BggGame[] | undefined = useMemo(() => {
    if (!searchData || !thingData) return undefined;
    return searchData.filter((g) => {
      const thing = thingData[g.id];
      return !thing || thing.type === "boardgame";
    });
  }, [searchData, thingData]);

  const totalPages = useMemo(() => {
    if (!filteredData) return 0;
    return Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  }, [filteredData]);

  const pageGames: BggGame[] = useMemo(() => {
    if (!filteredData) return [];
    const pageIndex = Math.min(currentPage, Math.max(1, totalPages)) - 1;
    const start = pageIndex * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage, totalPages]);

  const thumbnails: Record<string, string> = useMemo(() => {
    const result: Record<string, string> = {};
    for (const [id, thing] of Object.entries(thingResults)) {
      if (thing.thumbnail) {
        result[id] = thing.thumbnail;
      }
    }
    return result;
  }, [thingResults]);

  return {
    data: filteredData,
    pageGames,
    thumbnails,
    totalPages,
    isLoading,
    isError,
  };
}
