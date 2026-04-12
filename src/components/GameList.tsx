import { GameRow } from "@/components/GameCard";
import type { BggGame } from "@/types/bgg";

interface GameListProps {
  games: BggGame[];
}

export function GameList({ games }: GameListProps) {
  return (
    <table className="w-full border-collapse overflow-hidden rounded-lg border border-border text-left">
      <thead>
        <tr className="border-b border-border bg-muted text-xs font-medium text-muted-foreground">
          <th className="px-4 py-2" />
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">BGG ID</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {games.map((game) => (
          <GameRow key={game.id} game={game} />
        ))}
      </tbody>
    </table>
  );
}
