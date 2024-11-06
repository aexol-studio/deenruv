import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  Button,
} from '@deenruv/react-ui-devkit';
import { EllipsisVertical } from 'lucide-react';
import { PropsWithChildren } from 'react';

export const ContextMenu: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} variant={'outline'} className="h-8 w-8">
          <EllipsisVertical size={20} className="cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="bottom" align="end">
        <DropdownMenuGroup>{children}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
