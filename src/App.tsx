import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { PromptInput } from './components/PromptInput';
import { MermaidDiagram } from './components/MermaidDiagram';
import { Settings } from './components/SettingsDialog';
import { useOpenAIMermaidCompletion } from './hooks/useOpenAIMermaidCompletion';
import { Header } from './components/Header';
import { LoadingBar } from './components/LoadingBar';
import { Toaster } from './components/ui/sonner';

const DEFAULT_SETTINGS: Settings = {
  openAiApiKey: '',
  systemPrompt:
    "You are MermaidGPT, whose sole purpose is to create Mermaid.js diagrams. You are not allowed to answer with anything else except valid Mermaid.js diagram syntax code. The diagrams should be clean, but include everything that's required. Do not wrap the response in a code block.",
  model: 'gpt-4-0125-preview',
};

function App() {
  const [prompt, setPrompt] = useLocalStorage('mermaid-gpt-prompt-text', '');
  const [storedResponse, setStoredResponse] = useLocalStorage(
    'mermaid-gpt-response-text',
    '',
  );
  const [settings, setSettings] = useLocalStorage<Settings>(
    'mermaid-gpt-settings',
    DEFAULT_SETTINGS,
  );

  const { response, sendPrompt, loading, error } = useOpenAIMermaidCompletion({
    apiKey: settings.openAiApiKey || '',
    systemPrompt: settings.systemPrompt || '',
  });

  const onPromptChange = useCallback(
    (prompt: string) => {
      setPrompt(prompt);
      sendPrompt(prompt);
    },
    [sendPrompt, setPrompt],
  );

  useEffect(() => {
    if (response && !loading && !error && response !== storedResponse) {
      setStoredResponse(response);
    }
  }, [error, loading, response, setStoredResponse, storedResponse]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error, prompt, setStoredResponse]);

  return (
    <div className="flex flex-col h-full">
      <Header settings={settings} setSettings={setSettings} />
      <LoadingBar loading={loading} />
      <main className="flex-1">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div className="h-full bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <PromptInput value={prompt} setValue={onPromptChange} />
          </div>
          <div className="h-full bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <MermaidDiagram diagram={storedResponse || ''} />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
