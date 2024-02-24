import type { Octokit } from "octokit";
import { ghFetch } from "./base";

type UsersResponse = Awaited<
  ReturnType<Octokit["rest"]["search"]["users"]>
>["data"];

export const searchUsers = (q: string, signal?: AbortSignal) =>
  ghFetch<UsersResponse>("/search/users", {
    signal,
    query: { q },
  });
