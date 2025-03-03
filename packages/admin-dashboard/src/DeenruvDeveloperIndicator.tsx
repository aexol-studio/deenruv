import {
  Button,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  usePluginStore,
  Switch,
  useSettings,
  ScrollArea,
} from '@deenruv/react-ui-devkit';
import { useState } from 'react';

const lightMode = {
  '--background': '0 0% 100%',
  '--foreground': '240 10% 3.9%',

  '--card': '0 0% 100%',
  '--card-foreground': '240 10% 3.9%',

  '--popover': '0 0% 100%',
  '--popover-foreground': '240 10% 3.9%',

  '--primary': '240 5.9% 10%',
  '--primary-foreground': '0 0% 98%',

  '--secondary': '240 4.8% 95.9%',
  '--secondary-foreground': '240 5.9% 10%',

  '--muted': '240 4.8% 95.9%',
  '--muted-foreground': '240 3.8% 46.1%',

  '--accent': '240 4.8% 95.9%',
  '--accent-foreground': '240 5.9% 10%',

  '--destructive': '0 84.2% 60.2%',
  '--destructive-foreground': '0 0% 98%',

  '--border': '240 5.9% 90%',
  '--input': '240 5.9% 90%',
  '--ring': '240 10% 3.9%',

  '--radius': '0.5rem',

  '--warning': '38 92% 50%',
  '--warning-foreground': '48 96% 89%',
};

const darkMode = {
  '--background': '240 10% 3.9%',
  '--foreground': '0 0% 98%',

  '--card': '240 10% 3.9%',
  '--card-foreground': '0 0% 98%',

  '--popover': '240 10% 3.9%',
  '--popover-foreground': '0 0% 98%',

  '--primary': '0 0% 98%',
  '--primary-foreground': '240 5.9% 10%',

  '--secondary': '240 3.7% 15.9%',
  '--secondary-foreground': '0 0% 98%',

  '--muted': '240 3.7% 15.9%',
  '--muted-foreground': '240 5% 64.9%',

  '--accent': '240 3.7% 15.9%',
  '--accent-foreground': '0 0% 98%',

  '--destructive': '0 62.8% 30.6%',
  '--destructive-foreground': '0 0% 98%',

  '--border': '240 3.7% 15.9%',
  '--input': '240 3.7% 15.9%',
  '--ring': '240 4.9% 83.9%',

  '--warning': '48 96% 89%',
  '--warning-foreground': '38 92% 50%',
};

export const DeenruvDeveloperIndicator = () => {
  const { theme } = useSettings();
  const { plugins, viewMarkers, setViewMarkers } = usePluginStore();
  const [colorVariables, setColorVariables] = useState(theme === 'light' ? lightMode : darkMode);

  const updateColor = (key: string, value: string) => {
    setColorVariables((prev) => ({ ...prev, [key]: value }));
  };

  const setColors = () => {
    const root = document.documentElement;
    Object.entries(colorVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  const copyStylesToClipboard = () => {
    const cssVariables = Object.entries(colorVariables)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    navigator.clipboard.writeText(cssVariables).then(() => {
      alert('CSS Variables copied to clipboard!');
    });
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="border-primary flex h-10 w-10 items-center justify-center rounded-full border-dashed text-xs"
          >
            DDP
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-xl">
            <DrawerHeader>
              <DrawerTitle>DDP - Deenruv Developer Panel</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="markers" checked={viewMarkers} onCheckedChange={setViewMarkers} />
                  <label
                    htmlFor="markers"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show markers (ctrl + x)
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-4 md:grid-cols-5 lg:grid-cols-6">
                  {/* {Object.entries(colorVariables).map(([key, value]) => {
                    const [h, s, l] = value.split(' ').map(Number);
                    const hexValue = `#${[h, s, l]
                      .map((v, i) => (i === 0 ? v : Math.round(v)))
                      .map((v) => v.toString(16).padStart(2, '0'))
                      .join('')}`;

                    return (
                      <div key={key} className="flex flex-col items-center gap-2">
                        <label className="text-center text-sm font-medium capitalize">
                          {key.replace('--', '').replace(/-/g, ' ')}
                        </label>
                        <input
                          type="color"
                          value={hexValue}
                          onChange={(e) => {
                            const hex = e.target.value;
                            const r = parseInt(hex.slice(1, 3), 16);
                            const g = parseInt(hex.slice(3, 5), 16);
                            const b = parseInt(hex.slice(5, 7), 16);
                            const hsl = `${r} ${g}% ${b}%`;
                            updateColor(key, hsl);
                          }}
                          className="h-10 w-10 rounded border"
                        />
                      </div>
                    );
                  })} */}
                </div>
                <div className="flex flex-col gap-2">
                  <ScrollArea className="h-[100px]">
                    <div className="flex flex-col gap-2">
                      {plugins.map((plugin) => (
                        <div key={plugin.name} className="flex items-center space-x-2">
                          <label
                            htmlFor={plugin.name}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {plugin.name} ({plugin.version})
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <div className="flex items-center gap-2">
                <Button onClick={setColors} variant="action" className="w-full">
                  Apply styles
                </Button>
                <Button onClick={copyStylesToClipboard} variant="outline" className="w-full">
                  Copy styles
                </Button>
                <Button
                  onClick={() => setColorVariables(theme === 'light' ? lightMode : darkMode)}
                  variant="destructive"
                  className="w-full"
                >
                  Reset styles
                </Button>
              </div>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
