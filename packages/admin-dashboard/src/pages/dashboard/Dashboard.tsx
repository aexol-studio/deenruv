import {
  DashboardWidgets,
  useWidgetsStore,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  Button,
  DropdownMenuCheckboxItem,
} from '@deenruv/react-ui-devkit';

export const Dashboard = () => {
  const { widgets, setShowWidget } = useWidgetsStore((state) => ({
    widgets: state.widgets,
    setShowWidget: state.setShowWidget,
  }));

  return (
    <div className="px-4 pb-4 pt-2 md:px-8 md:py-4">
      <div className="mb-4 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Add widget</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-42">
            <DropdownMenuLabel>Widgets</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {widgets.map((widget) => (
                <DropdownMenuCheckboxItem
                  key={widget.id}
                  checked={widget.visible}
                  onCheckedChange={(checked) => setShowWidget(widget.id, checked)}
                >
                  {widget.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DashboardWidgets />
    </div>
  );
};
