<template>
<el-switch
  v-if="readonly !== true"
  v-model="modelValue"
  class="custom_switch"
  :set="0"
  v-bind="$attrs"
  :active-value="props.activeValue"
  :inactive-value="props.inactiveValue"
  :disabled="props.disabled"
  @change="onChange"
>
  <template
    v-for="(item, key, index) in $slots"
    :key="index"
    #[key]
  >
    <slot :name="key"></slot>
  </template>
</el-switch>
<template
  v-else
>
  <div
    class="custom_switch_readonly"
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeValue?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inactiveValue?: any;
    trueReadonlyLabel?: string;
    falseReadonlyLabel?: string;
    notBorder?: boolean;
  }>(),
  {
    modelValue: undefined,
    disabled: undefined,
    readonly: undefined,
    activeValue: 1,
    inactiveValue: 0,
    trueReadonlyLabel: "是",
    falseReadonlyLabel: "否",
    notBorder: undefined,
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
