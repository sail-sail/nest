/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_SERVER_I18N_ENABLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
