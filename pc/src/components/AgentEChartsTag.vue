<template>
  <div class="agent-chart">
    <CustomEChart
      v-if="option"
      :option="themedOption"
      :height="height"
    />
    <div
      v-else
      class="agent-chart__error"
    >
      <div class="agent-chart__error-title">
        图表配置无效
      </div>
      <div class="agent-chart__error-msg">
        {{ parsed.error }}
      </div>
      <pre class="agent-chart__raw">{{ rawPreview }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomEChart from "./CustomEChart.vue";
import {
  parseChartOption,
  safeCssSize,
  withChartTheme,
} from "@/utils/agentChart";

interface CustomTagNode {
  type?: string;
  tag?: string;
  content?: string;
  raw?: string;
  attrs?: Record<string, string>;
}

const props = defineProps<{
  node?: CustomTagNode;
}>();

const isDark = useDark();
const raw = computed(() => props.node?.content ?? props.node?.raw ?? "");
const parsed = computed(() => parseChartOption(raw.value));
const option = computed(() => parsed.value.option);
const height = computed(() => safeCssSize(props.node?.attrs?.height, "360px"));
const themedOption = computed(() =>
  option.value ? withChartTheme(option.value, isDark.value) : {},
);
const rawPreview = computed(() => {
  const text = raw.value;
  return text.length > 2000 ? `${text.slice(0, 2000)}\n…（已截断）` : text;
});
</script>

<style lang="scss" scoped>
.agent-chart {
  margin: 10px 0 14px;
  padding: 10px 8px 4px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  background: var(--el-fill-color-lighter);
  overflow: hidden;
}

.agent-chart__error {
  padding: 8px 10px 10px;
}

.agent-chart__error-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--el-color-danger);
}

.agent-chart__error-msg {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.agent-chart__raw {
  margin: 8px 0 0;
  max-height: 220px;
  overflow: auto;
  padding: 8px;
  border-radius: 6px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  font-size: 11px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
