import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
      <Search className="size-10" />
      <p className="text-lg">Search for a board game to get started</p>
    </div>
  );
}
