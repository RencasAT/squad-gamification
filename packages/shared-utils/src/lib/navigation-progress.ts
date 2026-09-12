export type NavigationProgressSnapshot = {
  active: boolean;
  value: number;
};

type Listener = () => void;

const listeners = new Set<Listener>();

let pending = 0;
let value = 0;
let active = false;
let trickleId: ReturnType<typeof setInterval> | null = null;
let hideId: ReturnType<typeof setTimeout> | null = null;
let snapshot: NavigationProgressSnapshot = { active: false, value: 0 };

function emit() {
  snapshot = { active, value };
  listeners.forEach((listener) => listener());
}

function trickleAmount(current: number) {
  if (current < 0.2) {
    return 0.1;
  }
  if (current < 0.5) {
    return 0.04;
  }
  if (current < 0.8) {
    return 0.02;
  }
  if (current < 0.99) {
    return 0.005;
  }
  return 0;
}

function stopTrickle() {
  if (trickleId == null) {
    return;
  }
  clearInterval(trickleId);
  trickleId = null;
}

function startTrickle() {
  stopTrickle();
  trickleId = setInterval(() => {
    if (!active || pending <= 0) {
      return;
    }
    value = Math.min(value + trickleAmount(value), 0.94);
    emit();
  }, 200);
}

function cancelHide() {
  if (hideId == null) {
    return;
  }
  clearTimeout(hideId);
  hideId = null;
}

/** Arranca o mantiene la barra (contador para cargas solapadas). */
export function startNavigationProgress() {
  pending += 1;
  cancelHide();

  if (!active || value >= 1) {
    active = true;
    value = 0.08;
    emit();
  }

  startTrickle();
}

/** Completa un arranque. Al llegar a 0, llena al 100% y se oculta. */
export function completeNavigationProgress() {
  if (pending === 0) {
    return;
  }

  pending -= 1;
  if (pending > 0) {
    return;
  }

  stopTrickle();
  value = 1;
  emit();

  hideId = setTimeout(() => {
    active = false;
    value = 0;
    hideId = null;
    emit();
  }, 220);
}

export function getNavigationProgressSnapshot() {
  return snapshot;
}

export function subscribeNavigationProgress(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Solo tests: deja el singleton en reposo. */
export function resetNavigationProgress() {
  pending = 0;
  value = 0;
  active = false;
  stopTrickle();
  cancelHide();
  emit();
}
