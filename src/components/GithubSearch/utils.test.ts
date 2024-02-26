import { describe, expect, it } from "vitest";
import { combineReposAndUsers } from "./utils";
import type { GithubUser } from "../../api/users";
import type { GithubRepo } from "../../api/repos";
import { ItemType } from "../../types";

describe(combineReposAndUsers.name, () => {
  it("maps user's login to name property", () => {
    const result = combineReposAndUsers({
      users: [
        {
          login: "user",
        } as GithubUser,
      ],
      repos: [],
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "user",
        }),
      ])
    );
  });

  it("adds itemType property", () => {
    const result = combineReposAndUsers({
      users: [
        {
          login: "user",
          id: 1,
        } as GithubUser,
      ],
      repos: [
        {
          name: "repo",
          id: 2,
        } as GithubRepo,
      ],
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "user",
          itemType: ItemType.User,
        }),
        expect.objectContaining({
          name: "repo",
          itemType: ItemType.Repo,
        }),
      ])
    );
  });

  it("sorts combined results alphabetically", () => {
    const res = combineReposAndUsers({
      users: [
        {
          login: "a",
        },
        {
          login: "c",
        },
        {
          login: "e",
        },
      ] as GithubUser[],
      repos: [
        {
          name: "b",
        },
        {
          name: "d",
        },
        {
          name: "f",
        },
      ] as GithubRepo[],
    });

    expect(
      res.map(({ name }) => ({
        name,
      }))
    ).toEqual([
      { name: "a" },
      { name: "b" },
      { name: "c" },
      { name: "d" },
      { name: "e" },
      { name: "f" },
    ]);
  });
});
