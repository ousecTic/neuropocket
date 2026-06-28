// Stub for `virtual:pwa-register` used by the offline (single-file) build, which
// omits VitePWA. Service workers don't run over file://, so registration is a no-op.
import type { RegisterSWOptions } from 'virtual:pwa-register';

export function registerSW(_options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void> {
  return () => Promise.resolve();
}
