<template>
<div
  v-if="readonly !== true"
  ref="selectDivRef"
  un-w="full"
  class="custom_select_div"
  :class="{
    custom_select_isShowModelLabel: isShowModelLabel && inited,
  }"
>
  <ElSelectV2
    :key="key"
    :options="options4SelectV2"
    filterable
    collapse-tags
    collapse-tags-tooltip
    default-first-option
    :height="props.height"
    :remote="props.pinyinFilterable"
    :remote-method="filterMethod"
    @visible-change="handleVisibleChange"
    @clear="onClear"
    un-w="full"
    v-bind="$attrs"
    :model-value="modelValueComputed"
    @update:model-value="modelValueUpdate"
    :loading="!inited"
    class="custom_select"
    :class="{
      'custom_select_space_normal': true,
    }"
    @change="onChange"
    :multiple="props.multiple"
    :clearable="!props.disabled"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :placeholder="isShowModelLabel && props.multiple ? props.modelLabel : props.placeholder"
    @keyup.enter.stop
  >
    <template
      v-for="(item, key, index) in $slots"
      :key="index"
      #[key]
    >
      <slot :name="key"></slot>
    </template>
  </ElSelectV2>
</div>
<template
  v-else
>
  <div
    v-if="props.multiple"
    un-flex="~ gap-1 wrap"
    un-items-center
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-words
    class="custom_select_readonly"
    :class="{
      'custom_select_placeholder': shouldShowPlaceholder,
      custom_select_isShowModelLabel: isShowModelLabel,
    }"
    v-bind="$attrs"
  >
    <template
      v-if="modelLabels.length === 0"
    >
      <span
        class="custom_select_placeholder"
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </span>
    </template>
    <template
      v-else
    >
      <span
        v-if="isShowModelLabel"
        class="custom_select_readonly"
      >
        {{ props.modelLabel || "" }}
      </span>
      <div
        v-else
      >
        <el-tag
          v-for="label in modelLabels"
          :key="label"
          type="info"
        >
          {{ label }}
        </el-tag>
      </div>
    </template>
  </div>
  <div
    v-else
    un-flex="~ gap-1 wrap"
    un-items-center
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-words
    class="custom_select_readonly"
    :class="{
      'custom_select_placeholder': shouldShowPlaceholder,
      custom_select_isShowModelLabel: isShowModelLabel,
    }"
    v-bind="$attrs"
  >
    <template
      v-if="!modelLabels[0]"
    >
      <span
        class="custom_select_placeholder"
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </span>
    </template>
    <template
      v-else
    >
      <span
        v-if="isShowModelLabel"
        class="custom_select_readonly"
      >
        {{ props.modelLabel || "" }}
      </span>
      <span
        v-else
        class="custom_select_readonly"
      >
        {{ modelLabels[0] || "" }}
      </span>
    </template>
  </div>
</template>
</template>

<script lang="ts" setup>
import { pinyin } from "pinyin-pro";

import type {
  OptionType,
} from "element-plus/es/components/select-v2/src/select.types";

const t = getCurrentInstance();

const usrStore = useUsrStore();

const emit = defineEmits<{
  (e: "update:modelValue", value?: string | string[] | null): void,
  (e: "update:modelLabel", value?: string | null): void,
  (e: "change", value?: any | any[] | null): void,
  (e: "clear"): void,
}>();

let inited = $ref(false);

type OptionsMap = (item: any) => OptionType;

let data = $ref<any[]>([ ]);

const props = withDefaults(
  defineProps<{
    method: () => Promise<any[]>; // 用于获取数据的方法
    optionsMap?: OptionsMap;
    pinyinFilterable?: boolean;
    height?: number;
    modelValue?: string | string[] | null;
    modelLabel?: string | null;
    options4SelectV2?: (OptionType & { __pinyin_label?: string })[];
    autoWidth?: boolean;
    maxWidth?: number;
    multiple?: boolean;
    init?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
  }>(),
  {
    optionsMap: function(item: any) {
      const item2 = item as { lbl: string; id: string; };
      return {
        label: item2.lbl,
        value: item2.id,
      };
    },
    pinyinFilterable: false,
    height: 300,
    options4SelectV2: () => [ ],
    modelValue: undefined,
    modelLabel: undefined,
    autoWidth: true,
    maxWidth: 550,
    multiple: false,
    init: true,
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
    modelLabel = props.modelLabel;
  },
);

let modelLabel = $ref(props.modelLabel);

watch(
  () => props.modelLabel,
  () => {
    modelLabel = props.modelLabel;
  },
);

const modelValueComputed = $computed(() => {
  if (!modelLabel) {
    return modelValue;
  }
  if (!props.multiple) {
    if (modelValue == null || modelValue === "") {
      return modelLabel;
    }
    const item = options4SelectV2.find((item: OptionType) => item.value === modelValue);
    if (!item || item.label !== modelLabel) {
      return modelLabel;
    }
    return modelValue;
  } else {
    if (modelValue == null || modelValue.length === 0) {
      return modelLabel;
    }
    const labels: string[] = modelLabel.split(",")
      .filter((item: string) => item)
      .map((item) => item.trim());
    if (labels.length !== modelValue.length) {
      return modelLabel;
    }
    for (let i = 0; i < modelValue.length; i++) {
      const item = modelValue[i];
      if (item !== labels[i]) {
        return modelLabel;
      }
    }
    return modelValue;
  }
});

const isShowModelLabel = $computed(() => {
  if (modelLabel == null) {
    return false;
  }
  return modelValueComputed === modelLabel;
});

let shouldShowPlaceholder = $computed(() => {
  if (props.multiple) {
    return modelValue == null || modelValue.length === 0;
  }
  return modelValue == null || modelValue === "";
});

function modelValueUpdate(value?: string | string[] | null) {
  nextTick(() => {
    modelLabel = undefined;
  });
  modelValue = value;
  emit("update:modelValue", value);
  if (!props.multiple) {
    emit("update:modelLabel", modelLabels[0]);
  } else {
    if (Array.isArray(modelLabels)) {
      emit("update:modelLabel", modelLabels.join(","));
    } else {
      emit("update:modelLabel", "");
    }
  }
}

const modelLabels = $computed(() => {
  if (!modelValue) {
    return "";
  }
  if (!props.multiple) {
    const model = data.find((item) => props.optionsMap(item).value === modelValue);
    if (!model) {
      return "";
    }
    return [ props.optionsMap(model).label || "" ];
  }
  const labels: string[] = [ ];
  let modelValues = (modelValue || [ ]) as string[];
  for (const value of modelValues) {
    const model = data.find((item) => props.optionsMap(item).value === value);
    if (!model) {
      continue;
    }
    labels.push(props.optionsMap(model).label || "");
  }
  return labels;
});

function onClear() {
  if (!props.multiple) {
    modelValue = "";
    emit("update:modelValue", modelValue);
    emit("update:modelLabel", "");
    emit("change", modelValue);
    emit("clear");
    return;
  }
  modelValue = [ ];
  emit("update:modelValue", modelValue);
  emit("update:modelLabel", "");
  emit("change", modelValue);
  emit("clear");
}

let options4SelectV2 = $ref<(OptionType & { __pinyin_label?: string })[]>(props.options4SelectV2);

let key = $ref(0);

watch(
  () => options4SelectV2,
  () => {
    key++;
  },
  {
    deep: true,
  },
);

async function refreshDropdownWidth() {
  if (!props.autoWidth) {
    return;
  }
  if (!t || !t.proxy || !t.proxy.$el) {
    return;
  }
  await nextTick();
  const el = t.proxy.$el as HTMLDivElement;
  const wrapperEl = el.querySelector(".el-select-v2__wrapper") as HTMLDivElement | null;
  if (!wrapperEl) {
    return;
  }
  const id = wrapperEl.getAttribute("aria-describedby");
  if (!id) {
    return;
  }
  const popperEl = document.getElementById(id) as HTMLDivElement | null;
  if (!popperEl) {
    return;
  }
  const optionItemEls = popperEl.querySelectorAll(".el-select-dropdown__option-item");
  if (!optionItemEls || optionItemEls.length === 0) {
    return;
  }
  const dropdownListEl = popperEl.querySelector(".el-select-dropdown__list") as HTMLDivElement | null;
  if (!dropdownListEl) {
    return;
  }
  const popperWidth = parseInt(dropdownListEl.style.width);
  if (!popperWidth) {
    return;
  }
  let maxWidth = 0;
  for (let i = 0; i < optionItemEls.length; i++) {
    const item = optionItemEls[i];
    const width = item.scrollWidth;
    if (width > maxWidth) {
      maxWidth = width;
    }
  }
  if (maxWidth > popperWidth) {
    dropdownListEl.style.minWidth = `${ maxWidth }px`;
  }
}

function filterMethod(value: string) {
  if (!options4SelectV2 || options4SelectV2.length === 0) {
    options4SelectV2 = data.map((item) => {
      const item2 = props.optionsMap(item);
      item2.__pinyin_label = (item as any).__pinyin_label;
      return item2;
    });
  }
  if (isEmpty(value)) {
    return;
  }
  options4SelectV2 = options4SelectV2.filter((item) => {
    return item.label.includes(value)
    || (item.__pinyin_label && item.__pinyin_label.includes(value));
  });
}

function handleVisibleChange(visible: boolean) {
  if (visible) {
    refreshDropdownWidth();
  }
  if (props.pinyinFilterable) {
    if (visible) {
      filterMethod("");
    }
  }
}

async function refreshEfc() {
  const method = props.method;
  if (!method) {
    if (!options4SelectV2 || options4SelectV2.length === 0) {
      inited = false;
    } else {
      inited = true;
    }
    return;
  }
  if (!options4SelectV2 || options4SelectV2.length === 0) {
    inited = false;
  } else {
    inited = true;
  }
  data = await method();
  options4SelectV2 = data.map(props.optionsMap);
  if (props.pinyinFilterable) {
    for (let i = 0; i < options4SelectV2.length; i++) {
      const item = options4SelectV2[i];
      if (item.label) {
        (data as any)[i].__pinyin_label = pinyin(item.label, { pattern: "first", toneType: "none", type: "array" }).join("");
      }
    }
  }
  inited = true;
}

function onChange() {
  if (!props.multiple) {
    const model = data.find((item) => props.optionsMap(item).value === modelValue);
    emit("change", model);
    return;
  }
  let models: any[] = [ ];
  let modelValues: string[] = [ ];
  if (Array.isArray(modelValue)) {
    modelValues = modelValue;
  } else {
    modelValues = modelValue?.split(",") || [ ];
  }
  for (const value of modelValues) {
    const model = data.find((item) => props.optionsMap(item).value === modelValue)!;
    models.push(model);
  }
  emit("change", models);
}


let selectDivRef = $ref<HTMLDivElement>();

async function refreshWrapperHeight() {
  await new Promise((resolve) => setTimeout(resolve, 0));
  if (!selectDivRef) {
    return;
  }
  const phder = selectDivRef?.querySelector(".el-select-v2__placeholder") as HTMLDivElement | null | undefined;
  if (!phder) {
    return;
  }
  const wrapper = selectDivRef?.querySelector(".el-select-v2__wrapper") as HTMLDivElement | null | undefined;
  if (!wrapper) {
    return;
  }
  const height = phder.offsetHeight;
  if (height === 0) {
    return;
  }
  wrapper.style.transition = "none";
  wrapper.style.height = `${ (height + 14) }px`;
}

watch(
  () => modelValue && inited && !props.multiple && options4SelectV2.length > 0,
  (val) => {
    if (!val) {
      return;
    }
    refreshWrapperHeight();
  },
);

if (props.init) {
  refreshEfc();
}

usrStore.onLogin(refreshEfc);

onMounted(() => {
  refreshWrapperHeight();
});

defineExpose({
  refresh: refreshEfc,
});
</script>

<style scoped lang="scss">
.custom_select_space_normal {
  :deep(.el-select-v2__placeholder) {
    line-height: normal;
    white-space: normal;
    top: calc(50% - 2px);
  }
}
.custom_select_isShowModelLabel {
  :deep(.el-select-v2__placeholder),.custom_select_readonly {
    color: red;
  }
}
</style>
