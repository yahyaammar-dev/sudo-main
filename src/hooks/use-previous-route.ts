import { useNavigationState } from '@react-navigation/native';
import { useMemo } from 'react';

export const usePreviousRoute = () => {
  const previousRoute = useNavigationState((state) => {
    if (state.index > 0) return state.routes[state.index - 1];
    return null;
  });

  return useMemo(() => previousRoute?.name ?? null, [previousRoute]);
};
