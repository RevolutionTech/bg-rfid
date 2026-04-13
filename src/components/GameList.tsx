import { GameRow } from "@/components/GameCard";
import type { BggGame } from "@/types/bgg";

interface GameListProps {
  games: BggGame[];
  thumbnails: Record<string, string>;
  thumbnailsLoading: boolean;
}

export function GameList({ games, thumbnails, thumbnailsLoading }: GameListProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <div className="hidden border-b border-border bg-muted px-4 py-2 text-xs font-medium text-muted-foreground sm:grid sm:grid-cols-[3rem_1fr_1fr]">
        <span className="sr-only">Thumbnail</span>
        <span>Name</span>
        <span>RFID Tag</span>
      </div>
      <div className="divide-y divide-border">
        {games.map((game) => (
          <GameRow
            key={game.id}
            game={game}
            thumbnail={thumbnails[game.id]}
            thumbnailLoading={thumbnailsLoading}
          />
        ))}
      </div>
    </div>
  );
}
