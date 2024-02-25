import { FC } from 'react';

import { cn } from '@/utils';

export const LoadingBar: FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <div className={cn('w-full', { 'opacity-0': !loading })}>
      <div className="h-1.5 -mt-1.5 w-full bg-pink-100 overflow-hidden">
        <div className="progress w-full h-full bg-pink-500 left-right"></div>
      </div>
    </div>
  );
};
