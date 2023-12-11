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
      v-model:active="sideActiveIdx"
      :item-height="100"
      :list="sideList"
      :height="sideHeight"
    >
      <view
        v-for="i of 100"
        :key="i"
      >
        这边是你的内容区域{{ i }}
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

const indexStore = useIndexStore(cfg.pinia);

let inited = $ref(false);

let sideActiveIdx = $ref(3);

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

// 产品类别
let ptTypeModels = $ref<Awaited<ReturnType<typeof findAllPtTypeAndPt>>>([ ]);

async function findAllPtTypeAndPtEfc() {
  ptTypeModels = await findAllPtTypeAndPt({
    is_deleted: 0,
    is_enabled: [ 1 ],
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
