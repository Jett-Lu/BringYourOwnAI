import type { ChatMessage, ChatResponse } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
const FRONTEND_REQUEST_TIMEOUT_MS = 20000;

export const sendChatRequest = async (apiKey: string, messages: ChatMessage[]): Promise<ChatResponse> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FRONTEND_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, messages }),
      signal: controller.signal
    });

    const data = (await response.json()) as ChatResponse & { error?: { message?: string } };

    if (!response.ok) {
      throw new Error(data.error?.message ?? 'Request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please retry.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const clearSession = async (): Promise<void> => {
  await fetch(`${API_BASE_URL}/api/session/clear`, {
    method: 'POST'
  });
};
