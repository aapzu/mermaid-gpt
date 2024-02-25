import { OpenAI } from 'openai';
import SimpleMdeReact from 'react-simplemde-editor';
import {
  ComponentProps,
  Dispatch,
  ReactPropTypes,
  SetStateAction,
  useMemo,
} from 'react';
import { encodeChat } from 'gpt-tokenizer';

import 'easymde/dist/easymde.min.css';
import './styles.css';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useTheme } from '../ThemeProvider';

type Options = Required<ComponentProps<typeof SimpleMdeReact>>['options'];

export type PromptInputProps = {
  value: string;
  setValue: (value: string) => void;
};

export const PromptInput = ({ value, setValue }: PromptInputProps) => {
  const { actualTheme } = useTheme();

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

  return (
    <SimpleMdeReact
      textareaProps={{ className: 'bg-transparent text-primary' }}
      value={value}
      onChange={setValue}
      options={options}
    />
  );
};
