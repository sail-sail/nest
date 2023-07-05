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
  @change="valueChg"
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
  <template
    v-if="props.readonlyBorder === true"
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
      class="custom_input_number_readonly"
      v-bind="$attrs"
    >
      {{ modelValue ?? "" }}
    </div>
  </template>
  <template
    v-else
  >
    <div
      class="custom_input_number_readonly readonly_border_none"
      v-bind="$attrs"
    >
      {{ modelValue ?? "" }}
    </div>
  </template>
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
    readonlyBorder?: boolean;
  }>(),
  {
    modelValue: undefined,
    precision: 0,
    step: 1,
    stepStrictly: false,
    controls: false,
    disabled: undefined,
    readonly: undefined,
    readonlyBorder: true,
  },
);

let modelValue = $ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
);

function valueChg() {
  emit("update:modelValue", modelValue);
  emit("change", modelValue);
}
</script>
