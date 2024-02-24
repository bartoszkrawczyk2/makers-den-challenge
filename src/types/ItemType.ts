export const ItemType = {
  User: "user",
  Repo: "repo",
} as const;

export type ItemType = (typeof ItemType)[keyof typeof ItemType];
