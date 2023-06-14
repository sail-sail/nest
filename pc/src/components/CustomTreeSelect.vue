<template>
<el-tree-select
  filterable
  clearable
  collapse-tags
  collapse-tags-tooltip
  default-first-option
  class="custom_tree_select"
  node-key="id"
  vaule-key="id"
  v-bind="$attrs"
  @keyup.enter.stop
  :data="data"
  :loading="!inited"
  :model-value="modelValue"
  @update:model-value="modelValueUpdate"
  @clear="clearClk"
  @change="valueChg"
  @check="checkClk"
  :multiple="props.multiple"
  :props="props.props"
>
  <template
    v-for="(item, key, index) in $slots"
    :key="index"
    #[key]
  >
    <slot :name="key"></slot>
  </template>
</el-tree-select>
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
  },
);

let modelValue = $ref(props.modelValue);

function modelValueUpdate(value?: string | string[] | null) {
  modelValue = value;
  emit("update:modelValue", modelValue);
}

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
);

function clearClk() {
  modelValue = "";
  emit("update:modelValue", modelValue);
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
