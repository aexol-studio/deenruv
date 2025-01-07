import { Check, X } from 'lucide-react';
import React from 'react';

export const BooleanCell: React.FC<{ value: boolean }> = ({ value }) => {
  const size = 20;
  return value ? <Check {...{ size }} /> : <X {...{ size }} />;
};
