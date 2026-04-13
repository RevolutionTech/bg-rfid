import { useState } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsDialogProps {
  token: string;
  onTokenChange: (token: string) => void;
}

export function SettingsDialog({ token, onTokenChange }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(token);

  const handleOpen = () => {
    setDraft(token);
    setOpen(true);
  };

  const handleSave = () => {
    onTokenChange(draft);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpen}
        aria-label="Settings"
        className="fixed right-4 top-4 text-primary-foreground hover:bg-primary-foreground/20"
      >
        <Settings className="size-5" />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-dialog-title"
            className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <h2
              id="settings-dialog-title"
              className="mb-4 text-lg font-semibold text-card-foreground"
            >
              Settings
            </h2>

            <label
              htmlFor="bgg-token"
              className="mb-1 block text-sm font-medium text-card-foreground"
            >
              BGG App Token
            </label>
            <p className="mb-2 text-xs text-muted-foreground">
              A token is required to make requests to the BoardGameGeek API.
            </p>
            <input
              id="bgg-token"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder="Enter your BGG app token"
              className="mb-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
