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
  @clear="onClear"
  un-w="full"
  v-bind="$attrs"
  :model-value="modelValueComputed"
  @update:model-value="modelValueUpdate"
  :loading="!inited"
  class="dictbiz_select"
  :class="{
    dictbiz_select_isShowModelLabel: isShowModelLabel && inited,
  }"
  :multiple="props.multiple"
  :clearable="!props.disabled"
  :disabled="props.disabled"
  :readonly="props.readonly"
  :placeholder="isShowModelLabel && props.multiple ? props.modelLabel : props.placeholder"
  @keyup.enter.stop
  @change="onValueChange"
>
  <template
    v-if="props.multiple && props.showSelectAll && !props.disabled && !props.readonly && options4SelectV2.length > 1"
    #header
  >
    <el-checkbox
      v-model="isSelectAll"
      :indeterminate="isIndeterminate"
      un-w="full"
      un-p="l-3"
      un-box-border
    >
      <span>
        ({{ ns("全选") }})
      </span>
    </el-checkbox>
  </template>
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
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-words
    class="dictbiz_select_readonly"
    v-bind="$attrs"
  >
    <template
      v-if="modelLabels.length === 0"
    >
      <span
        class="dictbiz_select_placeholder"
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </span>
    </template>
    <template
      v-else
    >
      <span
        v-if="isShowModelLabel"
        class="dictbiz_select_readonly"
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
          :disable-transitions="true"
        >
          {{ label }}
        </el-tag>
      </div>
    </template>
  </div>
  <div
    v-else
    un-b="1 solid [var(--el-border-color)]"
    un-p="x-2.5 y-1"
    un-box-border
    un-rounded
    un-w="full"
    un-min="h-8"
    un-line-height="normal"
    un-break-words
    class="dictbiz_select_readonly"
    :class="{
      'dictbiz_select_placeholder': shouldShowPlaceholder,
      dictbiz_select_isShowModelLabel: isShowModelLabel,
    }"
    v-bind="$attrs"
  >
    <template
      v-if="!modelLabels[0]"
    >
      <span
        class="dictbiz_select_placeholder"
      >
        {{ props.readonlyPlaceholder ?? "" }}
      </span>
    </template>
    <template
      v-else
    >
      <span
        v-if="isShowModelLabel"
        class="dictbiz_select_readonly"
      >
        {{ props.modelLabel || "" }}
      </span>
      <span
        v-else
        class="dictbiz_select_readonly"
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
  GetDictbiz,
} from "@/typings/types";

import type {
  OptionType,
} from "element-plus/es/components/select-v2/src/select.types";

export type DictbizModel = GetDictbiz & {
  __pinyin_label?: string;
};

const t = getCurrentInstance();

type OptionsMap = (item: DictbizModel) => OptionType;

const props = withDefaults(
  defineProps<{
    code: string;
    optionsMap?: OptionsMap;
    pinyinFilterable?: boolean;
    height?: number;
    modelValue?: any;
    modelLabel?: string | null;
    autoWidth?: boolean;
    maxWidth?: number;
    multiple?: boolean;
    showSelectAll?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
  }>(),
  {
    optionsMap: function(item: DictbizModel) {
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
    pinyinFilterable: false,
    height: 300,
    modelValue: undefined,
    modelLabel: undefined,
    autoWidth: true,
    maxWidth: 550,
    multiple: false,
    showSelectAll: true,
    disabled: undefined,
    readonly: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
  },
);

let inited = $ref(false);

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

let isSelectAll = $computed({
  get() {
    if (!modelValue) {
      return false;
    }
    if (!Array.isArray(modelValue)) {
      return false;
    }
    if (modelValue.length === 0) {
      return false;
    }
    if (modelValue.length === options4SelectV2.length) {
      return true;
    }
    return false;
  },
  set(val: boolean) {
    if (val) {
      modelValue = options4SelectV2.map((item) => item.value);
    } else {
      modelValue = [ ];
    }
    emit("update:modelValue", modelValue);
    emit("change", modelValue);
  },
});

const isIndeterminate = $computed(() => {
  if (!modelValue) {
    return false;
  }
  if (!Array.isArray(modelValue)) {
    return false;
  }
  if (modelValue.length === 0) {
    return false;
  }
  if (modelValue.length === options4SelectV2.length) {
    return false;
  }
  return true;
});

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

function onValueChange() {
  emit("update:modelValue", modelValue);
  if (!props.multiple) {
    const model = dictbizModels.find((item) => modelValue != null && String(props.optionsMap(item).value) == String(modelValue));
    emit("change", model);
    return;
  }
  let models: DictbizModel[] = [ ];
  let modelValues: string[] = [ ];
  if (Array.isArray(modelValue)) {
    modelValues = modelValue;
  } else {
    modelValues = modelValue?.split(",") || [ ];
  }
  for (const value of modelValues) {
    const model = dictbizModels.find((item) => value != null && String(props.optionsMap(item).value) == String(value))!;
    models.push(model);
  }
  emit("change", models);
}

let options4SelectV2 = $shallowRef<(OptionType & { __pinyin_label?: string })[]>([ ]);

watch(
  () => options4SelectV2,
  async () => {
    const oldModelValue = modelValue;
    modelValue = undefined;
    await nextTick();
    modelValue = oldModelValue;
  },
);

async function refreshDropdownWidth() {
  if (!props.autoWidth) {
    return;
  }
  if (!t || !t.refs || !t.refs.selectRef) {
    return;
  }
  await nextTick();
  const selectRef = t.refs.selectRef as any;
  if (!selectRef) {
    return;
  }
  const dropdownListEl = selectRef?.$refs?.menuRef?.listRef?.windowRef;
  if (!dropdownListEl) {
    return;
  }
  dropdownListEl.style.minWidth = "unset";
  const optionItemEls = dropdownListEl.querySelectorAll(".el-select-dropdown__item");
  if (!optionItemEls || optionItemEls.length === 0) {
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
    dropdownListEl.style.minWidth = `${ (maxWidth + 52) }px`;
  }
}

let dictbizModels = $ref<DictbizModel[]>([ ]);

const emit = defineEmits<{
  (e: "update:modelValue", value?: any): void,
  (e: "update:modelLabel", value?: string | null): void,
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const {
  ns,
  initSysI18ns,
} = useI18n();

const modelLabels = $computed(() => {
  if (!modelValue) {
    return "";
  }
  if (!props.multiple) {
    const model = dictbizModels.find((item) => modelValue != null && String(props.optionsMap(item).value) === String(modelValue));
    if (!model) {
      return "";
    }
    return [ props.optionsMap(model).label || "" ];
  }
  let labels: string[] = [ ];
  let modelValues = (modelValue || [ ]) as string[];
  for (const value of modelValues) {
    const model = dictbizModels.find((item) => value != null && String(props.optionsMap(item).value) === String(value));
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

function filterMethod(value: string) {
  options4SelectV2 = dictbizModels.map((item) => {
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
    dictbizModels = [ ];
    return;
  }
  inited = false;
  await nextTick();
  [ dictbizModels ] = await getDictbiz([ code ]);
  options4SelectV2 = dictbizModels.map(props.optionsMap);
  if (props.pinyinFilterable) {
    for (let i = 0; i < options4SelectV2.length; i++) {
      const item = options4SelectV2[i];
      if (item.label) {
        dictbizModels[i].__pinyin_label = pinyin(item.label, { pattern: "first", toneType: "none", type: "array" }).join("");
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

async function initFrame() {
  const codes = [
    "全选",
  ];
  await initSysI18ns(codes);
}

initFrame();

defineExpose({
  refresh: refreshEfc,
});
</script>

<style scoped lang="scss">
.dictbiz_select_space_normal {
  :deep(.el-select__placeholder) {
    line-height: normal;
    white-space: normal;
    top: calc(50% - 2px);
  }
}
.dictbiz_select_isShowModelLabel {
  :deep(.el-select__placeholder),.dictbiz_select_readonly {
    color: red;
  }
}
</style>

