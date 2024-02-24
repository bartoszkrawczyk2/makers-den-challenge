import { useEffect, useState } from "react";
import { useDebounced } from "../../utils/useDebounced";

type SuggestionItem = {
  id: string | number;
  name: string;
};

type AutocompleteProps<T> = {
  asyncData?: (query: string) => PromiseLike<T[]>;
};

export const Autocomplete = <T extends SuggestionItem>({
  asyncData,
}: AutocompleteProps<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<T[]>();
  const search = useDebounced(inputValue);

  useEffect(() => {
    // TODO: loading state

    const query = search.trim();
    if (query.length < 3) return;
    asyncData?.(query).then(setSuggestions);
  }, [asyncData, search]);

  return (
    <>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="py-3 px-4 mb-2 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
      />
      <ul>
        {suggestions?.map((item) => (
          <p key={item.id}>{item.name}</p>
        ))}
      </ul>
    </>
  );
};
