<template>
  <div
    class="flow-designer"
    :class="{ 'is-readonly': readonly }"
  >
    <!-- 流程画布 -->
    <div
      class="flow-designer__canvas"
      @click.self="closeConfig"
    >
      <FlowNodeWrap
        v-if="flowRoot"
        :node="flowRoot"
        :readonly="readonly"
        :editing-node-id="editingNodeId"
        :node-statuses="nodeStatuses"
        :is-leaf-end="true"
        @select="onSelectNode"
        @insert="onInsertNode"
        @remove="onRemoveNode"
        @update="syncToModel"
        @click-branch="onClickBranch"
      />
      <div
        v-else-if="!readonly"
        class="flow-designer__empty"
        @click="initFlow"
      >
        <ElIconPlus un-w="8" un-h="8" />
        <span>点击初始化流程</span>
      </div>
    </div>

    <!-- 右侧属性面板 -->
    <FlowNodeConfig
      v-if="!readonly && (editingNodeRef || editingBranchRef)"
      :node-ref="editingNodeRef"
      :branch-ref="editingBranchRef"
      @close="closeConfig"
      @update="syncToModel"
    />
  </div>
</template>

<script lang="ts" setup>
import type {
  FlowNode,
  ConditionBranch,
  InsertableNodeType,
  NodeStatusMap,
} from "./FlowTypes";
import {
  createDefaultFlow,
  scanMaxId,
  resetNodeIdSeq,
  genNodeId,
  genCondId,
  defaultApproveConfig,
  defaultCcConfig,
  insertAfter,
  removeNode,
  findNode,
} from "./FlowTypes";
import FlowNodeWrap from "./FlowNodeWrap.vue";
import FlowNodeConfig from "./FlowNodeConfig.vue";

const props = defineProps<{
  modelValue?: string | null;
  readonly?: boolean;
  nodeStatuses?: NodeStatusMap;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

let flowRoot = $ref<FlowNode | null>(null);
let editingNodeId = $ref<string>("");
let editingNodeRef = $ref<FlowNode | null>(null);
let editingBranchRef = $ref<ConditionBranch | null>(null);
let syncing = false;

/** 解析外部传入的 graph_json 链式树 */
function parseJson(jsonStr?: string | null): FlowNode | null {
  if (!jsonStr) return null;
  try {
    const obj = JSON.parse(jsonStr);
    if (!obj || !obj.id || !obj.type) return null;
    return obj as FlowNode;
  } catch {
    return null;
  }
}

/** 链式树 → JSON 字符串 */
function toJson(): string {
  if (!flowRoot) return "";
  return JSON.stringify(
    flowRoot,
    null,
    2,
  );
}

function syncToModel() {
  if (syncing) return;
  syncing = true;
  nextTick(() => {
    emit(
      "update:modelValue",
      toJson(),
    );
    syncing = false;
  });
}

function initFlow() {
  resetNodeIdSeq(0);
  flowRoot = createDefaultFlow();
  syncToModel();
}

/** 选中节点 → 打开属性面板 */
function onSelectNode(id: string) {
  if (props.readonly) return;
  editingBranchRef = null;
  editingNodeId = id;
  editingNodeRef = findNode(flowRoot, id);
}

/** 点击条件分支卡片 */
function onClickBranch(branch: ConditionBranch) {
  if (props.readonly) return;
  editingNodeRef = null;
  editingNodeId = branch.id;
  editingBranchRef = branch;
}

function closeConfig() {
  editingNodeId = "";
  editingNodeRef = null;
  editingBranchRef = null;
}

/** 在 targetId 之后插入节点 */
function onInsertNode(
  targetId: string,
  type: string,
) {
  if (!flowRoot) return;

  const nodeType = type as InsertableNodeType;

  // 特殊：插入到空分支
  if (targetId.startsWith("branch:")) {
    const branchId = targetId.slice(7);
    const brNode = findBranch(flowRoot, branchId);
    if (brNode) {
      brNode.child = createNode(nodeType);
      syncToModel();
      return;
    }
  }

  if (nodeType === "condition_group") {
    // 条件分支组
    const condGroup: FlowNode = {
      id: genNodeId(),
      type: "condition_group",
      label: "",
      config: {},
      conditions: [
        {
          id: genCondId(),
          label: "条件1",
          priority: 1,
          expression: "",
          child: null,
        },
        {
          id: genCondId(),
          label: "条件2",
          priority: 2,
          expression: "",
          child: null,
        },
      ],
      child: null,
    };
    insertAfter(flowRoot, targetId, condGroup);
  } else {
    const newNode = createNode(nodeType);
    insertAfter(flowRoot, targetId, newNode);
  }
  syncToModel();
}

function createNode(type: InsertableNodeType): FlowNode {
  const labelMap: Record<string, string> = {
    approve: "审核人",
    cc: "抄送人",
  };
  return {
    id: genNodeId(),
    type,
    label: labelMap[type] ?? type,
    config: type === "approve"
      ? defaultApproveConfig()
      : type === "cc"
        ? defaultCcConfig()
        : {},
    child: null,
  };
}

function onRemoveNode(id: string) {
  if (!flowRoot) return;
  removeNode(flowRoot, id);
  if (editingNodeId === id) {
    closeConfig();
  }
  syncToModel();
}

/** 在链式树中查找 ConditionBranch */
function findBranch(
  node: FlowNode | null,
  branchId: string,
): ConditionBranch | null {
  if (!node) return null;
  if (node.conditions) {
    for (const br of node.conditions) {
      if (br.id === branchId) return br;
      const found = findBranch(br.child, branchId);
      if (found) return found;
    }
  }
  return findBranch(node.child, branchId);
}

// 监听外部传入
watch(
  () => props.modelValue,
  (val) => {
    if (syncing) return;
    const parsed = parseJson(val);
    flowRoot = parsed;
    if (parsed) {
      resetNodeIdSeq(scanMaxId(parsed));
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.flow-designer {
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.flow-designer__canvas {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  min-height: 400px;
}

.flow-designer__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  padding: 80px 0;
  font-size: 14px;
  transition: color 0.2s;
}

.flow-designer__empty:hover {
  color: var(--el-color-primary);
}

</style>
