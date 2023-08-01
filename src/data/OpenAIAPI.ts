class OpenAIAPI {
  async isValidKey(key: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/engines/davinci', {
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      });

      return (response.status === 200);
    } catch (e) {
      return false;
    }
  }

  async summarize(apiKey: string, highlights: string[]): Promise<[string, string[]]> {
    const shape = { summary: 'string', hashtags: ['string'] };
    const prompt = `Generate a summary in up to two paragraphs for the following text. Include up to 5 hashtags to represent the content. Return the response as a JSON array with the shape of ${JSON.stringify(shape)}.\nText:"""\n${highlights.join('\n')}\n"""`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      })
    })

    const resBody = await response.json();
    const answer  = JSON.parse(resBody.choices[0].message.content) as { summary: string, hashtags: string[] };
    return [answer.summary, answer.hashtags];
  }
}

const instance = new OpenAIAPI();
export default instance;
