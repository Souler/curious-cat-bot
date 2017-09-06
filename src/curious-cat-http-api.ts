import * as request from 'request';
import * as requestPromise from 'request-promise-native';
import * as curiouscat from './types/curious-cat';

export class CuriousCatHttpApiError extends Error {}

export class CuriousCatHttpApi {
    protected client: request.RequestAPI<requestPromise.RequestPromise, requestPromise.RequestPromiseOptions, request.RequiredUriUrl>;

    constructor(authorizationToken: string) {
        this.client = requestPromise.defaults({
            baseUrl: 'https://api.curiouscat.me/v2/',
            forever: true,
            gzip: true,
            transform: (body, response) => {
                if (response.headers['content-type'].indexOf('application/json') === 0)
                    body = JSON.parse(body);
                return Promise.resolve(body);
            },
            headers: {
                'origin': 'https://curiouscat.me',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
                'authority': 'api.curiouscat.me',
                'authorization': `Basic ${authorizationToken}`,
            },
        })
    }

    protected async api<T>(request: request.Options): Promise<T> {
        const res = await this.client(request);
        if (res.error)
            return Promise.reject(new CuriousCatHttpApiError(res.error));
        return res as T;
    }

    /**
     * Retrieves a random users list.
     * @param options.count - Max lenght of the list that will be returned
     */
    discoverUsers({ count = 2 }: curiouscat.DiscoverUsersRequest = {}): Promise<curiouscat.UserInfo[]> {
        return this.api<curiouscat.DiscoverUsersResponse>({
            method: 'GET',
            url: '/discover/users',
            qs: { count }
        }).then(res => res.users);
    }


    /**
     * Retrieves the full profile of the user identified by username.
     * @param options.username - Username to check
     * @param options.count - Allows to determine how many posts at max will be available at the user info.
     * @param options.min_timestamp - Only posts sent after this timestamp will be included on the result.
     */
    getUserProfile({ username, count = 30, min_timestamp = 0 }: curiouscat.UserProfileRequest): Promise<curiouscat.UserProfile> {
        return this.api<curiouscat.UserProfileResponse>({
            method: 'GET',
            url: '/profile',
            qs: {
                username,
                count,
                min_timestamp,
            }
        }).catch((error) =>  null);
    }

    /**
     * Returns the url of the profile page of the given user. If no username
     * is provided, returns null.
     */
    static getUserProfileUrl({ username }: { username: string }) {
        if (!username)
            return null;
        return `https://curiouscat.me/${username}`;
    }

    /**
     * Returns the url of the post for the given username and postId. If no username
     * or postId is provided, returns null.
     */
    static getPostUrl({ username, postId }: { username: string, postId: number }) {
        if (!username || !postId)
            return null;
        const profileUrl = this.getUserProfileUrl({ username });
        return `${profileUrl}/post/${postId}`
    }

    /**
     * Search by username.
     * @param param0
     */
    search({ query, count = 10 }: curiouscat.SearcProfilehRequest): Promise<curiouscat.UserInfo[]> {
        if (!query || query.length < 3)
            return Promise.resolve([]);
        return this.api<curiouscat.SearcProfilehResponse>({
            method: 'GET',
            url: '/search/profile',
            qs: {
                search: query,
                count,
            }
        }).then(res => res.results);
    }


    /**
     * Sends a question to the user identified by addreseeId as an anon.
     * @param options.addresees - The id of the user this question is directed to.
     * @param options.quetsion - The contents of the question itself
     */
    sendQuestion({ addressees, question, anon = true }: curiouscat.PostCreateRequest): Promise<void> {
        return this.api<curiouscat.PostCreateResponse>({
            method: 'POST',
            url: '/post/create',
            form: {
                addressees,
                anon: true,
                question,
            },
            headers: {
                'authorization': null,
            },
        }).then((res) => {
            if (res.success !== true)
                return Promise.reject('Unknown error');
        });
    }
}
