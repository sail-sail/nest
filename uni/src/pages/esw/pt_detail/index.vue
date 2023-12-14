<template>
<tm-app
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <view
    v-if="!inited"
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
  >
    <view
      un-text="3 gray center"
      un-m="t-[100rpx]"
      un-w="full"
    >
      加载中, 请稍后...
    </view>
  </view>
  <view
    v-else-if="!ptModel"
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
  >
    <view
      un-text="3 gray center"
      un-m="t-[100rpx]"
      un-w="full"
    >
       产品不存在
    </view>
  </view>
  <view
    v-else
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
  >
    <view
      un-flex="[1_0_0]"
      un-overflow-x-hidden
      un-overflow-y-auto
    >
      <view
        v-if="ptModel.detail_top_img_urls.length > 0 && ptModel.detail_top_img_urls[0]"
      >
        <image
          :src="ptModel.detail_top_img_urls[0]"
          mode="widthFix"
          un-w="full"
        ></image>
      </view>
      <view
        un-m="y-1.5 l-4"
        un-text="4"
        un-font-bold
      >
        {{ ptModel.lbl }}
      </view>
      <view
        un-m="y-1.5 l-4"
      >
        <text
          un-text="4 red-500"
          un-font-bold
        >
          ￥{{ ptModel.price }}
        </text>
        <text
          un-text="3 red-500"
          un-font-bold
        >/{{ ptModel.unit || "次" }}</text>
      </view>
      <view
        un-m="y-1.5"
        un-p="x-2"
        un-box-border
      >
        <view
          v-for="detail_bottom_img_url of ptModel.detail_bottom_img_urls"
          :key="detail_bottom_img_url"
        >
          <image
            :src="detail_bottom_img_url"
            mode="widthFix"
            un-w="full"
          ></image>
        </view>
      </view>
    </view>
    <view
      un-flex="~"
      un-w="full"
      un-items-center
      un-justify-evenly
      :style="{
        marginBottom: (safeAreaInsets?.bottom || 0) + 'px',
      }"
      un-h="[70px]"
      un-p="x-8"
      un-box-border
      un-gap="x-2"
      un-b-t="1 gray-300 solid"
    >
      <view
        un-h="full"
        un-flex="~ col"
        un-justify-center
        un-items-center
      >
        <view>
          <i
            un-i="iconfont-phone"
            un-text="4"
          ></i>
        </view>
        <view
          un-text="3 [#333333]"
          un-m="t-1"
        >
          热线电话
        </view>
      </view>
      <view
        un-h="full"
        un-flex="~ col"
        un-justify-center
        un-items-center
      >
        <view>
          <i
            un-i="iconfont-talk"
            un-text="4"
          ></i>
        </view>
        <view
          un-text="3 [#222222]"
          un-m="t-1"
        >
          在线咨询
        </view>
      </view>
      <view
        un-w="40"
        un-m="l-4"
      >
        <button
          un-w="full"
          un-rounded="full"
          un-text="4 white"
          un-bg="[#c5a05d]"
        >
          立即购买
        </button>
      </view>
    </view>
  </view>
  <AppLoading></AppLoading>
</tm-app>
</template>

<script lang="ts" setup>
import cfg from "@/utils/config";

import type {
  PtId,
} from "@/typings/ids";

import type {
  PtModel,
} from "./Api";

import {
  findOnePt,
} from "./Api";

const indexStore = useIndexStore(cfg.pinia);

let safeAreaInsets = $ref(indexStore.systemInfo.safeAreaInsets);

const pagePath = "/pages/esw/pt_detail/index";

let id = $ref<PtId>();

let inited = $ref(false);

let ptModel = $ref<PtModel>();

async function findOnePtEfc() {
  if (!id) {
    ptModel = undefined;
    return;
  }
  ptModel = await findOnePt(
    {
      id,
      is_enabled: [ 1 ],
      is_deleted: 0,
    },
    undefined,
    {
      notLoading: true,
    },
  );
  uni.setStorage({
    key: `${ pagePath }:ptModel:${ id }`,
    data: ptModel,
  });
}

async function initFrame() {
  if (!id) {
    return;
  }
  uni.getStorage({
    key: `${ pagePath }:ptModel:${ id }`,
    success: ({ data }) => {
      ptModel = data;
    },
  });
  try {
    await findOnePtEfc();
  } finally {
    inited = true;
  }
}

watch(
  () => id,
  async () => {
    await initFrame();
  },
);

onLoad((query?: AnyObject) => {
  id = query?.id as PtId || undefined;
});
</script>
