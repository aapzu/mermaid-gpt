import { Dispatch, FC, SetStateAction } from 'react';

import { Settings, SettingsDialog } from './SettingsDialog';

type HeaderProps = {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
};
export const Header: FC<HeaderProps> = ({ settings, setSettings }) => {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
          MermaidGPT
        </h1>
        <div className="ml-auto flex gap-2">
          <SettingsDialog settings={settings} setSettings={setSettings} />
        </div>
      </header>
    </div>
  );
};
