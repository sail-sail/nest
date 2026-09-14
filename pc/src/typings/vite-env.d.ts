/// <reference types="vite-plus/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_SERVER_I18N_ENABLE: string
  readonly VITE_TIANDITU_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
