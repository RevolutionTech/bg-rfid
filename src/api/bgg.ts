import axios from "axios";
import { parseSearchResults } from "@/lib/parseXml";
import type { BggGame } from "@/types/bgg";

export async function searchGames(
  query: string,
  token: string,
): Promise<BggGame[]> {
  const response = await axios.get("/api/bgg/search", {
    params: { query, type: "boardgame" },
    headers: { Authorization: `Bearer ${token}` },
    responseType: "text",
  });

  if (response.status === 202) {
    throw new axios.AxiosError(
      "BGG is still processing the request",
      "BGG_202",
      response.config,
      response.request,
      response,
    );
  }

  return parseSearchResults(response.data);
}
