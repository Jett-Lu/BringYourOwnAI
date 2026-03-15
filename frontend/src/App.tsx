import { ApiKeyPanel } from './components/ApiKeyPanel';
import { ChatWindow } from './components/ChatWindow';
import { Composer } from './components/Composer';
import { useChat } from './hooks/useChat';

function App() {
  const {
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
    chatLimits
  } = useChat();

  const userTurns = messages.filter((message) => message.role === 'user').length;

  return (
    <main className="app">
      <header className="app-header">
        <h1>BringYourOwnAI</h1>
        <p>Security-first chat orchestration with in-memory API keys only.</p>
      </header>

      <div className="layout">
        <ApiKeyPanel apiKey={apiKey} onApiKeyChange={setApiKey} onClearApiKey={clearApiKey} />
        <ChatWindow messages={messages} isLoading={isLoading} />
      </div>

      <Composer
        input={input}
        maxPromptChars={chatLimits.maxPromptChars}
        isLoading={isLoading}
        canSend={canSend}
        onInputChange={setInput}
        onSend={send}
        onClearConversation={clearConversation}
      />

      <footer className="muted footer">
        <p>
          Turns used: {userTurns}/{chatLimits.maxTurns}. API keys are never persisted.
        </p>
        {error ? <p className="error">{error}</p> : null}
      </footer>
    </main>
  );
}

export default App;
