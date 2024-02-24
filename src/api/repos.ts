import { ofetch } from "ofetch";
import { Octokit } from "octokit";

type ReposResponse = Awaited<ReturnType<Octokit["rest"]["search"]["repos"]>>;

export const searchRepos = (q: string, signal?: AbortSignal) =>
  ofetch<ReposResponse>("https://api.github.com/search/repositories", {
    signal,
    query: { q },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    },
  });
