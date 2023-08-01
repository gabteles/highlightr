import nock from 'nock';
import OpenAIAPI from './OpenAIAPI';

describe('OpenAIAPI', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('calls an API endpoint to check if a key is valid', async () => {
    const scope = nock('https://api.openai.com')
      .persist()
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
        'access-control-allow-credentials': 'true',
      })
      .options(/^\//)
      .reply(200)
      .get('/v1/engines/davinci')
      .reply(200)
      .get('/v1/engines/davinci')
      .reply(401);

    const result1 = await OpenAIAPI.isValidKey('test');
    expect(result1).toBe(true);
    const result2 = await OpenAIAPI.isValidKey('test');
    expect(result2).toBe(false);
    scope.done();
  });

  it('calls an API endpoint to summarize text', async () => {
    const scope = nock('https://api.openai.com')
      .persist()
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
        'access-control-allow-credentials': 'true',
      })
      .options(/^\//)
      .reply(200)
      .post('/v1/chat/completions')
      .reply(200, {
        choices: [{
          message: {
            content: JSON.stringify({
              summary: 'This is a summary',
              hashtags: ['hashtag1', 'hashtag2'],
            }),
          },
        }],
      });

    const result = await OpenAIAPI.summarize('test', ['This is a test']);
    expect(result).toEqual(['This is a summary', ['hashtag1', 'hashtag2']]);
    scope.done();
  });
});
