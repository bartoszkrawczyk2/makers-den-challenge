import { ofetch } from "ofetch";
import { Octokit } from "octokit";

type UsersResponse = Awaited<ReturnType<Octokit["rest"]["search"]["users"]>>;

export const searchUsers = (q: string, signal?: AbortSignal) =>
  ofetch<UsersResponse>("https://api.github.com/search/users", {
    signal,
    query: { q },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    },
  });
