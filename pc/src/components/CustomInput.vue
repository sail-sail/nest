<template>
<el-input
  v-if="readonly !== true"
  ref="inputRef"
  :type="props.type"
  class="custom_input w-full"
  v-bind="$attrs"
  v-model="modelValue"
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
      {{ props.placeholder ?? "" }}
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
  }>(),
  {
    modelValue: undefined,
    type: "text",
    disabled: undefined,
    readonly: undefined,
    placeholder: undefined,
  },
);

let modelValue = $ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
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
</script>
