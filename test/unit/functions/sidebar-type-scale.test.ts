import { describe, expect, it } from 'vitest';
import {
  SIDEBAR_CHILD_FONT_MAX_PX,
  SIDEBAR_CHILD_FONT_MIN_PX,
  SIDEBAR_FONT_MAX_PX,
  SIDEBAR_FONT_MIN_PX,
  computeSidebarChildFontSize,
  computeSidebarFontSize,
} from '@gamification/host-shell/layout/sidebar-type-scale';

describe('computeSidebarFontSize', () => {
  it('clampa al máximo en 1920×1080 o más, y al mínimo en 1366×768', () => {
    expect(computeSidebarFontSize(1920, 1080)).toBe(SIDEBAR_FONT_MAX_PX);
    expect(computeSidebarFontSize(2560, 1440)).toBe(SIDEBAR_FONT_MAX_PX);
    expect(computeSidebarFontSize(1366, 768)).toBe(SIDEBAR_FONT_MIN_PX);
  });

  it('devuelve el máximo si el viewport es inválido', () => {
    expect(computeSidebarFontSize(0, 1080)).toBe(SIDEBAR_FONT_MAX_PX);
  });
});

describe('computeSidebarChildFontSize', () => {
  it('resta 2px y respeta el piso de los subítems', () => {
    expect(computeSidebarChildFontSize(SIDEBAR_FONT_MAX_PX)).toBe(
      SIDEBAR_CHILD_FONT_MAX_PX,
    );
    expect(computeSidebarChildFontSize(SIDEBAR_FONT_MIN_PX)).toBe(
      SIDEBAR_CHILD_FONT_MIN_PX,
    );
  });
});
