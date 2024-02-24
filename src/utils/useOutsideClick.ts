import { RefObject, useEffect } from "react";

export const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent) => void
) => {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!target || !target.isConnected) {
        return;
      }

      const isOutside = ref.current && !ref.current.contains(target);

      if (isOutside) {
        handler(e);
      }
    };

    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, [handler, ref]);
};
