import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BggGame } from "@/types/bgg";

interface GameCardProps {
  game: BggGame;
}

export function GameCard({ game }: GameCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(game.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-card p-4 shadow-sm">
      <img
        src={game.thumbnail ?? "https://via.placeholder.com/150?text=No+Image"}
        alt={game.name}
        className="mb-3 h-36 w-36 rounded object-contain"
      />
      <h3 className="mb-1 text-center text-sm font-semibold text-card-foreground">
        {game.name}
      </h3>
      <p className="mb-2 text-xs text-muted-foreground">BGG ID: {game.id}</p>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? (
          <>
            <Check data-icon="inline-start" className="size-3" />
            Copied!
          </>
        ) : (
          <>
            <Copy data-icon="inline-start" className="size-3" />
            Copy ID
          </>
        )}
      </Button>
    </div>
  );
}
