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
  :shortcuts="shortcutsComputed"
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

import dayjs from "dayjs";

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
    shortcuts?: DatePickerType["shortcuts"];
  }>(),
  {
    type: undefined,
    modelValue: undefined,
    format: undefined,
    disabled: undefined,
    readonly: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    shortcuts: undefined,
  },
);

let modelValue = $ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
);

// 'year' | 'years' |'month' | 'months' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange' | 'yearrange'
const shortcutsComputed = $computed(() => {
  if (props.shortcuts) {
    return props.shortcuts;
  }
  const type = props.type;
  const now = dayjs();
  if (type === "yearrange") {
    return [
      {
        text: "今年",
        value: () => {
          return [
            now.startOf("year").toDate(),
            now.endOf("year").toDate(),
          ];
        },
      },
      // 去年
      {
        text: "去年",
        value: () => {
          return [
            now.subtract(1, "year").startOf("year").toDate(),
            now.subtract(1, "year").endOf("year").toDate(),
          ];
        },
      },
    ];
  } else if (type === "monthrange") {
    return [
      {
        text: "当月",
        value: () => {
          return [
            now.startOf("month").toDate(),
            now.endOf("month").toDate(),
          ];
        },
      },
      // 上个月
      {
        text: "上个月",
        value: () => {
          return [
            now.subtract(1, "month").startOf("month").toDate(),
            now.subtract(1, "month").endOf("month").toDate(),
          ];
        },
      },
      // 最近三个月
      {
        text: "最近三个月",
        value: () => {
          return [
            now.subtract(2, "month").startOf("month").toDate(),
            now.endOf("month").toDate(),
          ];
        },
      },
      // 最近六个月
      {
        text: "最近六个月",
        value: () => {
          return [
            now.subtract(5, "month").startOf("month").toDate(),
            now.endOf("month").toDate(),
          ];
        },
      },
    ];
  } else if (type === "daterange" || type === "datetimerange") {
    return [
      {
        text: "今天",
        value: () => {
          return [
            now.startOf("day").toDate(),
            now.endOf("day").toDate(),
          ];
        },
      },
      {
        text: "当月",
        value: () => {
          return [
            now.startOf("month").toDate(),
            now.endOf("month").toDate(),
          ];
        },
      },
      {
        text: "上个月",
        value: () => {
          return [
            now.subtract(1, "month").startOf("month").toDate(),
            now.subtract(1, "month").endOf("month").toDate(),
          ];
        },
      },
      {
        text: "最近三个月",
        value: () => {
          return [
            now.subtract(2, "month").startOf("month").toDate(),
            now.endOf("month").toDate(),
          ];
        },
      },
      // 最近六个月
      {
        text: "最近六个月",
        value: () => {
          return [
            now.subtract(5, "month").startOf("month").toDate(),
            now.endOf("month").toDate(),
          ];
        },
      },
    ];
  }
});

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
