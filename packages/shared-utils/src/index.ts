export { cn, cva, type VariantProps } from './utils/cn';
export { dayjs } from './lib/dayjs';
export {
  classifyAppError,
  importWithChunkRetry,
  isChunkLoadError,
  type AppErrorKind,
} from './utils/chunk-load';
export { lazyRoute } from './utils/lazy-route';
export {
  getApiErrorMessage,
  isApiNotFound,
} from './utils/get-api-error-message';
export { buildDicebearAvatarUrl } from './utils/dicebear-avatar';
export { environment } from './environments/environment';
export { http, setAccessToken, setUnauthorizedHandler } from './api/http';
export { queryClient } from './api/query-client';
export {
  APP_ROLES,
  hasAppRole,
  hasPermission,
  isAppRole,
  rolesFromKeycloakToken,
  type AppRole,
  type FederatedRemoteProps,
} from './access';
export {
  APP_PERMISSIONS,
  COMPOSITE_ROLES,
  PERMISSIONS,
  isAppPermission,
  type AppPermission,
} from './permissions';
