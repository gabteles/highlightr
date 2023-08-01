class OpenAIAPI {
  isValidKey(key: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  summarize(apiKey: string, highlights: string[]): Promise<[string, string[]]> {
    console.log('summarizing', highlights)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([`Lorem ipsum. This is a fake summary ${Math.random()}`, ['foo', 'bar']]);
      }, 5000);
    })
  }
}

const instance = new OpenAIAPI();
export default instance;
