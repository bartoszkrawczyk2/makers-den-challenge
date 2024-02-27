import type { Octokit } from "octokit";
import { ghFetch } from "./base";

export type ReposResponse = Awaited<
  ReturnType<Octokit["rest"]["search"]["repos"]>
>["data"];

export type GithubRepo = ReposResponse["items"][number];

type SearchReposQuery = {
  searchQuery: string;
  perPage?: number;
};

export const searchRepos = (
  { searchQuery, perPage = 50 }: SearchReposQuery,
  signal?: AbortSignal
) =>
  ghFetch<ReposResponse>("/search/repositories", {
    signal,
    params: { q: searchQuery, per_page: perPage },
  });
