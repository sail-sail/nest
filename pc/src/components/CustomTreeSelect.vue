<template>
<el-tree-select
  v-if="readonly !== true"
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
  :check-on-click-node="false"
  un-w="full"
  v-bind="$attrs"
  :loading="!inited"
  v-model="modelValue"
  @keyup.enter.stop
  @clear="onClear"
  @change="onChange"
  @check="onCheck"
  :clearable="!props.disabled"
  @node-click="onNodeClick"
>
  <template
    v-for="(item, key, index) in $slots"
    :key="index"
    #[key]
  >
    <slot :name="key"></slot>
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
} from "element-plus";

import type {
  TreeOptionProps,
} from "element-plus/es/components/tree/src/tree.type";

import {
  type ExtractPropTypes,
} from "vue";

const usrStore = useUsrStore();

const emit = defineEmits<{
  (e: "update:modelValue", value?: string | string[] | null): void,
  (e: "change", value?: any | any[] | null): void,
  (e: "clear"): void,
}>();

let inited = $ref(false);

let data = $ref<any[]>([ ]);

const props = withDefaults(
  defineProps<{
    method: () => Promise<any[]>; // 用于获取数据的方法
    height?: number;
    modelValue?: string | string[] | null;
    autoWidth?: boolean;
    maxWidth?: number;
    multiple?: boolean;
    init?: boolean;
    props?: ExtractPropTypes<TreeOptionProps>;
    disabled?: boolean;
    readonly?: boolean;
    hideDisabledCheckbox?: boolean;
  }>(),
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

const modelLabels = $computed(() => {
  if (!modelValue) {
    return [ ];
  }
  const label = props.props.label || "label";
  if (!props.multiple) {
    const model = treeSelectFn(data, modelValue as string)!;
    if (!model) {
      return [ "" ];
    }
    if (typeof label === "string") {
      return [ model[label] || "" ];
    }
    return [ label(data, model) || "" ];
  }
  let models: any[] = [ ];
  let modelValues = (modelValue || [ ]) as string[];
  for (const id of modelValues) {
    const model = treeSelectFn(data, id);
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
    emit("change", modelValue);
    emit("clear");
    return;
  }
  modelValue = [ ];
  emit("update:modelValue", modelValue);
  emit("change", modelValue);
  emit("clear");
}

async function onChange() {
  await nextTick();
  if (!props.multiple) {
    if (!modelValue) {
      emit("change", undefined);
      return;
    }
    const model = treeSelectFn(data, modelValue as string)!;
    emit("change", model);
    return;
  }
  let models: any[] = [ ];
  let modelValues = (modelValue || [ ]) as string[];
  for (const id of modelValues) {
    const model = treeSelectFn(data, id)!;
    models.push(model);
  }
  emit("change", models);
}

function treeSelectFn<
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
      const item2 = treeSelectFn(item.children, id);
      if (item2) {
        return item2;
      }
    }
  }
  return;
}

async function onNodeClick(data: any, node: TreeNode) {
  let disabled = props.props.disabled as any;
  if (disabled instanceof Function) {
    disabled = disabled(data);
  }
  if (disabled) {
    return;
  }
  if (props.multiple) {
    const modelValueArr: any = Array.isArray(modelValue) ? modelValue : [ modelValue ];
    if (modelValueArr.includes(data.id)) {
      return;
    }
    if (modelValueArr.includes(data.id)) {
      modelValueArr.splice(modelValueArr.indexOf(data.id), 1);
    } else {
      modelValueArr.push(data.id);
    }
    modelValue = modelValueArr;
    emit("update:modelValue", modelValue);
    await onChange();
  } else {
    if (modelValue === data.id) {
      modelValue = "";
    } else {
      modelValue = data.id;
    }
    emit("update:modelValue", modelValue);
    await onChange();
  }
}

function onCheck() {
  if (!props.multiple) {
    if (!modelValue) {
      emit("change", undefined);
      return;
    }
    const model = treeSelectFn(data, modelValue as string)!;
    emit("change", model);
    return;
  }
  let models: any[] = [ ];
  let modelValues = (modelValue || [ ]) as string[];
  for (const id of modelValues) {
    const model = treeSelectFn(data, id)!;
    models.push(model);
  }
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
}

if (props.init) {
  refreshEfc();
}

usrStore.onLogin(refreshEfc);

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
