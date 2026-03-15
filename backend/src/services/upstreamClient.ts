import { getConfig } from '../config/env.js';
import type { ChatMessage } from '../types/chat.js';
import { AppError } from '../types/errors.js';

interface UpstreamChoice {
  message?: {
    content?: string;
  };
}

interface UpstreamUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

interface UpstreamResponse {
  choices?: UpstreamChoice[];
  usage?: UpstreamUsage;
}

const config = getConfig();

export const requestChatCompletion = async (
  apiKey: string,
  messages: ChatMessage[]
): Promise<{ reply: string; usage?: UpstreamUsage }> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(config.UPSTREAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.UPSTREAM_MODEL,
        messages,
        temperature: 0.7
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new AppError('Upstream model request failed.', 502, 'upstream_error');
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new AppError('Upstream returned unsupported content type.', 502, 'upstream_error');
    }

    const data = (await response.json()) as UpstreamResponse;
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new AppError('Upstream response was empty.', 502, 'upstream_error');
    }

    if (reply.length > config.MAX_MESSAGE_CHARS) {
      throw new AppError('Upstream response exceeded message limits.', 502, 'upstream_error');
    }

    return { reply, usage: data.usage };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new AppError('Upstream request timed out.', 504, 'timeout_error');
    }

    throw new AppError('Unable to reach upstream service.', 502, 'upstream_error');
  } finally {
    clearTimeout(timeout);
  }
};
