<template>
  <div class="flow-cond-group">
    <!-- 添加条件按钮 -->
    <div
      v-if="!readonly"
      class="flow-cond-group__add-btn"
      @click="onAddCondition"
    >
      添加条件
    </div>

    <!-- 分支容器 -->
    <div class="flow-cond-group__branches">
      <div
        v-for="(branch, idx) in conditions"
        :key="branch.id"
        class="flow-cond-branch"
      >
        <!-- 顶部横线 -->
        <div class="flow-cond-branch__top-line">
          <div
            class="flow-cond-branch__h-line"
            :class="{
              'flow-cond-branch__h-line--left': idx === 0,
              'flow-cond-branch__h-line--right': idx === conditions.length - 1,
              'flow-cond-branch__h-line--mid': idx > 0 && idx < conditions.length - 1,
            }"
          ></div>
        </div>

        <!-- 条件卡片 -->
        <div class="flow-cond-branch__card-wrap">
          <div class="flow-cond-branch__v-line"></div>
          <div
            class="flow-cond-branch__card"
            :class="{ 'is-active': editingNodeId === branch.id }"
            @click="onClickBranch(branch)"
          >
            <div class="flow-cond-branch__card-header">
              <span class="flow-cond-branch__card-title">{{ branch.label }}</span>
              <span class="flow-cond-branch__card-priority">优先级{{ branch.priority }}</span>
            </div>
            <div class="flow-cond-branch__card-body">
              {{ branch.expression || "请设置条件" }}
            </div>
            <ElIconClose
              v-if="!readonly && conditions.length > 2"
              class="flow-cond-branch__close"
              un-w="3.5"
              un-h="3.5"
              @click.stop="onRemoveBranch(idx)"
            />
          </div>
        </div>

        <!-- 分支内子链 -->
        <div class="flow-cond-branch__children">
          <FlowAddButton
            :readonly="readonly"
            @add="(type: string) => onInsertInBranch(branch, type)"
          />
          <FlowNodeWrap
            v-if="branch.child"
            :node="branch.child"
            :readonly="readonly"
            :editing-node-id="editingNodeId"
            :node-statuses="nodeStatuses"
            @select="(id: string) => emit('select', id)"
            @insert="(targetId: string, type: string) => emit('insert', targetId, type)"
            @remove="(id: string) => emit('remove', id)"
            @update="emit('update')"
            @click-branch="(br: any) => emit('click-branch', br)"
          />
        </div>

        <!-- 底部横线 -->
        <div class="flow-cond-branch__bottom-line">
          <div
            class="flow-cond-branch__h-line"
            :class="{
              'flow-cond-branch__h-line--left': idx === 0,
              'flow-cond-branch__h-line--right': idx === conditions.length - 1,
              'flow-cond-branch__h-line--mid': idx > 0 && idx < conditions.length - 1,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  ConditionBranch,
  InsertableNodeType,
  NodeStatusMap,
} from "./FlowTypes";
import { genCondId } from "./FlowTypes";
import FlowAddButton from "./FlowAddButton.vue";

defineOptions({ name: "FlowConditionGroup" });

const props = defineProps<{
  conditions: ConditionBranch[];
  readonly?: boolean;
  editingNodeId?: string;
  nodeStatuses?: NodeStatusMap;
}>();

const emit = defineEmits<{
  select: [id: string];
  insert: [targetId: string, type: string];
  remove: [id: string];
  update: [];
  "click-branch": [branch: ConditionBranch];
}>();

function onAddCondition() {
  const newPriority = props.conditions.length + 1;
  props.conditions.push({
    id: genCondId(),
    label: `条件${newPriority}`,
    priority: newPriority,
    expression: "",
    child: null,
  });
  emit("update");
}

function onRemoveBranch(idx: number) {
  props.conditions.splice(idx, 1);
  // 重新排序 priority
  props.conditions.forEach((br, i) => {
    br.priority = i + 1;
    br.label = `条件${i + 1}`;
  });
  emit("update");
}

function onClickBranch(branch: ConditionBranch) {
  if (!props.readonly) {
    emit("click-branch", branch);
  }
}

function onInsertInBranch(
  branch: ConditionBranch,
  type: string,
) {
  // 通知父组件：在该 branch 的末尾（最后一个节点之后）插入
  // 但我们直接用 tail 插入的方式，通过 emit insert 交给 FlowDesigner 处理
  // 这里如果 branch.child 为 null，就是在 branch 上直接插入第一个
  emit(
    "insert",
    branch.child ? getTailId(branch.child) : `branch:${branch.id}`,
    type,
  );
}

function getTailId(node: { id: string; child: any }): string {
  if (!node.child) return node.id;
  return getTailId(node.child);
}
</script>

<style scoped>
.flow-cond-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.flow-cond-group__add-btn {
  font-size: 12px;
  color: #15bc83;
  cursor: pointer;
  padding: 2px 8px;
  border: 1px solid #15bc83;
  border-radius: 12px;
  background: #fff;
  z-index: 2;
  margin-bottom: -6px;
  transition: all 0.2s;
}

.flow-cond-group__add-btn:hover {
  background: #15bc83;
  color: #fff;
}

.flow-cond-group__branches {
  display: flex;
  align-items: stretch;
}

.flow-cond-branch {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 220px;
}

.flow-cond-branch__top-line,
.flow-cond-branch__bottom-line {
  width: 100%;
  position: relative;
  height: 2px;
}

.flow-cond-branch__h-line {
  position: absolute;
  top: 0;
  height: 2px;
  background: #cacaca;
}

.flow-cond-branch__h-line--left {
  left: 50%;
  right: 0;
}

.flow-cond-branch__h-line--right {
  left: 0;
  right: 50%;
}

.flow-cond-branch__h-line--mid {
  left: 0;
  right: 0;
}

.flow-cond-branch__card-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flow-cond-branch__v-line {
  width: 2px;
  height: 16px;
  background: #cacaca;
}

.flow-cond-branch__card {
  width: 200px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.flow-cond-branch__card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.flow-cond-branch__card.is-active {
  border-color: #15bc83;
  box-shadow: 0 0 0 2px var(--el-color-primary);
}

.flow-cond-branch__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  padding-right: 24px;
  font-size: 12px;
  box-sizing: border-box;
}

.flow-cond-branch__card-title {
  color: #15bc83;
  font-weight: 600;
}

.flow-cond-branch__card-priority {
  color: #999;
  font-size: 12px;
}

.flow-cond-branch__card-body {
  padding: 6px 12px 10px;
  font-size: 13px;
  color: #666;
  min-height: 20px;
}

.flow-cond-branch__close {
  position: absolute;
  top: 4px;
  right: 4px;
  color: #999;
  cursor: pointer;
  border-radius: 50%;
  padding: 2px;
}

.flow-cond-branch__close:hover {
  color: #f56c6c;
  background: #fef0f0;
}

.flow-cond-branch__children {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.flow-cond-branch__children::after {
  content: "";
  width: 2px;
  flex: 1;
  background: #cacaca;
}
</style>
