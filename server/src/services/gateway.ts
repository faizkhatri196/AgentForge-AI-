import axios from 'axios';

export interface GatewayRequest {
  provider: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  apiKey: string;
  baseUrl?: string;
}

export interface GatewayResponse {
  content: string;
  tokensUsed: number;
  cost: number;
  latency: number;
  providerUsed: string;
  modelUsed: string;
}

export class AiGateway {
  // Simple pricing map per 1k tokens
  private static pricingMap: Record<string, { prompt: number; completion: number }> = {
    'gpt-4o': { prompt: 0.005, completion: 0.015 },
    'claude-3-5-sonnet': { prompt: 0.003, completion: 0.015 },
    'gemini-1.5-pro': { prompt: 0.00125, completion: 0.00375 },
    'llama-3.1-70b': { prompt: 0.00059, completion: 0.00079 },
    'deepseek-chat': { prompt: 0.00014, completion: 0.00028 }
  };

  public static async execute(
    req: GatewayRequest,
    fallbackChain: Array<{ provider: string; model: string; apiKey: string }> = [],
    retries = 3
  ): Promise<GatewayResponse> {
    const startTime = Date.now();
    let currentReq = { ...req };
    let attempt = 0;

    while (attempt <= retries) {
      try {
        const responseText = await this.callProvider(currentReq);
        const latency = Date.now() - startTime;
        
        // Simple token estimate (4 characters = 1 token approx)
        const promptChars = currentReq.messages.reduce((acc, m) => acc + m.content.length, 0);
        const promptTokens = Math.ceil(promptChars / 4);
        const completionTokens = Math.ceil(responseText.length / 4);
        const tokensUsed = promptTokens + completionTokens;

        // Calculate Cost
        const rate = this.pricingMap[currentReq.model] || { prompt: 0.002, completion: 0.002 };
        const cost = (promptTokens * rate.prompt + completionTokens * rate.completion) / 1000;

        return {
          content: responseText,
          tokensUsed,
          cost,
          latency,
          providerUsed: currentReq.provider,
          modelUsed: currentReq.model
        };

      } catch (err: any) {
        console.error(`Gateway attempt failed on ${currentReq.provider}/${currentReq.model}:`, err.message);
        
        // Check if rate limited (429) or if we are out of retries
        const isRateLimit = err.response?.status === 429;
        
        if (attempt === retries || isRateLimit) {
          // Trigger Fallback Chain if available
          if (fallbackChain.length > 0) {
            const nextInChain = fallbackChain.shift()!;
            console.log(`[AI GATEWAY] Failing over to ${nextInChain.provider}/${nextInChain.model}`);
            currentReq = {
              provider: nextInChain.provider,
              model: nextInChain.model,
              messages: currentReq.messages,
              apiKey: nextInChain.apiKey
            };
            attempt = 0; // Reset attempts for next in chain
            continue;
          }
          throw new Error(`AI Gateway execution exhausted. Last error: ${err.message}`);
        }
        
        // Exponential backoff
        attempt++;
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 500));
      }
    }

    throw new Error('AI Gateway execution failed unexpectedly.');
  }

  private static async callProvider(req: GatewayRequest): Promise<string> {
    switch (req.provider.toLowerCase()) {
      case 'openai':
        return this.callOpenAi(req);
      case 'anthropic':
        return this.callAnthropic(req);
      case 'gemini':
        return this.callGemini(req);
      case 'groq':
        return this.callGroq(req);
      case 'deepseek':
        return this.callDeepSeek(req);
      case 'ollama':
        return this.callOllama(req);
      default:
        // Generic OpenAI-compatible endpoint helper for OpenRouter, Together, Mistral, Cohere, etc.
        return this.callOpenAiCompatible(req);
    }
  }

  private static async callOpenAi(req: GatewayRequest): Promise<string> {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: req.model,
        messages: req.messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.apiKey}`
        }
      }
    );
    return res.data.choices[0].message.content;
  }

  private static async callAnthropic(req: GatewayRequest): Promise<string> {
    const res = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: req.model,
        max_tokens: 4096,
        messages: req.messages
      },
      {
        headers: {
          'content-type': 'application/json',
          'x-api-key': req.apiKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    return res.data.content[0].text;
  }

  private static async callGemini(req: GatewayRequest): Promise<string> {
    const geminiMessages = req.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${req.model}:generateContent?key=${req.apiKey}`,
      { contents: geminiMessages }
    );
    return res.data.candidates[0].content.parts[0].text;
  }

  private static async callGroq(req: GatewayRequest): Promise<string> {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: req.model,
        messages: req.messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.apiKey}`
        }
      }
    );
    return res.data.choices[0].message.content;
  }

  private static async callDeepSeek(req: GatewayRequest): Promise<string> {
    const res = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: req.model,
        messages: req.messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.apiKey}`
        }
      }
    );
    return res.data.choices[0].message.content;
  }

  private static async callOllama(req: GatewayRequest): Promise<string> {
    const url = req.baseUrl || 'http://localhost:11434';
    const res = await axios.post(`${url}/api/chat`, {
      model: req.model,
      messages: req.messages,
      stream: false
    });
    return res.data.message.content;
  }

  private static async callOpenAiCompatible(req: GatewayRequest): Promise<string> {
    // Maps baseUrls: OpenRouter, Together AI, Mistral, Cohere
    let url = 'https://openrouter.ai/api/v1/chat/completions';
    if (req.provider === 'together') url = 'https://api.together.xyz/v1/chat/completions';
    if (req.provider === 'mistral') url = 'https://api.mistral.ai/v1/chat/completions';
    if (req.provider === 'cohere') url = 'https://api.cohere.ai/v1/chat/completions';

    const res = await axios.post(
      url,
      {
        model: req.model,
        messages: req.messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.apiKey}`
        }
      }
    );
    return res.data.choices[0].message.content;
  }
}
