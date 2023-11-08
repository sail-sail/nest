<template>
<el-date-picker
  class="custom_date_picker w-full"
  :class="{ 'custom_date_picker_range': props.type?.endsWith('range') }"
  v-bind="$attrs"
  :type="props.type"
  v-model="modelValue"
  :format="props.format"
  :clearable="!props.disabled"
  :disabled="props.disabled"
  :readonly="props.readonly"
  @change="onChange"
  @clear="onClear"
>
  <template
    v-for="(item, key, index) in $slots"
    :key="index"
    #[key]
  >
    <slot :name="key"></slot>
  </template>
</el-date-picker>
</template>

<script lang="ts" setup>
import type { ElDatePicker } from "element-plus";

type DatePickerType = InstanceType<typeof ElDatePicker>;

const emit = defineEmits<{
  (e: "update:modelValue", value?: any): void,
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    type?: DatePickerType["type"];
    modelValue?: any;
    format?: string;
    disabled?: boolean;
    readonly?: boolean;
  }>(),
  {
    type: undefined,
    modelValue: undefined,
    format: undefined,
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

function onChange() {
  emit("update:modelValue", modelValue);
  emit("change", modelValue);
}

function onClear() {
  modelValue = undefined;
  emit("update:modelValue", modelValue);
  emit("change", modelValue);
  emit("clear");
}
</script>
