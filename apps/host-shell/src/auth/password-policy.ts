export type PasswordRequirement = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

export const passwordRequirements: PasswordRequirement[] = [
  {
    id: 'minLength',
    label: 'Mínimo 8 caracteres',
    test: (value) => value.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Mínimo 1 letra mayúscula',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'lowercase',
    label: 'Mínimo 1 letra minúscula',
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    label: 'Mínimo 1 número',
    test: (value) => /\d/.test(value),
  },
  {
    id: 'noForbidden',
    label: 'No incluir el símbolo &, #',
    test: (value) => !/[&#]/.test(value),
  },
];

export function isValidNewPassword(value: string): boolean {
  return passwordRequirements.every((requirement) => requirement.test(value));
}
