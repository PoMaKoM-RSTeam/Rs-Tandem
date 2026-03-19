import ollama from 'ollama';

export class OllamaService {
  async ask(question: string): Promise<void> {
    const response = await ollama.chat({
      model: 'phi3',
      messages: [{ role: 'user', content: question }],
    });
    console.log(response.message.content);
  }
}
