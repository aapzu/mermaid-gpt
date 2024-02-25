import { Dispatch, FC, SetStateAction, useState } from 'react';

import { Settings, SettingsDialog } from './SettingsDialog';

type HeaderProps = {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
};
export const Header: FC<HeaderProps> = ({ settings, setSettings }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <header>
      <div className="bg-indigo-600 p-4 shadow flex justify-between">
        <h1 className="text-lg font-semibold text-white">MermaidGPT</h1>
        <div>
          <button
            className="font-semibold text-white"
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </button>
          <SettingsDialog
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            settings={settings}
            setSettings={setSettings}
          />
        </div>
      </div>
    </header>
  );
};
