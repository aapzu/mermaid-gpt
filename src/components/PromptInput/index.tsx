import SimpleMdeReact from 'react-simplemde-editor';
import { useMemo } from 'react';

import 'easymde/dist/easymde.min.css';
import './styles.css';

export const PromptInput = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  const options = useMemo(
    () => ({
      toolbar: false,
      spellChecker: false,
    }),
    [],
  );

  return (
    <SimpleMdeReact
      className="editor"
      value={value}
      onChange={(value) => {
        console.log(value);
        setValue(value);
      }}
      options={options}
    />
  );
};
