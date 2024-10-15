import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  Button,
  DropdownMenuCheckboxItem,
} from '@/components/ui';
import { DashboardWidgets, useWidgetsStore } from '@deenruv/react-ui-devkit';

export const Dashboard = () => {
  const { widgets, setShowWidget } = useWidgetsStore((state) => ({
    widgets: state.widgets,
    setShowWidget: state.setShowWidget,
  }));

  return (
    <div>
      <div className="mb-2 flex justify-end">
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
