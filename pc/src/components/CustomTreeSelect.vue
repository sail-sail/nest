<template>
<el-tree-select
  v-if="readonly !== true"
  filterable
  collapse-tags
  collapse-tags-tooltip
  default-first-option
  class="custom_tree_select"
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
  v-model="modelValue"
  @keyup.enter.stop
  @clear="clearClk"
  @change="valueChg"
  @check="checkClk"
  :clearable="!props.disabled"
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
    un-m="l-1"
    un-w="full"
    un-min="h-7.5"
    un-line-height="normal"
    un-break-words
    class="custom_select_readonly"
    v-bind="$attrs"
  >
    <el-tag
      v-for="label in modelLabels"
      :key="label"
      type="info"
    >
      {{ label }}
    </el-tag>
  </div>
  <div
    v-else
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2.75 y-1"
    un-box-border
    un-rounded
    un-m="l-1"
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
import {
  type TreeOptionProps,
} from "element-plus/lib/components/tree/src/tree.type";

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
  }>(),
  {
    height: 300,
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

function clearClk() {
  modelValue = "";
  emit("change", undefined);
  emit("clear");
}

function valueChg() {
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

function checkClk() {
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
