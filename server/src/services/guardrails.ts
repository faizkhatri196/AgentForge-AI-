export interface GuardrailResult {
  passed: boolean;
  content: string; // Sanitized content (PII masked, secrets redacted)
  reason?: string;
}

export class GuardrailService {
  // PII patterns
  private static emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  private static phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  private static creditCardPattern = /\b(?:\d[ -]*?){13,16}\b/g;

  // Secret token patterns (API keys, connection strings)
  private static secretPatterns = [
    /gsk_[a-zA-Z0-9]{40,}/g, // Groq Key
    /sk-[a-zA-Z0-9]{48,}/g,  // OpenAI Key
    /mongodb\+srv:\/\/[^\s]+/g, // MongoDB connection string
    /postgres:\/\/[^\s]+/g // Postgres connection string
  ];

  // Prompt injection keywords
  private static injectionKeywords = [
    'ignore previous instructions',
    'system prompt',
    'you are now',
    'bypass security',
    'ignore safety'
  ];

  public static inspectPrompt(prompt: string): GuardrailResult {
    // 1. Scan for Prompt Injections
    const lowercasePrompt = prompt.toLowerCase();
    const hasInjection = this.injectionKeywords.some(keyword => lowercasePrompt.includes(keyword));
    
    if (hasInjection) {
      return {
        passed: false,
        content: prompt,
        reason: 'Policy Violation: adversarial prompt injection attempt detected.'
      };
    }

    // 2. Mask PII & Secrets
    let sanitized = prompt;
    sanitized = sanitized.replace(this.emailPattern, '[EMAIL_REDACTED]');
    sanitized = sanitized.replace(this.phonePattern, '[PHONE_REDACTED]');
    sanitized = sanitized.replace(this.creditCardPattern, '[CREDIT_CARD_REDACTED]');

    for (const pattern of this.secretPatterns) {
      sanitized = sanitized.replace(pattern, '[SECRET_REDACTED]');
    }

    return {
      passed: true,
      content: sanitized
    };
  }

  public static validateOutput(output: string, contextChunks: string[]): GuardrailResult {
    // Redact secrets in agent outputs
    let sanitized = output;
    for (const pattern of this.secretPatterns) {
      sanitized = sanitized.replace(pattern, '[SECRET_REDACTED]');
    }

    // Hallucination Check: Verify semantic overlap with context
    // If output claims numbers/specs not found in grounding chunks, warn (simplified overlap algorithm)
    if (contextChunks.length > 0) {
      const words = output.toLowerCase().split(/\s+/).filter(w => w.length > 5);
      const matched = words.filter(word => 
        contextChunks.some(chunk => chunk.toLowerCase().includes(word))
      );
      
      const overlapRatio = matched.length / (words.length || 1);
      if (overlapRatio < 0.25) {
        return {
          passed: true, // Let it pass but with a flag/warning
          content: sanitized,
          reason: `Hallucination warning: Low grounding overlap index (${Math.round(overlapRatio * 100)}%).`
        };
      }
    }

    return {
      passed: true,
      content: sanitized
    };
  }
}
