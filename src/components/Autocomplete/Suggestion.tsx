import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";
import { useEffect, useRef } from "react";

type SuggestionProps<T> = {
  active?: boolean;
  index?: number;
  item?: T;
  onClick?: (item: T) => void;
  onHover?: (index: number) => void;
  render?: (item: T) => ReactNode;
};

export const Suggestion = <T,>({
  active,
  children,
  item,
  index,
  onClick,
  onHover,
  render,
}: PropsWithChildren<SuggestionProps<T>>) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    active && ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (item)
    return (
      <li ref={ref} className={clsx("w-full", { "bg-slate-200": active })}>
        <button
          onClick={() => onClick?.(item)}
          className="w-full text-left p-2"
          onMouseEnter={() => onHover?.(index ?? 0)}
        >
          {render?.(item) || children}
        </button>
      </li>
    );

  return <li className="p-2">{children}</li>;
};
