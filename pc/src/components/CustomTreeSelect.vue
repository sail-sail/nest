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
    props: ExtractPropTypes<TreeOptionProps>;
  }>(),
  {
    height: 300,
    modelValue: undefined,
    autoWidth: true,
    maxWidth: 550,
    multiple: false,
    init: true,
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
  emit("clear");
}

function valueChg(value: string | string[] | null) {
  // if (!props.multiple) {
  //   const model = data.find((item) => props.optionsMap(item).value === value);
  //   emit("change", model);
  //   return;
  // }
  // let models: any[] = [ ];
  // let modelValues = (modelValue || [ ]) as string[];
  // for (const value of modelValues) {
  //   const model = data.find((item) => props.optionsMap(item).value === value);
  //   models.push(model);
  // }
  // emit("change", models);
  console.log(value);
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
