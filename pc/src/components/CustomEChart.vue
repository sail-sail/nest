<template>
<div
  ref="chartRef"
  un-w="full"
  :style="{ height }"
></div>
</template>

<script lang="ts" setup>
import type {
  ChartOption,
} from "@/utils/echarts.ts";

import {
  echarts,
} from "@/utils/echarts.ts";

const props = withDefaults(defineProps<{
  /** 图表配置 */
  option: ChartOption;
  /** 图表高度 */
  height?: string;
}>(), {
  height: "260px",
});

const chartRef = $(useTemplateRef("chartRef"));

let chart: ReturnType<typeof echarts.init> | null = null;
let resizeObserver: ResizeObserver | null = null;

/** 渲染图表 */
function render() {

  if (!chartRef) {
    return;
  }

  if (!chart) {
    chart = echarts.init(chartRef);
    resizeObserver = new ResizeObserver(() => {
      chart?.resize();
    });
    resizeObserver.observe(chartRef);
  }

  chart.setOption(props.option, true);
}

onMounted(() => {
  render();
});

watch(() => props.option, () => {
  render();
}, {
  deep: true,
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  chart?.dispose();
  chart = null;
});
</script>
