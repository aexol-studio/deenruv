import { Textarea } from '@/components';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React, { ChangeEvent } from 'react';

interface TextCardProps {
  value: string | undefined;
  label: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextCard: React.FC<TextCardProps> = ({ value, label, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea placeholder={label} value={value} rows={4} onChange={onChange} />
      </CardContent>
    </Card>
  );
};
