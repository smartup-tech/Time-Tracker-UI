export type Credentials = {
  email: string;
  password: string;
};

export interface PasswordRecoveryRequest {
  email: string;
}

export interface PasswordReset {
  newPassword: string;
  token: string;
}
