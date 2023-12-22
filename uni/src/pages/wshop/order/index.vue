<template>
<tm-app
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <view
    v-if="!inited || !payNowInput"
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
      v-model="payNowInput"
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
          v-model="payNowInput.company"
          placeholder="请输入 公司名称"
        ></CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="联系电话"
        field="phone"
        :rules="{
          required: true,
          message: '请输入 联系电话',
        }"
        required
      >
        <CustomInput
          v-model="payNowInput.phone"
          placeholder="请输入 联系电话"
        ></CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="产品名称"
      >
        <text
          un-text="4 [#333333]"
        >
          {{ ptModel.lbl }}
        </text>
      </tm-form-item>
      
      <tm-form-item
        label="产品价格"
      >
        <text
          un-text="5 red"
        >
          ￥{{ ptModel.price }}
        </text>
      </tm-form-item>
      
      <tm-form-item
        label="可用余额"
      >
        <text
          un-text="4 [#333333]"
        >
          ￥{{ balance }}
        </text>
      </tm-form-item>
      
      <tm-form-item
        label="备注"
      >
        <CustomInput
          type="textarea"
          v-model="payNowInput.rem"
          placeholder="请输入 备注"
          auto-height
        ></CustomInput>
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
          @click="onPayNow"
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
  findOne as findOneCard,
} from "../card/Api";

import type {
  CardModel,
  PayNowInput,
} from "@/typings/types";

import {
  payNow,
} from "./Api";

import Decimal from "decimal.js-light";

const indexStore = useIndexStore(cfg.pinia);
const usrStore = useUsrStore(cfg.pinia);

let safeAreaInsets = $ref(indexStore.getSystemInfo().safeAreaInsets);

const pagePath = "/pages/wshop/order/index";

let id = $ref<PtId>();

let inited = $ref(false);

let ptModel = $ref<PtModel>();

let cardModel = $ref<CardModel>();

let payNowInput = $ref<PayNowInput>();

async function findOnePtEfc() {
  if (!id) {
    ptModel = undefined;
    return;
  }
  const pagePath = "/pages/wshop/pt_detail/index";
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
const balance = $computed(() => {
  if (!cardModel) {
    return 0;
  }
  let balance = new Decimal(0);
  balance = balance.add(cardModel.balance);
  balance = balance.add(cardModel.give_balance);
  return balance.toFixed(2);
});

async function findAllCardEfc() {
  const usr_id = usrStore.getUsrId();
  cardModel = (await findOneCard(
    {
      usr_id: [ usr_id ],
      is_enabled: [ 1 ],
      is_deleted: 0,
    },
    undefined,
    {
      notLoading: true,
    },
  )) || undefined;
}

let formRef = $ref<InstanceType<typeof TmForm>>();

/* 立即支付 */
async function onPayNow() {
  if (!formRef) {
    return;
  }
  
  const {
    isPass,
  } = formRef.validate();
  
  if (!isPass) {
    formRef.submit();
    return;
  }
  
  if (!payNowInput) {
    return;
  }
  
  // 调用支付接口
  const isSucc = await payNow(payNowInput);
  if (!isSucc) {
    await uni.navigateTo({
      url: "/pages/wx/Bing?redirect_action=navigateBack",
    });
    return;
  }
  await uni.showModal({
    content: "支付成功!",
    showCancel: false,
  });
  await uni.navigateBack();
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
    if (!id) {
      await uni.showModal({
        title: "错误",
        content: "产品ID 不能为空!",
      });
      return;
    }
    payNowInput = {
      pt_id: id,
      company: "",
      phone: "",
    };
    await initFrame();
  },
);

onLoad((query?: AnyObject) => {
  id = query?.id as PtId;
});
</script>
