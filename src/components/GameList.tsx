import { GameRow } from "@/components/GameCard";
import type { BggGame } from "@/types/bgg";

interface GameListProps {
  games: BggGame[];
  thumbnails: Record<string, string>;
}

export function GameList({ games, thumbnails }: GameListProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <div className="divide-y divide-border">
        {games.map((game) => (
          <GameRow
            key={game.id}
            game={game}
            thumbnail={thumbnails[game.id]}
          />
        ))}
      </div>
    </div>
  );
}
