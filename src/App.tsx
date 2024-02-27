import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { pick } from 'lodash';
import { Resizable } from 're-resizable';

import { PromptInput } from './components/PromptInput';
import { MermaidDiagram } from './components/MermaidDiagram';
import { Settings } from './components/SettingsDialog';
import { useOpenAIMermaidCompletion } from './hooks/useOpenAIMermaidCompletion';
import { Header } from './components/Header';
import { LoadingBar } from './components/LoadingBar';
import { Toaster } from './components/ui/sonner';
import { EditorFooter } from './components/EditorFooter';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { ThemeProvider } from './components/ThemeProvider';

const DEFAULT_SETTINGS: Settings = {
  openAiApiKey: '',
  systemPrompt:
    "You are MermaidGPT, whose sole purpose is to create Mermaid.js diagrams. You are not allowed to answer with anything else except valid Mermaid.js diagram syntax code. The diagrams should be clean, but include everything that's required. Do not wrap the response in a code block.",
  model: 'gpt-4-0125-preview',
  theme: 'system',
  autoCompilation: false,
};

const percentageToPixels = (percentage: string, el: HTMLElement) => {
  const parentWidth = el.parentElement?.offsetWidth || 0;
  return (parentWidth * parseInt(percentage)) / 100;
};

function App() {
  const [prompt, setPrompt] = useLocalStorage(
    'mermaid-gpt-prompt-text',
    'A sequence diagram with three actors. Add some random content.',
  );
  const [storedResponse, setStoredResponse] = useLocalStorage(
    'mermaid-gpt-response-text',
    '',
  );
  const [settings, setSettings] = useLocalStorage<Settings>(
    'mermaid-gpt-settings',
    DEFAULT_SETTINGS,
  );
  const [leftPanelWidth, setLeftPanelWidth] = useLocalStorage<string | number>(
    'mermaid-gpt-left-panel-width',
    '50%',
  );

  const [showResponse, setShowResponse] = useState(false);

  const { response, sendPrompt, loading, error, inputTokens, outputTokens } =
    useOpenAIMermaidCompletion({
      ...pick(settings, ['openAiApiKey', 'model', 'systemPrompt']),
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
    <ThemeProvider theme={settings.theme}>
      <div className="flex flex-col h-full">
        <Header settings={settings} setSettings={setSettings} />
        <LoadingBar loading={loading} />
        <main className="w-full pt-2 px-4 pb-4 md:pb-6 md:pb-6 lg:px-8 flex-1 flex">
          <Resizable
            size={{ width: leftPanelWidth, height: '100%' }}
            minWidth="20%"
            maxWidth="80%"
            onResizeStop={(_e, _direction, ref, d) => {
              const currentWidth =
                typeof leftPanelWidth === 'string'
                  ? percentageToPixels(leftPanelWidth, ref)
                  : leftPanelWidth;
              setLeftPanelWidth(currentWidth + d.width);
            }}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
          >
            <Card className="h-full flex flex-col mr-3">
              <CardHeader>
                <CardTitle>Prompt</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <PromptInput
                  defaultValue={showResponse ? storedResponse : prompt}
                  onChange={showResponse ? setStoredResponse : onPromptChange}
                  showButton={!settings.autoCompilation && !showResponse}
                  loading={loading}
                />
              </CardContent>
              <CardFooter>
                <EditorFooter
                  inputTokenCount={inputTokens}
                  outputTokenCount={outputTokens}
                  showResponse={showResponse}
                  setShowResponse={setShowResponse}
                />
              </CardFooter>
            </Card>
          </Resizable>
          <Card className="h-full flex flex-col ml-3 flex-1">
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <MermaidDiagram diagram={storedResponse || ''} />
            </CardContent>
          </Card>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
