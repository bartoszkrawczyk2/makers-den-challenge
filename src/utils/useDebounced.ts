import { useEffect, useRef, useState } from "react";

export const useDebounced = <T>(value: T, debounceTimeMs = 350) => {
  const [cached, setCached] = useState(value);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => setCached(value), debounceTimeMs);
  }, [debounceTimeMs, value]);

  return cached;
};
