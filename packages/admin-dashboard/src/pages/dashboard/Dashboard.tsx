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
  useTranslation,
} from '@deenruv/react-ui-devkit';

export const Dashboard = () => {
  const { t } = useTranslation('common');
  const { widgets, setShowWidget } = useWidgetsStore((state) => ({
    widgets: state.widgets,
    setShowWidget: state.setShowWidget,
  }));

  return (
    <div className="px-4 pt-2 pb-4 md:px-8 md:py-4">
      <div className="mb-4 flex justify-end">
        {!!widgets.length && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{t('widgets.add')}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-42">
              <DropdownMenuLabel>{t('widgets.title')}</DropdownMenuLabel>
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
        )}
      </div>
      <DashboardWidgets />
    </div>
  );
};
