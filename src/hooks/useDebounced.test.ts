import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDebounced } from "./useDebounced";

const delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

describe(useDebounced.name, () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook((value: string) => useDebounced(value), {
      initialProps: "initial",
    });
    expect(result.current).toEqual("initial");
  });

  it("debounces until 350ms by default", async () => {
    const { rerender, result } = renderHook(
      (value: string) => useDebounced(value),
      { initialProps: "a" }
    );
    expect(result.current).toEqual("a");
    rerender("ab");
    expect(result.current).toEqual("a");
    rerender("abc");
    expect(result.current).toEqual("a");
    rerender("abcd");
    await delay(365);
    expect(result.current).toEqual("abcd");
  });
});
