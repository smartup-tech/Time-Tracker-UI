import type { Rule } from 'ant-design-vue/lib/form';

export const hasNumbers = (value: string, amount = 1) => {
  const re = new RegExp(`\\d{${amount},}`);

  return re.test(value);
};

export const hasUpperCaseLetters = (value: string, amount = 1) => {
  const re = new RegExp(`[A-Z]{${amount},}`);

  return re.test(value);
};

export const hasLowerCaseLetters = (value: string, amount = 1) => {
  const re = new RegExp(`(?=(.*[a-z]){${amount}})`);

  return re.test(value);
};

export const validateNumberAmount =
  (amount?: number) => (_rule: Rule, value: string) => {
    if (hasNumbers(value, amount)) {
      return Promise.resolve();
    }

    return Promise.reject();
  };

export const validateUpperCaseLetters =
  (amount?: number) => (_rule: Rule, value: string) => {
    if (hasUpperCaseLetters(value, amount)) {
      return Promise.resolve();
    }

    return Promise.reject();
  };

export const validateLowerCaseLetters =
  (amount?: number) => (_rule: Rule, value: string) => {
    if (hasLowerCaseLetters(value, amount)) {
      return Promise.resolve();
    }

    return Promise.reject();
  };
