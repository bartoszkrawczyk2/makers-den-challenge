import type { GithubRepo } from "../../api/repos";
import type { GithubUser } from "../../api/users";
import { ItemType } from "../../types";

export const combineReposAndUsers = (
  users: GithubUser[],
  repos: GithubRepo[]
) => {
  const usersItems = users.map((item) => ({
    ...item,
    name: item.login,
    id: `user-${item.id}`, // avoid potential id conflicts with repos
    userId: item.id,
    itemType: ItemType.User,
  }));

  const reposItems = repos.map((item) => ({
    ...item,
    itemType: ItemType.Repo,
  }));

  return [...reposItems, ...usersItems].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};
