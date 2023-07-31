class OpenAIAPI {
  isValidKey(key: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  summarize(apiKey: string, highlights: string[]): Promise<[string, string[]]> {
    return Promise.resolve(['Lorem ipsum. This is a fake summary' + Math.random().toString(), ['foo', 'bar']]);
  }
}

const instance = new OpenAIAPI();
export default instance;
