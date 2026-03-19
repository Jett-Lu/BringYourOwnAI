interface ApiKeyPanelProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onClearApiKey: () => void;
}

export const ApiKeyPanel = ({ apiKey, onApiKeyChange, onClearApiKey }: ApiKeyPanelProps) => {
  const hasApiKey = Boolean(apiKey.trim());

  return (
    <section className="key-panel">
      <div className="meta-row">
        <span className="eyebrow">Runtime API key</span>
        <span className="credential-meta">{hasApiKey ? 'Loaded in memory' : 'Not loaded'}</span>
      </div>
      <label>
        <span className="field-label">Provider secret</span>
        <input
          className="text-input"
          type="password"
          value={apiKey}
          onChange={(event) => onApiKeyChange(event.target.value)}
          placeholder="Paste your provider API key"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <p className="credential-meta">Kept in memory only for this active browser session.</p>
      <button type="button" className="button secondary" onClick={onClearApiKey} disabled={!apiKey}>
        Clear API Key
      </button>
    </section>
  );
};
