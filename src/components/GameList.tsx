import { GameRow } from "@/components/GameCard";
import type { BggGame } from "@/types/bgg";

interface GameListProps {
  games: BggGame[];
  thumbnails: Record<string, string>;
  thumbnailsLoading: boolean;
}

export function GameList({ games, thumbnails, thumbnailsLoading }: GameListProps) {
  return (
    <table className="w-full border-collapse overflow-hidden rounded-lg border border-border text-left">
      <thead>
        <tr className="border-b border-border bg-muted text-xs font-medium text-muted-foreground">
          <th className="px-4 py-2"><span className="sr-only">Thumbnail</span></th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">RFID Tag</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {games.map((game) => (
          <GameRow
            key={game.id}
            game={game}
            thumbnail={thumbnails[game.id]}
            thumbnailLoading={thumbnailsLoading}
          />
        ))}
      </tbody>
    </table>
  );
}
