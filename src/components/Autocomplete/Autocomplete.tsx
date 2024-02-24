import { useEffect, useState } from "react";
import { useDebounced } from "../../utils/useDebounced";

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
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<T[]>();
  const search = useDebounced(inputValue);

  useEffect(() => {
    const query = search.trim();
    if (query.length < 3) return;

    setIsLoading(true);
    asyncData?.(query)
      .then(setSuggestions)
      .finally(() => setIsLoading(false));
  }, [asyncData, search]);

  return (
    <div className="relative">
      {isLoading && (
        <span className="absolute right-0.5 bg-slate-50 rounded-lg inset-y-0.5 w-11 flex items-center justify-center">
          <span className="animate-spin block w-5 h-5 rounded-full border-2 border-slate-300 border-t-slate-500" />
        </span>
      )}
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="[&:focus+ul:not(:empty)]:block bg-slate-50 py-3 px-4 mb-2 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
      />
      <ul className="hidden overflow-y-auto max-h-64 absolute inset-x-0 bg-slate-50 border border-gray-300 rounded-lg -mt-1">
        {!suggestions?.length && isLoading && <li>loading...</li>}
        {suggestions?.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
        {suggestions?.length === 0 && <li>no results</li>}
      </ul>
    </div>
  );
};
