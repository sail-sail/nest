<template>
  <div
    class="bpm-node"
    :class="[`bpm-node--${nodeType}`, { 'is-selected': selected }]"
  >
    <Handle
      v-if="nodeType !== 'start'"
      type="target"
      :position="Position.Left"
      :connectable="!readonly"
    />
    <div class="bpm-node__icon">
      {{ iconMap[nodeType] ?? "●" }}
    </div>
    <div class="bpm-node__label">
      {{ data?.label ?? "" }}
    </div>
    <Handle
      v-if="nodeType !== 'end'"
      type="source"
      :position="Position.Right"
      :connectable="!readonly"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  Handle,
  Position,
} from "@vue-flow/core";

defineProps<{
  id: string;
  data?: {
    label: string;
    nodeType: string;
    config: Record<string, any>;
  };
  selected?: boolean;
  nodeType: string;
  readonly?: boolean;
}>();

const iconMap: Record<string, string> = {
  start: "▶",
  approve: "✍",
  condition: "◆",
  parallel: "☰",
  end: "■",
};
</script>

<style scoped>
.bpm-node {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 2px solid #dcdfe6;
  background: #fff;
  font-size: 13px;
  min-width: 80px;
  cursor: default;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.bpm-node.is-selected {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}

.bpm-node--start {
  border-color: #67c23a;
  background: #f0f9eb;
}

.bpm-node--start .bpm-node__icon {
  color: #67c23a;
}

.bpm-node--approve {
  border-color: #409eff;
  background: #ecf5ff;
}

.bpm-node--approve .bpm-node__icon {
  color: #409eff;
}

.bpm-node--condition {
  border-color: #e6a23c;
  background: #fdf6ec;
  border-radius: 2px;
}

.bpm-node--condition .bpm-node__icon {
  color: #e6a23c;
}

.bpm-node--parallel {
  border-color: #909399;
  background: #f4f4f5;
}

.bpm-node--parallel .bpm-node__icon {
  color: #909399;
}

.bpm-node--end {
  border-color: #f56c6c;
  background: #fef0f0;
}

.bpm-node--end .bpm-node__icon {
  color: #f56c6c;
}

.bpm-node__icon {
  font-size: 16px;
  flex-shrink: 0;
}

.bpm-node__label {
  white-space: nowrap;
}
</style>
