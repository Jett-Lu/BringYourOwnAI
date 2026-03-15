interface ApiKeyPanelProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onClearApiKey: () => void;
}

export const ApiKeyPanel = ({ apiKey, onApiKeyChange, onClearApiKey }: ApiKeyPanelProps) => {
  return (
    <section className="panel">
      <h2>Runtime API Key</h2>
      <p className="muted">Your key is kept in memory only for this active browser session.</p>
      <input
        type="password"
        value={apiKey}
        onChange={(event) => onApiKeyChange(event.target.value)}
        placeholder="Paste your provider API key"
        autoComplete="off"
        spellCheck={false}
      />
      <button type="button" className="secondary" onClick={onClearApiKey} disabled={!apiKey}>
        Clear API Key
      </button>
    </section>
  );
};
