<template>
<el-input-number
  v-if="readonly !== true"
  un-w="full"
  class="custom_input_number"
  :precision="props.precision"
  :step="props.step"
  :step-strictly="props.stepStrictly"
  :controls="props.controls"
  v-bind="$attrs"
  v-model="modelValue"
  :clearable="!props.disabled"
  :disabled="props.disabled"
>
  <template
    v-for="(item, key, index) in $slots"
    :key="index"
    #[key]
  >
    <slot :name="key"></slot>
  </template>
</el-input-number>
<template
  v-else
>
  <div
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
    {{ modelValue ?? "" }}
  </div>
</template>
</template>

<script lang="ts" setup>

const emit = defineEmits<{
  (e: "update:modelValue", value?: any): void,
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    precision?: number;
    step?: number;
    stepStrictly?: boolean;
    controls?: boolean;
    disabled?: boolean;
    readonly?: boolean;
  }>(),
  {
    modelValue: undefined,
    precision: 0,
    step: 1,
    stepStrictly: false,
    controls: false,
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
</script>
