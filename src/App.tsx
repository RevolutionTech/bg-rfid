import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useBggSearch } from "@/hooks/useBggSearch";
import { SearchBar } from "@/components/SearchBar";
import { GameList } from "@/components/GameList";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Loader2 } from "lucide-react";

function AppContent() {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError, isFetching } = useBggSearch(query);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center gap-8 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        BoardGameGeek Search
      </h1>
      <SearchBar onSearch={setQuery} />
      {isFetching && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Searching…</span>
        </div>
      )}
      {isError && <ErrorState message="Failed to fetch results from BGG." />}
      {!query && !isLoading && <EmptyState />}
      {data && data.length > 0 && <GameList games={data} />}
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
