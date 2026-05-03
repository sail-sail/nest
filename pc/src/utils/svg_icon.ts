export type SvgRenderMode = "image" | "mask";

const SVG_DATA_URI_PREFIX = "data:image/svg+xml";
const COMPLEX_SVG_RE = /<(?:linearGradient|radialGradient|pattern|image|foreignObject|filter|mask|fe[A-Za-z]+)\b/i;
const PAINT_ATTR_RE = /\b(?:fill|stroke|stop-color|flood-color|lighting-color)\s*=\s*(["'])(.*?)\1/gi;
const PAINT_STYLE_RE = /(?:^|[;{\s])(?:fill|stroke|stop-color|flood-color|lighting-color)\s*:\s*([^;"'}]+)/gi;
const IGNORED_PAINT_VALUES = new Set([
  "",
  "none",
  "transparent",
  "currentcolor",
  "context-fill",
  "context-stroke",
  "inherit",
  "initial",
  "unset",
]);

const NAMED_COLOR_HEX: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  cyan: "#00ffff",
  aqua: "#00ffff",
  magenta: "#ff00ff",
  fuchsia: "#ff00ff",
  gray: "#808080",
  grey: "#808080",
  silver: "#c0c0c0",
  maroon: "#800000",
  olive: "#808000",
  lime: "#00ff00",
  teal: "#008080",
  navy: "#000080",
  purple: "#800080",
  orange: "#ffa500",
};

const svgRenderModeCache = new Map<string, SvgRenderMode>();

export function isSvgDataUri(value?: string | null): value is string {
  return !!value && value.startsWith(SVG_DATA_URI_PREFIX);
}

function decodeBase64Svg(base64: string) {
  if (typeof atob === "undefined") {
    return "";
  }
  const binary = atob(base64);
  if (typeof TextDecoder === "undefined") {
    return binary;
  }
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeSvgDataUri(value?: string | null) {
  if (!isSvgDataUri(value)) {
    return "";
  }
  const commaIndex = value.indexOf(",");
  if (commaIndex === -1) {
    return "";
  }
  const meta = value.substring(0, commaIndex).toLowerCase();
  const payload = value.substring(commaIndex + 1);
  try {
    if (meta.includes(";base64")) {
      return decodeBase64Svg(payload);
    }
    return decodeURIComponent(payload);
  } catch (_err) {
    return payload;
  }
}

function normalizePaintValue(value: string) {
  const normalized = value
    .trim()
    .replace(/\s*!important\s*$/i, "")
    .replace(/^["']|["']$/g, "")
    .toLowerCase();
  if (IGNORED_PAINT_VALUES.has(normalized)) {
    return "";
  }
  if (normalized.startsWith("url(")) {
    return "__complex__";
  }
  if (/^#[0-9a-f]{3}$/i.test(normalized)) {
    return `#${ normalized[1] }${ normalized[1] }${ normalized[2] }${ normalized[2] }${ normalized[3] }${ normalized[3] }`;
  }
  if (/^(rgb|rgba|hsl|hsla)\(/.test(normalized)) {
    return normalized.replace(/\s+/g, "");
  }
  const hex = NAMED_COLOR_HEX[normalized];
  if (hex) {
    return hex;
  }
  return normalized;
}

function collectPaintValues(svgText: string) {
  const values: string[] = [ ];
  let match: RegExpExecArray | null;
  PAINT_ATTR_RE.lastIndex = 0;
  while ((match = PAINT_ATTR_RE.exec(svgText)) !== null) {
    values.push(match[2]);
  }
  PAINT_STYLE_RE.lastIndex = 0;
  while ((match = PAINT_STYLE_RE.exec(svgText)) !== null) {
    values.push(match[1]);
  }
  return values;
}

export function getSvgRenderMode(value?: string | null): SvgRenderMode {
  if (!isSvgDataUri(value)) {
    return "image";
  }
  const cached = svgRenderModeCache.get(value);
  if (cached) {
    return cached;
  }
  const svgText = decodeSvgDataUri(value);
  let mode: SvgRenderMode = "mask";
  if (!svgText || COMPLEX_SVG_RE.test(svgText)) {
    mode = "image";
  } else {
    const colors = new Set<string>();
    const paintValues = collectPaintValues(svgText);
    for (const paintValue of paintValues) {
      const normalized = normalizePaintValue(paintValue);
      if (!normalized) {
        continue;
      }
      if (normalized === "__complex__") {
        mode = "image";
        break;
      }
      colors.add(normalized);
      if (colors.size > 1) {
        mode = "image";
        break;
      }
    }
  }
  svgRenderModeCache.set(value, mode);
  return mode;
}

export function shouldMaskSvg(value?: string | null) {
  return getSvgRenderMode(value) === "mask";
}