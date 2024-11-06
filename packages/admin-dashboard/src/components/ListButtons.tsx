import { Button } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

interface ListButtonsProps {
  selected: boolean;
  createRoute: string;
  createLabel: string;
  handleClick: () => void;
}

export const ListButtons = ({ selected, createRoute, createLabel, handleClick }: ListButtonsProps) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex gap-2">
      {selected ? (
        <Button variant="outline" onClick={handleClick}>
          {t('deleteOrCancel')}
        </Button>
      ) : null}
      <Button>
        <NavLink to={createRoute}>{createLabel}</NavLink>
      </Button>
    </div>
  );
};
