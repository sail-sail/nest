<template>
<tm-picker
  v-bind="$attrs"
  v-model="modelValueComp"
  v-model:model-str="modelValueStrRaw"
  class="custom_city_picker"
  :class="{
    'custom_city_picker_readonly': readonly,
  }"
  rang-key="code"
  rang-text="name"
  :list="options"
  :disabled="pickerDisabled"
>
  <CustomInput
    :model-value="modelValueStr"
    readonly
    :clearable="clearable"
    :readonly-placeholder="inputPlaceholder"
    :color="props.color"
    :font-color="inputFontColor"
    type="text"
    @clear="onClear"
  >
    <template #right>
      <tm-icon
        v-if="showArrow"
        :size="42"
        color="#b1b1b1"
        name="arrow-right-s-line"
      ></tm-icon>
    </template>
  </CustomInput>
</tm-picker>
</template>

<script lang="ts" setup>
import {
  findAllPcaCode,
} from "./CustomCityPickerApi.ts";

import type {
  PcaItem,
} from "./CustomCityPickerApi.ts";

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    disabled?: boolean;
    pageInited?: boolean;
    clearable?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    separator?: string;
    color?: string;
    fontColor?: string;
  }>(),
  {
    readonly: undefined,
    disabled: false,
    pageInited: true,
    clearable: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    separator: "/",
    color: "transparent",
    fontColor: undefined,
  },
);

const tmFormItemReadonly = inject<ComputedRef<boolean> | undefined>("tmFormItemReadonly", undefined);

const readonly = computed<boolean>(() => {
  if (props.readonly != null) {
    return props.readonly;
  }
  if (tmFormItemReadonly) {
    return tmFormItemReadonly.value;
  }
  return false;
});

const clearable = computed<boolean>(() => {
  if (props.clearable != null) {
    return props.clearable;
  }
  return !readonly.value;
});

const modelValue = defineModel<string[] | undefined>();
const modelLabel = defineModel<string[] | undefined>("modelLabel");

const modelValueComp = computed<string[]>({
  get() {
    return modelValue.value?.filter((item) => item) ?? [ ];
  },
  set(value) {
    modelValue.value = value.length > 0 ? [ ...value ] : undefined;
  },
});

const options = ref<PcaItem[]>([ ]);
const isLoading = ref(false);
const hasLoadError = ref(false);
const modelValueStrRaw = ref("");

const modelValueStr = computed<string>(() => {
  const labels = modelLabel.value?.filter((item) => item) ?? [ ];
  if (labels.length > 0) {
    return labels.join(props.separator);
  }
  return modelValueStrRaw.value.split(",").filter((item) => item).join(props.separator);
});

const pickerDisabled = computed<boolean>(() => {
  return props.disabled || readonly.value || isLoading.value || hasLoadError.value;
});

const inputPlaceholder = computed<string>(() => {
  if (!props.pageInited) {
    return "";
  }
  if (readonly.value) {
    return props.readonlyPlaceholder ?? "";
  }
  if (hasLoadError.value) {
    return "省市区数据加载失败";
  }
  if (isLoading.value) {
    return "省市区数据加载中";
  }
  return props.placeholder ?? "";
});

const inputFontColor = computed<string>(() => {
  if (readonly.value) {
    return modelValueStr.value ? "var(--color-readonly)" : "var(--color-placeholder)";
  }
  return modelValueStr.value ? props.fontColor || "var(--font-color)" : "var(--color-placeholder)";
});

const showArrow = computed<boolean>(() => {
  if (readonly.value) {
    return false;
  }
  if (!clearable.value) {
    return true;
  }
  return !modelValueStr.value;
});

watch(
  () => modelValueStrRaw.value,
  (value) => {
    if (!value) {
      if (!modelValue.value || modelValue.value.length === 0) {
        modelLabel.value = undefined;
      }
      return;
    }
    modelLabel.value = value.split(",").filter((item) => item);
  },
  {
    immediate: true,
  },
);

watch(
  () => modelValue.value?.join(",") ?? "",
  (value) => {
    if (value) {
      return;
    }
    modelValueStrRaw.value = "";
    modelLabel.value = undefined;
  },
  {
    immediate: true,
  },
);

async function initFrame() {
  try {
    isLoading.value = true;
    hasLoadError.value = false;
    options.value = await findAllPcaCode();
  } catch (err) {
    hasLoadError.value = true;
    console.error(err);
    uni.showToast({
      title: "省市区加载失败",
      icon: "none",
    });
  } finally {
    isLoading.value = false;
  }
}

function onClear() {
  modelValueComp.value = [ ];
  modelValueStrRaw.value = "";
  modelLabel.value = undefined;
}

initFrame();
</script>

<style lang="scss" scoped>
.custom_city_picker {
  cursor: pointer;
}

.custom_city_picker_readonly {
  cursor: default;
}
</style>