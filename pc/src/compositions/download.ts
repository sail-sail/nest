type TauriWindow = Window & {
  __TAURI__?: unknown;
  __TAURI_INTERNALS__?: unknown;
};

function isTauriEnvironment() {
  if (typeof window === "undefined") {
    return false;
  }

  const tauriWindow = window as TauriWindow;
  return Boolean(
    tauriWindow.__TAURI__
    || tauriWindow.__TAURI_INTERNALS__
    || (typeof navigator !== "undefined" && /tauri/i.test(navigator.userAgent)),
  );
}

async function importTauriDownloadApis() {
  if (!isTauriEnvironment()) {
    return null;
  }

  try {
    const [{ download }, { save }] = await Promise.all([
      import("@tauri-apps/plugin-upload"),
      import("@tauri-apps/plugin-dialog"),
    ]);

    return {
      download,
      save,
    };
  } catch {
    return null;
  }
}

async function importTauriFsApis() {
  if (!isTauriEnvironment()) {
    return null;
  }

  try {
    const { writeFile } = await import("@tauri-apps/plugin-fs");
    const { save } = await import("@tauri-apps/plugin-dialog");

    return {
      writeFile,
      save,
    };
  } catch {
    return null;
  }
}

function isRemoteUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeFilename(value: string) {
  return value
    .replace(/^\.+/, "")
    .replace(/[\\/:*?"<>|]/g, "")
    .trim();
}

function parseContentDispositionFilename(value?: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  const filenameMatch = normalized.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
  if (filenameMatch?.[1]) {
    try {
      return decodeURIComponent(filenameMatch[1].trim().replace(/^"|"$/g, ""));
    } catch {
      return filenameMatch[1].trim().replace(/^"|"$/g, "");
    }
  }

  const simpleMatch = normalized.match(/filename=([^;]+)/i);
  if (simpleMatch?.[1]) {
    return simpleMatch[1].trim().replace(/^"|"$/g, "");
  }

  return null;
}

export async function resolveRemoteFilename(url: string, fallbackFilename?: string) {

  if (fallbackFilename) {
    return fallbackFilename;
  }
  
  if (!isRemoteUrl(url)) {
    return fallbackFilename;
  }

  try {
    const response = await fetch(url, { method: "HEAD" });
    const disposition = response.headers.get("content-disposition");
    const filename = parseContentDispositionFilename(disposition);
    if (filename) {
      return sanitizeFilename(filename);
    }
  } catch {
    // ignore and fall back
  }

  return fallbackFilename;
}

export async function saveAs(
  data: Blob | string,
  filename?: string,
) {
  const resolvedFilename = typeof data === "string" && isRemoteUrl(data)
    ? await resolveRemoteFilename(data, filename)
    : filename;

  if (typeof data === "string" && isRemoteUrl(data)) {
    const tauriApis = await importTauriDownloadApis();
    if (tauriApis) {
      const filePath = await tauriApis.save({
        title: resolvedFilename || filename || "下载文件",
        defaultPath: resolvedFilename || filename,
        filters: [
          {
            name: "文件",
            extensions: ["*"],
          },
        ],
      });

      if (!filePath) {
        return;
      }

      await tauriApis.download(data, filePath);
      return;
    }
  }

  if (data instanceof Blob) {
    const tauriFsApis = await importTauriFsApis();
    if (tauriFsApis) {
      const filePath = await tauriFsApis.save({
        title: filename || "下载文件",
        defaultPath: filename,
        filters: [
          {
            name: "文件",
            extensions: ["*"],
          },
        ],
      });

      if (!filePath) {
        return;
      }

      const buffer = await data.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      await tauriFsApis.writeFile(filePath, bytes);
      return;
    }
  }

  const { saveAs: browserSaveAs } = await import("file-saver");
  browserSaveAs(data, resolvedFilename || filename);
}
