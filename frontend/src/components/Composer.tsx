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
    <section className="panel">
      <h2>Prompt</h2>
      <textarea
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        rows={5}
        placeholder="Ask the model something..."
        maxLength={maxPromptChars}
      />
      <div className="row">
        <span className={`muted ${remaining < 120 ? 'warning' : ''}`}>{remaining} chars remaining</span>
        <div className="actions">
          <button type="button" className="secondary" onClick={onClearConversation}>
            Clear Conversation
          </button>
          <button type="button" onClick={onSend} disabled={!canSend}>
            {isLoading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </section>
  );
};
