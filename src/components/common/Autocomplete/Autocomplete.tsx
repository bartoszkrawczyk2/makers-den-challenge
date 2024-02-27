import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, ReactNode } from "react";
import { useDebounced } from "../../../hooks/useDebounced";
import { Spinner } from "./Spinner";
import type { SuggestionItem } from "./types";
import { Suggestion } from "./Suggestion";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { newIndex } from "./utils";

const DEFAULT_MIN_SEARCH_LENGTH = 3;

type AutocompleteProps<T> = {
  minSearchLength?: number;
  autoFocus?: boolean;
  asyncData?: (query: string) => Promise<T[] | undefined>;
  onSelect?: (item: T) => void;
  renderItem?: (item: T) => ReactNode;
};

export const Autocomplete = <T extends SuggestionItem>({
  asyncData,
  onSelect,
  renderItem,
  autoFocus,
  minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
}: AutocompleteProps<T>) => {
  const autocompleteElement = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<T[]>();
  const search = useDebounced(inputValue);

  useOutsideClick(autocompleteElement, () => setIsVisible(false));

  useEffect(() => {
    const query = search.trim();
    if (query.length < minSearchLength) return;

    setIsLoading(true);
    setErrorMessage(undefined);
    asyncData?.(query)
      .then((results) => {
        if (results) {
          setIsLoading(false);
          setSuggestions(results);
        }
      })
      .catch((e) => {
        setErrorMessage(e?.message || JSON.stringify(e));
        setIsLoading(false);
      });
  }, [asyncData, minSearchLength, search]);

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
      setIsVisible(true);
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
    isVisible && inputValue.trim().length >= minSearchLength;

  return (
    <div className="relative" ref={autocompleteElement}>
      <input
        autoFocus={autoFocus}
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
          {typeof errorMessage !== "undefined" ? (
            <Suggestion>
              <span className="text-red-600">Error: {errorMessage}</span>
            </Suggestion>
          ) : (
            <>
              {suggestions?.map((item, index) => (
                <Suggestion
                  active={activeIndex === index}
                  key={item.id}
                  item={item}
                  onClick={onItemClick}
                  index={index}
                  onSelect={setActiveIndex}
                  render={renderItem}
                >
                  {item.name}
                </Suggestion>
              ))}
              {suggestions?.length === 0 && <Suggestion>No results</Suggestion>}
            </>
          )}
        </ul>
      )}
    </div>
  );
};
