import { useCallback, useRef } from "react";
import { Autocomplete } from "./Autocomplete";
import { octokit } from "../utils/octokit";

export const GithubSearch = () => {
  const ac = useRef<AbortController>();

  const fetchData = useCallback(async (q: string) => {
    ac.current?.abort();
    ac.current = new AbortController();
    const signal = ac.current.signal;

    const [repos, users] = await Promise.all([
      octokit.rest.search.repos({ request: { signal }, q }),
      octokit.rest.search.users({ request: { signal }, q }),
    ]);

    // TODO: sort and optimize
    return [
      ...repos.data.items,
      ...users.data.items.map((item) => ({
        ...item,
        name: item.login,
      })),
    ];
  }, []);

  return <Autocomplete asyncData={fetchData} />;
};
