import {
  RestChange,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const ChangesRegisterTable: React.FC<{ changes: RestChange[] }> = ({ changes }) => {
  const { t } = useTranslation('orders');
  return (
    <ScrollArea>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">{t('changes.property', 'Property')}</TableHead>
            <TableHead className="w-1/3">{t('changes.previous', 'Previous')}</TableHead>
            <TableHead className="w-1/3">{t('changes.current', 'Current')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {changes.map((change, index) => {
            return (
              <TableRow key={index}>
                {change.changed === 'added'}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {change.path.includes('Address')
                      ? t(`changes.keys.${change.path.split('.').pop()}`)
                      : t(`changes.keys.${change.path}`)}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-red-600 dark:text-red-400">
                  <div className="flex items-center gap-2">
                    {change.changed === 'added'
                      ? '—'
                      : change.changed === 'removed'
                        ? (change.value as unknown as string)
                        : change.removed}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-green-600 dark:text-green-400">
                  <div className="flex items-center gap-2">
                    {change.changed === 'added'
                      ? (change.value as unknown as string)
                      : change.changed === 'removed'
                        ? '—'
                        : change.added}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
