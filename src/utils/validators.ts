export const isValidGroupId = (value: string): boolean => {
  return value.trim().length > 0;
};

export const isValidPhone = (value: string): boolean => {
  return /^\+?[0-9]{8,15}$/.test(value.trim());
};
