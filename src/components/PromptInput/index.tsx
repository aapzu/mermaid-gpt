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
  defaultValue: string;
  onChange: (value: string) => void;
  showButton: boolean;
  loading: boolean;
};

export const PromptInput = ({
  defaultValue,
  onChange,
  showButton,
  loading,
}: PromptInputProps) => {
  const { actualTheme } = useTheme();

  const [value, setValue] = useState('');

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
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!showButton) {
      onChange(value);
    }
  }, [onChange, showButton, value]);

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
      {showButton && (
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
