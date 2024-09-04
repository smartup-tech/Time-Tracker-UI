const AuthPage = () => import('@/pages/auth/AuthPage.vue');
const LoginPage = () => import('@/pages/auth/login/LoginPage.vue');
const LogoutPage = () => import('@/pages/auth/logout/LogoutPage.vue');
const PasswordRecoveryPage = () =>
  import('@/pages/auth/password-recovery/PasswordRecoveryPage.vue');
const ResetPasswordPage = () =>
  import('@/pages/auth/reset-password/ResetPasswordPage.vue');
const SetPasswordPage = () =>
  import('@/pages/auth/set-password/SetPasswordPage.vue');

export {
  AuthPage,
  LoginPage,
  LogoutPage,
  PasswordRecoveryPage,
  ResetPasswordPage,
  SetPasswordPage,
};
