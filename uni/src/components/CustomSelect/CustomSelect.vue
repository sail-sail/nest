<template>
<view
  class="custom_select"
  :class="{
    'custom_select_readonly': props.readonly
  }"
>
  <slot name="left"></slot>
  <view
    un-flex="~ [1_0_0]"
    un-overflow-hidden
    un-items="center"
    @click="onClick"
    un-h="full"
    un-p="l-3"
    un-box-border
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
      {{ (props.pageInited && inited) ? (props.placeholder || '') : '' }}
    </text>
    <view
      un-flex="[1_0_0]"
      un-overflow-hidden
    ></view>
    <tm-icon
      v-if="!props.disabled && !props.readonly"
      :size="42"
      color="#b1b1b1"
      name="arrow-right-s-line"
    ></tm-icon>
  </view>
  <view
    @click="onClear"
    un-p="r-2.65"
    un-box-border
    v-if="props.clearable && !isValueEmpty"
  >
    <tm-icon
      _style="transition:color 0.24s"
      :size="30"
      color="#b1b1b1"
      name="close-circle-fill"
    >
    </tm-icon>
  </view>
  <slot name="right"></slot>
</view>
<tm-drawer
  v-bind="$attrs"
  v-model:show="showPicker"
  :closeable="true"
  :height="dHeight"
  :title="props.placeholder || '请选择'"
  disabledScroll
  showClose
>
  <view
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
    un-h="full"
  >
    <scroll-view
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
      :scroll-y="true"
      :rebound="false"
    >
      <view>
        <view
          v-for="item in options4SelectV2"
          :key="item.value"
          :title="item.label"
          @click="onSelect(item.value)"
          un-p="y-4"
          un-box-border
          un-flex="~"
          un-items="center"
          un-gap="2"
          un-b="0 b-1 solid #e6e6e6"
          :style="{
            'color': selectedValueMuti.includes(item.value) ? '#0579ff' : undefined,
            'border-color': selectedValueMuti.includes(item.value) ? '#0579ff' : undefined,
          }"
        >
          
          <view
            un-flex="~ [1_0_0]"
            un-overflow-hidden
            un-items="center"
            un-m="l-4"
          >
            {{ item.label }}
          </view>
          
          <view
            style="width: 1.2rem;height: 1.2rem;"
            un-m="r-4"
          >
            <view
              v-if="selectedValueMuti.includes(item.value)"
              un-i="iconfont-check"
            ></view>
          </view>
          
        </view>
      </view>
    </scroll-view>
    <view
      un-p="x-2 y-4"
      un-box-border
      un-flex="~"
      un-w="full"
      un-items="center"
      un-gap="4"
    >
      
      <view
        un-flex="~ [1_0_0]"
      >
        <tm-button
          @click="onCancel"
          color="info"
          width="100%"
        >
          取消
        </tm-button>
      </view>
      
      <view
        un-flex="~ [1_0_0]"
      >
        <tm-button
          @click="onConfirm"
          width="100%"
        >
          确定
        </tm-button>
      </view>
      
    </view>
    <view
      :style="{ height: sysinfo.bottom + 'px' }"
    ></view>
  </view>
</tm-drawer>
</template>

<script lang="ts" setup>
type OptionType = {
  label: string;
  value: any;
};

type OptionsMap = (item: any) => OptionType;

const emit = defineEmits<{
  (e: "update:modelValue", value?: any): void,
  (e: "data", data: any[]): void,
  (e: "change", value: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    method: () => Promise<any[]>; // 用于获取数据的方法
    optionsMap?: OptionsMap;
    modelValue?: any;
    options4SelectV2?: OptionType[];
    placeholder?: string;
    height?: number;
    initData?: boolean;
    pageInited?: boolean;
    clearable?: boolean;
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
    initData: true,
    pageInited: true,
    clearable: true,
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

const selectedValue = ref(props.modelValue);
  
watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val;
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

let selectedValueMuti = computed(() => {
  if (selectedValue.value == null) {
    return [ ];
  }
  if (props.multiple) {
    if (Array.isArray(selectedValue.value)) {
      return selectedValue.value as string[];
    } else {
      return [ selectedValue.value as string ];
    }
  }
  return [ selectedValue.value as string ];
});

function onSelect(value: string) {
  if (props.multiple) {
    if (selectedValueMuti.value.includes(value)) {
      selectedValue.value = selectedValueMuti.value.filter((item) => item !== value);
    } else {
      selectedValue.value = [ ...selectedValueMuti.value, value ];
    }
  } else {
    selectedValue.value = value;
  }
}

let isValueEmpty = computed(() => {
  if (!selectedValue.value) {
    return true;
  }
  if (props.multiple) {
    return !selectedValue.value || (selectedValue.value as string[]).length === 0;
  }
  return false;
});

let showPicker = ref(false);

let modelLabels = computed(() => {
  if (props.modelValue == null) {
    return "";
  }
  if (!props.multiple) {
    const model = data.value.find((item) => props.optionsMap(item).value === props.modelValue);
    if (!model) {
      return "";
    }
    return [ props.optionsMap(model).label || "" ];
  }
  let labels: string[] = [ ];
  let modelValues = (props.modelValue || [ ]) as string[];
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
    showPicker.value = false;
    return;
  }
  showPicker.value = true;
}

function onChange() {
  let selectedValueArr: string[] = [ ];
  if (props.multiple) {
    selectedValueArr = (selectedValue.value || [ ]) as string[];
  } else if (selectedValue.value) {
    selectedValueArr = [ selectedValue.value as string ];
  }
  const models = selectedValueArr.map((selectedValue) => {
    const model = data.value.find((item) => props.optionsMap(item).value === selectedValue)!;
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
    selectedValue.value = "";
  } else {
    selectedValue.value = [ ];
  }
  emit("update:modelValue", selectedValue.value);
  emit("clear");
}

function onConfirm() {
  showPicker.value = false;
  emit("update:modelValue", selectedValue.value);
}

function onCancel() {
  showPicker.value = false;
}

async function onRefresh() {
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

if (props.initData) {
  onRefresh();
}

defineExpose({
  refresh: onRefresh,
});
</script>

<style lang="scss" scoped>
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
  height: 88rpx;
  display: flex;
  align-items: center;
  // border-radius: 4px;
}
</style>
