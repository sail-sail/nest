import { getChartPalette, getChartTheme, type ChartOption } from "@/utils/echarts";

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function themeAxis(value: unknown, theme: ReturnType<typeof getChartTheme>): unknown {
  if (Array.isArray(value)) return value.map((item) => themeAxis(item, theme));
  if (!isRecord(value)) return value;
  return {
    ...value,
    axisLabel: { color: theme.text, ...(isRecord(value.axisLabel) ? value.axisLabel : {}) },
    axisLine: {
      lineStyle: { color: theme.axisLine },
      ...(isRecord(value.axisLine) ? value.axisLine : {}),
    },
    splitLine: {
      lineStyle: { color: theme.splitLine },
      ...(isRecord(value.splitLine) ? value.splitLine : {}),
    },
    nameTextStyle: {
      color: theme.subText,
      ...(isRecord(value.nameTextStyle) ? value.nameTextStyle : {}),
    },
  };
}

function themeTitle(value: unknown, theme: ReturnType<typeof getChartTheme>): unknown {
  if (Array.isArray(value)) return value.map((item) => themeTitle(item, theme));
  if (!isRecord(value)) return value;
  return {
    textStyle: { color: theme.text },
    subtextStyle: { color: theme.subText },
    ...value,
  };
}

/** 把模型给的 option 和项目亮/暗主题合并；模型显式写的颜色优先 */
export function withChartTheme(option: ChartOption, isDark: boolean): ChartOption {
  const theme = getChartTheme(isDark);
  const tooltip = isRecord(option.tooltip) ? option.tooltip : {};
  const legend = isRecord(option.legend) ? option.legend : {};
  const textStyle = isRecord(option.textStyle) ? option.textStyle : {};
  const grid = isRecord(option.grid) ? { ...option.grid } : {};
  const bottom = typeof grid.bottom === "number" ? grid.bottom : 48;
  // 底部留够 x 轴标签 + 图例的空间，避免叠在一起
  grid.bottom = Math.max(bottom, 64);

  return {
    backgroundColor: "transparent",
    color: getChartPalette(isDark),
    ...option,
    textStyle: { color: theme.text, ...textStyle },
    title: themeTitle(option.title, theme),
    grid,
    tooltip: {
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      textStyle: { color: theme.tooltipText },
      ...tooltip,
    },
    legend: { textStyle: { color: theme.text }, ...legend },
    xAxis: themeAxis(option.xAxis, theme),
    yAxis: themeAxis(option.yAxis, theme),
  };
}

export interface ParsedChartOption {
  option?: ChartOption;
  error?: string;
}

const CHART_TYPES = new Set(["bar", "line", "pie", "funnel"]);

/** 解析并做最小校验，避免模型输出半截 JSON 或超大数组 */
export function parseChartOption(raw: string): ParsedChartOption {
  if (!raw.trim()) return { error: "图表配置为空" };
  if (raw.length > 200_000) return { error: "图表配置过大" };

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { error: "JSON 解析失败" };
  }
  if (!isRecord(value)) return { error: "配置必须是 JSON 对象" };

  const series = value.series;
  if (!Array.isArray(series) || series.length === 0) return { error: "缺少 series" };
  if (series.length > 12) return { error: "series 过多" };

  for (const item of series) {
    if (!isRecord(item) || typeof item.type !== "string") {
      return { error: "series 缺少 type" };
    }
    if (!CHART_TYPES.has(item.type)) {
      return { error: `暂不支持图表类型：${item.type}` };
    }
    if (Array.isArray(item.data) && item.data.length > 2000) {
      return { error: "单个 series 数据点过多" };
    }
  }

  return { option: value as ChartOption };
}

export function looksLikeChart(option: ChartOption): boolean {
  const series = option.series;
  return Array.isArray(series) && series.length > 0;
}

/** 只接受简单的 CSS 尺寸，避免模型写进奇怪的样式 */
export function safeCssSize(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return /^\d+(\.\d+)?(px|%|vh|vw|rem)$/.test(trimmed) ? trimmed : fallback;
}
