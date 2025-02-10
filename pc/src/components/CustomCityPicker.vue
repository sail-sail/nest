<template>
<div
  v-if="props.readonly !== true"
  un-flex="~"
  un-items-center
  class="custom_city_picker"
>
  <el-cascader
    ref="inputRef"
    v-model="modelValue"
    :set="modelValue = modelValue ?? undefined"
    filterable
    collapse-tags
    collapse-tags-tooltip
    default-first-option
    :options="options"
    :props="cascaderProps"
    :separator="props.separator"
    :clearable="!props.disabled"
    :disabled="props.disabled"
    :readonly="props.readonly"
    v-bind="$attrs"
  ></el-cascader>
</div>
<template
  v-else
>
  <div
    un-whitespace-nowrap
    un-flex="~"
    un-justify="start"
    un-items="center"
    class="custom_city_picker_readonly"
    :class="{
      'custom_city_picker_readonly_border': props.isReadonlyBorder,
      'custom_city_picker_readonly_no_border': !props.isReadonlyBorder,
    }"
  >
    <div
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-p="x-2.5 y-0.875"
      un-box-border
      un-w="full"
      un-min="h-7.5"
      un-break-words
      un-whitespace-pre-wrap
      class="custom_city_picker_readonly_content"
      :class="{
        'custom_city_picker_placeholder': shouldShowPlaceholder,
      }"
    >
      <template
        v-if="!modelLabel || modelLabel.length === 0"
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </template>
      <template
        v-else
      >
        {{ modelLabel?.join(props.separator) ?? "" }}
      </template>
    </div>
    <div
      un-flex="~"
      un-overflow-hidden
      un-p="x-2.5 y-0.875"
      un-box-border
      un-min="h-7.5"
      un-items="center"
    >
      <slot name="suffix"></slot>
    </div>
  </div>
</template>
</template>

<script lang="ts" setup>
import {
  ElCascader,
} from "element-plus";

import type {
  CascaderProps,
} from "element-plus";

import {
  findAllPcaCode,
} from "./CustomCityPickerApi";

import type {
  PcaItem,
} from "./CustomCityPickerApi";

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    readonlyPlaceholder?: string;
    separator?: string;
    props?: CascaderProps;
    disabled?: boolean;
    isReadonlyBorder?: boolean;
  }>(),
  {
    readonly: undefined,
    readonlyPlaceholder: undefined,
    separator: " / ",
    props: undefined,
    disabled: undefined,
    isReadonlyBorder: true,
  },
);

const cascaderProps = computed<CascaderProps>(() => {
  return {
    ...props.props,
    value: "code",
    label: "name",
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const options = ref<any>();
let optionsPrm: Promise<PcaItem[]>;

const inputRef = ref<InstanceType<typeof ElCascader>>();

const modelValue = defineModel<string[] | null>();

const modelLabel = defineModel<string[] | null>("modelLabel");

const shouldShowPlaceholder = computed<boolean>(() => {
  return modelValue.value == null || modelValue.value.length === 0;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function treeFindLabel(data: any[], value: string): any {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const option = data.find((item: any) => item[cascaderProps.value?.value ?? "value"] === value);
  if (option) {
    return option[cascaderProps.value?.label ?? "label"];
  }
  for (const item of data) {
    if (item.children) {
      const label = treeFindLabel(item.children, value);
      if (label !== undefined) {
        return label;
      }
    }
  }
}

watch(
  () => [
    modelValue.value,
    options.value,
  ],
  () => {
    if (!modelValue.value || !options.value || options.value.length === 0) {
      modelLabel.value = undefined;
    } else {
      modelLabel.value = modelValue.value.map((item) => {
        return treeFindLabel(options.value, item);
      });
    }
  },
  {
    deep: true,
  },
);

async function initFrame() {
  if (!optionsPrm) {
    optionsPrm = findAllPcaCode();
  }
  options.value = await optionsPrm;
}

initFrame();

function focus() {
}

defineExpose({
  inputRef,
  focus,
});
</script>

<style lang="scss" scoped>
.custom_city_picker_readonly_border {
  @apply b-1 b-solid b-[var(--el-border-color)] rounded;
}
.custom_city_picker_readonly_no_border {
  @apply b-0;
}
</style>
