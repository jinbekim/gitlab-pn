export type FilterKey =
  | "author:" // author_username
  | "assignee:" // assignee_username , assignee_id=any
  | "reviewer:" //reviewer_username
  | "merged-user:" // merged_user_username
  | "approver:" // approver_usernames[]
  | "approved-by:" // approved_by_usernames[]
  | "milestone:" // milestone_title
  | "label:" // label_name[]
  | "my-reaction:" //my_reaction_emoji
  | "draft:"; // draft
export type Operator = "=" | "!=";
export type FilterToken = {
  key: FilterKey;
  operator: Operator;
  value: string;
};

export const stringifyTokenToParam = (token: FilterToken): string => {
  // TODO
  throw new Error("Not implemented");
};
