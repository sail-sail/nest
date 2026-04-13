<template>
<div
  id="app"
>
  <TransitionGroup
    class="app_message"
    name="app_message"
    tag="div"
  >
    <div
      v-for="item in msgs"
      :key="item.id"
      class="app_message_inner"
      :class="{
        app_message_error: item.type === 'error',
        app_message_info: item.type === 'info',
      }"
      @mousepause="pauseMsg(item)"
      @mouseresume="resumeMsg(item)"
    >
      {{ item.content }}
      <!-- 关闭按钮圆圈 -->
      <div
        un-absolute
        un-cursor-pointer
        un-top=".5"
        un-right=".5"
        un-w="5"
        un-h="5"
        un-bg="hover:red-500"
        un-text="3 hover:white"
        un-rounded="full"
        un-flex="~"
        un-items-center
        un-justify-center
        @click="msgs = msgs.filter((msg) => msg.id !== item.id)"
      >
        X
      </div>
    </div>
  </TransitionGroup>
  <NuxtLayout>
    <NuxtPage
      :transition="{
        name: 'bounce',
        mode: 'out-in'
      }"
    />
  </NuxtLayout>
</div>
</template>

<script setup lang="ts">
import "@/app/utils/DateUtil.ts";

import {
  useMsgs,
} from "./composables/msg.ts";

import {
  initClientTenantId,
  useMySeoMeta,
} from "./Api.ts";

const {
  msgs,
  pauseMsg,
  resumeMsg,
} = $(useMsgs());

await initClientTenantId();
await useMySeoMeta();
</script>

<style lang="scss">
#app,#__nuxt {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.app_message-move,
.app_message-enter-active,
.app_message-leave-active {
  transition: all 0.4s ease;
}
.app_message-enter-from,
.app_message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.app_message-leave-active {
  position: absolute;
}
</style>
