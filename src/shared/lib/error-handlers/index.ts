import { message } from 'ant-design-vue';

import { PageName } from '@/pages';
import router from '@/router';
import { useAuthStore } from '@/store';
import { HTTPException, UnauthorizedException } from '@/shared/exceptions';

import { Errors } from './config';

export * from './config';

export const errorHandler = (error: unknown) => {
  const { logout } = useAuthStore();

  if (error instanceof UnauthorizedException) {
    logout().then(() => {
      router.push({
        name: PageName.LOGIN,
        query: {
          next: router.currentRoute.value.fullPath,
        },
      });
    });

    return false;
  }

  if (error instanceof HTTPException && error.status === 403) {
    message.error('Операция недоступна');
    return false;
  }

  if (error instanceof HTTPException) {
    const errorMessage =
      (error.response?.errorCode && Errors[error.response.errorCode]) ||
      error.response?.errorMessage;

    if (errorMessage) {
      message.error(errorMessage);
      return false;
    }
  }
};
