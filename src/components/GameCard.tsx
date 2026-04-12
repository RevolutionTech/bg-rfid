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
    try {
      await navigator.clipboard.writeText(game.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access denied or unavailable
    }
  };

  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-card p-4 shadow-sm">
      <img
        src={
          game.thumbnail ??
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E"
        }
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
