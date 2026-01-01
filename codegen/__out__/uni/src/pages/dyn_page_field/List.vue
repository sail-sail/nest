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
        :label="`${ dyn_page_field_ids_selected.length ? dyn_page_field_ids_selected.length : '' }`"
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
          @click="isEditing = false;dyn_page_field_ids_selected = [ ]"
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
      :label-width="180"
      
      @submit="onSearch"
    >
      
      <!-- 名称 -->
      <tm-form-item
        label="名称"
        name="lbl"
        :required="false"
      >
        <CustomInput
          v-model="search.lbl"
          placeholder="请输入 名称"
          @change="onSearch"
        ></CustomInput>
      </tm-form-item>
      
      <!-- 编码 -->
      <tm-form-item
        label="编码"
        name="code"
        :required="false"
      >
        <CustomInput
          v-model="search.code"
          placeholder="请输入 编码"
          @change="onSearch"
        ></CustomInput>
      </tm-form-item>
    
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
      v-if="!inited && dyn_page_field_models.length === 0"
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
      v-if="inited && dyn_page_field_models.length === 0"
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
      (暂无动态页面字段)
    </view>
    
    <template
      v-else
    >
      
      <view
        v-for="dyn_page_field_model of dyn_page_field_models_computed"
        :key="dyn_page_field_model.id"
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
            :model-value="dyn_page_field_ids_selected.includes(dyn_page_field_model.id)"
            :size="30"
            :show-label="false"
            @change="onRadio($event, dyn_page_field_model.id)"
          >
          </tm-radio>
        </view>
        
        <view
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-cursor="pointer"
          un-b="0 solid transparent b-1"
          :style="{
            borderColor: dyn_page_field_id_selected === dyn_page_field_model.id ? 'var(--color-primary)' : undefined,
          }"
          @click="onDynPageField(dyn_page_field_model.id)"
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
                  {{ dyn_page_field_model.lbl }}
                </view>
                
              </view>
              
              <view
                un-text="3.5 gray-400"
              >
                {{ dyn_page_field_model.code }}
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
      共 {{ total }} 动态页面字段
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
    @click="onAddDynPageField"
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
  findAllDynPageField,
  findCountDynPageField,
  deleteByIdsDynPageField,
} from "./Api.ts";

let inited = $ref(false);

let isEditing = $ref(false);

let dyn_page_field_ids_selected = $ref<DynPageFieldId[]>([ ]);
let dyn_page_field_id_selected = $ref<DynPageFieldId>();

const dyn_page_field_models_key = "dyn_page_field.List.dyn_page_field_models";
let dyn_page_field_models = $ref<DynPageFieldModel[]>(uni.getStorageSync(dyn_page_field_models_key) || [ ]);

type SearchType = {
  // 名称
  lbl?: string;
  // 编码
  code?: string;
};

const searchKey = "/pages/dyn_page_field/List:search";
const search = $ref<SearchType>(uni.getStorageSync(searchKey) || {
});

type DynPageFieldModelComputed = {
  id: DynPageFieldId;
  lbl: string;
  code: string;
};

const dyn_page_field_models_computed = computed<DynPageFieldModelComputed[]>(() => {
  return dyn_page_field_models.map((dyn_page_field_model, i) => {
    return {
      id: dyn_page_field_model.id,
      lbl: dyn_page_field_model.lbl,
      code: dyn_page_field_model.code,
    };
  });
});

function onRadio(
  checked: boolean,
  dyn_page_field_id: DynPageFieldId,
) {
  if (checked) {
    if (!dyn_page_field_ids_selected.includes(dyn_page_field_id)) {
      dyn_page_field_ids_selected.push(dyn_page_field_id);
    }
  } else {
    dyn_page_field_ids_selected = dyn_page_field_ids_selected.filter((item) => item !== dyn_page_field_id);
  }
}

async function onDynPageField(
  dyn_page_field_id: DynPageFieldId,
) {
  if (isEditing) {
    if (!dyn_page_field_ids_selected.includes(dyn_page_field_id)) {
      dyn_page_field_ids_selected.push(dyn_page_field_id);
    } else {
      dyn_page_field_ids_selected = dyn_page_field_ids_selected.filter((item) => item !== dyn_page_field_id);
    }
    return;
  }
  dyn_page_field_id_selected = dyn_page_field_id;
  await uni.navigateTo({
    url: `/pages/dyn_page_field/Detail?dyn_page_field_id=${ encodeURIComponent(dyn_page_field_id) }`,
  });
}

async function onAddDynPageField() {
  if (!inited) {
    return;
  }
  await uni.navigateTo({
    url: "/pages/dyn_page_field/Detail",
  });
}

uni.$on("/pages/dyn_page_field/List:refresh", async function() {
  pgOffset = 0;
  await onRefresh();
});

/** 全选 */
const isSelectAll = $computed({
  get() {
    if (dyn_page_field_models.length === 0) {
      return false;
    }
    return dyn_page_field_ids_selected.length === dyn_page_field_models.length;
  },
  set(value) {
    if (value) {
      dyn_page_field_ids_selected = dyn_page_field_models.map((item) => item.id);
    } else {
      dyn_page_field_ids_selected = [ ];
    }
  },
});

/** 删除 */
async function onDelete() {
  if (dyn_page_field_ids_selected.length === 0) {
    uni.showToast({
      title: "请选择需要删除的动态页面字段",
      icon: "none",
    });
    return;
  }
  const len = dyn_page_field_ids_selected.length;
  const {
    confirm,
  } = await uni.showModal({
    title: "提示",
    content: `确定删除选中的 ${ len } 个动态页面字段吗？`,
    confirmText: "删除",
    cancelText: "取消",
  });
  if (!confirm) {
    return;
  }
  
  await deleteByIdsDynPageField(dyn_page_field_ids_selected);
  
  uni.showToast({
    title: `删除 ${ len } 个动态页面字段成功`,
    icon: "none",
  });
  
  await onRefresh();
  
  dyn_page_field_ids_selected = [ ];
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
    data: {
      lbl: search.lbl,
      code: search.code,
    },
  });
  pgOffset = 0;
  await onRefresh();
}

function getSearchDynPageField() {
  const search2: SearchType = {
    lbl: search.lbl?.trim() || undefined,
    code: search.code?.trim() || undefined,
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
    dyn_page_field_ids_selected = [ ];
    
    [
      dyn_page_field_models,
      total,
    ] = await Promise.all([
      findAllDynPageField(
        getSearchDynPageField(),
        {
          pgSize,
          pgOffset,
        },
        undefined,
        {
          notLoading: true,
        },
      ),
      findCountDynPageField(
        getSearchDynPageField(),
        {
          notLoading: true,
        },
      ),
    ]);
    
    if (!dyn_page_field_models.some((item) => item.id === dyn_page_field_id_selected)) {
      dyn_page_field_id_selected = undefined;
    }
    dyn_page_field_ids_selected = dyn_page_field_ids_selected
      .filter((id) => dyn_page_field_models.some((item2) => item2.id === id));
    const len = dyn_page_field_models.length;
    isEnd = len < pgSize;
    pgOffset = len;
    await uni.setStorage({
      key: dyn_page_field_models_key,
      data: dyn_page_field_models,
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
    const dyn_page_field_models_new = await findAllDynPageField(
      getSearchDynPageField(),
      {
        pgSize,
        pgOffset,
      },
      undefined,
      {
        notLoading: true,
      },
    );
    const len = dyn_page_field_models_new.length;
    if (len < pgSize) {
      isEnd = true;
    }
    if (len > 0) {
      pgOffset += len;
      dyn_page_field_models.push(...dyn_page_field_models_new);
    }
    if (!dyn_page_field_models.some((item) => item.id === dyn_page_field_id_selected)) {
      dyn_page_field_id_selected = undefined;
    }
    await uni.setStorage({
      key: dyn_page_field_models_key,
      data: dyn_page_field_models,
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

initFrame();
</script>
