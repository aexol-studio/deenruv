import { Input, Card, CardHeader, CardTitle, CardContent } from '@deenruv/react-ui-devkit';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface DiscountRatingCardProps {
  discountByValue: number | undefined;
  onDiscountByChange: (e: ChangeEvent<HTMLInputElement>) => void;
  searchMetricsScoreValue: number | undefined;
  onSearchMetricsScoreChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const DiscountRatingCard: React.FC<DiscountRatingCardProps> = ({
  discountByValue,
  onDiscountByChange,
  searchMetricsScoreValue,
  onSearchMetricsScoreChange,
}) => {
  const { t } = useTranslation('products');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">
          {t('customFields.discountRating.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Input
            type="number"
            step={0.01}
            label={t('customFields.discountRating.discountedBy')}
            placeholder={t('customFields.discountRating.discountedBy')}
            value={discountByValue}
            onChange={onDiscountByChange}
          />
          <Input
            type="number"
            label={t('customFields.discountRating.rating')}
            placeholder={t('customFields.discountRating.rating')}
            value={searchMetricsScoreValue}
            onChange={onSearchMetricsScoreChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
