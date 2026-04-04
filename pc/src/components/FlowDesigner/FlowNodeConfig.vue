<template>
  <div class="flow-node-config">
    <div class="flow-node-config__header">
      <span>{{ title }} - 属性</span>
      <el-button
        link
        @click="emit('close')"
      >
        <ElIconClose
          un-w="5"
          un-h="5"
          un-text="hover:red"
        />
      </el-button>
    </div>
    <div class="flow-node-config__body">
      <el-form
        label-width="auto"
        
        un-grid="~ cols-[repeat(1,320px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
      >
        <!-- 通用：名称 -->
        <el-form-item
          v-if="editType !== 'branch'"
          label="名称"
        >
          <el-input
            v-model="nodeRef!.label"
            @input="emit('update')"
          />
        </el-form-item>

        <!-- ======= 审批节点 ======= -->
        <template v-if="editType === 'approve'">
          <el-form-item label="处理人">
            <el-select
              v-model="(nodeRef!.config as any).assignee_type"
              @change="emit('update')"
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
                label="直接主管"
                value="dept_head"
              />
              <el-option
                label="上级主管"
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
              v-model="(nodeRef!.config as any).approve_method"
              @change="emit('update')"
            >
              <el-option
                label="或签(任一人通过)"
                value="or_sign"
              />
              <el-option
                label="会签(按比例)"
                value="counter_sign"
              />
              <el-option
                label="依次审批"
                value="sequential"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="(nodeRef!.config as any).approve_method === 'counter_sign'"
            label="通过比例(%)"
          >
            <el-input-number
              v-model="(nodeRef!.config as any).counter_sign_ratio"
              :min="1"
              :max="100"
              @change="emit('update')"
            />
          </el-form-item>

          <el-form-item label="允许退回">
            <el-switch
              v-model="(nodeRef!.config as any).can_return"
              @change="emit('update')"
            />
          </el-form-item>

          <el-form-item label="允许转交">
            <el-switch
              v-model="(nodeRef!.config as any).can_transfer"
              @change="emit('update')"
            />
          </el-form-item>

          <el-form-item label="允许加签">
            <el-switch
              v-model="(nodeRef!.config as any).can_add_sign"
              @change="emit('update')"
            />
          </el-form-item>
        </template>

        <!-- ======= 抄送节点 ======= -->
        <template v-if="editType === 'cc'">
          <el-form-item label="抄送规则">
            <el-select
              v-model="(nodeRef!.config as any).cc_type"
              @change="emit('update')"
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
                label="发起人自选"
                value="starter_select"
              />
            </el-select>
          </el-form-item>
        </template>

        <!-- ======= 条件分支 ======= -->
        <template v-if="editType === 'branch'">
          <el-form-item label="条件名称">
            <el-input
              v-model="branchRef!.label"
              @input="emit('update')"
            />
          </el-form-item>
          <el-form-item label="优先级">
            <el-input-number
              v-model="branchRef!.priority"
              :min="1"
              @change="emit('update')"
            />
          </el-form-item>
          <el-form-item label="条件表达式">
            <el-input
              v-model="branchRef!.expression"
              type="textarea"
              :rows="3"
              placeholder="留空表示兜底分支"
              @input="emit('update')"
            />
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  FlowNode,
  ConditionBranch,
} from "./FlowTypes";

const props = defineProps<{
  nodeRef?: FlowNode | null;
  branchRef?: ConditionBranch | null;
}>();

const emit = defineEmits<{
  close: [];
  update: [];
}>();

const editType = $computed(() => {
  if (props.branchRef) return "branch";
  return props.nodeRef?.type ?? "";
});

const title = $computed(() => {
  if (editType === "branch") return "条件分支";
  const map: Record<string, string> = {
    start: "发起人",
    approve: "审核人",
    cc: "抄送人",
    condition_group: "条件分支",
    end: "结束",
  };
  return map[editType] ?? editType;
});
</script>

<style scoped>
.flow-node-config {
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  border: 1px solid var(--el-border-color);
  border-right: none;
  border-top: none;
  z-index: 20;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color-overlay);
}

.flow-node-config__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color);
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.flow-node-config__body {
  flex: 1;
  overflow: auto;
  padding: 16px;
}
</style>
