import { paths, PageName } from '@/pages';
import {
  AuthPage,
  LoginPage,
  LogoutPage,
  PasswordRecoveryPage,
  ResetPasswordPage,
  SetPasswordPage,
} from '@/pages/auth';

import type { RouteLocation, RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: PageName.ACCOUNT,
    component: AuthPage,
    children: [
      {
        path: paths[PageName.LOGIN],
        name: PageName.LOGIN,
        component: LoginPage,
      },
      {
        path: paths[PageName.LOGOUT],
        name: PageName.LOGOUT,
        component: LogoutPage,
      },
      {
        path: paths[PageName.PASSWORD_RECOVERY],
        name: PageName.PASSWORD_RECOVERY,
        component: PasswordRecoveryPage,
      },
      {
        path: paths[PageName.RESET_PASSWORD],
        name: PageName.RESET_PASSWORD,
        component: ResetPasswordPage,
        props: (route: RouteLocation) => ({
          token: route.query.token,
        }),
      },
      {
        path: paths[PageName.SET_PASSWORD],
        name: PageName.SET_PASSWORD,
        component: SetPasswordPage,
        props: (route: RouteLocation) => ({
          token: route.query.token,
        }),
      },
    ],
  },
];
