import type { PropsWithChildren } from "react";

type SuggestionProps<T> = {
  item?: T;
  onClick?: (item: T) => void;
};

export const Suggestion = <T,>({
  children,
  item,
  onClick,
}: PropsWithChildren<SuggestionProps<T>>) => {
  if (item)
    return (
      <li className="w-full">
        <button
          onClick={() => onClick?.(item)}
          className="w-full text-left p-2"
        >
          {children}
        </button>
      </li>
    );

  return <li className="p-2">{children}</li>;
};
