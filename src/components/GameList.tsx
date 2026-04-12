import { GameCard } from "@/components/GameCard";
import type { BggGame } from "@/types/bgg";

interface GameListProps {
  games: BggGame[];
}

export function GameList({ games }: GameListProps) {
  return (
    <div className="flex w-full flex-col divide-y divide-border rounded-lg border border-border">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
