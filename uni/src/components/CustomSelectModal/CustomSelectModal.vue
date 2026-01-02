<template>
<view
  class="custom_select"
  :class="{
    'custom_select_readonly': readonly
  }"
  :style="{
    cursor: readonly ? 'default' : 'pointer',
  }"
>
  <slot name="left"></slot>
  
  <view
    un-flex="~ [1_0_0] wrap"
    un-overflow-hidden
    un-items="center"
    un-h="full"
    un-w="full"
    un-p="l-3 r-2 y-1"
    un-box-border
    un-gap="2"
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
      un-cursor="pointer"
    >
      {{ props.pageInited ? (props.placeholder || '') : '' }}
    </text>
    
    <view
      un-flex="[1_0_0]"
      un-overflow-hidden
    ></view>
  
    <view
      v-if="props.clearable && !readonly && !modelValueIsEmpty"
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
      v-if="!readonly"
      :size="42"
      color="#b1b1b1"
      name="arrow-right-s-line"
    ></tm-icon>
    
  </view>
  
  <tm-modal
    v-model:show="showPicker"
    :closeable="true"
    :height="_height"
    :title="props.placeholder || '请选择'"
    disabled-scroll
    show-close
    :show-footer="false"
    :content-padding="0"
    max-height="90%"
    :overlay-click="true"
    v-bind="$attrs"
  >
    
    <view
      un-h="full"
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
      :style="{
        flex: options4SelectV2.length > 5 ? undefined : 'none',
      }"
    >
      
      <view
        v-if="options4SelectV2.length > 5 && !isLoading"
        un-p="t-2"
        un-box-border
        un-m="x-4"
        un-flex="~"
        un-items="center"
        un-gap="x-2"
      >
        
        <view
          un-flex="~ [1_0_0]"
          un-overflow-hidden
          un-items="center"
        >
          
          <tm-input
            v-model="searchStr"
            width="100%"
            placeholder="请输入关键字"
            show-clear
          ></tm-input>
          
        </view>
        
        <view
          v-if="props.multiple && props.showSelectAll && !readonly && options4SelectV2.length > 0"
        >
          
          <tm-checkbox
            :model-value="selectedValueArr.length === options4SelectV2Computed.length"
            @change="onSelectAll"
          ></tm-checkbox>
          
        </view>
        
      </view>
      
      <scroll-view
        un-flex="~ [1_0_0] col"
        un-overflow-hidden
        :style="{
          flex: options4SelectV2.length > 5 ? undefined : 'none',
        }"
        scroll-y
        :rebound="false"
        :scroll-into-view="scrollIntoViewId"
        :scroll-with-animation="true"
      >
        
        <template
          v-if="isLoading"
        >
          
          <view
            un-flex="~"
            un-items="center"
            un-justify="center"
            un-text="gray-400"
            un-min="h-40"
            un-p="y-6"
            un-box-border
          >
            加载中...
          </view>
          
        </template>
        
        <template
          v-else
        >
          
          <view
            un-flex="~ [1_0_0] col"
            un-overflow-hidden
            :style="{
              flex: options4SelectV2.length > 5 ? undefined : 'none',
            }"
          >
          
            <view
              v-for="item of options4SelectV2Computed"
              :id="'a' + item.value"
              :key="item.value"
              :title="item.label"
              un-m="x-2"
              un-p="y-4"
              un-box-border
              un-flex="~"
              un-items="center"
              un-gap="2"
              un-b="0 b-1 solid #e6e6e6"
              :style="{
                'color': selectedValueArr.includes(item.value) ? '#0579ff' : undefined,
                'border-color': selectedValueArr.includes(item.value) ? '#0579ff' : '#e6e6e6',
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
              
            <view
              v-if="inited && options4SelectV2Computed.length === 0"
              un-flex="~"
              un-items="center"
              un-justify="center"
              un-text="gray-400"
              un-h="10"
            >
              (暂无数据)
            </view>
            
            <view
              v-else-if="options4SelectV2Computed.length > 5"
              un-m="y-2"
            >
              <CustomDivider></CustomDivider>
            </view>
            
          </view>
          
        </template>
          
      </scroll-view>
      
      <view
        un-p="x-2 y-2"
        un-box-border
        un-flex="~"
        un-w="full"
        un-items="center"
        un-gap="x-2"
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
      
    </view>
    
  </tm-modal>
</view>
</template>

<script lang="ts" setup>
import type {
  WatchHandle,
} from "vue";

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
    method: () => Promise<any[]> | Promise<MaybeRef<any[]>> | MaybeRef<any[]> | any[]; // 用于获取数据的方法
    optionsMap?: OptionsMap;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any;
    placeholder?: string;
    height?: string;
    initData?: boolean;
    refreshWhenShowPicker?: boolean;
    pageInited?: boolean;
    clearable?: boolean;
    multiple?: boolean;
    showSelectAll?: boolean;
    readonly?: boolean | null;
    searchStr?: string | null;
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
    placeholder: "",
    height: undefined,
    initData: true,
    pageInited: true,
    clearable: true,
    multiple: false,
    showSelectAll: true,
    readonly: undefined,
    searchStr: "",
  },
);

let _height = $ref(props.height || "90%");

const tmFormItemReadonly = inject<ComputedRef<boolean> | undefined>("tmFormItemReadonly", undefined);

const readonly = $computed(() => {
  if (props.readonly != null) {
    return props.readonly;
  }
  if (tmFormItemReadonly) {
    return tmFormItemReadonly.value;
  }
  return;
});

const inited = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = ref<any[]>([ ]);
const options4SelectV2 = ref<OptionType[]>([ ]);

const searchStr = ref(props.searchStr || "");

const options4SelectV2Computed = computed(() => {
  if (searchStr.value) {
    return options4SelectV2.value.filter((item) => item.label.includes(searchStr.value));
  }
  return options4SelectV2.value;
});

const isTagExpanded = ref(false);

function onExpandTag(event: Event) {
  event?.stopPropagation?.();
  isTagExpanded.value = !isTagExpanded.value;
}

const selectedValue = ref(props.modelValue);
  
watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val;
  },
);

watch(
  () => readonly,
  () => {
    if (readonly) {
      showPicker.value = false;
    }
  },
);

const selectedValueArr = computed(() => {
  if (selectedValue.value == null || selectedValue.value === "") {
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
    if (selectedValueArr.value.includes(value)) {
      selectedValue.value = selectedValueArr.value.filter((item) => item !== value);
    } else {
      selectedValue.value = [ ...selectedValueArr.value, value ];
    }
  } else {
    selectedValue.value = value;
  }
}

function onSelectAll() {
  if (selectedValueArr.value.length === options4SelectV2Computed.value.length) {
    selectedValue.value = [ ];
  } else {
    selectedValue.value = options4SelectV2Computed.value.map((item) => item.value);
  }
}

const modelValueIsEmpty = computed(() => {
  if (props.modelValue == null || props.modelValue === '') {
    return true;
  }
  if (props.multiple) {
    return (props.modelValue as string[]).length === 0;
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

const scrollIntoViewId = ref("");

async function onClick() {
  if (readonly) {
    showPicker.value = false;
    return;
  }
  if (props.refreshWhenShowPicker) {
    await onRefresh();
  }
  searchStr.value = "";
  selectedValue.value = props.modelValue;
  showPicker.value = true;
  scrollIntoViewId.value = "";
  setTimeout(() => {
    scrollIntoViewId.value = selectedValueArr.value[0] ? "a" + selectedValueArr.value[0] : "";
  }, 500);
}

const isLoading = ref(false);

watch(
  () => [showPicker.value, props.refreshWhenShowPicker],
  async () => {
    if (showPicker.value && props.refreshWhenShowPicker) {
      try {
        isLoading.value = true;
        await onRefresh();
      } finally {
        isLoading.value = false;
      }
    }
  },
);

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

let methodWatchHandle: WatchHandle | null = null;

async function onRefresh() {
  if (methodWatchHandle) {
    methodWatchHandle();
    methodWatchHandle = null;
  }
  const method = props.method;
  const methodData = (await method?.()) || [ ];
  if (isRef(methodData)) {
    methodWatchHandle  = watch(
      methodData,
      () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.value = unref(methodData) as any[];
        emit("data", data.value);
        options4SelectV2.value = data.value.map(props.optionsMap);
      },
      {
        immediate: true,
      },
    );
  } else {
    data.value = methodData;
    emit("data", data.value);
    options4SelectV2.value = data.value.map(props.optionsMap);
  }
}

watch(
  () => [
    inited.value,
    props.height,
    options4SelectV2.value.length,
  ],
  () => {
    if (!inited.value) {
      return;
    }
    if (options4SelectV2.value.length <= 5 && !props.height) {
      _height = "auto";
    } else {
      _height = props.height || "90%";
    }
  },
);

async function initFrame() {
  await onRefresh();
  inited.value = true;
}

if (props.initData) {
  initFrame();
}

function togglePicker() {
  showPicker.value = !showPicker.value;
}

onUnmounted(() => {
  if (methodWatchHandle) {
    methodWatchHandle();
    methodWatchHandle = null;
  }
});

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
  min-height: 88rpx;
  display: flex;
  align-items: center;
  // border-radius: 4px;
}
</style>
