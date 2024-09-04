import { computed, unref } from 'vue';
import { useLocaleState } from './use-locale';

export const useNumberFormat = (
  value: number,
  options?: Intl.NumberFormatOptions
) => {
  const locale = useLocaleState();

  const formatted = computed<string>(() =>
    new Intl.NumberFormat(locale.value, options).format(value)
  );

  return unref(formatted);
};
