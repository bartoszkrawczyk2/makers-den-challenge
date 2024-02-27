import { useCallback, useRef } from "react";
import { Autocomplete } from "../common/Autocomplete";
import { searchRepos, searchUsers } from "../../api";
import { ItemType } from "../../types";
import { LucideFolderGit2, LucideCircleUserRound } from "../common/Icon";
import { combineReposAndUsers } from "./utils";
import { AxiosError } from "axios";

export const GithubSearch = () => {
  const ac = useRef<AbortController>();

  const fetchData = useCallback(async (searchQuery: string) => {
    ac.current?.abort();
    ac.current = new AbortController();
    const signal = ac.current.signal;

    try {
      const [{ data: repos }, { data: users }] = await Promise.all([
        searchRepos({ searchQuery }, signal),
        searchUsers({ searchQuery }, signal),
      ]);
      return combineReposAndUsers({ users: users.items, repos: repos.items });
    } catch (error) {
      if (error instanceof AxiosError && error.code === "ERR_CANCELED") {
        return undefined;
      }
      throw error;
    }
  }, []);

  const onSelect = (item: { html_url: string }) => {
    window.open(item.html_url, "_blank");
  };

  return (
    <div>
      <label className="inline-block mb-2 font-bold">
        Search Github repos and users
      </label>
      <div className="max-w-80">
        <Autocomplete
          autoFocus
          asyncData={fetchData}
          onSelect={onSelect}
          renderItem={(item) => (
            <div className="flex items-center gap-2">
              {item.itemType === ItemType.Repo && <LucideFolderGit2 />}
              {item.itemType === ItemType.User && <LucideCircleUserRound />}
              <span className="inline-block flex-1 text-ellipsis text-nowrap whitespace-nowrap min-w-0 overflow-hidden">
                {item.name}
              </span>
            </div>
          )}
        />
      </div>
      <p>
        Type at least 3 characters to start searching. Results are sorted
        alphabetically
      </p>
    </div>
  );
};
