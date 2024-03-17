import { SimpleMdeReact } from 'react-simplemde-editor';
import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import 'easymde/dist/easymde.min.css';
import './styles.css';

import { useTheme } from '../ThemeProvider';
import { Button } from '../ui/button';

type Options = Required<ComponentProps<typeof SimpleMdeReact>>['options'];

export type PromptInputProps = {
  defaultPromptValue: string;
  defaultResponseValue: string;
  onPromptChange: (value: string) => void;
  onResponseChange: (value: string) => void;
  showResponse: boolean;
  autoCompile: boolean;
  loading: boolean;
};

export const PromptInput = ({
  defaultPromptValue,
  defaultResponseValue,
  onPromptChange,
  onResponseChange,
  showResponse,
  autoCompile,
  loading,
}: PromptInputProps) => {
  const { actualTheme } = useTheme();

  const [promptValue, setPromptValue] = useState('');
  const [responseValue, setResponseValue] = useState('');

  const defaultValue = useMemo(
    () => (showResponse ? defaultResponseValue : defaultPromptValue),
    [defaultPromptValue, defaultResponseValue, showResponse],
  );

  const value = useMemo(
    () => (showResponse ? responseValue : promptValue),
    [promptValue, responseValue, showResponse],
  );

  const setValue = useMemo(
    () => (showResponse ? setResponseValue : setPromptValue),
    [showResponse],
  );

  const onChange = useMemo(
    () => (showResponse ? onResponseChange : onPromptChange),
    [onPromptChange, onResponseChange, showResponse],
  );

  const options: Options = useMemo(
    () => ({
      toolbar: false,
      spellChecker: false,
      status: false,
      autoDownloadFontAwesome: false,
      uploadImage: false,
      theme: actualTheme === 'dark' ? 'twilight' : 'easymd',
    }),
    [actualTheme],
  );

  useEffect(() => {
    setPromptValue(defaultPromptValue);
    setResponseValue(defaultResponseValue);
  }, [defaultPromptValue, defaultResponseValue]);

  useEffect(() => {
    if (
      autoCompile &&
      !loading &&
      !!value.trim() &&
      value.trim() !== defaultValue.trim()
    ) {
      onChange(value);
    }
  }, [autoCompile, defaultValue, loading, onChange, value]);

  const onCompileClick = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <div className="relative h-full">
      <SimpleMdeReact
        className="editor"
        value={value}
        onChange={setValue}
        options={options}
      />
      {!autoCompile && !showResponse && (
        <Button
          className="absolute right-2 bottom-2"
          size="sm"
          onClick={onCompileClick}
          disabled={loading || !value.trim() || value === defaultValue}
        >
          Compile
        </Button>
      )}
    </div>
  );
};
