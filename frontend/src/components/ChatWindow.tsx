import type { ChatMessage } from '../types/chat';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatWindow = ({ messages, isLoading }: ChatWindowProps) => {
  return (
    <section className="panel chat-window">
      <h2>Conversation</h2>
      <div className="messages" aria-live="polite">
        {messages.length === 0 ? <p className="muted">Start a conversation by sending your first prompt.</p> : null}
        {messages.map((message, index) => (
          <article key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
            <strong>{message.role === 'user' ? 'You' : 'Assistant'}</strong>
            <p>{message.content}</p>
          </article>
        ))}
        {isLoading ? <p className="muted">Assistant is thinking…</p> : null}
      </div>
    </section>
  );
};
