import {
  ElMessageBox,
} from "element-plus";

type VitePreloadErrorEvent = Event & {
  payload?: unknown;
};

let assetUpdateRecoverySetup = false;
let upgradePromptVisible = false;

function getErrorMessage(error: unknown) {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "";
}

function isAssetUpdateError(error: unknown) {
  const message = getErrorMessage(error);
  if (!message) {
    return false;
  }
  return [
    "Failed to fetch dynamically imported module",
    "Importing a module script failed",
    "Unable to preload CSS",
    "Loading CSS chunk",
    "ChunkLoadError",
    "Failed to fetch module dynamically",
  ].some((item) => message.includes(item));
}

function reloadPageForUpgrade() {
  window.location.reload();
}

async function promptReloadForUpgrade() {
  if (upgradePromptVisible) {
    return;
  }
  upgradePromptVisible = true;
  try {
    await ElMessageBox.confirm(
      "系统已更新，页面已过期。是否立即刷新页面升级到最新版本？",
      "发现新版本",
      {
        confirmButtonText: "刷新页面",
        cancelButtonText: "稍后处理",
        type: "warning",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false,
      },
    );
    reloadPageForUpgrade();
  } catch (error) {
  } finally {
    upgradePromptVisible = false;
  }
}

function handleAssetUpdateError(error: unknown) {
  if (!isAssetUpdateError(error)) {
    return false;
  }
  void promptReloadForUpgrade();
  return true;
}

export function setupAssetUpdateRecovery() {
  if (assetUpdateRecoverySetup) {
    return;
  }
  assetUpdateRecoverySetup = true;

  window.addEventListener("vite:preloadError", (event: Event) => {
    const preloadErrorEvent = event as VitePreloadErrorEvent;
    preloadErrorEvent.preventDefault();
    if (!handleAssetUpdateError(preloadErrorEvent.payload)) {
      void promptReloadForUpgrade();
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (!handleAssetUpdateError(event.reason)) {
      return;
    }
    event.preventDefault();
  });
}