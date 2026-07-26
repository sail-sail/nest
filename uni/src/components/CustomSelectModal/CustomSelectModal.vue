<template>
<view
  class="custom_select"
  :class="{
    'custom_select_readonly': readonly,
    'custom_select_isShowModelLabel': isShowModelLabel && pageInited,
  }"
  :style="{
    cursor: readonly ? 'default' : 'pointer',
  }"
>
  <slot name="left"></slot>
  
  <view
    un-flex="~ [1_0_0]"
    un-overflow="hidden"
    un-items="center"
    un-h="full"
    un-w="full"
    un-p="l-3 r-2 y-1"
    un-box-border
    un-gap="2"
    @click="onClick"
  >
    
    <view
      v-if="isShowModelLabel"
      un-flex="~ [1_0_0] wrap"
      un-overflow="hidden"
      un-items="center"
      un-h="full"
    >
      {{ modelLabel }}
    </view>
    
    <template
      v-else
    >
      
      <template
        v-if="(props.multiple || modelLabels[0]) && (!props.multiple || modelLabels.length > 0)"
      >
        
        <view
          v-if="!props.multiple || modelLabels.length === 1"
          un-flex="~ [1_0_0] wrap"
          un-overflow="hidden"
          un-items="center"
          un-h="full"
        >
          {{ modelLabels[0] || '' }}
        </view>
        
        <view
          v-else
          un-flex="~ [1_0_0] wrap"
          un-overflow="hidden"
          un-items="center"
          un-h="full"
          un-gap="2"
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
                un-text="[var(--color-placeholder)]"
              >
                +{{ modelLabels.length - 1 }}
              </view>
            </tm-tag>
            
          </template>
          
        </view>
        
      </template>
      
      <view
        v-else
        un-flex="~ [1_0_0] wrap"
        un-overflow="hidden"
        un-items="center"
        un-h="full"
        un-text="[var(--color-placeholder)]"
      >
        {{ props.pageInited ? (!readonly ? (props.placeholder || '') : (props.readonlyPlaceholder || '')) : '' }}
      </view>
      
    </template>
    
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
    :width="_width"
    :title="props.placeholder || '请选择'"
    disabled-scroll
    show-close
    :show-footer="false"
    :content-padding="0"
    max-height="90%"
    :overlay-click="true"
  >
    
    <view
      un-h="full"
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
      :style="{
        flex: shouldUseScrollableBody ? undefined : 'none',
      }"
    >
      
      <view
        v-if="!props.hideSearch && shouldUseScrollableBody"
        un-p="t-1"
        un-box-border
        un-m="x-3"
        un-flex="~ col"
        un-gap="y-1"
      >
        
        <slot
          name="search-extra"
          :search-str="searchStr"
          :search-params="extraSearch"
          :is-search-ids="isSearchIds"
          :on-search="onSearchConfirm"
        ></slot>
        
        <view
          un-flex="~"
          un-items="center"
          un-gap="x-2"
        >
          
          <view
            un-flex="~ [1_0_0]"
            un-overflow-hidden
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
                :show-clear="!!searchStr"
                @confirm="onSearchConfirm"
              ></tm-input>
            </view>
            
            <view>
              <tm-checkbox
                v-model="isSearchIds"
                @change="onSearchConfirm"
              ></tm-checkbox>
            </view>
            
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
        
      </view>
      
      <scroll-view
        un-flex="~ [1_0_0] col"
        un-overflow-hidden
        :style="{
          flex: shouldUseScrollableBody ? undefined : 'none',
        }"
        scroll-y
        enable-flex
        refresher-enabled
        :refresher-triggered="refresherTriggered"
        :rebound="false"
        :scroll-into-view="scrollIntoViewId"
        :scroll-with-animation="true"
        @refresherrefresh="onRefresherrefresh"
        @scrolltolower="onLoadMore"
      >
        
        <slot
          name="option"
          :size="options4SelectV2.length"
          :options-computed="options4SelectV2Computed"
          :selected-value="selectedValueArr"
          :on-select="onSelect"
        >
          
          <view
            v-for="item of options4SelectV2Computed"
            :id="getOptionAnchorId(item.value)"
            :key="item.value"
            :title="item.label"
            un-m="x-2"
            un-p="y-3"
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
            
            <slot
              name="option-label"
              :item="item"
            >
              
              <view
                un-flex="~ [1_0_0] col wrap"
                un-overflow-hidden
                un-justify="center"
                un-m="l-4"
                un-gap="y-1"
              >
                
                <view>
                  {{ item.label }}
                </view>
                
                <view
                  v-if="item.subLabel"
                  un-text="[var(--color-placeholder)]"
                  :style="{
                    'color': selectedValueArr.includes(item.value) ? '#0579ff' : undefined,
                  }"
                >
                  {{ item.subLabel }}
                </view>
                
              </view>
              
              
            </slot>
            
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
            v-if="(!inited || isLoading) && options4SelectV2.length === 0"
            un-flex="~ [1_0_0]"
            un-overflow-hidden
            un-items="center"
            un-justify="center"
            un-min="h-20"
            un-text="gray-500 dark:gray-400"
          >
            加载中...
          </view>
          
          <view
            v-else-if="inited && options4SelectV2Computed.length === 0"
            un-flex="~ [1_0_0]"
            un-overflow-hidden
            un-items="center"
            un-justify="center"
            un-text="gray-500 dark:gray-400"
            un-min="h-20"
          >
            (暂无数据)
          </view>
          
          <view
            v-else-if="inited && shouldUseScrollableBody"
            un-m="y-2"
          >
            <CustomDivider
              v-if="!isEnd && props.isPage"
            >
              加载更多中...
            </CustomDivider>
            <CustomDivider
              v-else
            >
              共 {{ options4SelectV2.length }} 条
            </CustomDivider>
          </view>
          
        </slot>
        
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
  subLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  image?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OptionsMap = (item: any) => OptionType;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SelectMethod = (...args: any[]) => Promise<any[] | MaybeRef<any[]>> | MaybeRef<any[]> | any[];

type SelectPageInput = {
  pgOffset?: number;
  pgSize?: number;
};

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:modelValue", value?: any): void,
  (e: "update:modelLabel", value?: string | null): void;
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
    method?: SelectMethod | any[]; // 用于获取数据的方法. 分页模式下约定为 (search?, page?)
    optionsMap?: OptionsMap;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any;
    modelLabel?: string | null;
    placeholder?: string;
    height?: string;
    width?: string;
    initData?: boolean;
    pageInited?: boolean;
    clearable?: boolean;
    multiple?: boolean;
    showSelectAll?: boolean;
    readonly?: boolean | null;
    readonlyPlaceholder?: string | null;
    searchStr?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchParams?: Record<string, any> | MaybeRef<Record<string, any>>;
    hideSearch?: boolean;
    isPage?: boolean;
    pageSize?: number;
    searchKey?: string;
    searchIds?: string;
  }>(),
  {
    method: undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    optionsMap: function(item: any) {
      return {
        label: item.lbl,
        subLabel: item.subLabel,
        value: item.id,
        image: item.img_lbl,
      };
    },
    modelValue: undefined,
    modelLabel: "",
    placeholder: "",
    height: undefined,
    width: undefined,
    initData: true,
    pageInited: true,
    clearable: true,
    multiple: false,
    showSelectAll: true,
    readonly: undefined,
    readonlyPlaceholder: undefined,
    searchStr: "",
    searchParams: undefined,
    hideSearch: false,
    isPage: false,
    pageSize: 20,
    searchKey: "keyword",
    searchIds: "ids",
  },
);

let _height = $ref(props.height || "90%");
const _width = $ref(props.width || "90%");

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

const isLoading = ref(false);

const searchStr = ref(props.searchStr || "");
const extraSearch = computed(() => {
  if (props.searchParams == null) {
    return { };
  }
  return unref(props.searchParams) || { };
});

const options4SelectV2Computed = computed(() => {
  if (props.isPage) {
    return options4SelectV2.value;
  }
  let options4SelectV2Filtered = options4SelectV2.value;
  if (isSearchIds) {
    options4SelectV2Filtered = options4SelectV2Filtered.filter((item) => selectedValueArr.value.includes(item.value));
  }
  if (searchStr.value) {
    options4SelectV2Filtered = options4SelectV2Filtered.filter((item) => item.label.includes(searchStr.value));
  }
  return options4SelectV2Filtered;
});

const shouldUseScrollableBody = computed(() => {
  return props.isPage || options4SelectV2.value.length > 5 || !!props.height;
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

let modelValue = $ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    modelValue = props.modelValue;
  },
);

let modelLabel = $ref(props.modelLabel);

watch(
  () => props.modelLabel,
  () => {
    modelLabel = props.modelLabel;
  },
);

const isShowModelLabel = $computed(() => {
  if (modelLabel == null || modelLabel === "") {
    return false;
  }
  return modelLabel != modelLabels.value.join(",");
});

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
    if (selectedValue.value === value) {
      selectedValue.value = "";
    } else {
      selectedValue.value = value;
    }
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
  if (modelValue == null || modelValue === '') {
    return true;
  }
  if (props.multiple) {
    return (modelValue as string[]).length === 0;
  }
  return false;
});

const showPicker = ref(false);

let refresherTriggered = $ref(false);
let pgOffset = $ref(0);
let isEnd = $ref(false);
let pendingRemoteRefresh = $ref(false);
let searchTimer: ReturnType<typeof setTimeout> | undefined;

function clearSearchTimer() {
  if (searchTimer == null) {
    return;
  }
  clearTimeout(searchTimer);
  searchTimer = undefined;
}

function getFallbackModelLabels() {
  if (!props.modelLabel) {
    return [ ];
  }
  if (!props.multiple) {
    return [ props.modelLabel ];
  }
  return props.modelLabel
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getNormalizedModelValues() {
  if (props.multiple) {
    if (selectedValue.value == null || selectedValue.value === "") {
      return [ ];
    }
    if (Array.isArray(selectedValue.value)) {
      return selectedValue.value.filter((item) => item != null && item !== "");
    }
    return [ selectedValue.value ];
  }
  if (selectedValue.value == null || selectedValue.value === "") {
    return [ ];
  }
  return [ selectedValue.value ];
}

const modelLabels = computed(() => {
  if (selectedValueArr.value.length === 0) {
    return [ ];
  }
  if (!props.multiple) {
    const model = data.value.find((item) => props.optionsMap(item).value === modelValue);
    if (!model) {
      return getFallbackModelLabels();
    }
    return [ props.optionsMap(model).label || "" ];
  }
  const labels: string[] = [ ];
  const modelValues = (modelValue || [ ]) as string[];
  for (const value of modelValues) {
    const model = data.value.find((item) => props.optionsMap(item).value === value);
    if (!model) {
      continue;
    }
    labels.push(props.optionsMap(model).label || "");
  }
  if (labels.length === 0) {
    return getFallbackModelLabels();
  }
  return labels;
});

// 如果是分页模式, 没弹框之前data是空的, modelValue对应的label无法获取, 需要弹框之前单独获取
watch(
  () => [
    props.modelValue,
    props.isPage,
    props.multiple,
    showPicker.value,
    isLoading.value,
    props.method,
  ],
  async () => {
    if (!props.isPage || showPicker.value || isLoading.value) {
      return;
    }
    if (typeof props.method !== "function") {
      return;
    }
    const modelValues = getNormalizedModelValues();
    if (modelValues.length === 0) {
      return;
    }
    const items = data.value.filter((item) => modelValues.includes(props.optionsMap(item).value));
    if (modelValues.length === items.length) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let methodData: any = [ ];
    try {
      isLoading.value = true;
      methodData = (await props.method?.(
        {
          [props.searchIds]: modelValues,
        },
        {
          pgSize: modelValues.length,
          pgOffset: 0,
        },
      )) || [ ];
    } catch {
      inited.value = true;
      isLoading.value = false;
    } finally {
      isLoading.value = false;
    }
    const mergedData = [ ...data.value ];
    for (const item of methodData) {
      const itemValue = props.optionsMap(item).value;
      if (!mergedData.some((existingItem) => props.optionsMap(existingItem).value === itemValue)) {
        mergedData.push(item);
      }
    }
    data.value = mergedData;
    emit("data", data.value);
    options4SelectV2.value = data.value.map(props.optionsMap);
  },
);

const scrollIntoViewId = ref("");

function getOptionAnchorId(
  value?: string,
) {
  if (!value) {
    return "";
  }
  return [
    "option",
    String(value)
      .replaceAll("_", "__")
      .replaceAll("+", "_plus_")
      .replaceAll("/", "_slash_")
      .replaceAll("=", "_eq_"),
  ].join("_");
}

async function syncScrollIntoView() {
  if (props.multiple || selectedValueArr.value.length === 0
    || options4SelectV2Computed.value.length === 0
    || props.isPage
  ) {
    return;
  }
  scrollIntoViewId.value = "";
  await nextTick();
  scrollIntoViewId.value = getOptionAnchorId(selectedValueArr.value[0]);
}

async function onClick() {
  if (readonly) {
    showPicker.value = false;
    return;
  }
  searchStr.value = "";
  selectedValue.value = modelValue;
  showPicker.value = true;
  await nextTick();
  await syncScrollIntoView();
}

async function onRefresherrefresh() {
  refresherTriggered = true;
  try {
    await onRefresh();
    await syncScrollIntoView();
  } finally {
    refresherTriggered = false;
  }
}

function getPageInput(): SelectPageInput {
  return {
    pgSize: props.pageSize,
    pgOffset,
  };
}

function getRemoteSearch() {
  const keyword = searchStr.value.trim();
  const hasKeyword = !!keyword;
  const hasExtraSearch = Object.entries(extraSearch.value || {}).some(([, value]) => {
    if (value == null || value === "") {
      return false;
    }
    if (Array.isArray(value)) {
      return value.some((item) => item != null && item !== "");
    }
    return true;
  });
  if (!hasKeyword && !isSearchIds && !hasExtraSearch) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search: Record<string, any> = { };
  if (hasKeyword) {
    search[props.searchKey] = keyword;
  }
  if (isSearchIds) {
    search[props.searchIds] = selectedValueArr.value;
  }
  for (const [key, value] of Object.entries(extraSearch.value || {})) {
    if (value == null || value === "") {
      continue;
    }
    if (Array.isArray(value) && value.every((item) => item == null || item === "")) {
      continue;
    }
    search[key] = value;
  }
  return search;
}

function setOptionsData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methodData: any,
  append = false,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nextData = (unref(methodData) || [ ]) as any[];
  if (append) {
    data.value = [
      ...data.value,
      ...nextData,
    ];
  } else {
    data.value = nextData;
  }
  emit("data", data.value);
  options4SelectV2.value = data.value.map(props.optionsMap);
  return nextData.length;
}

let isSearchIds = $ref(false);

async function loadPage(
  append = false,
) {
  if (typeof props.method !== "function") {
    data.value = [ ];
    emit("data", data.value);
    options4SelectV2.value = [ ];
    inited.value = true;
    isEnd = true;
    return;
  }
  if (isLoading.value) {
    if (!append) {
      pendingRemoteRefresh = true;
    }
    return;
  }
  if (!append) {
    pgOffset = 0;
    isEnd = false;
  } else if (isEnd) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let methodData: any = [ ];
  try {
    isLoading.value = true;
    methodData = (await props.method?.(
      getRemoteSearch(),
      getPageInput(),
    )) || [ ];
  } catch {
    inited.value = true;
    isLoading.value = false;
    return;
  } finally {
    isLoading.value = false;
  }
  const len = setOptionsData(methodData, append);
  pgOffset = data.value.length;
  isEnd = len < props.pageSize;
  inited.value = true;
  if (pendingRemoteRefresh) {
    pendingRemoteRefresh = false;
    await loadPage(false);
  }
}

watch(
  () => showPicker.value,
  async () => {
    if (!showPicker.value || isLoading.value) {
      return;
    }
    await onRefresh();
  },
);

function onClear() {
  if (!props.multiple) {
    selectedValue.value = "";
  } else {
    selectedValue.value = [ ];
  }
  modelLabel = "";
  emit("update:modelValue", selectedValue.value);
  emit("update:modelLabel", "");
  emit("confirm");
  emit("change");
  emit("clear");
}

function onConfirm() {
  showPicker.value = false;
  const isChanged = selectedValue.value !== modelValue;
  modelValue = selectedValue.value;
  modelLabel = modelLabels.value.join(",");
  emit("update:modelValue", selectedValue.value);
  emit("update:modelLabel", modelLabel);
  const models = selectedValueArr.value.map((selectedValue) => {
    const model = data.value.find((item) => props.optionsMap(item).value === selectedValue)!;
    return model;
  });
  if (props.multiple) {
    emit("confirm", models);
  } else {
    emit("confirm", models[0]);
  }
  if (isChanged) {
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

function onSearchConfirm() {
  if (!props.isPage || !showPicker.value) {
    return;
  }
  clearSearchTimer();
  void onRefresh();
}

async function onLoadMore() {
  if (!props.isPage) {
    return;
  }
  await loadPage(true);
}

let methodWatchHandle: WatchHandle | null = null;

async function onRefresh() {
  if (methodWatchHandle) {
    methodWatchHandle();
    methodWatchHandle = null;
  }
  if (props.isPage) {
    await loadPage(false);
    return;
  }
  if (typeof props.method !== "function") {
    methodWatchHandle = watch(
      () => props.method,
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const methodData = (unref(props.method) || [ ]) as any[];
        data.value = methodData;
        emit("data", data.value);
        options4SelectV2.value = data.value.map(props.optionsMap);
      },
      {
        immediate: true,
      },
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let methodData: any = [ ];
    try {
      isLoading.value = true;
      methodData = (await props.method?.()) || [ ];
    } finally {
      isLoading.value = false;
    }
    if (isRef(methodData)) {
      methodWatchHandle = watch(
        methodData,
        () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.value = (unref(methodData) || [ ]) as any[];
          emit("data", data.value);
          options4SelectV2.value = data.value.map(props.optionsMap);
        },
        {
          immediate: true,
        },
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.value = (methodData || [ ]) as any[];
      emit("data", data.value);
      options4SelectV2.value = data.value.map(props.optionsMap);
    }
  }
  inited.value = true;
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
    if (!shouldUseScrollableBody.value) {
      _height = "auto";
    } else {
      _height = props.height || "90%";
    }
  },
);

watch(
  () => searchStr.value,
  () => {
    if (!props.isPage || !showPicker.value) {
      return;
    }
    clearSearchTimer();
    searchTimer = setTimeout(() => {
      void onRefresh();
    }, 300);
  },
);

watch(
  () => props.searchParams,
  () => {
    if (!props.isPage || !showPicker.value) {
      return;
    }
    clearSearchTimer();
    searchTimer = setTimeout(() => {
      void onRefresh();
    }, 300);
  },
  {
    deep: true,
  },
);

async function initFrame() {
  if (props.isPage) {
    return;
  }
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
  clearSearchTimer();
  if (methodWatchHandle) {
    methodWatchHandle();
    methodWatchHandle = null;
  }
});

defineExpose({
  data,
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
.custom_select_isShowModelLabel {
  color: red;
}
</style>
