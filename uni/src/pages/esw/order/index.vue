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
    <tm-form
      ref="formRef"
      v-model="buyNowInput"
      :label-width="160"
      un-flex="~ [1_0_0] col"
      un-overflow-auto
    >
      
      <tm-form-item
        label="公司名称"
        field="company"
        :rules="{
          required: true,
          message: '请输入 公司名称',
        }"
        required
      >
        <CustomInput
          v-model="buyNowInput.company"
          :type="'text'"
          :show-clear="true"
          placeholder="请输入 公司名称"
        >
        </CustomInput>
      </tm-form-item>
      
    </tm-form>
    <view
      un-flex="~"
      un-w="full"
      :style="{
        marginBottom: (safeAreaInsets?.bottom || 0) + 'px',
      }"
    >
      <view
        un-w="full"
        un-flex="~"
        un-items-center
        un-justify-evenly
        un-m="x-4"
      >
        <button
          un-w="full"
          un-rounded="full"
          un-text="4 white"
          un-bg="[#c5a05d]"
        >
          立即支付
        </button>
      </view>
    </view>
  </view>
  
  <AppLoading></AppLoading>
  <tm-message
    ref="msgRef"
    :lines="2"
  ></tm-message>
</tm-app>
</template>

<script lang="ts" setup>
import cfg from "@/utils/config";

import type {
  PtId,
} from "@/typings/ids";

import type {
  PtModel,
} from "../pt_detail/Api";

import {
  findOnePt,
} from "../pt_detail/Api";

import {
  findAll as findAllCard,
} from "../card/Api";

import type {
  CardModel,
  BuyNowInput,
} from "@/typings/types";

const indexStore = useIndexStore(cfg.pinia);

let safeAreaInsets = $ref(indexStore.systemInfo.safeAreaInsets);

const pagePath = "/pages/esw/order/index";

let id = $ref<PtId>();

let inited = $ref(false);

let ptModel = $ref<PtModel>();

let cardModel = $ref<CardModel>();

let buyNowInput = $ref<BuyNowInput>({ });

async function findOnePtEfc() {
  if (!id) {
    ptModel = undefined;
    return;
  }
  const pagePath = "/pages/esw/pt_detail/index";
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

// 余额
let balance = $ref(0);

async function findAllCardEfc() {
  const cardModels = await findAllCard(
    {
      is_enabled: [ 1 ],
      is_deleted: 0,
    },
    undefined,
    undefined,
    {
      notLoading: true,
    },
  );
  for (const cardModel of cardModels) {
    balance += Number(cardModel.balance);
    balance += Number(cardModel.give_balance);
    balance = Math.round(balance * 100) / 100;
  }
}

async function initFrame() {
  try {
    await Promise.all([
      findOnePtEfc(),
      findAllCardEfc(),
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
  id = query?.id as PtId;
});
</script>
