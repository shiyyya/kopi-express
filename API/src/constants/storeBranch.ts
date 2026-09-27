export const BRANCH_STATUS = [
    'open',
    'closed',
] as const;
export type BranchStatus = typeof BRANCH_STATUS[number];