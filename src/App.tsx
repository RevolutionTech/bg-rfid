import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAppToken } from "@/hooks/useAppToken";
import { useBggSearch } from "@/hooks/useBggSearch";
import { SearchBar } from "@/components/SearchBar";
import { GameList } from "@/components/GameList";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

function AppContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  // currentPage is 1-based for the URL
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const { token, setToken } = useAppToken();
  const {
    data,
    pageGames,
    thumbnails,
    totalPages,
    clampedPage,
    isLoading,
    isError,
    isFetching,
    isThingLoading,
  } = useBggSearch(query, token, currentPage);

  // Clamp currentPage in the URL if it exceeds totalPages after filtering
  useEffect(() => {
    if (currentPage !== clampedPage) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (clampedPage <= 1) {
          next.delete("page");
        } else {
          next.set("page", String(clampedPage));
        }
        return next;
      });
    }
  }, [currentPage, clampedPage, setSearchParams]);

  const handleSearch = (q: string) => {
    setSearchParams(q ? { q } : {});
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage <= 1) {
        next.delete("page");
      } else {
        next.set("page", String(newPage));
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SettingsDialog token={token} onTokenChange={setToken} />
      <header className="bg-primary px-4 pb-8 pt-10 text-primary-foreground">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Board Game RFID Lookup
          </h1>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-6 px-4 py-6">
        <SearchBar initialQuery={query} onSearch={handleSearch} />
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
              thumbnailsLoading={isThingLoading}
            />
            {totalPages > 1 && (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={clampedPage <= 1}
                  onClick={() => handlePageChange(clampedPage - 1)}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {clampedPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={clampedPage >= totalPages}
                  onClick={() => handlePageChange(clampedPage + 1)}
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
      </main>
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
