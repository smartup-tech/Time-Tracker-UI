import { ref } from 'vue';

import { HTTPException } from '@/shared/exceptions';

export function useRemoteValidation<T>(
  method: (payload: T) => Promise<void>,
  options?: {
    onSuccess?: ({ data }: { data: unknown }) => Promise<void> | void;
    onError?: () => Promise<unknown> | void;
  }
) {
  const error = ref<string | null>(null);
  const isSubmitting = ref<boolean>(false);

  const submit = async (payload: T) => {
    isSubmitting.value = true;

    try {
      const data = await method(payload);
      if (options?.onSuccess) {
        await options.onSuccess({ data });
      }
    } catch (validationError) {
      if (validationError instanceof HTTPException) {
        error.value =
          validationError.response?.errorCode ||
          validationError.response?.errorMessage ||
          null;

        if (options?.onError) {
          await options.onError();
        }

        return;
      }
    } finally {
      isSubmitting.value = false;
    }
  };

  const resetError = () => {
    error.value = null;
  };

  return {
    error,
    isSubmitting,
    submit,
    resetError,
  };
}
