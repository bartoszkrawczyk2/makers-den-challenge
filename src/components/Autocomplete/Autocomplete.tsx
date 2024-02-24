import { useEffect, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useDebounced } from "../../utils/useDebounced";

const MIN_SEARCH_LENGTH = 3;

type SuggestionItem = {
  id: string | number;
  name: string;
};

type AutocompleteProps<T> = {
  asyncData?: (query: string) => Promise<T[]>;
};

export const Autocomplete = <T extends SuggestionItem>({
  asyncData,
}: AutocompleteProps<T>) => {
  // TODO: too much state, probably should use useReducer
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<T[]>();
  const search = useDebounced(inputValue);

  useEffect(() => {
    const query = search.trim();
    if (query.length < MIN_SEARCH_LENGTH) return;

    setIsLoading(true);
    asyncData?.(query)
      .then(setSuggestions)
      .finally(() => setIsLoading(false));
  }, [asyncData, search]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsVisible(true);
  };

  const handleKeyboard = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Escape") setIsVisible(false);
  };

  const shouldShowDropdown =
    isVisible && inputValue.trim().length >= MIN_SEARCH_LENGTH;

  return (
    <div className="relative">
      {isLoading && (
        <span className="absolute right-0.5 bg-slate-50 rounded-lg inset-y-0.5 w-11 flex items-center justify-center">
          <span className="animate-spin block w-5 h-5 rounded-full border-2 border-slate-300 border-t-slate-500" />
        </span>
      )}
      <input
        value={inputValue}
        onKeyUp={handleKeyboard}
        onChange={onChange}
        onBlur={() => setIsVisible(false)}
        className="bg-slate-50 py-3 px-4 mb-2 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
      />
      {shouldShowDropdown && (
        <ul className="empty:hidden overflow-y-auto max-h-64 absolute inset-x-0 bg-slate-50 border border-gray-300 rounded-lg -mt-1">
          {!suggestions?.length && isLoading && <li>loading...</li>}
          {suggestions?.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
          {suggestions?.length === 0 && <li>no results</li>}
        </ul>
      )}
    </div>
  );
};
