<template>
  <div class="flow-node-wrap">
    <!-- 节点卡片 -->
    <div
      class="flow-node-card"
      :class="[
        `flow-node-card--${node.type}`,
        {
          'is-active': editingNodeId === node.id,
          [`is-status-${nodeStatus}`]: !!nodeStatus,
        },
      ]"
      @click="emit('select', node.id)"
    >
      <!-- 节点头部 -->
      <div class="flow-node-card__header">
        <span class="flow-node-card__icon">{{ iconMap[node.type] }}</span>
        <span class="flow-node-card__type-lbl">{{ typeLabelMap[node.type] }}</span>
        <ElIconClose
          v-if="!readonly && canRemove"
          class="flow-node-card__close"
          un-w="3.5"
          un-h="3.5"
          @click.stop="emit('remove', node.id)"
        />
      </div>
      <!-- 节点体 -->
      <div class="flow-node-card__body">
        <span class="flow-node-card__label">{{ bodyText }}</span>
        <ElIconArrowRight
          v-if="!readonly && hasConfig"
          class="flow-node-card__arrow"
          un-w="4"
          un-h="4"
        />
      </div>
    </div>

    <!-- "+" 按钮 -->
    <FlowAddButton
      v-if="node.type !== 'end'"
      :readonly="readonly"
      @add="(type: string) => emit('insert', node.id, type)"
    />

    <!-- 条件分支组 -->
    <template v-if="node.child?.type === 'condition_group'">
      <FlowConditionGroup
        :conditions="node.child.conditions!"
        :readonly="readonly"
        :editing-node-id="editingNodeId"
        :node-statuses="nodeStatuses"
        @select="(id: string) => emit('select', id)"
        @insert="(targetId: string, type: string) => emit('insert', targetId, type)"
        @remove="(id: string) => emit('remove', id)"
        @update="emit('update')"
        @click-branch="(br: any) => emit('click-branch', br)"
      />
      <!-- 条件组汇合后的 "+" 按钮 -->
      <FlowAddButton
        :readonly="readonly"
        @add="(type: string) => emit('insert', node.child!.id, type)"
      />
      <!-- 条件组汇合后的 child 递归 -->
      <FlowNodeWrap
        v-if="node.child.child"
        :node="node.child.child"
        :readonly="readonly"
        :editing-node-id="editingNodeId"
        :node-statuses="nodeStatuses"
        @select="(id: string) => emit('select', id)"
        @insert="(targetId: string, type: string) => emit('insert', targetId, type)"
        @remove="(id: string) => emit('remove', id)"
        @update="emit('update')"
        @click-branch="(br: any) => emit('click-branch', br)"
      />
    </template>

    <!-- 普通 child 递归 -->
    <template v-else-if="node.child">
      <FlowNodeWrap
        :node="node.child"
        :readonly="readonly"
        :editing-node-id="editingNodeId"
        :node-statuses="nodeStatuses"
        @select="(id: string) => emit('select', id)"
        @insert="(targetId: string, type: string) => emit('insert', targetId, type)"
        @remove="(id: string) => emit('remove', id)"
        @update="emit('update')"
        @click-branch="(br: any) => emit('click-branch', br)"
      />
    </template>

    <!-- 最末节点 — 流程结束标记 -->
    <template v-if="!node.child && isLeafEnd">
      <div class="flow-end-dot">
        <div class="flow-end-dot__circle"></div>
        <span class="flow-end-dot__text">流程结束</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type {
  FlowNode,
  NodeStatusMap,
} from "./FlowTypes";
import FlowAddButton from "./FlowAddButton.vue";
import FlowConditionGroup from "./FlowConditionGroup.vue";

defineOptions({ name: "FlowNodeWrap" });

const props = defineProps<{
  node: FlowNode;
  readonly?: boolean;
  editingNodeId?: string;
  nodeStatuses?: NodeStatusMap;
  /** 是否作为主链末端（显示"流程结束"） */
  isLeafEnd?: boolean;
}>();

const emit = defineEmits<{
  select: [id: string];
  insert: [targetId: string, type: string];
  remove: [id: string];
  update: [];
  "click-branch": [branch: any];
}>();

const iconMap: Record<string, string> = {
  start: "👤",
  approve: "🖊",
  cc: "📨",
  condition_group: "◆",
  end: "■",
};

const typeLabelMap: Record<string, string> = {
  start: "发起人",
  approve: "审核人",
  cc: "抄送人",
  condition_group: "条件分支",
  end: "结束",
};

const nodeStatus = $computed(() => {
  return props.nodeStatuses?.[props.node.id];
});

const canRemove = $computed(() => {
  return props.node.type !== "start";
});

const hasConfig = $computed(() => {
  return props.node.type === "approve" || props.node.type === "cc";
});

const bodyText = $computed(() => {
  const cfg = props.node.config as any;
  if (props.node.type === "start") {
    return "所有人";
  }
  if (props.node.type === "approve") {
    const typeMap: Record<string, string> = {
      user: "指定用户",
      role: "指定角色",
      dept_head: "直接主管",
      parent_dept_head: "上级主管",
      starter_select: "发起人自选",
      form_field: "表单字段",
    };
    return typeMap[cfg?.assignee_type] ?? cfg?.assignee_type ?? "请设置";
  }
  if (props.node.type === "cc") {
    const typeMap: Record<string, string> = {
      user: "指定用户",
      role: "指定角色",
      starter_select: "发起人自选",
    };
    return typeMap[cfg?.cc_type] ?? cfg?.cc_type ?? "请设置";
  }
  return props.node.label;
});
</script>

<style scoped>
.flow-node-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ---- 节点卡片 ---- */
.flow-node-card {
  width: 200px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  background: #fff;
}

.flow-node-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.flow-node-card.is-active {
  box-shadow: 0 0 0 2px var(--el-color-primary);
}

/* 头部颜色 */
.flow-node-card__header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 12px;
  color: #fff;
  position: relative;
}

.flow-node-card--start .flow-node-card__header {
  background: #576a95;
}

.flow-node-card--approve .flow-node-card__header {
  background: #ff943e;
}

.flow-node-card--cc .flow-node-card__header {
  background: #3296fa;
}

.flow-node-card--condition_group .flow-node-card__header {
  background: #15bc83;
}

.flow-node-card--end .flow-node-card__header {
  background: #909399;
}

.flow-node-card__icon {
  font-size: 14px;
}

.flow-node-card__type-lbl {
  flex: 1;
  font-weight: 600;
}

.flow-node-card__close {
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.flow-node-card:hover .flow-node-card__close {
  opacity: 1;
}

.flow-node-card__close:hover {
  transform: scale(1.2);
}

/* 体部 */
.flow-node-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  font-size: 13px;
  color: #666;
  min-height: 20px;
}

.flow-node-card__arrow {
  color: #c0c4cc;
  flex-shrink: 0;
}

/* ---- 只读状态着色 ---- */
.flow-node-card.is-status-completed {
  border: 2px solid #67c23a;
}

.flow-node-card.is-status-running {
  border: 2px solid #3296fa;
}

.flow-node-card.is-status-rejected {
  border: 2px solid #f56c6c;
}

.flow-node-card.is-status-skipped {
  opacity: 0.5;
}

/* ---- 流程结束标记 ---- */
.flow-end-dot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: 8px;
}

.flow-end-dot__circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cacaca;
}

.flow-end-dot__text {
  font-size: 13px;
  color: #999;
}
</style>
