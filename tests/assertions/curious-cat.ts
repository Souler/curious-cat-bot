import 'should';

export function isAnonymousUserInfo(object: any) {
    should.exist(object);
    should(object).have.property('id').which.is.a.False();
    should(object).have.property('avatar').which.is.a.String();
    return true;
}

export function isUserInfo(object: any) {
    should.exist(object);
    should(object).have.property('id');
    should(typeof object['id']).be.oneOf('string', 'number');
    should(object).have.property('verified').which.is.a.Boolean();
    should(object).have.property('username').which.is.a.String();
    if (object.hasOwnProperty('twitterid')) {
        if (object['twitterid'] !== false && object['twitterid'] !== null)
            should(object['twitterid']).be.a.String();
    }
    if (object.hasOwnProperty('facebookid')) {
        if (object['facebookid'] !== false && object['facebookid'] !== null)
            should(object['facebookid']).be.a.String();
    }
    should(object).have.property('answers').which.is.a.String();
    should(Number(object['answers'])).be.a.Number();
    should(object).have.property('askboxtext');
    if (object['askboxtext'] !== null)
        should(object['askboxtext']).be.a.String();
    should(object).have.property('avatar').which.is.a.String();
    should(object).have.property('banner').which.is.a.String();
    return true;
}

export function isUserProfilePost(object: any) {
    should.exist(object);
    should(object).have.property('id').which.is.a.Number();
    should(object).have.property('likes').which.is.a.Number();
    should(object).have.property('topic_question').which.is.a.Boolean();
    should(object).have.property('timestamp').which.is.a.Number();
    should(object).have.property('reply').which.is.a.String();
    should(object).have.property('comment').which.is.a.String();
    should(object).have.property('image');
    if (object['image'] !== false)
        should(object['image']).be.a.String();
    should(object).have.property('isquestion').which.is.a.Boolean();
    should(object).have.property('senderData');
    should(object['senderData']).have.property('id');
    if (object['senderData']['id'] === false)
        should(isAnonymousUserInfo(object['senderData'])).be.true();
    else
        should(isUserInfo(object['senderData'])).be.true();
    should(object).have.property('addresseeData');
    should(isUserInfo(object['addresseeData'])).be.true();
    return true;
}

export function isUserProfile(object: any) {
    should.exist(object);
    should(isUserInfo(object)).be.true();
    should(object).have.property('posts').which.is.an.Array();
    should(object['posts'].every(isUserProfilePost)).be.true();
    return true;
}
