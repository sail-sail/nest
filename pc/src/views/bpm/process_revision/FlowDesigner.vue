<template>
<div
  class="flow-designer"
  :class="{ 'is-readonly': readonly }"
>
  <!-- 工具栏 -->
  <div
    v-if="!readonly"
    class="flow-toolbar"
  >
    <el-button
      size="small"
      @click="addNode('start')"
      :disabled="hasStartNode"
    >
      <span class="node-dot node-dot--start"></span>
      开始
    </el-button>
    <el-button
      size="small"
      @click="addNode('approve')"
    >
      <span class="node-dot node-dot--approve"></span>
      审批
    </el-button>
    <el-button
      size="small"
      @click="addNode('condition')"
    >
      <span class="node-dot node-dot--condition"></span>
      条件
    </el-button>
    <el-button
      size="small"
      @click="addNode('parallel')"
    >
      <span class="node-dot node-dot--parallel"></span>
      并行
    </el-button>
    <el-button
      size="small"
      @click="addNode('end')"
    >
      <span class="node-dot node-dot--end"></span>
      结束
    </el-button>
    <el-divider direction="vertical" />
    <el-button
      size="small"
      :disabled="!selectedNodes.length && !selectedEdges.length"
      @click="deleteSelected"
    >
      删除选中
    </el-button>
  </div>

  <!-- 流程图画布 -->
  <div class="flow-canvas">
    <VueFlow
      v-model:nodes="flowNodes"
      v-model:edges="flowEdges"
      :nodes-draggable="!readonly"
      :nodes-connectable="!readonly"
      :elements-selectable="!readonly"
      :edges-updatable="!readonly"
      :delete-key-code="readonly ? null : 'Delete'"
      :fit-view-on-init="true"
      :default-edge-options="defaultEdgeOptions"
      @nodes-change="onNodesChange"
      @edges-change="onEdgesChange"
      @connect="onConnect"
    >
      <template #node-bpmStart="nodeProps">
        <BpmNode
          v-bind="nodeProps"
          node-type="start"
          :readonly="readonly"
        />
      </template>
      <template #node-bpmApprove="nodeProps">
        <BpmNode
          v-bind="nodeProps"
          node-type="approve"
          :readonly="readonly"
        />
      </template>
      <template #node-bpmCondition="nodeProps">
        <BpmNode
          v-bind="nodeProps"
          node-type="condition"
          :readonly="readonly"
        />
      </template>
      <template #node-bpmParallel="nodeProps">
        <BpmNode
          v-bind="nodeProps"
          node-type="parallel"
          :readonly="readonly"
        />
      </template>
      <template #node-bpmEnd="nodeProps">
        <BpmNode
          v-bind="nodeProps"
          node-type="end"
          :readonly="readonly"
        />
      </template>

      <Background />
      <MiniMap />
      <Controls :show-interactive="!readonly" />
    </VueFlow>
  </div>

  <!-- 节点属性编辑面板 -->
  <div
    v-if="!readonly && editingNode"
    class="flow-panel"
  >
    <div class="flow-panel__header">
      <span>{{ nodeTypeLabel(editingNode.data?.nodeType ?? '') }} - 属性</span>
      <el-button
        link
        @click="editingNode = undefined"
      >
        <ElIconClose
          un-w="5"
          un-h="5"
          un-text="hover:red"
        />
      </el-button>
    </div>
    <el-form
      label-width="80px"
      size="small"
    >
      <el-form-item label="名称">
        <el-input
          v-model="editingNode.data!.label"
          @change="syncToModel"
        />
      </el-form-item>

      <template v-if="editingNode.data?.nodeType === 'approve'">
        <el-form-item label="处理人">
          <el-select
            v-model="editingNode.data!.config.assignee_type"
            @change="syncToModel"
          >
            <el-option
              label="指定用户"
              value="user"
            />
            <el-option
              label="指定角色"
              value="role"
            />
            <el-option
              label="部门负责人"
              value="dept_head"
            />
            <el-option
              label="上级部门负责人"
              value="parent_dept_head"
            />
            <el-option
              label="发起人自选"
              value="starter_select"
            />
            <el-option
              label="表单字段"
              value="form_field"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审批方式">
          <el-select
            v-model="editingNode.data!.config.approve_method"
            @change="syncToModel"
          >
            <el-option
              label="或签"
              value="or_sign"
            />
            <el-option
              label="会签"
              value="counter_sign"
            />
            <el-option
              label="依次审批"
              value="sequential"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
  </div>
</div>
</template>

<script lang="ts" setup>
import {
  VueFlow,
  useVueFlow,
  type Node as FlowNode,
  type Edge as FlowEdge,
  type Connection,
  Position,
  MarkerType,
} from "@vue-flow/core";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import "@vue-flow/minimap/dist/style.css";
import "@vue-flow/controls/dist/style.css";

import BpmNode from "./BpmNode.vue";

interface BpmNodeData {
  label: string;
  nodeType: string;
  config: Record<string, any>;
}

interface GraphJsonNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  config: Record<string, any>;
}

interface GraphJsonEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

interface GraphJson {
  nodes: GraphJsonNode[];
  edges: GraphJsonEdge[];
}

const props = defineProps<{
  modelValue?: string | null;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const nodeTypeMap: Record<string, string> = {
  start: "bpmStart",
  approve: "bpmApprove",
  condition: "bpmCondition",
  parallel: "bpmParallel",
  end: "bpmEnd",
};

const reverseNodeTypeMap: Record<string, string> = {};
for (const [k, v] of Object.entries(nodeTypeMap)) {
  reverseNodeTypeMap[v] = k;
}

function nodeTypeLabel(type: string) {
  const map: Record<string, string> = {
    start: "开始节点",
    approve: "审批节点",
    condition: "条件分支",
    parallel: "并行网关",
    end: "结束节点",
  };
  return map[type] ?? type;
}

const defaultEdgeOptions = {
  type: "smoothstep",
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
};

let flowNodes = $ref<any[]>([]);
let flowEdges = $ref<any[]>([]);
let editingNode = $ref<any>();
let nodeIdCounter = 0;
let edgeIdCounter = 0;
let syncing = false;

const {
  onNodeClick,
  getSelectedNodes: selectedNodes,
  getSelectedEdges: selectedEdges,
  addEdges,
} = useVueFlow();

onNodeClick(({ node }) => {
  if (!props.readonly) {
    editingNode = node;
  }
});

const hasStartNode = $computed(() => {
  return flowNodes.some((n) => n.data?.nodeType === "start");
});

/** graph_json → vue-flow nodes/edges */
function parseGraphJson(jsonStr?: string | null) {
  if (!jsonStr) {
    return { nodes: [], edges: [] };
  }
  let graph: GraphJson;
  try {
    graph = JSON.parse(jsonStr);
  } catch {
    return { nodes: [], edges: [] };
  }
  if (!graph?.nodes || !graph?.edges) {
    return { nodes: [], edges: [] };
  }

  const nodes = graph.nodes.map((n) => {
    const numId = parseInt(n.id.replace(/\D/g, ""), 10) || 0;
    if (numId >= nodeIdCounter) nodeIdCounter = numId + 1;
    return {
      id: n.id,
      type: nodeTypeMap[n.type] || "bpmApprove",
      position: { x: n.x, y: n.y },
      data: {
        label: n.label,
        nodeType: n.type,
        config: n.config ?? {},
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  });

  const edges = graph.edges.map((e) => {
    const numId = parseInt(e.id.replace(/\D/g, ""), 10) || 0;
    if (numId >= edgeIdCounter) edgeIdCounter = numId + 1;
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label || "",
      type: "smoothstep",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
  });

  return { nodes, edges };
}

/** vue-flow nodes/edges → graph_json */
function toGraphJson(): string {
  const nodes: GraphJsonNode[] = [];
  for (const n of flowNodes) {
    nodes.push({
      id: n.id,
      type: n.data?.nodeType ?? "approve",
      label: n.data?.label ?? "",
      x: Math.round(n.position.x),
      y: Math.round(n.position.y),
      config: n.data?.config ?? {},
    });
  }
  const edges: GraphJsonEdge[] = [];
  for (const e of flowEdges) {
    edges.push({
      id: e.id,
      source: e.source,
      target: e.target,
      label: typeof e.label === "string" ? e.label : "",
    });
  }
  const graph: GraphJson = { nodes, edges };
  return JSON.stringify(
    graph,
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
      toGraphJson(),
    );
    syncing = false;
  });
}

function getDefaultConfig(type: string): Record<string, any> {
  if (type === "approve") {
    return {
      assignee_type: "user",
      assignee_users: [],
      assignee_roles: [],
      approve_method: "or_sign",
      counter_sign_ratio: 100,
      can_return: true,
      can_transfer: true,
      can_add_sign: true,
      timeout_hours: 0,
      timeout_action: "none",
      cc_users: [],
      cc_roles: [],
    };
  }
  if (type === "condition") {
    return {
      conditions: [],
      default_edge_id: "",
    };
  }
  return {};
}

function addNode(type: string) {
  const id = `node_${String(++nodeIdCounter).padStart(3, "0")}`;
  const labelMap: Record<string, string> = {
    start: "开始",
    approve: "审批节点",
    condition: "条件分支",
    parallel: "并行网关",
    end: "结束",
  };
  const newNode = {
    id,
    type: nodeTypeMap[type] || "bpmApprove",
    position: {
      x: 100 + flowNodes.length * 200,
      y: 200,
    },
    data: {
      label: labelMap[type] ?? type,
      nodeType: type,
      config: getDefaultConfig(type),
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };
  flowNodes = [...flowNodes, newNode];
  syncToModel();
}

function deleteSelected() {
  const selNodeIds = new Set(
    selectedNodes.value.map((n: FlowNode) => n.id),
  );
  const selEdgeIds = new Set(
    selectedEdges.value.map((e: FlowEdge) => e.id),
  );
  flowNodes = flowNodes.filter((n) => !selNodeIds.has(n.id));
  flowEdges = flowEdges.filter(
    (e) => !selEdgeIds.has(e.id) && !selNodeIds.has(e.source) && !selNodeIds.has(e.target),
  );
  editingNode = undefined;
  syncToModel();
}

function onConnect(connection: Connection) {
  const id = `edge_${String(++edgeIdCounter).padStart(3, "0")}`;
  addEdges([
    {
      ...connection,
      id,
      type: "smoothstep",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
  ]);
  nextTick(() => syncToModel());
}

function onNodesChange() {
  syncToModel();
}

function onEdgesChange() {
  syncToModel();
}

// 监听外部 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    if (syncing) return;
    const { nodes, edges } = parseGraphJson(val);
    flowNodes = nodes;
    flowEdges = edges;
  },
  { immediate: true },
);
</script>

<style scoped>
.flow-designer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.flow-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  flex-shrink: 0;
}

.node-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
}

.node-dot--start {
  background: #67c23a;
}

.node-dot--approve {
  background: #409eff;
}

.node-dot--condition {
  background: #e6a23c;
}

.node-dot--parallel {
  background: #909399;
}

.node-dot--end {
  background: #f56c6c;
}

.flow-canvas {
  flex: 1;
  min-height: 0;
}

.flow-panel {
  position: absolute;
  top: 50px;
  right: 0;
  width: 280px;
  background: var(--el-bg-color);
  border-left: 1px solid var(--el-border-color);
  height: calc(100% - 50px);
  overflow: auto;
  z-index: 10;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.flow-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--el-border-color);
  font-weight: 600;
  font-size: 13px;
}

.flow-panel :deep(.el-form) {
  padding: 12px;
}

.is-readonly .flow-canvas {
  height: 100%;
}
</style>
