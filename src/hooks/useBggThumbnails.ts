import { useQuery } from "@tanstack/react-query";
import { fetchThumbnails } from "@/api/bgg";

export function useBggThumbnails(ids: string[], token: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["bggThumbnails", ids],
    queryFn: () => fetchThumbnails(ids, token),
    enabled: ids.length > 0 && token.length > 0,
  });

  return { thumbnails: data ?? {}, isLoading };
}
