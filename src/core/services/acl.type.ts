export type ACLType = string | number;

export type NodeTreeCache = {
    parentEl: HTMLElement | null;
    parentNode: ParentNode | null;
    comment?: Comment;
};
