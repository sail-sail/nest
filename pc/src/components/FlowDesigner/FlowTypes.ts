/** BPM 链式流程图 — 类型定义 */

/** 审批节点配置 */
export interface ApproveConfig {
  assignee_type: string;
  assignee_users: string[];
  assignee_roles: string[];
  approve_method: string;
  counter_sign_ratio: number;
  can_return: boolean;
  can_transfer: boolean;
  can_add_sign: boolean;
  timeout_hours: number;
  timeout_action: string;
}

/** 抄送节点配置 */
export interface CcConfig {
  cc_type: string;
  cc_users: string[];
  cc_roles: string[];
}

/** 条件分支 */
export interface ConditionBranch {
  id: string;
  label: string;
  priority: number;
  expression: string;
  child: FlowNode | null;
}

/** 流程节点（链式树） */
export interface FlowNode {
  id: string;
  type: "start" | "approve" | "condition_group" | "cc" | "end";
  label: string;
  config: ApproveConfig | CcConfig | Record<string, any>;
  /** condition_group 特有 */
  conditions?: ConditionBranch[];
  /** 下一个节点 */
  child: FlowNode | null;
}

/** 节点类型定义（用于 UI） */
export type InsertableNodeType = "approve" | "cc" | "condition_group";

/** 节点状态映射（只读查看用） */
export type NodeStatusMap = Record<string, string>;

/** 默认审批配置 */
export function defaultApproveConfig(): ApproveConfig {
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
  };
}

/** 默认抄送配置 */
export function defaultCcConfig(): CcConfig {
  return {
    cc_type: "user",
    cc_users: [],
    cc_roles: [],
  };
}

let _nodeIdSeq = 0;

/** 重置 ID 计数器 */
export function resetNodeIdSeq(start = 0) {
  _nodeIdSeq = start;
}

/** 生成唯一节点 ID */
export function genNodeId(): string {
  return `node_${String(++_nodeIdSeq).padStart(3, "0")}`;
}

/** 生成唯一条件 ID */
export function genCondId(): string {
  return `cond_${String(++_nodeIdSeq).padStart(3, "0")}`;
}

/** 创建默认流程（仅 start 节点） */
export function createDefaultFlow(): FlowNode {
  return {
    id: genNodeId(),
    type: "start",
    label: "发起人",
    config: {},
    child: null,
  };
}

/** 创建默认条件分支 */
export function createDefaultConditions(): ConditionBranch[] {
  return [
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
  ];
}

/** 创建默认条件分支组 */
export function createConditionGroupNode(): FlowNode {
  return {
    id: genNodeId(),
    type: "condition_group",
    label: "条件分支",
    config: {},
    conditions: createDefaultConditions(),
    child: null,
  };
}

/** 扫描树中最大 ID 序号，用于 resetNodeIdSeq */
export function scanMaxId(node: FlowNode | null): number {
  if (!node) return 0;
  const num = parseInt(node.id.replace(/\D/g, ""), 10) || 0;
  let max = num;
  if (node.conditions) {
    for (const br of node.conditions) {
      const bNum = parseInt(br.id.replace(/\D/g, ""), 10) || 0;
      if (bNum > max) max = bNum;
      const childMax = scanMaxId(br.child);
      if (childMax > max) max = childMax;
    }
  }
  const childMax = scanMaxId(node.child);
  if (childMax > max) max = childMax;
  return max;
}

/** 在目标节点后面插入新节点 */
export function insertAfter(
  root: FlowNode,
  targetId: string,
  newNode: FlowNode,
): boolean {
  if (root.id === targetId) {
    newNode.child = root.child;
    root.child = newNode;
    return true;
  }
  if (root.conditions) {
    for (const br of root.conditions) {
      if (br.child && insertAfter(br.child, targetId, newNode)) {
        return true;
      }
    }
  }
  if (root.child) {
    return insertAfter(root.child, targetId, newNode);
  }
  return false;
}

/** 删除指定 ID 的节点（将其 child 接回父节点） */
export function removeNode(
  root: FlowNode,
  targetId: string,
): boolean {
  // 不允许删除根节点 (start)
  if (root.id === targetId) return false;

  if (root.child?.id === targetId) {
    const removed = root.child;
    if (removed.type === "condition_group") {
      // 删除条件组：直接跳到条件组的 child
      root.child = removed.child;
    } else {
      root.child = removed.child;
    }
    return true;
  }

  if (root.conditions) {
    for (const br of root.conditions) {
      if (br.child?.id === targetId) {
        br.child = br.child.child;
        return true;
      }
      if (br.child && removeNode(br.child, targetId)) {
        return true;
      }
    }
  }

  if (root.child) {
    return removeNode(root.child, targetId);
  }
  return false;
}

/** 查找节点 */
export function findNode(
  root: FlowNode | null,
  targetId: string,
): FlowNode | null {
  if (!root) return null;
  if (root.id === targetId) return root;
  if (root.conditions) {
    for (const br of root.conditions) {
      const found = findNode(br.child, targetId);
      if (found) return found;
    }
  }
  return findNode(root.child, targetId);
}
