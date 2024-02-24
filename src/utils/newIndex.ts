type Dir = "ArrowDown" | "ArrowUp" | (string & Record<never, never>);

export const newIndex = (dir: Dir, currentIndex: number, arr: unknown[]) => {
  if (dir === "ArrowDown") {
    return currentIndex >= arr.length - 1 ? 0 : currentIndex + 1;
  }

  if (dir === "ArrowUp") {
    return currentIndex <= 0 ? arr.length - 1 : currentIndex - 1;
  }

  return currentIndex;
};
