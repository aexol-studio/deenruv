import { Routes, Button } from '@deenruv/react-ui-devkit';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  editMode: boolean;
  onCreate: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ editMode, onCreate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('products');

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate(Routes.products.list, { viewTransition: true })}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        {!editMode && (
          <Button variant="action" onClick={onCreate} className="ml-auto">
            {t('add')}
          </Button>
        )}
      </div>
    </>
  );
};
