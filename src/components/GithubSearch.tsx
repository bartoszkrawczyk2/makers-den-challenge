import { useCallback, useRef } from "react";
import { Autocomplete } from "./Autocomplete";
import { searchRepos, searchUsers } from "../api";

export const GithubSearch = () => {
  const ac = useRef<AbortController>();

  const fetchData = useCallback(async (query: string) => {
    ac.current?.abort();
    ac.current = new AbortController();
    const signal = ac.current.signal;

    // TODO: error handling
    const [{ items: reposItems }, users] = await Promise.all([
      searchRepos(query, signal),
      searchUsers(query, signal),
    ]);

    const usersItems = users.items.map((item) => ({
      ...item,
      name: item.login,
    }));

    return [...reposItems, ...usersItems].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, []);

  return (
    <div>
      <label className="inline-block mb-2 font-bold">
        Search Github repos and users
      </label>
      <div className="max-w-80">
        <Autocomplete asyncData={fetchData} />
      </div>
      <p>
        Type at least 3 characters to start searching. Results are sorted
        alphabetically
      </p>
    </div>
  );
};
