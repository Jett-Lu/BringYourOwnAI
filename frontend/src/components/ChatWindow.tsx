import type { ChatMessage } from '../types/chat';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatWindow = ({ messages, isLoading }: ChatWindowProps) => {
  const hasConversation = messages.length > 0 || isLoading;

  return (
    <div className="chat-window" aria-live="polite">
      {!hasConversation ? (
        <div className="chat-empty-state">
          <div>
            <strong>No conversation yet</strong>
            <p>Add your API key, send a prompt, and the assistant response will appear here.</p>
          </div>
        </div>
      ) : null}

      {messages.map((message, index) => (
        <article key={`${message.role}-${index}`} className={`message-card ${message.role}`}>
          <div className="message-role">{message.role === 'user' ? 'You' : 'Assistant'}</div>
          <div className="message-content">{message.content}</div>
        </article>
      ))}

      {isLoading ? (
        <article className="message-card assistant">
          <div className="message-role">Assistant</div>
          <div className="chat-status">Thinking...</div>
        </article>
      ) : null}
    </div>
  );
};
