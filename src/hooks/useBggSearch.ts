import { useQuery } from "@tanstack/react-query";
import { searchGames } from "@/api/bgg";

export function useBggSearch(query: string) {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["bggSearch", query],
    queryFn: () => searchGames(query),
    enabled: query.length > 0,
  });

  return { data, isLoading, isError, isFetching };
}
