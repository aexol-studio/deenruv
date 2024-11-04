import { cn } from '@/lib/utils';
import { CircleOff } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import pkg from 'react-color';
const { CirclePicker } = pkg;
interface ColorSampleProps {
  color: string | undefined; // hex
  setColor?: (color: string | undefined) => void;
  small?: true;
}

export const ColorSample: React.FC<ColorSampleProps> = ({ color, setColor, small }) => {
  const [openColorPicker, setOpenColorPicker] = useState(false);

  const handleColorPicked = useCallback(
    (e: any | undefined) => {
      if (e) {
        setColor?.(e.hex);
      } else setColor?.(undefined);
      setOpenColorPicker(false);
    },
    [setColor],
  );

  return (
    <div>
      {!color || color === '---' ? (
        <CircleOff {...(setColor && { onClick: () => setOpenColorPicker(true) })} size={small ? 18 : 28} />
      ) : (
        <div
          className={cn('border-gray h-6 w-6 rounded-full border border-solid', small && 'h-[18px] w-[18px]')}
          style={{ backgroundColor: color }}
          {...(setColor && { onClick: () => setOpenColorPicker(true) })}
        ></div>
      )}
      {openColorPicker && (
        <div className="absolute mt-2 rounded bg-white p-2 shadow dark:bg-gray-900">
          <div className="mb-3 flex cursor-pointer gap-3" onClick={() => handleColorPicked(undefined)}>
            <CircleOff size={small ? 24 : 28} /> No color
          </div>
          <CirclePicker color={color} onChangeComplete={handleColorPicked} />
        </div>
      )}
    </div>
  );
};
