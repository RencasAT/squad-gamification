import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  completeNavigationProgress,
  getNavigationProgressSnapshot,
  resetNavigationProgress,
  startNavigationProgress,
} from '@gamification/shared-utils/lib/navigation-progress';

beforeEach(() => {
  vi.useFakeTimers();
  resetNavigationProgress();
});

afterEach(() => {
  resetNavigationProgress();
  vi.useRealTimers();
});

describe('navigation progress', () => {
  it('arranca cerca del 8% y completa al 100% cuando no hay cargas pendientes', () => {
    startNavigationProgress();

    expect(getNavigationProgressSnapshot()).toMatchObject({
      active: true,
      value: 0.08,
    });

    completeNavigationProgress();
    expect(getNavigationProgressSnapshot().value).toBe(1);

    vi.advanceTimersByTime(220);
    expect(getNavigationProgressSnapshot()).toEqual({
      active: false,
      value: 0,
    });
  });

  it('espera a que terminen cargas solapadas antes de ocultarse', () => {
    startNavigationProgress();
    startNavigationProgress();
    completeNavigationProgress();

    expect(getNavigationProgressSnapshot().active).toBe(true);
    expect(getNavigationProgressSnapshot().value).toBeLessThan(1);

    completeNavigationProgress();
    expect(getNavigationProgressSnapshot().value).toBe(1);
  });
});
