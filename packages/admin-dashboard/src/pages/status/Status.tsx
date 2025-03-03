import { Health } from './_components/Health.js';
import { Jobs } from './_components/Jobs.js';

export const Status = () => {
  return (
    <div className="w-full p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <Health />
        <Jobs />
      </div>
    </div>
  );
};
