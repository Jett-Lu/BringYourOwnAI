import { useMemo, useState } from 'react';
import { CHAT_LIMITS } from '../state/chatLimits';
import { clearSession, sendChatRequest } from '../services/api';
import type { ChatMessage } from '../types/chat';

export const useChat = () => {
  const [apiKey, setApiKey] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = useMemo(() => {
    const prompt = input.trim();
    const turns = messages.filter((message) => message.role === 'user').length;

    return (
      Boolean(apiKey.trim()) &&
      Boolean(prompt) &&
      !isLoading &&
      prompt.length <= CHAT_LIMITS.maxPromptChars &&
      turns < CHAT_LIMITS.maxTurns &&
      messages.length < CHAT_LIMITS.maxMessages
    );
  }, [apiKey, input, isLoading, messages]);

  const send = async () => {
    const prompt = input.trim();
    if (!canSend || !prompt) {
      return;
    }

    setError(null);
    const snapshot = [...messages];
    const nextMessages: ChatMessage[] = [...snapshot, { role: 'user', content: prompt }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatRequest(apiKey.trim(), nextMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message.');
      setMessages(snapshot);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setError(null);
  };

  const clearApiKey = async () => {
    setApiKey('');
    setMessages([]);
    setInput('');
    setError(null);

    try {
      await clearSession();
    } catch {
      // Key is already cleared locally. Server clear endpoint is best-effort only.
    }
  };

  return {
    apiKey,
    setApiKey,
    input,
    setInput,
    messages,
    isLoading,
    error,
    canSend,
    send,
    clearConversation,
    clearApiKey,
    chatLimits: CHAT_LIMITS
  };
};
