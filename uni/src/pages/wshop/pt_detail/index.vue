<template>
<tm-app
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <view
    v-if="inited && !ptModel"
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
    v-else-if="ptModel"
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
      :style="{
        marginBottom: (safeAreaInsets?.bottom || 0) + 'px',
      }"
      un-h="[70px]"
      un-box-border
      un-b-t="1 gray-300 solid"
    >
      <view
        un-flex="~ [1_0_0]"
        un-overflow-hidden
        un-items-center
        un-justify-evenly
      >
        <view
          v-if="hotline"
          un-h="full"
          un-flex="~ col"
          un-justify-center
          un-items-center
          @click="onMakePhoneCall"
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
        <button
          un-h="full"
          un-flex="~ col"
          un-justify-center
          un-items-center
          open-type="contact"
          plain
          style="border: 0;padding: 0;outline: none;margin: 0;line-height: unset;"
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
        </button>
        <button
          un-h="full"
          un-flex="~ col"
          un-justify-center
          un-items-center
          open-type="share"
          plain
          style="border: 0;padding: 0;outline: none;margin: 0;line-height: unset;"
        >
          <view>
            <i
              un-i="iconfont-share"
              un-text="4"
            ></i>
          </view>
          <view
            un-text="3 [#222222]"
            un-m="t-1"
          >
            分享产品
          </view>
        </button>
      </view>
      <view
        un-w="40"
        un-flex="~"
        un-items-center
        un-justify-evenly
        un-m="r-2"
      >
        <button
          un-w="full"
          un-rounded="full"
          un-text="4 white"
          un-bg="[#c5a05d]"
          @click="onBuy"
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

import {
  findOne as findOneWxappConfig,
} from "../wxapp_config/Api";

const indexStore = useIndexStore(cfg.pinia);

let safeAreaInsets = $ref(indexStore.getSystemInfo().safeAreaInsets);

const pagePath = "/pages/wshop/pt_detail/index";

let id = $ref<PtId>();

let inited = $ref(false);

let ptModel = $ref<PtModel>();

async function findOnePtEfc() {
  if (!id) {
    ptModel = undefined;
    return;
  }
  uni.getStorage({
    key: `${ pagePath }:ptModel:${ id }`,
    success: ({ data }) => {
      ptModel = data;
    },
  });
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

let hotline = $ref<string>();

uni.getStorage({
  key: `${ pagePath }:hotline`,
  success: ({ data }) => {
    hotline = data;
  },
});

async function findOneWxappConfigEfc() {
  const wxappConfigModel = await findOneWxappConfig(
    {
      lbl: "小程序热线电话",
      is_deleted: 0,
      is_enabled: [ 1 ],
    },
    undefined,
    {
      notLoading: true,
    },
  );
  hotline = wxappConfigModel?.val;
  uni.setStorage({
    key: `${ pagePath }:hotline`,
    data: hotline,
  });
}

/** 热线电话 */
async function onMakePhoneCall() {
  if (!hotline) {
    return;
  }
  await uni.makePhoneCall({
    phoneNumber: hotline,
  });
}

/** 立即购买 */
async function onBuy() {
  if (!ptModel) {
    return;
  }
  await uni.navigateTo({
    url: `/pages/wshop/order/index?id=${ ptModel.id }`,
  });
}

async function initFrame() {
  try {
    await Promise.all([
      findOnePtEfc(),
      findOneWxappConfigEfc(),
    ]);
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
