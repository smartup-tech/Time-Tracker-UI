import { computed, onMounted, onUnmounted } from 'vue';

import { useBoolean } from '@/shared/lib';

export const useCurrentTheme = () => {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
  const getCurrentTheme = () => darkThemeMq.matches;

  const [isDarkTheme, { set }] = useBoolean(getCurrentTheme());

  const theme = computed<'dark' | 'light'>(() =>
    isDarkTheme.value ? 'dark' : 'light'
  );

  const mqListener = (event: MediaQueryListEvent) => {
    set(event.matches);
  };

  onMounted(() => {
    darkThemeMq.addEventListener('change', mqListener);
  });

  onUnmounted(() => {
    darkThemeMq.removeEventListener('change', mqListener);
  });

  return [theme];
};
