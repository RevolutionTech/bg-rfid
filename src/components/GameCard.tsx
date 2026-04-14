import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiddleTruncate } from "@/components/MiddleTruncate";
import type { BggGame } from "@/types/bgg";

const NO_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

interface GameRowProps {
  game: BggGame;
  thumbnail?: string;
  thumbnailLoading?: boolean;
}

export function GameRow({ game, thumbnail, thumbnailLoading }: GameRowProps) {
  const [copied, setCopied] = useState(false);
  const rfidTag = `bgstats://app.bgstatsapp.com/addPlay.html?gameId=${game.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rfidTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access denied or unavailable
    }
  };

  return (
    <div className="flex items-center gap-3 bg-card px-4 py-4">
      {/* Thumbnail */}
      <div className="shrink-0">
        {thumbnailLoading ? (
          <div className="h-24 w-24 animate-pulse rounded bg-muted sm:h-16 sm:w-16" />
        ) : (
          <img
            src={thumbnail ?? NO_IMAGE_PLACEHOLDER}
            alt={game.name}
            className="h-24 w-24 rounded object-contain sm:h-16 sm:w-16"
          />
        )}
      </div>

      {/* Name + RFID tag: stacked on mobile, side-by-side on sm+ */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <span className="truncate text-sm font-semibold text-foreground sm:w-1/3 sm:shrink-0">
          {game.name}
        </span>
        <MiddleTruncate
          text={rfidTag}
          className="min-w-0 text-xs text-muted-foreground sm:flex-1 sm:text-sm"
        />
      </div>

      {/* Copy button */}
      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <Check data-icon="inline-start" className="size-3" />
            <span className="hidden sm:inline">Copied!</span>
          </>
        ) : (
          <>
            <Copy data-icon="inline-start" className="size-3" />
            <span className="hidden sm:inline">Copy Tag</span>
          </>
        )}
      </Button>
    </div>
  );
}
