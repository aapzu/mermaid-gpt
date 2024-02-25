import { OpenAI } from 'openai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';

export const useOpenAIMermaidCompletion = ({
  apiKey,
  systemPrompt,
  debounceMs = 1000,
}: {
  apiKey: string;
  debounceMs?: number;
  systemPrompt: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [response, setResponse] = useState<string | undefined>();

  const streamRef = useRef<Awaited<ReturnType<typeof createStream>>>(null);

  const openai = useRef<OpenAI | null>(null);

  useEffect(() => {
    if (apiKey) {
      openai.current = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    }
  }, [apiKey]);

  const abortResponse = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.controller.abort();
    }
  }, []);

  const createStream = useCallback(
    async (messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) => {
      abortResponse();

      const stream = await openai.current?.chat.completions.create({
        messages,
        model: 'gpt-3.5-turbo',
        stream: true,
      });

      return stream;
    },
    [abortResponse],
  );

  const submitPrompt = useCallback(
    async (messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) => {
      setError(undefined);
      setLoading(true);
      setResponse('');
      try {
        const stream = await createStream(messages);
        if (!stream) {
          return;
        }
        for await (const chunk of stream) {
          setResponse(
            (currentResponse) =>
              `${currentResponse || ''}${chunk.choices[0]?.delta?.content || ''}`,
          );
          console.log(chunk.choices[0]?.delta?.content || '');
        }
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    },
    [createStream],
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
    error,
  };
};
