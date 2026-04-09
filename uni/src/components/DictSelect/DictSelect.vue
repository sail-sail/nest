<template>
<CustomSelect
  v-bind="$attrs"
  v-model="modelValue"
  v-model:model-label="modelLabel"
  :method="dataMethod"
  :options-map="optionsMap"
  @change="onChange"
  @data="onData"
  @confirm="onConfirm"
  @clear="onClear"
></CustomSelect>
</template>

<script lang="ts" setup>
import {
  type GetDict,
  DictType,
} from "#/types";

const emit = defineEmits<{
  (e: "data", data: GetDict[]): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "confirm", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    code?: string;
    pageInited?: boolean;
  }>(),
  {
    code: undefined,
    pageInited: undefined,
  },
);

watch(
  () => props.pageInited,
  async (value, oldValue) => {
    if (value === true && oldValue === false) {
      await dataMethod();
    }
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any>();
const modelLabel = defineModel<string | null>("modelLabel");

function onChange(value: GetDict | GetDict[] | null) {
  emit("change", value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onConfirm(value?: any) {
  emit("confirm", value);
}

function onClear() {
  emit("clear");
}

function onData(data: GetDict[]) {
  emit("data", data);
}

async function dataMethod() {
  if (!props.code) {
    return [ ];
  }
  const res = await getDict([
    props.code,
  ]);
  const data = res[0];
  emit("data", data);
  return data;
}

function optionsMap(item: GetDict) {
  const item2 = item as { lbl: string; val: string; };
  if (item.type === DictType.Number) {
    return {
      label: item2.lbl,
      value: Number(item2.val),
    };
  }
  if (item.type === DictType.Boolean) {
    return {
      label: item2.lbl,
      value: Number(item2.val),
    };
  }
  return {
    label: item2.lbl,
    value: item2.val,
  };
}
</script>
