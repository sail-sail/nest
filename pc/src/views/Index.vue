<template>
<div
  un-flex="~ [1_0_0]"
  un-overflow-hidden
>
  <template v-if="!inited">
    <!-- <div
      un-flex="~ [1_0_0]"
      un-overflow-hidden
      un-justify-center
      un-items-center
      un-text="gray 5"
    >
      {{ errMsg }}
    </div> -->
  </template>
  <template v-else>
    <template v-if="inited && myComponents.length === 0">
      <div
        un-flex="~ [1_0_0]"
        un-overflow-hidden
        un-justify-center
        un-items-center
        un-text="gray"
        un-gap="x-4"
      >
        <!-- <span>(暂未设置首页)</span>
        <el-button
          v-if="tabLen > 1"
          plain
          size="small"
          @click="closeCurrentTab"
        >
          关闭
        </el-button> -->
      </div>
    </template>
    <template v-else-if="myComponents.length === 1">
      <Component
        :is="myComponents[0]"
      ></Component>
    </template>
    <swiper
      v-else
      class="swiper"
      un-w="full"
      navigation
      :pagination="{ clickable: true }"
      :modules="[ Pagination, A11y ]"
    >
      <swiper-slide
        v-for="(item, i) in myComponents"
        :key="homeUrls[i]"
      >
        <Component
          :is="item"
        ></Component>
      </swiper-slide>
    </swiper>
  </template>
</div>
</template>

<script setup lang="ts">
import "swiper/css";
import "swiper/css/pagination";

import type {
  Component,
} from "vue";

import { Pagination, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/vue";

import { getComponent } from "@/router/util";

import {
  getHomeUrls,
} from "@/components/Api";

defineOptions({
  name: "首页",
});

const route = useRoute();
const usrStore = useUsrStore();
const tabStore = useTabsStore();

let inited = $ref(false);

const tabLen = $computed(() => tabStore.tabs.length);

let errMsg = $ref("正在加载...");

let myComponents = $shallowRef<Component[]>([ ]);
const homeUrls = $shallowRef<string[]>([ ]);

async function onGetHomeUrls() {
  const homeUrls = await getHomeUrls({
    notLoading: true,
  }) || [ ];
  myComponents = await Promise.all(homeUrls.map((url) => getComponent(url)));
}

async function closeCurrentTab() {
  tabStore.closeCurrentTab(
    {
      path: route.path,
      query: route.query,
    },
    true,
  );
  await tabStore.refreshTab(route);
}

async function initFrame() {
  try {
    await onGetHomeUrls();
    inited = true;
  } catch(err) {
    console.log(err);
    errMsg = "网络连接失败";
  }
}

usrStore.onLogin(initFrame);

initFrame();
</script>

<style scoped>

</style>
