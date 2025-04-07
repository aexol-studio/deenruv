import { Label, apiClient, type Option, SimpleSelect } from '@deenruv/react-ui-devkit';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface CustomerGroupsSelectorProps {
  label: string;
  value?: string;
  onChange: (e: string) => void;
}

export const CustomerGroupsSelector: React.FC<CustomerGroupsSelectorProps> = ({ label, value, onChange }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const valueParsed = useMemo(() => (value?.startsWith('"') ? JSON.parse(value) : value), [value]);

  const fetchCustomerGroups = useCallback(async () => {
    const response = await apiClient('query')({
      customerGroups: [
        {},
        {
          items: {
            name: true,
            id: true,
          },
        },
      ],
    });
    setOptions(response.customerGroups.items?.map((v) => ({ label: v.name, value: v.id })));
  }, []);

  useEffect(() => {
    fetchCustomerGroups();
  }, [fetchCustomerGroups]);

  return (
    <div className="flex basis-full flex-col gap-2">
      <Label>{label}</Label>
      <SimpleSelect options={options} value={valueParsed} onValueChange={(e) => onChange(e)} />
    </div>
  );
};
