import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameRow } from "./GameCard";
import type { BggGame } from "@/types/bgg";

const mockGame: BggGame = { id: "13", name: "Catan" };

describe("GameRow", () => {
  it("renders the game name and BGG ID", () => {
    render(<GameRow game={mockGame} />);

    expect(screen.getByText("Catan")).toBeInTheDocument();
    // The BGG ID appears in the rfidTag string
    expect(
      screen.getByText(
        (content) =>
          content.includes("13") && content.includes("bgstats://"),
      ),
    ).toBeInTheDocument();
  });

  it("renders a placeholder element when thumbnail is undefined", () => {
    render(<GameRow game={mockGame} />);

    const img = screen.getByRole("img", { name: "Catan" });
    expect(img).toBeInTheDocument();
    // When no thumbnail, it should use the placeholder data URI
    expect(img.getAttribute("src")).toContain("data:image/svg+xml");
  });

  it("renders an <img> with the correct src when thumbnail is provided", () => {
    render(
      <GameRow
        game={mockGame}
        thumbnail="https://cf.geekdo-images.com/catan_thumb.jpg"
      />,
    );

    const img = screen.getByRole("img", { name: "Catan" });
    expect(img.getAttribute("src")).toBe(
      "https://cf.geekdo-images.com/catan_thumb.jpg",
    );
  });

  it("copy button calls navigator.clipboard.writeText with the BGG ID", async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    render(<GameRow game={mockGame} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    expect(writeTextMock).toHaveBeenCalledWith(
      "bgstats://app.bgstatsapp.com/addPlay.html?gameId=13",
    );
  });

  it('copy button text changes to "Copied!" after click and resets after timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    render(<GameRow game={mockGame} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    expect(screen.getByText("Copied!")).toBeInTheDocument();

    // Advance timers past the 1500ms timeout
    await act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.queryByText("Copied!")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();

    vi.useRealTimers();
  });
});
