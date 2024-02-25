import { OpenAI } from 'openai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { encodeChat } from 'gpt-tokenizer';

import { Model, Settings } from '@/components/SettingsDialog';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  name?: string;
  content: string;
};

type UseOpenAIMermaidCompletionOpts = Pick<
  Settings,
  'openAiApiKey' | 'model' | 'systemPrompt'
> & {
  debounceMs?: number;
};

const getTokenCount = (messages: ChatMessage[], model: Model) =>
  encodeChat(messages, model.startsWith('gpt-4') ? 'gpt-4' : 'gpt-3.5-turbo')
    .length;

export const useOpenAIMermaidCompletion = ({
  openAiApiKey,
  model,
  systemPrompt,
  debounceMs = 1000,
}: UseOpenAIMermaidCompletionOpts) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [response, setResponse] = useState<string | undefined>();

  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);

  const streamRef = useRef<Awaited<ReturnType<typeof createStream>>>(null);

  const openai = useRef<OpenAI | null>(null);

  useEffect(() => {
    if (openAiApiKey) {
      openai.current = new OpenAI({
        apiKey: openAiApiKey,
        dangerouslyAllowBrowser: true,
      });
    } else {
      setResponse('You must provide an API key in Settings');
    }
  }, [openAiApiKey]);

  const abortResponse = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.controller.abort();
    }
  }, []);

  const createStream = useCallback(
    async (messages: ChatMessage[]) => {
      abortResponse();

      const stream = await openai.current?.chat.completions.create({
        messages,
        model,
        stream: true,
      });

      return stream;
    },
    [abortResponse, model],
  );

  const submitPrompt = useCallback(
    async (messages: ChatMessage[]) => {
      setError(undefined);
      setLoading(true);
      setResponse('');
      setInputTokens(getTokenCount(messages, model));
      try {
        const stream = await createStream(messages);
        if (!stream) {
          return;
        }
        let outputTokens = 0;
        for await (const chunk of stream) {
          setResponse(
            (currentResponse) =>
              `${currentResponse || ''}${chunk.choices[0]?.delta?.content || ''}`,
          );
          outputTokens++;
        }
        setOutputTokens(outputTokens);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    },
    [createStream, model],
  );

  const sendPrompt = useMemo(
    () =>
      debounce((prompt: string) => {
        if (!systemPrompt) {
          throw new Error(
            'systemPrompt is required for useOpenAIMermaidCompletion',
          );
        }
        return submitPrompt([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ]);
      }, debounceMs),
    [debounceMs, submitPrompt, systemPrompt],
  );

  return {
    sendPrompt,
    abortResponse,
    response,
    loading,
    inputTokens,
    outputTokens,
    error,
  };
};
