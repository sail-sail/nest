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
  <slot name="right"></slot>
</view>
<tm-picker
  v-if="!props.multiple"
  :columns="options4SelectV2"
  map-key="label"
  v-bind="$attrs"
  v-model="pickerValue"
  :disabled="props.disabled"
  v-model:show="showPicker"
  :height="height"
  @confirm="onConfirm"
>
</tm-picker>
<template
  v-else
>
  <tm-drawer
    v-bind="$attrs"
    v-model:show="showPicker"
    :closeable="true"
    :height="dHeight"
    :title="props.placeholder || '请选择'"
    ok-text="确认"
  >
    <view
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
      un-h="full"
    >
      <view
        un-flex="~ [1_0_0] col"
        un-overflow-auto
        un-p="y-2 x-4"
        un-box-border
      >
        <tm-cell
          v-for="item in options4SelectV2"
          :key="item.value"
          :margin="[0, 0]"
          :title="item.label"
          un-rounded="md"
          un-flex="shrink-0"
          un-box-border
          :bottom-border="true"
          :border="1"
        >
          <template #right>
            <i
              v-if="modelValueMuti.includes(item.value)"
              un-i="iconfont-check"
              un-text="[var(--primary-color)]"
            ></i>
          </template>
        </tm-cell>
      </view>
      <view
        un-m="x-2"
      >
        <tm-button
          @click="onConfirm"
          label="确定选择"
          block
        ></tm-button>
      </view>
      <view
        :style="{ height: sysinfo.bottom + 'px' }"
      ></view>
    </view>
  </tm-drawer>
</template>
</template>

<script lang="ts" setup>
type OptionType = {
  label: string;
  value: string;
};

type OptionsMap = (item: any) => OptionType;

const emit = defineEmits<{
  (e: "update:modelValue", value?: string | string[] | null): void,
  (e: "data", data: any[]): void,
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
    height?: number;
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
    height: 700,
    init: true,
    showClear: true,
    multiple: false,
    disabled: false,
    readonly: false,
  },
);

const sysinfo = inject(
  "tmuiSysInfo",
  computed(() => {
    return {
      bottom: 0,
      height: 750,
      width: uni.upx2px(750),
      top: 0,
      isCustomHeader: false,
      sysinfo: null,
    };
  })
);

const dHeight = computed(() => {
  return props.height + sysinfo.value.bottom + 80;
});

let inited = ref(false);
let data = ref<any[]>([ ]);
let options4SelectV2 = ref<OptionType[]>(props.options4SelectV2 || [ ]);
  
let modelValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue.value = props.modelValue;
  },
);

watch(
  () => props.disabled,
  () => {
    if (props.disabled) {
      showPicker.value = false;
    }
  },
);

let modelValueMuti = computed(() => {
  if (!modelValue.value) {
    return [ ];
  }
  if (props.multiple) {
    if (Array.isArray(modelValue.value)) {
      return modelValue.value as string[];
    } else {
      return [ modelValue.value as string ];
    }
  }
  return [ modelValue.value as string ];
});

let isValueEmpty = computed(() => {
  if (!modelValue) {
    return true;
  }
  if (props.multiple) {
    return !modelValue || (modelValue.value as string[]).length === 0;
  }
  return false;
});

let showPicker = ref(false);

let pickerValue = computed({
  get() {
    const value: number[] = [ ];
    const idx = options4SelectV2.value.findIndex((item) => item.value === modelValue.value);
    if (idx !== -1) {
      value.push(idx);
    }
    return value;
  },
  set(idxs: number[]) {
    if (idxs.length === 0) {
      modelValue.value = undefined;
      return;
    }
    const idx = idxs[0];
    modelValue.value = options4SelectV2[idx].value;
    onChange();
  },
});

let modelLabels = computed(() => {
  if (!modelValue.value) {
    return "";
  }
  if (!props.multiple) {
    const model = data.value.find((item) => props.optionsMap(item).value === modelValue.value);
    if (!model) {
      return "";
    }
    return [ props.optionsMap(model).label || "" ];
  }
  let labels: string[] = [ ];
  let modelValues = (modelValue.value || [ ]) as string[];
  for (const value of modelValues) {
    const model = data.value.find((item) => props.optionsMap(item).value === value);
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
  showPicker.value = true;
}

function onChange() {
  let modelValueArr: string[] = [ ];
  if (props.multiple) {
    modelValueArr = (modelValue.value || [ ]) as string[];
  } else if (modelValue) {
    modelValueArr = [ modelValue.value as string ];
  }
  const models = modelValueArr.map((modelValue) => {
    const model = data.value.find((item) => props.optionsMap(item).value === modelValue)!;
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
    modelValue.value = "";
  } else {
    modelValue.value = [ ];
  }
  emit("update:modelValue", modelValue.value);
  emit("clear");
}

function onConfirm() {
  showPicker.value = false;
  emit("update:modelValue", modelValue.value);
}

async function refreshEfc() {
  const method = props.method;
  if (!method) {
    if (!options4SelectV2 || options4SelectV2.value.length === 0) {
      inited.value = false;
    } else {
      inited.value = true;
    }
    return;
  }
  if (!options4SelectV2 || options4SelectV2.value.length === 0) {
    inited.value = false;
  } else {
    inited.value = true;
  }
  data.value = await method();
  emit("data", data.value);
  options4SelectV2.value = data.value.map(props.optionsMap);
  inited.value = true;
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
