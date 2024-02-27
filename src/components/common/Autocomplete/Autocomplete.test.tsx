import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Autocomplete } from ".";

describe(Autocomplete.name, () => {
  it("displays data in a dropdown", async () => {
    render(
      <Autocomplete
        minSearchLength={1}
        debounceTime={0}
        asyncData={async () => [{ id: 1, name: "hello item" }]}
      />
    );

    await userEvent.click(screen.getByTestId("input"));
    await userEvent.keyboard("mock");
    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toHaveTextContent("hello item");
    });
  });

  it("displays 'no results' message when data is empty", async () => {
    render(
      <Autocomplete
        minSearchLength={1}
        debounceTime={0}
        asyncData={async () => []}
      />
    );
    await userEvent.click(screen.getByTestId("input"));
    await userEvent.keyboard("mock");
    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toHaveTextContent("No results");
    });
  });

  it("shows thrown errors", async () => {
    render(
      <Autocomplete
        minSearchLength={1}
        asyncData={async () => {
          throw new Error("ThisIsAnError");
        }}
      />
    );
    await userEvent.click(screen.getByTestId("input"));
    await userEvent.keyboard("mock");
    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toHaveTextContent("ThisIsAnError");
    });
  });

  it("passes input query to asyncData callback", async () => {
    const fn = vi.fn().mockImplementation(async () => []);
    render(<Autocomplete minSearchLength={1} asyncData={fn} />);
    await userEvent.click(screen.getByTestId("input"));
    await userEvent.keyboard("search-query");
    await waitFor(() => {
      expect(fn.mock.calls[0]).toEqual(["search-query"]);
    });
  });

  it("doesn't update existing state if asyncData callback returns undefined", async () => {
    const { rerender } = render(
      <Autocomplete asyncData={async () => [{ id: 1, name: "hello item" }]} />
    );
    await userEvent.click(screen.getByTestId("input"));
    await userEvent.keyboard("search-query");
    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toHaveTextContent("hello item");
    });
    rerender(<Autocomplete asyncData={async () => undefined} />);
    await userEvent.keyboard("search-query");
    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toHaveTextContent("hello item");
    });
  });
});
