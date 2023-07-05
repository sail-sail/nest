<template>
<ElSelectV2
  v-if="readonly !== true"
  :options="options4SelectV2"
  filterable
  collapse-tags
  collapse-tags-tooltip
  default-first-option
  :height="props.height"
  :remote="props.pinyinFilterable"
  :remote-method="filterMethod"
  @visible-change="handleVisibleChange"
  @clear="clearClk"
  un-w="full"
  v-bind="$attrs"
  :model-value="modelValue ? modelValue : undefined"
  @update:model-value="modelValueUpdate"
  :loading="!inited"
  class="custom_select"
  @change="valueChg"
  :multiple="props.multiple"
  :clearable="!props.disabled"
  :disabled="props.disabled"
  :readonly="props.readonly"
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
<template
  v-else
>
  <div
    v-if="props.multiple"
    un-flex="~ gap-1 wrap"
    un-b="1 solid [var(--el-border-color)]"
    un-p="y-0.75 x-1.5"
    un-box-border
    un-rounded
    un-m="l-1"
    un-w="full"
    un-min="h-7.5"
    un-line-height="normal"
    un-break-words
    class="custom_select_readonly"
    v-bind="$attrs"
  >
    <el-tag
      v-for="label in modelLabels"
      :key="label"
      type="info"
    >
      {{ label }}
    </el-tag>
  </div>
  <div
    v-else
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
    v-bind="$attrs"
  >
    {{ modelLabels[0] || "" }}
  </div>
</template>
</template>

<script lang="ts" setup>
import { pinyin } from "pinyin-pro";

import {
  type OptionType,
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
  },
);

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

function modelValueUpdate(value?: string | string[] | null) {
  modelValue = value;
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
  let labels: string[] = [ ];
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

function clearClk() {
  modelValue = "";
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

function valueChg(value: string | string[] | null) {
  if (!props.multiple) {
    const model = data.find((item) => props.optionsMap(item).value === value);
    emit("change", model);
    return;
  }
  let models: any[] = [ ];
  let modelValues = (modelValue || [ ]) as string[];
  for (const value of modelValues) {
    const model = data.find((item) => props.optionsMap(item).value === value);
    models.push(model);
  }
  emit("change", models);
}

if (props.init) {
  refreshEfc();
}

usrStore.onLogin(refreshEfc);

defineExpose({
  refresh: refreshEfc,
});
</script>
