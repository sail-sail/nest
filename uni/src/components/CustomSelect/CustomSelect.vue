<template>
<view
  class="custom_select"
  :class="{
    'custom_select_readonly': props.readonly,
  }"
  :style="{
    cursor: props.readonly ? 'default' : 'pointer',
  }"
>
  <slot name="left"></slot>
  
  <view
    un-flex="~ [1_0_0]"
    un-overflow-hidden
    un-items="center"
    un-h="full"
    un-p="l-3"
    un-box-border
    @click="onClick"
  >
    
    <template
      v-if="(props.multiple || modelLabels[0]) && (!props.multiple || modelLabels.length > 0)"
    >
      
      <text
        v-if="!props.multiple || modelLabels.length === 1"
        un-cursor="pointer"
      >
        {{ modelLabels[0] || '' }}
      </text>
      
      <template
        v-else
      >
        
        <template
          v-if="isTagExpanded"
        >
          
          <tm-tag
            v-for="(label, index) of modelLabels"
            :key="index"
            skin="outlined"
            color="info"
          >
            {{ label }}
          </tm-tag>
        
        </template>
        
        <template v-else>
          
          <tm-tag
            skin="outlined"
            color="info"
          >
            {{ modelLabels[0] }}
          </tm-tag>
          
          <tm-tag
            v-if="modelLabels.length > 1"
            skin="thin"
            color="info"
            un-cursor="pointer"
            @tap.stop=""
            @click.stop="onExpandTag"
          >
            <view
              v-if="modelLabels.length > 1"
              un-text="gray-400"
            >
              +{{ modelLabels.length - 1 }}
            </view>
          </tm-tag>
          
        </template>
        
      </template>
      
    </template>
    
    <text
      v-else
      un-text="gray"
    >
      {{ props.pageInited ? (props.placeholder || '') : '' }}
    </text>
    
    <view
      un-flex="[1_0_0]"
      un-overflow-hidden
    ></view>
    
    <view
      v-if="props.clearable && !props.readonly && !modelValueIsEmpty"
      @tap.stop=""
      @click="onClear"
    >
      <tm-icon
        _style="transition:color 0.24s"
        :size="30"
        color="#b1b1b1"
        name="close-circle-fill"
        @tap.stop=""
        @click="onClear"
      >
      </tm-icon>
    </view>
    
    <slot name="right"></slot>
    
    <tm-icon
      v-if="!props.readonly"
      :size="42"
      color="#b1b1b1"
      name="arrow-right-s-line"
    ></tm-icon>
  </view>
  
  <tm-drawer
    v-model:show="showPicker"
    :closeable="true"
    :height="dHeight"
    :title="props.placeholder || '请选择'"
    disabled-scroll
    show-close
    v-bind="$attrs"
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
            un-p="y-4"
            un-box-border
            un-flex="~"
            un-items="center"
            un-gap="2"
            un-b="0 b-1 solid #e6e6e6"
            :style="{
              'color': selectedValueArr.includes(item.value) ? '#0579ff' : undefined,
            }"
            @click="onSelect(item.value)"
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
                v-if="selectedValueArr.includes(item.value)"
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
            color="info"
            width="100%"
            @click="onCancel"
          >
            取消
          </tm-button>
        </view>
        
        <view
          un-flex="~ [1_0_0]"
        >
          <tm-button
            width="100%"
            @click="onConfirm"
          >
            确定 ({{ selectedValueArr.length }})
          </tm-button>
        </view>
        
      </view>
      <view
        :style="{ height: sysinfo.bottom + 'px' }"
      ></view>
    </view>
  </tm-drawer>
</view>
</template>

<script lang="ts" setup>
type OptionType = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OptionsMap = (item: any) => OptionType;

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:modelValue", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "data", data: any[]): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "confirm", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value?: any): void,
  (e: "clear"): void,
}>();

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    method: () => Promise<any[]>; // 用于获取数据的方法
    optionsMap?: OptionsMap;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any;
    options4SelectV2?: OptionType[];
    placeholder?: string;
    height?: number;
    initData?: boolean;
    pageInited?: boolean;
    clearable?: boolean;
    multiple?: boolean;
    readonly?: boolean;
  }>(),
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const inited = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = ref<any[]>([ ]);
const options4SelectV2 = ref<OptionType[]>(props.options4SelectV2 || [ ]);

const selectedValue = ref(props.modelValue);
  
watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val;
  },
);

const selectedValueArr = computed(() => {
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

const isTagExpanded = ref(false);

function onExpandTag(event: Event) {
  event?.stopPropagation?.();
  isTagExpanded.value = !isTagExpanded.value;
}

function onSelect(value: string) {
  if (props.multiple) {
    if (selectedValueArr.value.includes(value)) {
      selectedValue.value = selectedValueArr.value.filter((item) => item !== value);
    } else {
      selectedValue.value = [ ...selectedValueArr.value, value ];
    }
  } else {
    selectedValue.value = value;
  }
}

const modelValueIsEmpty = computed(() => {
  if (!props.modelValue) {
    return true;
  }
  if (props.multiple) {
    return !props.modelValue || (props.modelValue as string[]).length === 0;
  }
  return false;
});

const showPicker = ref(false);

const modelLabels = computed(() => {
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
  const labels: string[] = [ ];
  const modelValues = (props.modelValue || [ ]) as string[];
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
  if (props.readonly) {
    showPicker.value = false;
    return;
  }
  showPicker.value = true;
}

function onClear() {
  if (!props.multiple) {
    selectedValue.value = "";
  } else {
    selectedValue.value = [ ];
  }
  emit("update:modelValue", selectedValue.value);
  emit("confirm");
  emit("change");
  emit("clear");
}

function onConfirm() {
  showPicker.value = false;
  emit("update:modelValue", selectedValue.value);
  const models = selectedValueArr.value.map((selectedValue) => {
    const model = data.value.find((item) => props.optionsMap(item).value === selectedValue)!;
    return model;
  });
  if (props.multiple) {
    emit("confirm", models);
  } else {
    emit("confirm", models[0]);
  }
  if (selectedValue.value !== props.modelValue) {
    if (props.multiple) {
      emit("change", models);
    } else {
      emit("change", models[0]);
    }
  }
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
  data.value = (await method?.()) || [ ];
  emit("data", data.value);
  options4SelectV2.value = data.value.map(props.optionsMap);
  inited.value = true;
}

if (props.initData) {
  onRefresh();
}

function togglePicker() {
  showPicker.value = !showPicker.value;
}

defineExpose({
  refresh: onRefresh,
  togglePicker,
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
