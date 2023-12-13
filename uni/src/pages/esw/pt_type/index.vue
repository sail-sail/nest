<template>
<tm-app
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <view
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
  >
    <tm-side-menu
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
      menu-active-font-color="#c5a05d"
      v-model:active="sideActiveIdx"
      :item-height="sideItemLeftHeight"
      :list="sideList"
      :height="sideHeight"
      :side-width="sideLeftWidth"
    >
      <view
        v-for="(_, i) of Math.ceil(activePtModels.length / 3)"
        :key="i"
        un-w="full"
        :style="{
          height: (sideItemWidth + sideTextHeight) + 'rpx',
          paddingTop: sideItemMargin + 'rpx',
          paddingLeft: sideItemMargin + 'rpx',
          paddingRight: sideItemMargin + 'rpx',
          gap: sideItemMargin + 'rpx',
        }"
        un-box-border
        un-flex="~"
      >
        <view
          v-for="ptModel of activePtModels.slice(i * 3, i * 3 + 3)"
          :key="ptModel.id"
          :style="{
            width: (sideItemWidth - sideItemMargin) + 'rpx',
          }"
          un-h="full"
          un-flex="~ col"
          @click="onPtDetail(ptModel.id)"
        >
          <view
            un-flex="~ [1_0_0]"
            un-overflow-hidden
            un-justify-center
            un-items-center
          >
            <image
              v-if="ptModel.img_urls.length > 0"
              width="100%"
              mode="widthFix"
              :src="ptModel.img_urls[0]"
            ></image>
            <text
              v-else
              un-text="3 gray"
            >
              {{ ptModel.lbl }}
            </text>
          </view>
          <view
            :style="{
              height: sideTextHeight + 'rpx',
            }"
            un-text="3 [#333333] ellipsis center"
            un-whitespace-nowrap
            un-overflow-hidden
          >
            {{ ptModel.lbl }}
          </view>
        </view>
      </view>
    </tm-side-menu>
  </view>
  <AppLoading></AppLoading>
</tm-app>
</template>

<script lang="ts" setup>
import cfg from "@/utils/config";

import {
  findAllPtTypeAndPt,
} from "./Api";

import type {
  PtId,
} from "@/typings/ids";

const indexStore = useIndexStore(cfg.pinia);

let inited = $ref(false);

let sideActiveIdx = $ref(0);

let sideList = $computed(() => {
  return ptTypeModels.map((ptTypeModel) => {
    return {
      text: ptTypeModel.lbl,
      id: ptTypeModel.id,
    };
  });
});

let sideHeight = $computed(() => {
  const safeWidth = indexStore.systemInfo.safeArea!.width;
  const safeHeight = indexStore.systemInfo.safeArea!.height;
  return Math.floor(750/safeWidth * safeHeight);
});

let sideLeftWidth = 190;
let sideItemLeftHeight = 100;
let sideItemMargin = 16;
let sideItemWidth = (750-sideLeftWidth-sideItemMargin)/3;
let sideTextHeight = 30;

// 产品类别
let ptTypeModels = $ref<Awaited<ReturnType<typeof findAllPtTypeAndPt>>>([ ]);
let activePtModels = $computed(() => ptTypeModels[sideActiveIdx]?.ptModels || [ ]);

async function findAllPtTypeAndPtEfc() {
  ptTypeModels = await findAllPtTypeAndPt({
    is_deleted: 0,
    is_enabled: [ 1 ],
  });
}

// async function onPreviewImage(id: PtId) {
//   const ptTypeModel = ptTypeModels[sideActiveIdx];
//   if (!ptTypeModel) {
//     return;
//   }
//   const ptModels = ptTypeModel.ptModels || [ ];
//   const ptModel = ptModels.find((ptModel) => ptModel.id === id);
//   if (!ptModel) {
//     return;
//   }
//   const img_urls = ptModels
//     .map((ptModel) => ptModel.img_urls[0])
//     .filter((img_url) => img_url);
//   if (img_urls.length === 0) {
//     return;
//   }
//   await uni.previewImage({
//     current: ptModels.indexOf(ptModel),
//     urls: img_urls.map((img_url) => cfg.urlBase + img_url),
//   });
// }

async function onPtDetail(id: PtId) {
  await uni.navigateTo({
    url: `/pages/esw/pt_detail/index?id=${ encodeURIComponent(id) }`,
  });
}

async function initFrame() {
  try {
    await Promise.all([
      findAllPtTypeAndPtEfc(),
    ]);
  } finally {
    inited = true;
  }
}
initFrame();
</script>
