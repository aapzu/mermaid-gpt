import { FC, useCallback } from 'react';

import { Button } from './ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Theme, useTheme } from './ThemeProvider';

const MODELS = [
  'gpt-4-0125-preview',
  'gpt-4-turbo-preview',
  'gpt-4-1106-preview',
  'gpt-4-vision-preview',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-0613',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-4-32k-0613',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-0125',
  'gpt-3.5-turbo-16k-0613',
] as const;

export type Model = (typeof MODELS)[number];

export type Settings = {
  openAiApiKey: string;
  systemPrompt: string;
  model: Model;
  theme: Theme;
};

type SettingsDialogProps = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

export const SettingsDialog: FC<SettingsDialogProps> = ({
  settings,
  setSettings,
}) => {
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      setSettings({
        openAiApiKey: data.get('openAiApiKey') as string,
        systemPrompt: data.get('systemPrompt') as string,
        model: data.get('model') as Model,
        theme: data.get('theme') as Theme,
      });
    },
    [setSettings],
  );

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            className="justify-self-end px-2 py-1 text-xs"
            variant="outline"
          >
            Settings
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="pl-0">
              <DrawerTitle>Settings</DrawerTitle>
            </DrawerHeader>
            <form className="" onSubmit={onSubmit}>
              <div className="py-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="openAiApiKey">OpenAI API Key</Label>
                  <Input
                    type="text"
                    id="openAiApiKey"
                    name="openAiApiKey"
                    defaultValue={settings.openAiApiKey}
                  />
                </div>
              </div>
              <div className="py-2">
                <Label htmlFor="systemPrompt">System prompt</Label>
                <Textarea
                  id="systemPrompt"
                  name="systemPrompt"
                  defaultValue={settings.systemPrompt}
                />
              </div>
              <div className="py-2">
                <Label htmlFor="model">GPT Model</Label>
                <Select defaultValue={settings.model} name="model">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="py-2">
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue={settings.theme} name="theme">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button type="submit">Save</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
