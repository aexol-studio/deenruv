import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '.';
import { Construction } from 'lucide-react';

interface Props {
  customTitle?: string;
  customText?: string;
}

export const UnderMaintenance: React.FC<Props> = ({ customTitle, customText }) => {
  const { t } = useTranslation('common');

  return (
    <Card className="absolute left-[50%] top-[50%] flex translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center p-24 text-center">
      <CardHeader className="flex flex-col items-center">
        <Construction size={144} className="mb-4" />
        <CardTitle className="text-3xl">{customTitle || t(`maintenance.title`)}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xl">{customText || t(`maintenance.text`)}</CardDescription>
      </CardContent>
    </Card>
  );
};
