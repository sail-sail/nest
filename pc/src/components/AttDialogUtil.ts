import {
  getStatsOss,
} from "./Api";

export type AttFileStat = {
  id: string;
  lbl: string;
  contentType?: string;
  size?: number;
};

export type AttPreviewType = "flyfish" | "iframe";

export type AttDialogPreviewInfoItem = {
  id: string;
  stat?: AttFileStat;
  previewType: AttPreviewType;
  canPreview: boolean;
  canStablePreview: boolean;
};

export type AttDialogPreviewInfo = {
  ids: string[];
  items: AttDialogPreviewInfoItem[];
  canPreview: boolean;
  canStablePreview: boolean;
  allPreviewable: boolean;
};

export function splitAttIds(
  modelValue?: string | null,
): string[] {
  return (modelValue || "")
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x);
}

const flyfishSupportedExts = new Set([
  "docx",
  "doc",
  "xlsx",
  "xlsm",
  "xlsb",
  "xls",
  "csv",
  "ods",
  "fods",
  "numbers",
  "pptx",
  "pdf",
  "ofd",
  "dxf",
  "dwg",
  "excalidraw",
  "drawio",
  "dio",
  "epub",
  "md",
  "markdown",
  "gif",
  "jpg",
  "jpeg",
  "bmp",
  "tiff",
  "tif",
  "png",
  "svg",
  "webp",
  // "txt",
  "json",
  "js",
  "mjs",
  "cjs",
  "umd",
  "css",
  "java",
  "py",
  "html",
  "htm",
  "jsx",
  "ts",
  "tsx",
  "xml",
  "log",
  "vue",
  "yaml",
  "yml",
  "ini",
  "sh",
  "bash",
  "sql",
  "go",
  "rs",
  "php",
  "c",
  "cpp",
  "cc",
  "h",
  "hpp",
  "cs",
  "diff",
  "mp3",
  "mpeg",
  "wav",
  "ogg",
  "oga",
  "opus",
  "m4a",
  "aac",
  "flac",
  "weba",
  "mp4",
]);

function getFileExt(
  fileStat?: AttFileStat,
): string {
  const lbl = fileStat?.lbl || "";
  const dotIndex = lbl.lastIndexOf(".");
  if (dotIndex <= -1 || dotIndex === lbl.length - 1) {
    return "";
  }
  return lbl.slice(dotIndex + 1).toLowerCase();
}

export function getAttPreviewType(
  fileStat?: AttFileStat,
): AttPreviewType {
  const ext = getFileExt(fileStat);
  if (ext && flyfishSupportedExts.has(ext)) {
    return "flyfish";
  }
  return "iframe";
}

export function canAttPreviewTypePreview(
  previewType: AttPreviewType,
): boolean {
  return previewType === "flyfish"
    || previewType === "iframe";
}

export function canAttPreviewTypeStablePreview(
  previewType: AttPreviewType,
): boolean {
  return previewType === "flyfish";
}

export async function getAttDialogPreviewInfo(
  modelValue?: string | null,
  opt?: GqlOpt,
): Promise<AttDialogPreviewInfo> {
  const ids = splitAttIds(modelValue);
  if (ids.length === 0) {
    return {
      ids,
      items: [ ],
      canPreview: false,
      canStablePreview: false,
      allPreviewable: false,
    };
  }

  const stats = await getStatsOss(ids, opt);
  const statMap = new Map(stats.map((stat) => [stat.id, stat]));
  const items = ids.map((id) => {
    const stat = statMap.get(id);
    const previewType = getAttPreviewType(stat);
    const canPreview = canAttPreviewTypePreview(previewType);
    const canStablePreview = canAttPreviewTypeStablePreview(previewType);
    return {
      id,
      stat,
      previewType,
      canPreview,
      canStablePreview,
    };
  });

  return {
    ids,
    items,
    canPreview: items.some((item) => item.canPreview),
    canStablePreview: items.some((item) => item.canStablePreview),
    allPreviewable: items.length > 0 && items.every((item) => item.canPreview),
  };
}

export async function canPreviewWithAttDialog(
  modelValue?: string | null,
  opt?: GqlOpt,
): Promise<boolean> {
  const previewInfo = await getAttDialogPreviewInfo(modelValue, opt);
  return previewInfo.canPreview;
}