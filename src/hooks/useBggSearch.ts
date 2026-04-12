import { useQuery } from "@tanstack/react-query";
import { searchGames } from "@/api/bgg";

export function useBggSearch(query: string, token: string) {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["bggSearch", query, token],
    queryFn: () => searchGames(query, token),
    enabled: query.length > 0 && token.length > 0,
  });

  return { data, isLoading, isError, isFetching };
}
