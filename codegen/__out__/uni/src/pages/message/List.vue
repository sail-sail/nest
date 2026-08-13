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
        :label="`${ message_ids_selected.length ? message_ids_selected.length : '' }`"
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
          @click="isEditing = false;message_ids_selected = [ ]"
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
      :label-width="130"
      
      @submit="onSearch"
    >
      
      <!-- 关键字 -->
      <tm-form-item
        label="关键字"
        name="keyword"
        :required="false"
      >
        <CustomInput
          v-model="search.keyword"
          placeholder="请输入 关键字"
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
      v-if="!inited && message_models.length === 0"
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
      v-if="inited && message_models.length === 0"
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
      (暂无消息)
    </view>
    
    <view
      v-else
      un-flex="~ col"
      un-gap="y-2"
      un-m="x-2"
    >
      
      <view
        v-for="message_model of message_models_computed"
        :key="message_model.id"
        un-flex="~"
        un-gap="x-2"
        un-box-border
      >
        
        <view
          v-if="isEditing"
          un-flex="~"
          un-items="center"
        >
          <tm-radio
            :model-value="message_ids_selected.includes(message_model.id)"
            :size="30"
            :show-label="false"
            @change="onRadio($event, message_model.id)"
          >
          </tm-radio>
        </view>
        
        <view
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-cursor="pointer"
          un-b="0 solid transparent b-1"
          :style="{
            borderColor: message_id_selected === message_model.id ? 'var(--color-primary)' : undefined,
          }"
          @click="onMessage(message_model.id)"
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
                  {{ message_model.content }}
                </view>
                
              </view>
              
              <view
                un-text="3.5 gray-400"
              >
                {{ message_model.title }}
              </view>
              
            </view>
            
            <view
              un-flex="[1_0_0]"
              un-overflow="hidden"
            ></view>
            
            <view
              un-text="4 gray-400"
              un-m="x-2"
            >
              {{ message_model.create_time_lbl }}
            </view>
            
            <!-- 向右的箭头 -->
            <view
              v-if="!isEditing"
              un-flex="~"
              un-items="center"
            >
              <view
                un-i="iconfont-right"
                un-text="[var(--color-placeholder)]"
              ></view>
            </view>
            
          </view>
          
        </view>
        
      </view>
      
    </view>
    
    <CustomDivider
      v-if="!inited || isLoading"
    >
      加载中, 请稍后...
    </CustomDivider>
    
    <CustomDivider
      v-else-if="inited && total > 0"
    >
      共 {{ total }} 消息
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
    @click="onAddMessage"
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
  findAllMessage,
  findCountMessage,
  setLblByIdMessage,
  deleteByIdsMessage,
} from "./Api.ts";

let inited = $ref(false);

let isEditing = $ref(false);

let message_ids_selected = $ref<MessageId[]>([ ]);
let message_id_selected = $ref<MessageId>();

let message_models = $ref<MessageModel[]>([ ]);

type SearchType = {
  // 关键字
  keyword?: string;
};

const props = withDefaults(
  defineProps<{
    builtInSearch?: Partial<MessageSearch>;
    addQuery?: Record<string, string | number | boolean | null | undefined>;
  }>(),
  {
    builtInSearch: undefined,
    addQuery: undefined,
  },
);

const searchKey = "/pages/message/List:search";

function initSearch() {
  const search: SearchType = {
  };
  return search;
}

let search = $ref<SearchType>(uni.getStorageSync(searchKey) || initSearch());

type MessageModelComputed = {
  id: MessageId;
  content: string;
  title: string;
  create_time: string | undefined | null;
  create_time_lbl: string | undefined | null;
};

const message_models_computed = computed<MessageModelComputed[]>(() => {
  return message_models.map((message_model, i) => {
    let create_time_lbl = "";
    if (message_model.create_time) {
      create_time_lbl = dayjs(message_model.create_time).format("YYYY-MM-DD");
    }
    return {
      id: message_model.id,
      content: message_model.content,
      title: message_model.title,
      create_time: message_model.create_time,
      create_time_lbl: create_time_lbl,
    };
  });
});

function buildPageQuery(
  query?: Record<string, string | number | boolean | null | undefined>,
) {
  const params = Object.entries(query || { })
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => {
      return `${ key }=${ encodeURIComponent(String(value)) }`;
    });
  if (params.length === 0) {
    return "";
  }
  return `?${ params.join("&") }`;
}

function onRadio(
  checked: boolean,
  message_id: MessageId,
) {
  if (checked) {
    if (!message_ids_selected.includes(message_id)) {
      message_ids_selected.push(message_id);
    }
  } else {
    message_ids_selected = message_ids_selected.filter((item) => item !== message_id);
  }
}

async function onMessage(
  message_id: MessageId,
) {
  if (isEditing) {
    if (!message_ids_selected.includes(message_id)) {
      message_ids_selected.push(message_id);
    } else {
      message_ids_selected = message_ids_selected.filter((item) => item !== message_id);
    }
    return;
  }
  message_id_selected = message_id;
  
  await uni.navigateTo({
    url: `/pages/message/Detail?message_id=${ encodeURIComponent(message_id) }`,
  });
}

async function onAddMessage() {
  if (!inited) {
    return;
  }
  await uni.navigateTo({
    url: `/pages/message/Detail${ buildPageQuery({
      action: "add",
      ...props.addQuery,
    }) }`,
  });
}

async function onReset() {
  search = initSearch();
  pgOffset = 0;
  await onSearch();
}

uni.$on("/pages/message/List:refresh", async function(
  data?: {
    action?: string;
  },
) {
  const action = data?.action;
  if (action === "add" || action === "copy") {
    await onReset();
  } else {
    await onRefresh();
  }
});

/** 全选 */
const isSelectAll = $computed({
  get() {
    if (message_models.length === 0) {
      return false;
    }
    return message_ids_selected.length === message_models.length;
  },
  set(value) {
    if (value) {
      message_ids_selected = message_models.map((item) => item.id);
    } else {
      message_ids_selected = [ ];
    }
  },
});

/** 删除 */
async function onDelete() {
  if (message_ids_selected.length === 0) {
    uni.showToast({
      title: "请选择需要删除的消息",
      icon: "none",
    });
    return;
  }
  const len = message_ids_selected.length;
  const {
    confirm,
  } = await uni.showModal({
    title: "提示",
    content: `确定删除选中的 ${ len } 个消息吗？`,
    confirmText: "删除",
    cancelText: "取消",
  });
  if (!confirm) {
    return;
  }
  
  await deleteByIdsMessage(message_ids_selected);
  
  uni.showToast({
    title: `删除 ${ len } 个消息成功`,
    icon: "none",
  });
  
  await onRefresh();
  
  message_ids_selected = [ ];
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
      keyword: search.keyword,
    },
  });
  pgOffset = 0;
  await onRefresh();
}

function getSearchMessage() {
  const search2: MessageSearch = {
    keyword: search.keyword?.trim() || undefined,
  };
  return {
    ...search2,
    ...props.builtInSearch,
  };
}

async function onRefresh() {
  if (isLoading) {
    return;
  }
  isLoading = true;
  pgOffset = 0;
  
  try {
    message_ids_selected = [ ];
    
    [
      message_models,
      total,
    ] = await Promise.all([
      findAllMessage(
        getSearchMessage(),
        {
          pgSize,
          pgOffset,
        },
        undefined,
        {
          notLoading: true,
        },
      ),
      findCountMessage(
        getSearchMessage(),
        {
          notLoading: true,
        },
      ),
    ]);
    
    if (!message_models.some((item) => item.id === message_id_selected)) {
      message_id_selected = undefined;
    }
    message_ids_selected = message_ids_selected
      .filter((id) => message_models.some((item2) => item2.id === id));
    const len = message_models.length;
    isEnd = len < pgSize;
    pgOffset = len;
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
    const message_models_new = await findAllMessage(
      getSearchMessage(),
      {
        pgSize,
        pgOffset,
      },
      undefined,
      {
        notLoading: true,
      },
    );
    const len = message_models_new.length;
    if (len < pgSize) {
      isEnd = true;
    }
    if (len > 0) {
      pgOffset += len;
      message_models.push(...message_models_new);
    }
    if (!message_models.some((item) => item.id === message_id_selected)) {
      message_id_selected = undefined;
    }
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
