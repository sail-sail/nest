import {
  getStatsOss,
} from "./Api";

export type AttFileStat = {
  id: string;
  lbl: string;
  contentType?: string;
  size?: number;
};

export type AttPreviewType = "image" | "excel" | "docx" | "binary" | "iframe";

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

export function getAttPreviewType(
  contentType?: string,
): AttPreviewType {
  if (contentType?.startsWith("image/")) {
    return "image";
  }
  if (
    contentType?.startsWith("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    || contentType?.startsWith("application/vnd.ms-excel.sheet")
  ) {
    return "excel";
  }
  if (
    contentType?.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    || contentType?.startsWith("application/msword")
  ) {
    return "docx";
  }
  if (contentType?.startsWith("application/octet")) {
    return "binary";
  }
  return "iframe";
}

export function canAttPreviewTypePreview(
  previewType: AttPreviewType,
): boolean {
  return previewType !== "binary";
}

export function canAttPreviewTypeStablePreview(
  previewType: AttPreviewType,
): boolean {
  return previewType === "image"
    || previewType === "excel"
    || previewType === "docx";
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
    const previewType = getAttPreviewType(stat?.contentType);
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