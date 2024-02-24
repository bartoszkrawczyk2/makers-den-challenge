import { useCallback, useRef } from "react";
import { Autocomplete } from "./Autocomplete";
import { searchRepos, searchUsers } from "../api";

export const GithubSearch = () => {
  const ac = useRef<AbortController>();

  const fetchData = useCallback(async (query: string) => {
    ac.current?.abort();
    ac.current = new AbortController();
    const signal = ac.current.signal;

    const [repos, users] = await Promise.all([
      searchRepos(query, signal),
      searchUsers(query, signal),
    ]);

    // TODO: sort and optimize
    return [
      ...repos.items,
      ...users.items.map((item) => ({
        ...item,
        name: item.login,
      })),
    ];
  }, []);

  return <Autocomplete asyncData={fetchData} />;
};
