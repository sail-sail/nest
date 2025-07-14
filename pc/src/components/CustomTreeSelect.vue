<template>
<el-tree-select
  v-if="readonly !== true"
  v-model="modelValue"
  filterable
  collapse-tags
  collapse-tags-tooltip
  default-first-option
  :height="props.height"
  class="custom_tree_select"
  :class="{
    hideDisabledCheckbox: props.hideDisabledCheckbox,
  }"
  node-key="id"
  vaule-key="id"
  :props="props.props"
  :multiple="props.multiple"
  :data="data"
  :check-strictly="true"
  :default-expand-all="true"
  :show-checkbox="true"
  :check-on-click-node="true"
  un-w="full"
  v-bind="$attrs"
  :loading="!inited"
  :clearable="!props.disabled"
  @keyup.enter.stop
  @clear="onClear"
  @change="onChange"
  @check-change="onCheck"
  @node-click="onNodeClick"
  @keydown.ctrl.c.stop="copyModelLabel"
  @keyup.ctrl.delete.stop="onClear"
  @keyup.ctrl.backspace.stop="onClear"
>
  <template
    v-for="(_, name) of $slots"
    :key="name"
    #[name]="slotProps"
  >
    <slot
      :name="name"
      v-bind="slotProps"
    ></slot>
  </template>
</el-tree-select>
<template
  v-else
>
  <div
    v-if="props.multiple"
    un-flex="~ gap-1 wrap"
    un-b="1 solid [var(--el-border-color)]"
    un-p="y-0.75 x-1.5"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-7.5"
    un-line-height="normal"
    un-break-words
    class="custom_tree_select_readonly"
    v-bind="$attrs"
  >
    <el-tag
      v-for="label in modelLabels"
      :key="label"
      type="info"
      :disable-transitions="true"
    >
      {{ label }}
    </el-tag>
  </div>
  <div
    v-else
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2.5 y-1"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-words
    class="custom_select_readonly"
    v-bind="$attrs"
  >
    {{ modelLabels[0] || "" }}
  </div>
</template>
</template>

<script lang="ts" setup>
import type {
  TreeNode,
  SelectProps,
  TreeComponentProps,
} from "element-plus";

import type {
  TreeOptionProps,
} from "element-plus/es/components/tree/src/tree.type";

import type {
  ExtractPropTypes,
} from "vue";

import {
  copyText,
} from "@/utils/common";

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "data", value: any[]): void;
  (e: "update:modelValue", value?: string | string[] | null): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any | any[] | null): void;
  (e: "clear"): void;
}>();

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    method: () => Promise<any[]>; // 用于获取数据的方法
    height?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any | any[] | null;
    autoWidth?: boolean;
    maxWidth?: number;
    multiple?: boolean;
    init?: boolean;
    props?: ExtractPropTypes<TreeOptionProps>;
    disabled?: boolean;
    readonly?: boolean;
    hideDisabledCheckbox?: boolean;
  } & Partial<SelectProps> & Partial<TreeComponentProps>>(),
  {
    height: 400,
    modelValue: undefined,
    autoWidth: true,
    maxWidth: 550,
    multiple: false,
    init: true,
    props: () => ({
      label: 'lbl',
      children: 'children',
    }),
    disabled: undefined,
    readonly: undefined,
    hideDisabledCheckbox: true,
  },
);

const {
  nsAsync,
} = useI18n();

async function copyModelLabel() {
  const text = modelLabels.join(",");
  if (!text) {
    return;
  }
  copyText(text);
  ElMessage.success(text + " " + await nsAsync("复制成功"));
}

let inited = $ref(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let data = $ref<any[]>([ ]);

let modelValue = $ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
);

watch(
  () => modelValue,
  () => {
    emit("update:modelValue", modelValue);
  },
);

const modelLabels: string[] = $computed(() => {
  if (!modelValue) {
    return [ "" ];
  }
  const label = props.props.label || "label";
  if (!props.multiple) {
    const model = findModelById(data, modelValue as string)!;
    if (!model) {
      return [ "" ];
    }
    if (typeof label === "string") {
      return [ model[label] || "" ];
    }
    return [ label(data, model) || "" ];
  }
  const models: string[] = [ ];
  const modelValues = (modelValue || [ ]) as string[];
  for (const id of modelValues) {
    const model = findModelById(data, id);
    if (!model) {
      models.push("");
      continue;
    }
    if (typeof label === "string") {
      models.push(model[label] || "");
      continue;
    }
    models.push(label(data, model) || "");
  }
  return models;
});

function onClear() {
  if (!props.multiple) {
    modelValue = "";
    emit("update:modelValue", modelValue);
    emit("change", undefined);
    emit("clear");
    return;
  }
  modelValue = [ ];
  emit("update:modelValue", modelValue);
  emit("change", [ ]);
  emit("clear");
}

function onChange() {
  const models = getModelsByValue();
  emit("change", models);
}

function findModelById<
  T extends {
    id: string;
    children?: T[];
  },
>(data: T[], id: string): T | undefined {
  for (const item of data) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const item2 = findModelById(item.children, id);
      if (item2) {
        return item2;
      }
    }
  }
  return;
}

function getModelsByValue() {
  if (!props.multiple) {
    return findModelById(data, modelValue as string);
  }
  const modelValues = (modelValue || [ ]) as string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const models: any[] = [ ];
  for (const id of modelValues) {
    const model = findModelById(data, id);
    if (model) {
      models.push(model);
    }
  }
  return models;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onNodeClick(data: any, node: TreeNode) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let disabled = props.props.disabled as any;
  if (disabled instanceof Function) {
    disabled = disabled(data);
  }
  if (disabled) {
    return;
  }
  if (props.multiple) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelValueArr: any = Array.isArray(modelValue) ? modelValue : [ modelValue ];
    if (modelValueArr.includes(data.id)) {
      modelValue = modelValueArr.filter((id: string) => id !== data.id);
      emit("update:modelValue", modelValue);
      const models = getModelsByValue();
      emit("change", models);
      return;
    }
    if (modelValueArr.includes(data.id)) {
      modelValueArr.splice(modelValueArr.indexOf(data.id), 1);
    } else {
      modelValueArr.push(data.id);
    }
    modelValue = modelValueArr;
    emit("update:modelValue", modelValue);
    const models = getModelsByValue();
    emit("change", models);
  } else {
    if (modelValue === data.id) {
      modelValue = "";
    } else {
      modelValue = data.id;
    }
    emit("update:modelValue", modelValue);
    const models = getModelsByValue();
    emit("change", models);
  }
}

function onCheck() {
  const models = getModelsByValue();
  emit("change", models);
}

async function refreshEfc() {
  const method = props.method;
  if (!method) {
    inited = true;
    return;
  }
  data = await method();
  inited = true;
  emit("data", data);
}

if (props.init) {
  refreshEfc();
}

defineExpose({
  refresh: refreshEfc,
});
</script>

<style lang="scss" scoped>
:global(.el-select-dropdown__wrap) {
  max-height: 400px;
}
:global(.hideDisabledCheckbox .el-select-dropdown__item.is-disabled) {
  color: inherit;
  cursor: pointer;
}
:global(.hideDisabledCheckbox .el-checkbox.is-disabled) {
  display: none;
}
</style>
