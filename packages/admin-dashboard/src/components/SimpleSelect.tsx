import {
  Select as BaseSelect,
  Label,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type Option,
} from '@deenruv/react-ui-devkit';
import { SelectProps } from '@radix-ui/react-select';
import { Stack } from './Stack';

interface CustomSelectProps extends SelectProps {
  options: Option[] | undefined;
  label?: string;
}

export const SimpleSelect: React.FC<CustomSelectProps> = ({ defaultValue, value, onValueChange, options, label }) => {
  return (
    <Stack column className="w-full gap-2">
      {label && <Label>{label}</Label>}
      <BaseSelect defaultValue={defaultValue} onValueChange={onValueChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder="Select element" />
        </SelectTrigger>
        <SelectContent>
          {options?.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </BaseSelect>
    </Stack>
  );
};
