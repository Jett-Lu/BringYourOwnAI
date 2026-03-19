import type { ChatMessage, ChatResponse } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
const FRONTEND_REQUEST_TIMEOUT_MS = 20000;

const parseErrorResponse = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.toLowerCase().includes('application/json')) {
    const data = (await response.json()) as { error?: { message?: string } };
    return data.error?.message ?? 'Request failed';
  }

  const text = (await response.text()).trim();
  return text || 'Request failed';
};

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

    if (!response.ok) {
      throw new Error(await parseErrorResponse(response));
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new Error('Server returned an unsupported response format.');
    }

    return (await response.json()) as ChatResponse;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please retry.');
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to reach the backend. Check that the server is running and reachable.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const clearSession = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/session/clear`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Unable to clear the backend session state.');
  }
};
