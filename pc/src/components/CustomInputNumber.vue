<template>
<el-input-number
  v-if="readonly !== true"
  v-model="modelValueComputed"
  un-w="full"
  class="custom_input_number"
  :precision="props.precision"
  :step="props.step"
  :step-strictly="props.stepStrictly"
  :min="props.min"
  :controls="props.controls"
  :align="props.align"
  :class="{
    'custom_input_number_align_center': props.align === 'center',
    'custom_input_number_align_right': props.align === 'right',
  }"
  v-bind="$attrs"
  :clearable="!props.disabled && props.clearable"
  :disabled="props.disabled"
  :placeholder="props.placeholder"
  @change="onChange"
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
</el-input-number>
<template
  v-else
>
  <template
    v-if="props.isReadonlyBorder === true"
  >
    <div
      un-b="1 solid [var(--el-border-color)]"
      un-p="x-2.5 y-1"
      un-box-border
      un-rounded
      un-w="full"
      un-min="h-8"
      un-whitespace-nowrap
      class="custom_input_number_readonly"
      :class="{
        'custom_input_number_placeholder': shouldShowPlaceholder,
        'custom_input_number_align_center': props.align === 'center',
        'custom_input_number_align_right': props.align === 'right',
      }"
      v-bind="$attrs"
    >
      {{ modelLabel }}
    </div>
  </template>
  <template
    v-else
  >
    <div
      class="custom_input_number_readonly readonly_border_none"
      :class="{
        'custom_input_number_placeholder': shouldShowPlaceholder,
      }"
      v-bind="$attrs"
    >
      {{ modelLabel }}
    </div>
  </template>
</template>
</template>

<script lang="ts" setup>
import Decimal from "decimal.js";

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:modelValue", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any;
    precision?: number;
    step?: number;
    stepStrictly?: boolean;
    min?: number;
    controls?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    isReadonlyBorder?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    isHideZero?: boolean;
    align?: "center" | "left" | "right";
  }>(),
  {
    modelValue: undefined,
    precision: 0,
    step: 1,
    stepStrictly: false,
    min: 0,
    controls: false,
    clearable: false,
    disabled: undefined,
    readonly: undefined,
    isReadonlyBorder: true,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    isHideZero: false,
    align: undefined,
  },
);

let modelValue = $ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue == null || (props.isHideZero && Number(props.modelValue.toString()) === 0)) {
      modelValue = undefined;
      return;
    }
    modelValue = props.modelValue;
  },
  {
    immediate: true,
  },
);

watch(
  () => modelValue,
  () => {
    if (modelValue === null) {
      modelValue = undefined;
    }
    emit("update:modelValue", modelValue);
  },
);

const modelValueComputed = $computed({
  get() {
    if (modelValue instanceof Decimal) {
      return modelValue.toNumber();
    }
    const type = typeof modelValue;
    if (type === "string") {
      if (modelValue === "") {
        return 0;
      }
      const num = Number(modelValue);
      if (isNaN(num)) {
        return modelValue;
      }
      if (props.isHideZero && num === 0) {
        return;
      }
      return num;
    }
    return modelValue;
  },
  set(value?: number) {
    if (modelValue instanceof Decimal) {
      modelValue = new Decimal(value ?? 0);
      return;
    }
    modelValue = value;
  },
});

const modelLabel = $computed(() => {
  if (modelValue == null) {
    return "";
  }
  if (isNaN(Number(modelValue))) {
    return modelValue;
  }
  if (props.precision === 0) {
    return modelValue;
  }
  if (props.isHideZero && Number(modelValue) === 0) {
    if (props.readonlyPlaceholder) {
      return props.readonlyPlaceholder;
    }
    return "";
  }
  return Number(modelValue).toFixed(props.precision);
});

const shouldShowPlaceholder = $computed<boolean>(() => {
  return modelValue == null || modelValue === "" || (!Number(modelValue) && props.isHideZero);
});

function onChange() {
  if (modelValue === null) {
    modelValue = undefined;
  }
  emit("update:modelValue", modelValue);
  emit("change", modelValue);
}
</script>

<style lang="scss" scoped>
.custom_input_number_align_center {
  text-align: center;
}
.custom_input_number_align_right {
  text-align: right;
}
</style>
