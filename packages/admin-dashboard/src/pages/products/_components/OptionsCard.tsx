import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components';

interface OptionsCardProps {
  optionGroups: { name: string; group: { name: string } }[] | undefined;
}

export const OptionsCard: React.FC<OptionsCardProps> = ({ optionGroups: options }) => {
  const { t } = useTranslation('products');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('options')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {options?.map((o) => (
              <TableRow key={o.name}>
                <TableCell className="font-semibold">{o.group.name}</TableCell>
                <TableCell>{o.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button size={'sm'} className="mt-4">
          {t('editOptions')}
        </Button>
      </CardContent>
    </Card>
  );
};
