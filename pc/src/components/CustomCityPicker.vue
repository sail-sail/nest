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
    :validate-event="false"
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
    un-box-border
    class="custom_city_picker_readonly"
    :class="{
      'custom_city_picker_readonly_border': props.isReadonlyBorder,
      'custom_city_picker_readonly_no_border': !props.isReadonlyBorder,
    }"
  >
    <div
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-items="center"
      un-p="x-2.5 y-0.875"
      un-box-border
      un-w="full"
      un-min="h-7.5"
      un-break-all
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
        {{ modelLabelComp }}
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
  useFormItem,
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

defineSlots<InstanceType<typeof ElCascader>['$slots']>();

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    readonlyPlaceholder?: string;
    separator?: string;
    props?: CascaderProps;
    disabled?: boolean;
    isReadonlyBorder?: boolean;
    validateEvent?: boolean;
  }>(),
  {
    readonly: undefined,
    readonlyPlaceholder: undefined,
    separator: " / ",
    props: undefined,
    disabled: undefined,
    isReadonlyBorder: true,
    validateEvent: undefined,
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

const modelLabelComp = computed<string>(() => {
  if (!modelLabel.value) {
    return "";
  }
  const arr = modelLabel.value;
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!item) {
      continue;
    }
    str += item;
    if (i < arr.length - 1) {
      str += props.separator;
    }
  }
  return str;
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

const {
  formItem,
} = useFormItem();

watch(
  () => [
    modelValue.value,
    options.value,
  ],
  async (oldVaue, newValue) => {
    if (oldVaue[0] == null && newValue[0] == null) {
      return;
    }
    const oldItem0 = oldVaue[0]?.[0] ?? "";
    const oldItem1 = oldVaue[0]?.[1] ?? "";
    const oldItem2 = oldVaue[0]?.[2] ?? "";
    
    const newItem0 = newValue[0]?.[0] ?? "";
    const newItem1 = newValue[0]?.[1] ?? "";
    const newItem2 = newValue[0]?.[2] ?? "";
    
    if (oldItem0 == newItem0 && oldItem1 == newItem1 && oldItem2 == newItem2) {
      return;
    }
    
    if (!modelValue.value || !options.value || options.value.length === 0) {
      modelLabel.value = undefined;
    } else {
      modelLabel.value = modelValue.value.map((item) => {
        return treeFindLabel(options.value, item);
      });
    }
    if (props.validateEvent !== false && options.value) {
      try {
        await formItem?.validate("change");
      } catch (err) { /* empty */ }
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
  border-width: 1px;
  border-style: solid;
  border-color: var(--el-border-color);
  border-radius: 4px;
}
.custom_city_picker_readonly_no_border {
  border-width: 0;
}
</style>
