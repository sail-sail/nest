import * as echarts from "echarts/core";

import {
  BarChart,
  FunnelChart,
  LineChart,
  PieChart,
} from "echarts/charts";

import {
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";

import {
  CanvasRenderer,
} from "echarts/renderers";

echarts.use([
  BarChart,
  FunnelChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  GraphicComponent,
  CanvasRenderer,
]);

export {
  echarts,
};

/** 图表配置对象类型 */
export type ChartOption = Record<string, unknown>;

/** 图表主色板 */
export const chartPalette = [
  "#22d3ee",
  "#4f8cff",
  "#8b5cf6",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#38bdf8",
  "#a3e635",
];

/** 明亮模式主色板, 白底上对比度更高 */
export const chartPaletteLight = [
  "#0891b2",
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#d97706",
  "#e11d48",
  "#0284c7",
  "#65a30d",
];

/** 按主题取图表主色板 */
export function getChartPalette(isDark: boolean) {
  return isDark ? chartPalette : chartPaletteLight;
}

/** 图表主题, 区分明亮/黑暗模式 */
export function getChartTheme(isDark: boolean) {

  return {
    text: isDark ? "#c7d7ea" : "#41526b",
    subText: isDark ? "#7c8fa8" : "#8996a8",
    axisLine: isDark ? "rgba(148,178,214,0.18)" : "rgba(120,145,175,0.24)",
    splitLine: isDark ? "rgba(148,178,214,0.08)" : "rgba(120,145,175,0.14)",
    tooltipBg: isDark ? "rgba(9,17,32,0.94)" : "rgba(255,255,255,0.98)",
    tooltipBorder: isDark ? "rgba(56,189,248,0.28)" : "rgba(59,130,246,0.18)",
    tooltipText: isDark ? "#e6f1ff" : "#16233a",
  };
}
