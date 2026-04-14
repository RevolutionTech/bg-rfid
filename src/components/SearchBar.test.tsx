import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("renders an input and a submit button", () => {
    render(
      <MemoryRouter>
        <SearchBar onSearch={vi.fn()} />
      </MemoryRouter>,
    );

    expect(
      screen.getByPlaceholderText("Search board games…"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("calls onSearch with the correct value on form submit", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <MemoryRouter>
        <SearchBar onSearch={onSearch} />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText("Search board games…");
    await user.type(input, "catan");
    await user.keyboard("{Enter}");

    expect(onSearch).toHaveBeenCalledWith("catan");
  });

  it("calls onSearch on button click", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <MemoryRouter>
        <SearchBar onSearch={onSearch} />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText("Search board games…");
    await user.type(input, "ticket to ride");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith("ticket to ride");
  });

  it("pre-populates the input with the current q URL param if present", () => {
    render(
      <MemoryRouter initialEntries={["/?q=catan"]}>
        <SearchBar initialQuery="catan" onSearch={vi.fn()} />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(
      "Search board games…",
    ) as HTMLInputElement;
    expect(input.value).toBe("catan");
  });
});
