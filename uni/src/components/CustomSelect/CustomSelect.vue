<template>
<view
  class="custom_select"
>
  <slot name="left"></slot>
  <view
    un-flex="~ [1_0_0]"
    un-overflow-hidden
    un-items="center"
    @click="onClick"
    un-h="full"
  >
    <text
      v-if="modelLabels[0] || ''"
    >
      {{ modelLabels[0] || '' }}
    </text>
    <text
      v-else
      un-text="gray"
    >
      {{ props.placeholder || '' }}
    </text>
    <view
      un-flex="[1_0_0]"
      un-overflow-hidden
    ></view>
    <tm-icon
      :user-interaction-enabled="false"
      :font-size="24"
      name="tmicon-angle-right"
    ></tm-icon>
  </view>
  <view
    @click="onClear"
    un-p="l-2"
    v-if="props.showClear && !isValueEmpty"
  >
    <tm-icon
      _style="transition:color 0.24s"
      :user-interaction-enabled="false"
      :font-size="30"
      name="tmicon-times-circle-fill"
    >
    </tm-icon>
  </view>
</view>
<tm-picker
  :columns="options4SelectV2"
  map-key="label"
  v-bind="$attrs"
  v-model="pickerValue"
  :disabled="props.disabled"
  v-model:show="showPicker"
>
</tm-picker>
</template>

<script lang="ts" setup>
type OptionType = {
  label: string;
  value: string;
};

type OptionsMap = (item: any) => OptionType;

const emit = defineEmits<{
  (e: "update:modelValue", value?: string | string[] | null): void,
  (e: "change", value?: any | any[] | null): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    method: () => Promise<any[]>; // 用于获取数据的方法
    optionsMap?: OptionsMap;
    modelValue?: string | string[] | null;
    options4SelectV2?: OptionType[];
    placeholder?: string;
    init?: boolean;
    showClear?: boolean;
    multiple?: boolean;
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
    modelValue: undefined,
    options4SelectV2: undefined,
    placeholder: "",
    init: true,
    showClear: true,
    multiple: false,
    disabled: false,
    readonly: false,
  },
);

let inited = $ref(false);
let data = $ref<any[]>([ ]);
let options4SelectV2 = $ref<OptionType[]>(props.options4SelectV2 || [ ]);
  
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

let isValueEmpty = $computed(() => {
  if (!modelValue) {
    return true;
  }
  if (props.multiple) {
    return !modelValue || (modelValue as string[]).length === 0;
  }
  return false;
});

let showPicker = $ref(false);

let pickerValue = $computed({
  get() {
    const value: number[] = [ ];
    const idx = options4SelectV2.findIndex((item) => item.value === modelValue);
    if (idx !== -1) {
      value.push(idx);
    }
    return value;
  },
  set(idxs: number[]) {
    if (idxs.length === 0) {
      modelValue = undefined;
      return;
    }
    const idx = idxs[0];
    modelValue = options4SelectV2[idx].value;
    onChange();
  },
});

let modelLabels = $computed(() => {
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

function onClick() {
  if (props.disabled || props.readonly) {
    return;
  }
  showPicker = true;
}

function onChange() {
  let modelValueArr: string[] = [ ];
  if (props.multiple) {
    modelValueArr = (modelValue || [ ]) as string[];
  } else if (modelValue) {
    modelValueArr = [ modelValue as string ];
  }
  const models = modelValueArr.map((modelValue) => {
    const model = data.find((item) => props.optionsMap(item).value === modelValue)!;
    return model;
  });
  if (props.multiple) {
    emit("change", models);
  } else {
    emit("change", models[0]);
  }
}

function onClear() {
  if (!props.multiple) {
    modelValue = "";
  } else {
    modelValue = [ ];
  }
  emit("clear");
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
  inited = true;
}

if (props.init) {
  refreshEfc();
}

defineExpose({
  refresh: refreshEfc,
});
</script>

<style scoped lang="scss">
.custom_select {
  margin-left: 0px;
  margin-top: 0px;
  margin-right: 0px;
  margin-bottom: 0px;
  padding-left: 0;
  padding-top: 0px;
  padding-right: 0;
  padding-bottom: 0px;
  // border: 0px solid rgba(230,230,230,1);
  // background-color: rgba(245,245,245,1);
  transition: border 0.24s;
  height: 35px;
  display: flex;
  align-items: center;
  // border-radius: 4px;
}
</style>
