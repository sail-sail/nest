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
  :model-value="modelValue === '' ? modelValue : undefined"
  @update:model-value="modelValue = $event"
  :loading="!inited"
  class="dict_select"
  :multiple="props.multiple"
  :clearable="!props.disabled"
  :disabled="props.disabled"
  :readonly="props.readonly"
  @keyup.enter.stop
  @change="valueChg"
>
  <!--传递插槽-->
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
    un-min="h-8"
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

export type DictModel = {
  id: string;
  lbl: string;
  type: string;
  val: string;
  __pinyin_label?: string;
};

const t = getCurrentInstance();

type OptionsMap = (item: DictModel) => OptionType;

const props = withDefaults(
  defineProps<{
    code: string;
    optionsMap?: OptionsMap;
    pinyinFilterable?: boolean;
    height?: number;
    modelValue?: any;
    autoWidth?: boolean;
    maxWidth?: number;
    multiple?: boolean;
    disabled?: boolean;
    readonly?: boolean;
  }>(),
  {
    optionsMap: function(item: DictModel) {
      if ([ "number", "time", "boolean" ].includes(item.type)) {
        return {
          label: item.lbl,
          value: Number(item.val),
        };
      }
      return {
        label: item.lbl,
        value: item.val,
      };
    },
    pinyinFilterable: true,
    height: 300,
    modelValue: undefined,
    autoWidth: true,
    maxWidth: 550,
    multiple: false,
    disabled: undefined,
    readonly: undefined,
  },
);

let inited = $ref(false);

let modelValue = $ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
);

function valueChg() {
  emit("update:modelValue", modelValue);
  if (!props.multiple) {
    const model = dictModels.find((item) => modelValue != null && String(props.optionsMap(item).value) == String(modelValue));
    emit("change", model);
    return;
  }
  let models: DictModel[] = [ ];
  let modelValues: string[] = [ ];
  if (Array.isArray(modelValue)) {
    modelValues = modelValue;
  } else {
    modelValues = modelValue?.split(",") || [ ];
  }
  for (const value of modelValues) {
    const model = dictModels.find((item) => value != null && String(props.optionsMap(item).value) == String(value))!;
    models.push(model);
  }
  emit("change", models);
}

let options4SelectV2 = $ref<(OptionType & { __pinyin_label?: string })[]>([ ]);

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

let dictModels = $ref<DictModel[]>([ ]);

const emit = defineEmits<{
  (e: "update:modelValue", value?: any): void,
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const modelLabels = $computed(() => {
  if (!modelValue) {
    return "";
  }
  if (!props.multiple) {
    const model = dictModels.find((item) => modelValue != null && String(props.optionsMap(item).value) === String(modelValue));
    if (!model) {
      return "";
    }
    return [ props.optionsMap(model).label || "" ];
  }
  let labels: string[] = [ ];
  let modelValues = (modelValue || [ ]) as string[];
  for (const value of modelValues) {
    const model = dictModels.find((item) => value != null && String(props.optionsMap(item).value) === String(value));
    if (!model) {
      continue;
    }
    labels.push(props.optionsMap(model).label || "");
  }
  return labels;
});

function clearClk() {
  modelValue = undefined;
  emit("update:modelValue", modelValue);
  emit("change", modelValue);
  emit("clear");
}

function filterMethod(value: string) {
  options4SelectV2 = dictModels.map((item) => {
    const item2 = props.optionsMap(item);
    item2.__pinyin_label = item.__pinyin_label;
    return item2;
  });
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
  const code = props.code;
  if (!code) {
    inited = false;
    dictModels = [ ];
    return;
  }
  inited = false;
  [ dictModels ] = await getDictbiz([ code ]);
  options4SelectV2 = dictModels.map(props.optionsMap);
  if (props.pinyinFilterable) {
    for (let i = 0; i < options4SelectV2.length; i++) {
      const item = options4SelectV2[i];
      if (item.label) {
        dictModels[i].__pinyin_label = pinyin(item.label, { pattern: "first", toneType: "none", type: "array" }).join("");
      }
    }
  }
  inited = true;
}

watch(
  () => props.code,
  async () => {
    await refreshEfc();
  },
  {
    immediate: true,
  },
);
</script>
