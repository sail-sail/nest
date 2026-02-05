<template>
<view
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  
  <!-- 操作 -->
  <view
    un-flex="~ wrap"
    un-m="x-2 t-2"
    un-items="center"
  >
    
    <view
      v-if="isEditing"
      un-flex="~"
      un-items="center"
      un-m="l-.125"
    >
      <tm-radio
        v-model="isSelectAll"
        :size="30"
        :label-font-size="28"
        :label="`${ dyn_page_data_ids_selected.length ? dyn_page_data_ids_selected.length : '' }`"
      ></tm-radio>
    </view>
    
    <view
      un-flex="[1_0_0]"
      un-overflow="hidden"
    ></view>
    
    <view
      un-flex="~"
      un-items="center"
      un-gap="x-4"
    >
      
      <template
        v-if="isEditing"
      >
        
        <view
          un-flex="[1_0_0]"
          un-overflow="hidden"
        ></view>
        
        <text
          un-whitespace="nowrap"
          un-cursor="pointer"
          un-text="red"
          @click="onDelete"
        >
          删除
        </text>
        
        <text
          un-whitespace="nowrap"
          un-cursor="pointer"
          @click="isEditing = false;dyn_page_data_ids_selected = [ ]"
        >
          取消
        </text>
        
      </template>
      
      <text
        v-if="!isEditing"
        un-whitespace="nowrap"
        un-cursor="pointer"
        @click="isEditing = true"
      >
        操作
      </text>
      
    </view>
    
  </view>
  
  <!-- 搜索 -->
  <view
    un-p="x-2 y-.5"
    un-box-border
  >
    <tm-form
      v-model="search"
      :label-width="200"
      
      @submit="onSearch"
    >
      
      <template
        v-for="field_model in dyn_page_field_models"
        :key="field_model.id"
      >
        <tm-form-item
          v-if="field_model.is_mobile_search"
          :label="field_model.lbl"
          :name="field_model.code"
          :required="false"
        >
          <CustomDynComp
            :model-value="search.dyn_page_data?.[field_model.code + '_like']"
            :name="field_model.type"
            :placeholder="`请输入 ${ field_model.lbl }`"
            v-bind="field_model._attrs"
            @update:model-value="(val: any) => {
              search.dyn_page_data = search.dyn_page_data ?? { };
              search.dyn_page_data[field_model.code + '_like'] = val;
            }"
            @change="onSearch"
          ></CustomDynComp>
        </tm-form-item>
      </template>
      
    </tm-form>
  </view>
  
  <scroll-view
    un-flex="~ [1_0_0] col"
    un-overflow="hidden"
    scroll-y
    enable-back-to-top
    enable-flex
    refresher-enabled
    :refresher-triggered="refresherTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="onLoadMore"
  >
    
    <view
      v-if="!inited && dyn_page_data_models.length === 0"
      un-m="x-2 t-2"
      un-p="x-4 y-4"
      un-box-border
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-rounded="md"
      un-text="gray-500"
      un-justify="center"
      un-items="center"
    >
      加载中, 请稍后...
    </view>
    
    <view
      v-if="inited && dyn_page_data_models.length === 0"
      un-m="x-2 t-2"
      un-p="x-4 y-4"
      un-box-border
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-rounded="md"
      un-text="gray-500"
      un-justify="center"
      un-items="center"
    >
      (暂无{{ menu_model?.lbl }}数据)
    </view>
    
    <template
      v-else
    >
      
      <view
        v-for="dyn_page_data_model of dyn_page_data_models_computed"
        :key="dyn_page_data_model.id"
        un-flex="~"
        un-m="x-2 t-2"
        un-gap="x-2"
      >
        
        <view
          v-if="isEditing"
          un-flex="~"
          un-items="center"
        >
          <tm-radio
            :model-value="dyn_page_data_ids_selected.includes(dyn_page_data_model.id)"
            :size="30"
            :show-label="false"
            @change="onRadio($event, dyn_page_data_model.id)"
          >
          </tm-radio>
        </view>
        
        <view
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-cursor="pointer"
          un-b="0 solid transparent b-1"
          :style="{
            borderColor: dyn_page_data_id_selected === dyn_page_data_model.id ? 'var(--color-primary)' : undefined,
          }"
          @click="onDynPageData(dyn_page_data_model.id)"
        >
          
          <view
            un-bg="white"
            un-flex="~ [1_0_0]"
            un-overflow="hidden"
            un-rounded="lg"
            un-items="center"
            un-p="x-2 y-2"
            un-box-border
          >
            
            <view
              un-flex="~ col"
              un-justify="center"
              un-gap="y-1"
            >
              
              <view
                un-flex="~"
                un-gap="x-2"
              >
                
                <view>
                  {{ dyn_page_data_model.ref_code }}
                </view>
                
              </view>
              
              <view
                un-text="3.5 gray-400"
              >
                {{ dyn_page_data_model.ref_code }}
              </view>
              
            </view>
            
            <view
              un-flex="[1_0_0]"
              un-overflow="hidden"
            ></view>
            
            <!-- 向右的箭头 -->
            <view
              v-if="!isEditing"
              un-flex="~"
              un-items="center"
            >
              <view
                un-i="iconfont-right"
              ></view>
            </view>
            
          </view>
          
        </view>
        
      </view>
      
    </template>
    
    <CustomDivider
      v-if="!isLoading && inited && total > 0"
    >
      共 {{ total }} {{ menu_model?.lbl }}数据
    </CustomDivider>
    
    <CustomDivider
      v-else-if="isLoading"
    >
      加载中...
    </CustomDivider>
  
  </scroll-view>
  
  <view
    v-if="!isEditing"
    un-fixed
    un-bottom="8"
    un-right="6"
    un-z="3"
    un-bg="[var(--color-primary)]"
    un-p="x-4 y-4"
    un-box-border
    un-rounded="full"
    un-cursor="pointer"
    @click="onAddDynPageData"
  >
    <view
      un-i="iconfont-plus"
      un-text="6"
      un-shadow="lg"
      un-color="white"
      un-font="bold"
    ></view>
  </view>
  
  <AppLoading></AppLoading>
</view>
</template>

<script setup lang="ts">
import {
  findAllDynPageData,
  findCountDynPageData,
  deleteByIdsDynPageData,
} from "./Api.ts";

import {
  useMenuTitle,
  useDynPageFields,
} from "@/compositions/List.ts";

let inited = $ref(false);

let isEditing = $ref(false);

let pagePath = $ref("");

let dyn_page_data_ids_selected = $ref<DynPageDataId[]>([ ]);
let dyn_page_data_id_selected = $ref<DynPageDataId>();

const dyn_page_data_models_key = "dyn_page_data.List.dyn_page_data_models";
let dyn_page_data_models = $ref<DynPageDataModel[]>(uni.getStorageSync(dyn_page_data_models_key) || [ ]);

type SearchType = {
  ref_code?: string;
  dyn_page_data?: DynPageDataSearch["dyn_page_data"];
};

const searchKey = "/pages/dyn_page_data/List:search";
const search = $ref<SearchType>(uni.getStorageSync(searchKey) || {
});

type DynPageDataModelComputed = {
  id: DynPageDataId;
  ref_code: string;
};

const dyn_page_data_models_computed = computed<DynPageDataModelComputed[]>(() => {
  return dyn_page_data_models.map((dyn_page_data_model, i) => {
    return {
      id: dyn_page_data_model.id,
      ref_code: dyn_page_data_model.ref_code,
    };
  });
});

/** 页面标题 */
const {
  menu_model,
} = $(useMenuTitle($$(pagePath)));

/** 动态页面表单字段 */
const {
  dyn_page_field_models,
  refreshDynPageFields,
} = $(useDynPageFields($$(pagePath)));

function onRadio(
  checked: boolean,
  dyn_page_data_id: DynPageDataId,
) {
  if (checked) {
    if (!dyn_page_data_ids_selected.includes(dyn_page_data_id)) {
      dyn_page_data_ids_selected.push(dyn_page_data_id);
    }
  } else {
    dyn_page_data_ids_selected = dyn_page_data_ids_selected.filter((item) => item !== dyn_page_data_id);
  }
}

async function onDynPageData(
  dyn_page_data_id: DynPageDataId,
) {
  if (isEditing) {
    if (!dyn_page_data_ids_selected.includes(dyn_page_data_id)) {
      dyn_page_data_ids_selected.push(dyn_page_data_id);
    } else {
      dyn_page_data_ids_selected = dyn_page_data_ids_selected.filter((item) => item !== dyn_page_data_id);
    }
    return;
  }
  dyn_page_data_id_selected = dyn_page_data_id;
  await uni.navigateTo({
    url: `/pages/dyn_page_data/Detail?dyn_page_data_id=${ encodeURIComponent(dyn_page_data_id) }`,
  });
}

async function onAddDynPageData() {
  if (!inited) {
    return;
  }
  await uni.navigateTo({
    url: "/pages/dyn_page_data/Detail",
  });
}

uni.$on("/pages/dyn_page_data/List:refresh", async function() {
  pgOffset = 0;
  await onRefresh();
});

/** 全选 */
const isSelectAll = $computed({
  get() {
    if (dyn_page_data_models.length === 0) {
      return false;
    }
    return dyn_page_data_ids_selected.length === dyn_page_data_models.length;
  },
  set(value) {
    if (value) {
      dyn_page_data_ids_selected = dyn_page_data_models.map((item) => item.id);
    } else {
      dyn_page_data_ids_selected = [ ];
    }
  },
});

/** 删除 */
async function onDelete() {
  if (dyn_page_data_ids_selected.length === 0) {
    uni.showToast({
      title: `请选择需要删除的${ menu_model?.lbl }`,
      icon: "none",
    });
    return;
  }
  const len = dyn_page_data_ids_selected.length;
  const {
    confirm,
  } = await uni.showModal({
    title: "提示",
    content: `确定删除选中的 ${ len } 个${ menu_model?.lbl }吗？`,
    confirmText: "删除",
    cancelText: "取消",
  });
  if (!confirm) {
    return;
  }
  
  await deleteByIdsDynPageData(dyn_page_data_ids_selected);
  
  uni.showToast({
    title: `删除 ${ len } 个${ menu_model?.lbl }成功`,
    icon: "none",
  });
  
  await onRefresh();
  
  dyn_page_data_ids_selected = [ ];
  isEditing = false;
}

const pgSize = 20;
let pgOffset = 0;
let total = $ref<number>(0);
let isLoading = $ref(false);
let isEnd = false;

async function onSearch() {
  uni.setStorage({
    key: searchKey,
    data: search,
  });
  pgOffset = 0;
  await onRefresh();
}

function getSearchDynPageData() {
  const search2: SearchType = {
    ...search,
    ref_code: pagePath,
  };
  return search2;
}

async function onRefresh() {
  if (isLoading) {
    return;
  }
  isLoading = true;
  pgOffset = 0;
  
  try {
    dyn_page_data_ids_selected = [ ];
    
    [
      dyn_page_data_models,
      total,
    ] = await Promise.all([
      findAllDynPageData(
        getSearchDynPageData(),
        {
          pgSize,
          pgOffset,
        },
        undefined,
        {
          notLoading: true,
        },
      ),
      findCountDynPageData(
        getSearchDynPageData(),
        {
          notLoading: true,
        },
      ),
    ]);
    
    if (!dyn_page_data_models.some((item) => item.id === dyn_page_data_id_selected)) {
      dyn_page_data_id_selected = undefined;
    }
    dyn_page_data_ids_selected = dyn_page_data_ids_selected
      .filter((id) => dyn_page_data_models.some((item2) => item2.id === id));
    const len = dyn_page_data_models.length;
    isEnd = len < pgSize;
    pgOffset = len;
    await uni.setStorage({
      key: dyn_page_data_models_key,
      data: dyn_page_data_models,
    });
  } finally {
    isLoading = false;
  }
}

async function onLoadMore() {
  if (isLoading) {
    return;
  }
  if (isEnd) {
    isLoading = false;
    return;
  }
  isLoading = true;
  try {
    const dyn_page_data_models_new = await findAllDynPageData(
      getSearchDynPageData(),
      {
        pgSize,
        pgOffset,
      },
      undefined,
      {
        notLoading: true,
      },
    );
    const len = dyn_page_data_models_new.length;
    if (len < pgSize) {
      isEnd = true;
    }
    if (len > 0) {
      pgOffset += len;
      dyn_page_data_models.push(...dyn_page_data_models_new);
    }
    if (!dyn_page_data_models.some((item) => item.id === dyn_page_data_id_selected)) {
      dyn_page_data_id_selected = undefined;
    }
    await uni.setStorage({
      key: dyn_page_data_models_key,
      data: dyn_page_data_models,
    });
  } finally {
    isLoading = false;
  }
}

let refresherTriggered = $ref(false);

/** 下拉刷新 */
async function onRefresherrefresh() {
  refresherTriggered = true;
  pgOffset = 0;
  try {
    await onRefresh();
  } finally {
    refresherTriggered = false;
  }
}

async function initFrame() {
  await onRefresh();
  inited = true;
}

onLoad(async (query?: AnyObject) => {
  const pg = query?.pg as string | undefined;
  if (!pg) {
    uni.showToast({
      title: "pg 参数不能为空",
      icon: "none",
    });
    return;
  }
  pagePath = decodeURIComponent(pg);
  await initFrame();
});
</script>
