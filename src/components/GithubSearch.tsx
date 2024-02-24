import { useCallback, useRef } from "react";
import { Autocomplete } from "./Autocomplete";
import { searchRepos, searchUsers } from "../api";
import { ItemType } from "../types";
import { LucideFolderGit2, LucideCircleUserRound } from "./Icon";

export const GithubSearch = () => {
  const ac = useRef<AbortController>();

  const fetchData = useCallback(async (query: string) => {
    ac.current?.abort();
    ac.current = new AbortController();
    const signal = ac.current.signal;

    // TODO: error handling
    const [repos, users] = await Promise.all([
      searchRepos(query, signal),
      searchUsers(query, signal),
    ]);

    // TODO: move to a function
    const usersItems = users.items.map((item) => ({
      ...item,
      name: item.login,
      id: `user-${item.id}`, // avoid potential id conflicts with repos
      userId: item.id,
      itemType: ItemType.User,
    }));

    const reposItems = repos.items.map((item) => ({
      ...item,
      itemType: ItemType.Repo,
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
        <Autocomplete
          asyncData={fetchData}
          onSelect={(item) => console.log("Selected:", item)}
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
