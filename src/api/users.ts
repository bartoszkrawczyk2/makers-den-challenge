import type { Octokit } from "octokit";
import { ghFetch } from "./base";

export type UsersResponse = Awaited<
  ReturnType<Octokit["rest"]["search"]["users"]>
>["data"];

export type GithubUser = UsersResponse["items"][number];

type SearchUsersQuery = {
  searchQuery: string;
  perPage?: number;
};

export const searchUsers = (
  { searchQuery, perPage = 50 }: SearchUsersQuery,
  signal?: AbortSignal
) =>
  ghFetch<UsersResponse>("/search/users", {
    signal,
    query: { q: searchQuery, per_page: perPage },
  });
