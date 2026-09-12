import { useEffect, useState } from 'react';

/** Tope Figma (16px). El tamaño vivo nunca lo supera. */
export const SIDEBAR_FONT_MAX_PX = 16;

/** Piso de lectura en viewports chicos (p. ej. 1366×768). */
export const SIDEBAR_FONT_MIN_PX = 12;

/** Los subítems van 2px por debajo del padre (tope 14px). */
export const SIDEBAR_CHILD_FONT_OFFSET_PX = 2;

export const SIDEBAR_CHILD_FONT_MAX_PX =
  SIDEBAR_FONT_MAX_PX - SIDEBAR_CHILD_FONT_OFFSET_PX;

export const SIDEBAR_CHILD_FONT_MIN_PX =
  SIDEBAR_FONT_MIN_PX - SIDEBAR_CHILD_FONT_OFFSET_PX;

/** Viewport de diseño 16:9. En este tamaño se usa el máximo. */
export const SIDEBAR_REF_WIDTH = 1920;
export const SIDEBAR_REF_HEIGHT = 1080;

/**
 * Tamaño de texto del sidebar según el viewport vs 1920×1080.
 * `max * min(w/1920, h/1080)`, clamp entre min y max.
 * Pantalla más grande → texto más grande; 1366×768 → cerca del mínimo.
 */
export function computeSidebarFontSize(
  width: number,
  height: number,
  maxPx = SIDEBAR_FONT_MAX_PX,
  minPx = SIDEBAR_FONT_MIN_PX,
  refWidth = SIDEBAR_REF_WIDTH,
  refHeight = SIDEBAR_REF_HEIGHT,
): number {
  if (height <= 0 || width <= 0) {
    return maxPx;
  }

  const scale = Math.min(width / refWidth, height / refHeight);
  const raw = maxPx * scale;
  return Math.round(Math.min(maxPx, Math.max(minPx, raw)));
}

export function computeSidebarChildFontSize(parentPx: number): number {
  return Math.min(
    SIDEBAR_CHILD_FONT_MAX_PX,
    Math.max(
      SIDEBAR_CHILD_FONT_MIN_PX,
      parentPx - SIDEBAR_CHILD_FONT_OFFSET_PX,
    ),
  );
}

export function useSidebarTypeScale() {
  const [fontPx, setFontPx] = useState(SIDEBAR_FONT_MAX_PX);

  useEffect(() => {
    const update = () => {
      setFontPx(computeSidebarFontSize(window.innerWidth, window.innerHeight));
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return fontPx;
}
