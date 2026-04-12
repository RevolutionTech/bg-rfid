import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BggGame } from "@/types/bgg";

interface GameRowProps {
  game: BggGame;
}

export function GameRow({ game }: GameRowProps) {
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
    <tr className="bg-card">
      <td className="px-4 py-3">
        <img
          src={
            game.thumbnail ??
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E"
          }
          alt={game.name}
          className="h-10 w-10 rounded object-contain"
        />
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-foreground">
        {game.name}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{game.id}</span>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={handleCopy}
          >
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
      </td>
    </tr>
  );
}
