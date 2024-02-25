import { Dispatch, FC, SetStateAction, useState } from 'react';

import { Settings, SettingsDialog } from './SettingsDialog';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { Button } from './ui/button';

type HeaderProps = {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
};
export const Header: FC<HeaderProps> = ({ settings, setSettings }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    // <div className="container mx-auto px-4 md:px-6 lg:px-8">
    //   <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
    //     <NavigationMenu className="flex justify-between w-full">
    //       <NavigationMenuList>
    //         <NavigationMenuItem>
    //           <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
    //             MermaidGPT
    //           </h1>
    //         </NavigationMenuItem>
    //       </NavigationMenuList>
    //       <NavigationMenuList>
    //         <NavigationMenuItem>
    //           <Button onClick={() => setSettingsOpen(true)}>Settings</Button>
    //           <SettingsDialog
    //             isOpen={settingsOpen}
    //             onClose={() => setSettingsOpen(false)}
    //             settings={settings}
    //             setSettings={setSettings}
    //           />
    //         </NavigationMenuItem>
    //       </NavigationMenuList>
    //     </NavigationMenu>
    //   </header>
    // </div>
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
          MermaidGPT
        </h1>
        <div className="ml-auto flex gap-2">
          <SettingsDialog
            settings={settings}
            setSettings={setSettings}
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
        </div>
      </header>
    </div>
  );
};
