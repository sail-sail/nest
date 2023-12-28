<template>
<div
  v-if="readonly !== true"
  ref="selectDivRef"
  un-w="full"
>
  <ElSelectV2
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
    :model-value="modelValue !== '' ? modelValue : undefined"
    @update:model-value="modelValueUpdate"
    :loading="!inited"
    class="custom_select"
    @change="onChange"
    :multiple="props.multiple"
    :clearable="!props.disabled"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :placeholder="props.placeholder"
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
      'custom_select_placeholder': shouldShowPlaceholder
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
      <el-tag
        v-for="label in modelLabels"
        :key="label"
        type="info"
      >
        {{ label }}
      </el-tag>
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
      'custom_select_placeholder': shouldShowPlaceholder
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
  },
);

let shouldShowPlaceholder = $computed(() => {
  if (props.multiple) {
    return modelValue == null || modelValue.length === 0;
  }
  return modelValue == null || modelValue === "";
});

function modelValueUpdate(value?: string | string[] | null) {
  modelValue = value;
  emit("update:modelValue", value);
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
    emit("clear");
    return;
  }
  modelValue = [ ];
  emit("update:modelValue", modelValue);
  emit("clear");
}

let options4SelectV2 = $ref<(OptionType & { __pinyin_label?: string })[]>(props.options4SelectV2);

async function refreshDropdownWidth() {
  if (!props.autoWidth) {
    return;
  }
  if (!t || !t.proxy || !t.proxy.$el) {
    return;
  }
  await nextTick();
  const el = t.proxy.$el as HTMLDivElement;
  const wrapperEl = el.querySelector(".el-select-v2__wrapper") as HTMLDivElement;
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
  wrapper.style.height = `${ (height + 12) }px`;
}

watch(
  () => modelValue,
  () => {
    refreshWrapperHeight();
  },
  {
    immediate: true,
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
