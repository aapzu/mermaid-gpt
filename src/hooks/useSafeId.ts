import { useId } from 'react';

export const useSafeId = () => {
  return useId().replace(/[^a-zA-Z0-9]/g, '');
};
