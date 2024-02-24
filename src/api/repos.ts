import type { Octokit } from "octokit";
import { ghFetch } from "./base";

type ReposResponse = Awaited<
  ReturnType<Octokit["rest"]["search"]["repos"]>
>["data"];

export const searchRepos = (q: string, signal?: AbortSignal) =>
  ghFetch<ReposResponse>("/search/repositories", {
    signal,
    query: { q },
  });
