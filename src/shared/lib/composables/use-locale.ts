import { createGlobalState, useStorage } from '@vueuse/core';

export const useLocaleState = createGlobalState(() =>
  useStorage('locale', 'ru')
);
