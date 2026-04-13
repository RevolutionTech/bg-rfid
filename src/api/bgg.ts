import axios from "axios";
import { parseSearchResults, parseThingResults } from "@/lib/parseXml";
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

export async function fetchThumbnails(
  ids: string[],
  token: string,
): Promise<Record<string, string>> {
  if (ids.length === 0) return {};

  const response = await axios.get("/api/bgg/thing", {
    params: { id: ids.join(","), type: "boardgame,boardgameexpansion" },
    headers: { Authorization: `Bearer ${token}` },
    responseType: "text",
  });

  return parseThingResults(response.data);
}
