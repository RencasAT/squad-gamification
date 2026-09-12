import { describe, expect, it } from 'vitest';
import { changePasswordSchema } from '@gamification/host-shell/auth/change-password.schema';
import { isValidNewPassword } from '@gamification/host-shell/auth/password-policy';

describe('password-policy', () => {
  it('acepta una contraseña que cumple todos los requisitos', () => {
    expect(isValidNewPassword('NuevaPass1')).toBe(true);
  });

  it('rechaza menos de 8 caracteres, sin mayúscula, sin minúscula o sin número', () => {
    expect(isValidNewPassword('Ab1')).toBe(false);
    expect(isValidNewPassword('nuevapass1')).toBe(false);
    expect(isValidNewPassword('NUEVAPASS1')).toBe(false);
    expect(isValidNewPassword('NuevaPass')).toBe(false);
  });

  it('rechaza los símbolos & y #', () => {
    expect(isValidNewPassword('Nueva&Pass1')).toBe(false);
    expect(isValidNewPassword('Nueva#Pass1')).toBe(false);
  });
});

describe('changePasswordSchema', () => {
  it('exige que la confirmación coincida', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'TempPass1',
      newPassword: 'NuevaPass1',
      confirmPassword: 'OtraPass1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Las contraseñas no coinciden',
      );
    }
  });
});
