<template>
<tm-app
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <view
    un-flex="~ [1_0_0] col"
    un-overflow="x-hidden y-auto"
    un-text="[#333333]"
  >
    <view>
      <swiper
        un-h="[500rpx]"
        un-w="full"
      >
        <swiper-item
          v-for="img_url of wxappConfigModel?.img_urls || [ ]"
          :key="img_url"
        >
          <image
            un-h="[500rpx]"
            un-w="full"
            :src="img_url"
          ></image>
        </swiper-item>
      </swiper>
    </view>
    <view
      un-min-h="[300px]"
      un-m="x-[28rpx] t--6"
      un-rounded-4
      un-shadow-md
      un-bg="white"
      un-z="2"
      un-flex="~ col"
      un-gap="[38rpx]"
      un-p="y-[50rpx] x-[74rpx] b-[60rpx]"
      un-box-border
    >
      <template
        v-for="(_, i) of Math.ceil(ptTypeModels1.length / 3)"
        :key="i"
      >
        <view
          un-h="[150rpx]"
          un-flex="~ row"
          un-gap="[48rpx]"
        >
          <view
            v-for="ptTypeModel of ptTypeModels1.slice(i * 3, i * 3 + 3)"
            :key="ptTypeModel.id"
            un-w="[150rpx]"
            un-flex="~ col"
          >
            <view
              un-flex="~ [1_0_0] col"
              un-overflow-hidden
              un-justify-center
              un-items-center
            >
              <view
                un-h="[100rpx]"
                un-w="[100rpx]"
                un-rounded-50
                un-bg="[#f7efdf]"
                un-flex="~"
                un-justify-center
                un-items-center
              >
                <image
                  un-h="full"
                  un-w="full"
                  un-text="gray"
                  un-p="3"
                  un-box-border
                  :src="ptTypeModel.img_urls[0]"
                ></image>
              </view>
            </view>
            <view
              un-flex="~"
              un-justify-center
            >
              {{ ptTypeModel.lbl }}
            </view>
          </view>
        </view>
      </template>
    </view>
  </view>
  <AppLoading></AppLoading>
</tm-app>
</template>

<script lang="ts" setup>
import {
  findOne as findOneWxappConfig,
  findAllPtType,
} from "./Api";

let inited = $ref(false);

// 小程序配置
let wxappConfigModel = $ref<Awaited<ReturnType<typeof findOneWxappConfig>>>();

async function findOneWxappConfigEfc() {
  wxappConfigModel = await findOneWxappConfig({
    lbl: "小程序首页顶部轮播图",
    is_deleted: 0,
    is_enabled: [ 1 ],
  });
}

// 产品类别
let ptTypeModels = $ref<Awaited<ReturnType<typeof findAllPtType>>>([ ]);

let ptTypeModels1 = $computed(() => {
  return [
    ...ptTypeModels,
    {
      id: "0",
      lbl: "更多服务",
      img_urls: [
        "/static/tarbar/type.png",
      ],
    },
  ];
});

async function findAllPtTypeEfc() {
  ptTypeModels = await findAllPtType({
    is_deleted: 0,
    is_enabled: [ 1 ],
    is_home: [ 1 ],
  });
}

async function initFrame() {
  try {
    await Promise.all([
      findOneWxappConfigEfc(),
      findAllPtTypeEfc(),
    ]);
  } finally {
    inited = true;
  }
}
initFrame();
</script>
