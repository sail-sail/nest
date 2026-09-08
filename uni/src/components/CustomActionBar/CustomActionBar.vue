<template>
<view
  v-show="registryCount > 0"
  class="custom-action-bar"
  :class="{
    'custom-action-bar--single': registryCount === 1,
    'custom-action-bar--open': drawerShow,
  }"
>
  <!-- 触发按钮: 仅多按钮形态显示 -->
  <view
    class="custom-action-bar__trigger"
    @click="onTriggerClick"
  >
    <tm-button
      block
      :color="triggerColor"
    >
      <view
        un-flex="~"
        un-justify="center"
        un-items="center"
      >
        <view>{{ triggerText }}</view>
        <view un-i="iconfont-caret_top"></view>
      </view>
    </tm-button>
  </view>

  <!-- 遮罩: 仅多按钮 + 打开时显示 -->
  <view
    class="custom-action-bar__mask"
    @click="onCloseClick"
  ></view>

  <!--
    插槽容器: 只挂载一次, 通过 CSS 在两种形态间切换定位
    - 单按钮: 文档流内, 只显示上报按钮
    - 多按钮: fixed 底部抽屉
  -->
  <view class="custom-action-bar__panel">
    <view class="custom-action-bar__title">
      {{ triggerText }}
    </view>
    <view class="custom-action-bar__content">
      <slot></slot>
    </view>
    <view class="custom-action-bar__footer">
      <tm-button
        block
        :color="triggerColor"
        @click="onCloseClick"
      >
        <view
          un-flex="~"
          un-justify="center"
          un-items="center"
          un-gap="x-1"
        >
          <view>关闭</view>
          <view un-i="iconfont-caret_bottom"></view>
        </view>
      </tm-button>
    </view>
  </view>
</view>
</template>

<script setup lang="ts">
import {
  provide,
  ref,
} from "vue";

import {
  actionBarRegistryKey,
} from "./context";

defineOptions({
  name: "CustomActionBar",
});

const props = withDefaults(
  defineProps<{
    triggerText?: string;
    triggerColor?: string;
  }>(),
  {
    triggerText: "操作",
    triggerColor: "info",
  },
);

const registryCount = ref(0);

const drawerShow = ref(false);

provide(actionBarRegistryKey, {
  count: registryCount,
  register: () => {
    registryCount.value += 1;
  },
  unregister: () => {
    registryCount.value = Math.max(0, registryCount.value - 1);
  },
});

function onTriggerClick() {
  drawerShow.value = true;
}

function onCloseClick() {
  drawerShow.value = false;
}

function close() {
  drawerShow.value = false;
}

defineExpose({
  close,
});
</script>

<style lang="scss" scoped>
.custom-action-bar {
  position: relative;
  width: 100%;

  // ============ 触发按钮: 默认隐藏, 多按钮形态显示 ============
  &__trigger {
    display: none;
    width: 100%;
  }

  // ============ 遮罩: 默认隐藏 ============
  &__mask {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 1200;
    background-color: rgba(0, 0, 0, 0.4);
  }

  // ============ 面板(插槽容器): 默认是文档流内的"单按钮直出"形态 ============
  &__panel {
    width: 100%;
  }

  &__title,
  &__footer {
    display: none;
  }

  // ============ 单按钮形态 ============
  &--single {
    .custom-action-bar__content {
      width: 100%;
      // 包裹层(按钮组 view)拆壳, 让上报按钮浮到文档流直接显示
      :deep(> view) {
        display: contents;
      }
      // 业务侧可用 custom-action-bar-single-hide 标记单按钮时隐藏的元素(如分隔线)
      :deep(> .custom-action-bar-single-hide) {
        display: none !important;
      }
    }
  }

  &__content {
    width: 100%;
  }

  // ============ 多按钮形态 ============
  &:not(&--single) {
    .custom-action-bar__trigger {
      display: block;
    }

    .custom-action-bar__panel {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1201;
      background-color: #ffffff;
      border-radius: 16rpx 16rpx 0 0;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      // 多按钮形态默认隐藏(通过 transform 移出屏幕), 打开时显示
      transform: translateY(100%);
      transition: transform 0.25s ease;
      pointer-events: none;
    }

    .custom-action-bar__title {
      display: flex;
      height: 100rpx;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      flex-shrink: 0;
    }

    .custom-action-bar__content {
      flex: 1;
      overflow-y: auto;
      padding: 32rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 32rpx;
      // 多按钮形态: 全部正常显示
      // :deep(> *) {
      //   display: block !important;
      // }
      // :deep(> .custom-action-button) {
      //   display: flex !important;
      // }
    }

    .custom-action-bar__footer {
      display: block;
      flex-shrink: 0;
      padding: 0 32rpx calc(32rpx + env(safe-area-inset-bottom));
      box-sizing: border-box;
    }
  }

  // ============ 多按钮 + 打开状态 ============
  &:not(&--single)#{&}--open {
    .custom-action-bar__mask {
      display: block;
    }

    .custom-action-bar__panel {
      transform: translateY(0);
      pointer-events: auto;
    }
  }
}
</style>
