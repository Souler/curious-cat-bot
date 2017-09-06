import 'mocha';
import 'should';
import * as dotenv from 'dotenv';
import * as curiouscat from '../src/types/curious-cat';
import { CuriousCatHttpApi } from '../src/curious-cat-http-api';
import * as curiouscatAssertions from './assertions/curious-cat';

dotenv.config();
const curiouscatToken = process.env['CURIOUSCAT_API_TOKEN'];

describe('CuriousCatHttpApi E2E', function () {
    this.slow(500);
    let api: CuriousCatHttpApi;
    before(async () => {
        api = new CuriousCatHttpApi(curiouscatToken)
        // Init the socket so the first test doens't suffer from the
        // socket initialization delay.
        await api.discoverUsers();
    })

    describe('#discoverUsers', () => {
        it('returns a list of users', async () => {
            const users = await api.discoverUsers();
            should(users).be.an.Array();
            users.forEach(curiouscatAssertions.isUserInfo);
        })
        it('returns two users by default', async () => {
            const users = await api.discoverUsers();
            should(users).be.an.Array().which.has.lengthOf(2);
        })
        it('returns as many elements as count specifies', async () => {
            const users = await api.discoverUsers({ count: 5 });
            should(users).be.an.Array().which.has.lengthOf(5);
        })
    })

    describe('#getUserProfile', () => {
        it('returns the profile of a user', async () => {
            const profile = await api.getUserProfile({ username: 'Anarion' });
            should(curiouscatAssertions.isUserProfile(profile)).be.true();
        })
        it('returns null if unknown userid', async () => {
            const profile = await api.getUserProfile({ username: String(Date.now()) });
            should(profile).be.null();
        })
        it('returns 30 posts by default', async () => {
            const profile = await api.getUserProfile({ username: 'Anarion' });
            should(profile.posts).be.an.Array().which.has.lengthOf(30);
        })
        it('returns as many posts as count specifies', async () => {
            const _count = 10;
            const profile = await api.getUserProfile({ username: 'Anarion', count: _count });
            should(profile.posts).be.an.Array().which.has.lengthOf(_count);
        })
        it('returns posts posted after a specified timestamp', async () => {
            const _timestamp = 1504292458;
            const profile = await api.getUserProfile({ username: 'Anarion', min_timestamp: _timestamp });
            should(profile.posts).be.an.Array();
            should(profile.posts.every(({ timestamp }) => timestamp >= _timestamp)).be.true();
        })
    })

    describe('.getUserProfileUrl', () => {
        it('@TODO')
    })

    describe('.getPostUrl', () => {
        it('@TODO')
    })

    describe('#search', () => {
        it('returns a list of users', async () => {
            const query = 'ana';
            const users = await api.search({ query });
            should(users).be.an.Array();
            users.forEach(curiouscatAssertions.isUserInfo);
        })
        it('returns a list of users matching the search criteria for its username', async () => {
            const query = 'ana';
            const users = await api.search({ query });
            should(users.every(({ username }) => username.toLowerCase().includes(query))).be.true();
        })
        it('returns as many elements as count specifies', async () => {
            const query = 'ana';
            const count = 3;
            const users = await api.search({ query, count });
            should(users).be.an.Array().which.has.lengthOf(count);
        })
        it('returns an empty list if query is shorter than 3 characters', async () => {
            const query0 = '';
            const users0 = await api.search({ query: query0 });
            should(users0).be.an.Array().which.has.lengthOf(0);
            const query1 = 'a';
            const users1 = await api.search({ query: query1 });
            should(users1).be.an.Array().which.has.lengthOf(0);
            const query2 = 'ab';
            const users2 = await api.search({ query: query2 });
            should(users2).be.an.Array().which.has.lengthOf(0);
        })
    })

    describe('#sendQuestion', () => {
        it('@TODO')
    })
})
