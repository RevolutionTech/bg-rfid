import { useQuery } from "@tanstack/react-query";
import { fetchThumbnails } from "@/api/bgg";
import type { ThingResult } from "@/types/bgg";

export function useBggThumbnails(ids: string[], token: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["bggThumbnails", ids],
    queryFn: () => fetchThumbnails(ids, token),
    enabled: ids.length > 0 && token.length > 0,
  });

  const thingResults: Record<string, ThingResult> = data ?? {};
  const thumbnails: Record<string, string> = {};
  for (const [id, result] of Object.entries(thingResults)) {
    if (result.thumbnail) {
      thumbnails[id] = result.thumbnail;
    }
  }

  return { thumbnails, thingResults, isLoading };
}
