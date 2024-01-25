export type CommentType = {
    ID: number;
    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt: Date;
    body: string;
    threadID: number;
    userID: number;
    user: UserType;
};

export type ThreadType = {
    ID: number;
    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt: Date;
    title: string;
    body: string;
    userID: number;
    user: UserType;
    tags: TagType[];
    comments: CommentType[];
    votes: VoteType[];
};

export type TagType = {
    ID: number;
    name: string;
    threads: ThreadType[];
};

export type VoteType = {
    threadID: number;
    userID: number;
    vote: number;
    CreatedAt: Date;
};

export type UserType = {
    ID: number;
    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt: Date;
    username: string;
    password: string;
    threads: ThreadType[];
    comments: CommentType[];
    votes: VoteType[];
};

export type GenericResponseType = {
    status: string;
    data: never;
    message: string;
};

export type AuthResponseType = {
    accessToken: string;
    refreshToken: string;
    username: string;
    userID: number;
};
