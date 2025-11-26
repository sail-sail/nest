<template>
<el-checkbox
  v-if="readonly !== true"
  v-model="modelValue"
  :set="0"
  :false-value="0"
  :true-value="1"
  class="custom_checkbox"
  v-bind="$attrs"
  :disabled="props.disabled"
  @change="valueChg"
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
</el-checkbox>
<template
  v-else
>
  <div
    class="custom_checkbox_readonly"
    v-bind="$attrs"
  >
    {{ modelLabel }}
  </div>
</template>
</template>

<script lang="ts" setup>
const {
  ns,
  initSysI18ns,
} = useI18n("/base/usr");

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:modelValue", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any): void,
}>();

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any;
    disabled?: boolean;
    readonly?: boolean;
    trueReadonlyLabel?: string;
    falseReadonlyLabel?: string;
  }>(),
  {
    modelValue: undefined,
    disabled: undefined,
    readonly: undefined,
    trueReadonlyLabel: undefined,
    falseReadonlyLabel: undefined,
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

const modelLabel = $computed(() => {
  if (modelValue == 1) {
    return props.trueReadonlyLabel || ns("是");
  }
  if (modelValue == 0) {
    return props.falseReadonlyLabel || ns("否");
  }
  return modelValue ?? "";
});

async function initFrame() {
  const codes = [
    "是",
    "否",
  ];
  await initSysI18ns(codes);
}

initFrame();
</script>
