
export interface ApiError {
    error: string;
}

export interface ApiAcitonResult {
    success: boolean;
}

export interface AnonymousUserInfo {
    id: false,
    avatar: string,
}

export interface UserInfo {
    id: number | string,
    verified: boolean,
    username: string,
    twitterid?: string | false | null,
    facebookid?: string | false | null,
    answers: string,
    askboxtext: string | null,
    avatar: string,
    banner: string,
}

export interface UserProfilePost {
    id: number,
    likes: number,
    topic_question: boolean,
    timestamp: number,
    reply: string,
    comment: string,
    image: string | false,
    isquestion: boolean,
    senderData: UserInfo | AnonymousUserInfo,
    addresseeData: UserInfo,
    liked: false,
}

export type UserProfile = UserInfo & { posts: UserProfilePost[] }

export interface SearcProfilehRequest {
    query: string;
    count?: number;
}

export interface SearcProfilehResponse {
    results: UserInfo[];
}

export interface DiscoverUsersRequest {
    count?: number
}

export interface DiscoverUsersResponse {
    users: UserInfo[];
}

export interface UserProfileRequest {
    username: string;
    min_timestamp?: number;
    count?: number;
}

export type UserProfileResponse = UserProfile

export interface PostCreateRequest {
    addressees: string;
    question: string;
    anon?: boolean;
}
export type PostCreateResponse = ApiAcitonResult
