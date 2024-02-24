import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useDebounced } from "../../utils/useDebounced";
import { Spinner } from "./Spinner";
import type { SuggestionItem } from "./types";
import { Suggestion } from "./Suggestion";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { newIndex } from "../../utils/newIndex";

const MIN_SEARCH_LENGTH = 3;

type AutocompleteProps<T> = {
  asyncData?: (query: string) => Promise<T[]>;
  onSelect?: (item: T) => void;
};

export const Autocomplete = <T extends SuggestionItem>({
  asyncData,
  onSelect,
}: AutocompleteProps<T>) => {
  const autocompleteElement = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<T[]>();
  const search = useDebounced(inputValue);

  useOutsideClick(autocompleteElement, () => setIsVisible(false));

  useEffect(() => {
    const query = search.trim();
    if (query.length < MIN_SEARCH_LENGTH) return;

    setIsLoading(true);
    asyncData?.(query)
      .then(setSuggestions)
      .finally(() => setIsLoading(false));
  }, [asyncData, search]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActiveIndex(-1);
    setInputValue(e.target.value);
    setIsVisible(true);
  };

  const handleKeyboard = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Escape") setIsVisible(false);
    if (["ArrowDown", "ArrowUp"].includes(e.code)) {
      e.preventDefault();
      setActiveIndex(newIndex(e.code, activeIndex ?? 0, suggestions || []));
    }
  };

  const onItemClick = (item: T) => {
    onSelect?.(item);
    setActiveIndex(-1);
    setIsVisible(false);
    setSuggestions(undefined);
    setInputValue("");
  };

  const shouldShowDropdown =
    isVisible && inputValue.trim().length >= MIN_SEARCH_LENGTH;

  return (
    <div className="relative" ref={autocompleteElement}>
      <input
        value={inputValue}
        onKeyDown={handleKeyboard}
        onChange={onChange}
        className="bg-slate-50 py-3 px-4 mb-2 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
      />
      {isLoading && <Spinner />}
      {shouldShowDropdown && (
        <ul className="scrollbar empty:hidden overflow-y-auto max-h-72 absolute inset-x-0 bg-slate-50 border border-gray-300 rounded-lg -mt-1">
          {!Array.isArray(suggestions) && isLoading && (
            <Suggestion>Loading...</Suggestion>
          )}
          {suggestions?.map((item, index) => (
            <Suggestion
              active={activeIndex === index}
              key={item.id}
              item={item}
              onClick={onItemClick}
              index={index}
              onHover={setActiveIndex}
            >
              {item.name}
            </Suggestion>
          ))}
          {suggestions?.length === 0 && <Suggestion>No results</Suggestion>}
        </ul>
      )}
    </div>
  );
};
