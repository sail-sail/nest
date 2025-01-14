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
  v-bind="$attrs"
  :clearable="!props.disabled && props.clearable"
  :disabled="props.disabled"
  :placeholder="props.placeholder"
  @change="onChange"
>
  <template
    v-for="(key, index) in keys"
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
    v-if="props.isReadonlyBorder === true"
  >
    <div
      un-b="1 solid [var(--el-border-color)]"
      un-p="x-2.5 y-1"
      un-box-border
      un-rounded
      un-w="full"
      un-min="h-8"
      un-line-height="normal"
      un-whitespace-nowrap
      class="custom_input_number_readonly"
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
      v-bind="$attrs"
    >
      {{ modelLabel }}
    </div>
  </template>
</template>
</template>

<script lang="ts" setup>
import Decimal from "decimal.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slots: any = useSlots();
const keys = Object.keys(slots);

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
  },
);

let modelValue = $ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue == null) {
      modelValue = undefined;
      return;
    }
    modelValue = props.modelValue;
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
  return Number(modelValue).toFixed(props.precision);
});

function onChange() {
  if (modelValue === null) {
    modelValue = undefined;
  }
  emit("update:modelValue", modelValue);
  emit("change", modelValue);
}
</script>
