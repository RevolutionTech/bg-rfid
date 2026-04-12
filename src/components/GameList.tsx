import { GameCard } from "@/components/GameCard";
import type { BggGame } from "@/types/bgg";

interface GameListProps {
  games: BggGame[];
}

export function GameList({ games }: GameListProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
