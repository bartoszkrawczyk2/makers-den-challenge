import { describe, expect, it } from "vitest";
import { newIndex } from "./utils";

const arr = (length: number) => new Array(length).fill(undefined);

describe(newIndex.name, () => {
  it("returns 0 when currentIndex is last element and direction is ArrowDown", () => {
    expect(newIndex("ArrowDown", 2, arr(3))).toEqual(0);
  });

  it("increments when dir is ArrowDown and currentIndex is not last index", () => {
    expect(newIndex("ArrowDown", 1, arr(3))).toEqual(2);
  });

  it("returns last index when dir is ArrowUp and currentIndex is 0", () => {
    expect(newIndex("ArrowUp", 0, arr(3))).toEqual(2);
  });

  it("decrements when dir is ArrowUp and currentIndex greater than 0", () => {
    expect(newIndex("ArrowUp", 1, arr(3))).toEqual(0);
  });

  it("doesn't increment or decrement if currnent is 0 and array length is 1", () => {
    expect(newIndex("ArrowUp", 0, arr(1))).toEqual(0);
    expect(newIndex("ArrowDown", 0, arr(1))).toEqual(0);
  });
});
