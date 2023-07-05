<template>
<el-checkbox
  v-if="readonly !== true"
  class="custom_checkbox"
  un-w="full"
  :set="0"
  :false-label="0"
  :true-label="1"
  v-bind="$attrs"
  v-model="modelValue"
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
  (e: "update:modelValue", value?: any): void,
  (e: "change", value?: any): void,
}>();

const props = withDefaults(
  defineProps<{
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
    trueReadonlyLabel: "是",
    falseReadonlyLabel: "否",
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

let modelLabel = $computed(() => {
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
