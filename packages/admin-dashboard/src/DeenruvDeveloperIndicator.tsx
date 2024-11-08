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
} from '@deenruv/react-ui-devkit';

export const DeenruvDeveloperIndicator = () => {
  const { viewMarkers, setViewMarkers } = usePluginStore();
  return (
    <div className="fixed bottom-4 right-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="border-primary size-10 rounded-full border-[1px] border-dashed text-[10px]"
          >
            DDP
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>DDP - Deenruv Developer Panel</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center space-x-2">
                <Switch id="markers" checked={viewMarkers} onCheckedChange={setViewMarkers} />
                <label
                  htmlFor="markers"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show markers (ctrl + x)
                </label>
              </div>
            </div>
            <DrawerFooter>
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
