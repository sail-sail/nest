<template>
<el-date-picker
  v-model="modelValue"
  class="custom_date_picker w-full"
  :class="{
    'custom_date_picker_range': props.type?.endsWith('range'),
    'custom_date_picker_readonly': props.readonly === true,
  }"
  v-bind="$attrs"
  :type="props.type"
  :format="props.format"
  :clearable="!props.disabled"
  :disabled="props.disabled"
  :readonly="props.readonly"
  :placeholder="props.readonly ? props.readonlyPlaceholder : props.placeholder"
  @change="onChange"
  @clear="onClear"
>
  <template
    v-for="(key, index) in keys"
    :key="index"
    #[key]
  >
    <slot :name="key"></slot>
  </template>
</el-date-picker>
</template>

<script lang="ts" setup>
import type {
  ElDatePicker,
} from "element-plus";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slots: any = useSlots();
const keys = Object.keys(slots);

type DatePickerType = InstanceType<typeof ElDatePicker>;

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:modelValue", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    type?: DatePickerType["type"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any;
    format?: string;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
  }>(),
  {
    type: undefined,
    modelValue: undefined,
    format: undefined,
    disabled: undefined,
    readonly: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
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
