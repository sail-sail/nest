<template>
<ElSelectV2
  :options="options4SelectV2"
  filterable
  clearable
  collapse-tags
  collapse-tags-tooltip
  default-first-option
  :height="props.height"
  :remote="props.pinyinFilterable"
  :remote-method="filterMethod"
  @visible-change="handleVisibleChange"
  :model-value="modelValue"
  @update:model-value="modelValueUpdate"
  @clear="clearClk"
  v-bind="$attrs"
  @keyup.enter.stop
  :loading="!inited"
  class="custom_select"
>
  <template
    v-for="(item, key, index) in $slots"
    :key="index"
    #[key]
  >
    <slot :name="key"></slot>
  </template>
</ElSelectV2>
</template>

<script lang="ts" setup>
import { pinyin } from "pinyin-pro";

import {
  type OptionType,
} from "element-plus/es/components/select-v2/src/select.types";

const t = getCurrentInstance();

const usrStore = useUsrStore();

let emit = defineEmits<{
  (e: "update:modelValue", value?: string | string[] | null): void,
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
  },
);

let modelValue = $ref(props.modelValue);

function modelValueUpdate(value?: string | string[] | null) {
  modelValue = value;
  emit("update:modelValue", modelValue);
}

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
);

function clearClk() {
  modelValue = "";
  emit("update:modelValue", modelValue);
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

refreshEfc();

usrStore.onLogin(refreshEfc);
</script>
