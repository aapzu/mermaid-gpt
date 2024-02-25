import { FC } from 'react';

import { Checkbox } from './ui/checkbox';

export type PromptInputProps = {
  inputTokenCount?: number;
  outputTokenCount?: number;
  showResponse?: boolean;
  setShowResponse?: (show: boolean) => void;
};

export const EditorFooter: FC<PromptInputProps> = ({
  inputTokenCount = 100,
  outputTokenCount = 100,
  showResponse = false,
  setShowResponse,
}) => {
  return (
    <div className="text-xs text-[#959694] flex justify-between w-full">
      <div>
        <span className="">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={showResponse}
              onCheckedChange={setShowResponse}
            />{' '}
            <label className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Show response text
            </label>
          </div>
        </span>
      </div>
      <div>
        <span className="ml-2.5">input tokens: {inputTokenCount}</span>
        <span className="ml-2.5">output tokens: {outputTokenCount}</span>
      </div>
    </div>
  );
};
