<template>
<div
  v-if="readonly !== true"
  un-flex="~"
  un-items-center
  un-w="full"
  class="custom_input"
>
  <el-input
    ref="inputRef"
    :type="props.type"
    v-bind="$attrs"
    v-model="modelValue"
    class="flex-[1_0_0] overflow-hidden"
    :clearable="!props.disabled"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
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
  </el-input>
  <slot name="myAppend"></slot>
</div>
<template
  v-else
>
  <div
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2.5 y-1"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-words
    class="custom_input_readonly"
    :class="{
      'whitespace-pre-wrap': type === 'textarea',
      'custom_input_placeholder': shouldShowPlaceholder
    }"
    :style="{
      height: textareaHeight != null ? textareaHeight + 'px' : undefined,
    }"
    v-bind="$attrs"
  >
    <template
      v-if="!(modelValue ?? '')"
    >
      {{ props.readonlyPlaceholder ?? "" }}
    </template>
    <template
      v-else
    >
      {{ modelValue ?? "" }}
    </template>
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
    type?: string;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
  }>(),
  {
    modelValue: undefined,
    type: "text",
    disabled: undefined,
    readonly: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
  },
);

const t = getCurrentInstance()!.proxy!;

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

let shouldShowPlaceholder = $computed(() => {
  return modelValue == null || modelValue === "";
});

let inputRef = $ref<InstanceType<typeof ElInput>>();
let textareaHeight = $shallowRef<number>();

useResizeObserver($$(inputRef) as any, (entries) => {
  const [ entry ] = entries;
  const { height } = entry.contentRect;
  textareaHeight = height;
});

function onChange() {
  emit("update:modelValue", modelValue);
  emit("change", modelValue);
}

function onClear() {
  modelValue = "";
  emit("update:modelValue", modelValue);
  emit("clear");
}

defineExpose({
  inputRef: $$(inputRef),
});
</script>
