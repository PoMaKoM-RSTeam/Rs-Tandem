import { Injectable } from '@angular/core';
import ollama, { Ollama } from 'ollama/browser';

@Injectable({ providedIn: 'root' })
export class OllamaService {
  private readonly ollamaClient: Ollama = ollama;

  get client(): Ollama {
    return this.ollamaClient;
  }
}
