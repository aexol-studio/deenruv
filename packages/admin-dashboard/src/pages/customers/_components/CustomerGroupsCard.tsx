import React, { useCallback, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomerDetailType,
  MultipleSelector,
  Option,
  useMutation,
  useQuery,
} from '@deenruv/react-ui-devkit';
import { Stack } from '@/components';
import { useTranslation } from 'react-i18next';
import { typedGql, scalars, $ } from '@deenruv/admin-types';
import { toast } from 'sonner';

interface RolesCardProps {
  customerId: string | undefined;
  groups: CustomerDetailType['groups'] | undefined;
}

const CustomerGroupsQuery = typedGql('query', { scalars })({
  customerGroups: [{}, { items: { id: true, name: true } }],
});

const AddCustomerToGroupMutation = typedGql('mutation', { scalars })({
  addCustomersToGroup: [
    { customerGroupId: $('groupId', 'ID!'), customerIds: $('customerIds', '[ID!]!') },
    { id: true },
  ],
});

const RemoveCustomerFromGroupMutation = typedGql('mutation', { scalars })({
  removeCustomersFromGroup: [
    { customerGroupId: $('groupId', 'ID!'), customerIds: $('customerIds', '[ID!]!') },
    { id: true },
  ],
});

const mapToOptions = (groups: { id: string; name: string }[]) => groups.map((g) => ({ value: g.id, label: g.name }));

export const CustomerGroupsCard: React.FC<RolesCardProps> = ({ groups, customerId }) => {
  const { t } = useTranslation('customers');
  const { data } = useQuery(CustomerGroupsQuery);
  const [addToGroup] = useMutation(AddCustomerToGroupMutation);
  const [removeFromGroup] = useMutation(RemoveCustomerFromGroupMutation);
  const [value, setValue] = useState(mapToOptions(groups || []));
  const options = useMemo(() => mapToOptions(data?.customerGroups.items || []), [data]);

  const handleChange = useCallback(
    (newValue: Option[]) => {
      if (!customerId) return;

      const added = newValue.find((item) => !value.includes(item));
      const removed = value.find((item) => !newValue.includes(item));

      if (added)
        addToGroup({ customerIds: [customerId], groupId: added.value }).then(() => {
          setValue((prev) => [...prev, added]);
          toast.success(t('customerGroups.toastAdded'));
        });
      else if (removed)
        removeFromGroup({ customerIds: [customerId], groupId: removed.value }).then(() => {
          setValue((prev) => prev.filter((i) => i.value !== removed.value));
          toast.success(t('customerGroups.toastRemoved'));
        });
    },
    [value],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('customerGroups.header')}</CardTitle>
        <CardContent className="flex flex-col gap-4 p-0 pt-4">
          <Stack className="gap-2">
            <MultipleSelector
              options={options}
              value={value}
              placeholder={t('customerGroups.placeholder')}
              onChange={handleChange}
              hideClearAllButton
              className="h-24"
            />
          </Stack>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
