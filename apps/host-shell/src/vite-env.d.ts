/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRODUCTION: string;
  readonly VITE_API_URL: string;
  readonly VITE_USE_MOCKS: string;
  readonly VITE_PRIMEUI_LICENSE: string;
  readonly VITE_HOST_ENTRY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
