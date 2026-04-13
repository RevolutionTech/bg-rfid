import { useState, useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAppToken } from "@/hooks/useAppToken";
import { useBggSearch } from "@/hooks/useBggSearch";
import { useBggThumbnails } from "@/hooks/useBggThumbnails";
import { SearchBar } from "@/components/SearchBar";
import { GameList } from "@/components/GameList";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 20;

function AppContent() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const { token, setToken } = useAppToken();
  const { data, isLoading, isError, isFetching } = useBggSearch(query, token);

  const totalPages = data ? Math.ceil(data.length / PAGE_SIZE) : 0;
  const pageGames = useMemo(() => {
    if (!data) return [];
    const start = page * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page]);

  const pageIds = useMemo(() => pageGames.map((g) => g.id), [pageGames]);
  const { thumbnails, isLoading: thumbnailsLoading } = useBggThumbnails(
    pageIds,
    token,
  );

  const handleSearch = (q: string) => {
    setQuery(q);
    setPage(0);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center gap-8 px-4 py-8">
      <SettingsDialog token={token} onTokenChange={setToken} />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Board Game RFID Lookup
      </h1>
      <SearchBar onSearch={handleSearch} />
      {!token && (
        <p className="text-sm text-muted-foreground">
          Set your BGG app token in Settings (gear icon) to enable search.
        </p>
      )}
      {isFetching && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Searching…</span>
        </div>
      )}
      {isError && <ErrorState message="Failed to fetch results from BGG." />}
      {!query && !isLoading && <EmptyState />}
      {data && data.length > 0 && (
        <>
          <GameList
            games={pageGames}
            thumbnails={thumbnails}
            thumbnailsLoading={thumbnailsLoading}
          />
          {totalPages > 1 && (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
      {data && data.length === 0 && !isFetching && (
        <p className="py-8 text-muted-foreground">
          No results found. Try a different search term.
        </p>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
