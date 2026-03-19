interface ComposerProps {
  input: string;
  maxPromptChars: number;
  isLoading: boolean;
  canSend: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClearConversation: () => void;
}

export const Composer = ({
  input,
  maxPromptChars,
  isLoading,
  canSend,
  onInputChange,
  onSend,
  onClearConversation
}: ComposerProps) => {
  const remaining = maxPromptChars - input.length;

  return (
    <form
      className="composer-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
    >
      <label>
        <span className="field-label">Message</span>
        <textarea
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          rows={5}
          placeholder="Ask anything"
          maxLength={maxPromptChars}
          className="chat-textarea"
        />
      </label>
      <div className="composer-actions">
        <span className={`credential-meta ${remaining < 120 ? 'warning' : ''}`}>{remaining} characters remaining</span>
        <div className="action-group">
          <button type="button" className="button secondary" onClick={onClearConversation}>
            Clear Conversation
          </button>
          <button type="submit" className="button primary" disabled={!canSend}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </form>
  );
};
