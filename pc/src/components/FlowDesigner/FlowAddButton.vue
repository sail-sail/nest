<template>
  <div
    v-if="!readonly"
    class="flow-add-btn"
  >
    <div class="flow-add-btn__line"></div>
    <el-popover
      trigger="click"
      :width="280"
      placement="right-start"
      :visible="popVisible"
    >
      <template #reference>
        <div
          class="flow-add-btn__circle"
          @click="popVisible = !popVisible"
        >
          <ElIconPlus
            un-w="3.5"
            un-h="3.5"
          />
        </div>
      </template>
      <div class="flow-add-pop">
        <div
          class="flow-add-pop__item"
          @click="onSelect('approve')"
          v-click-outside="() => popVisible = false"
        >
          <div class="flow-add-pop__icon flow-add-pop__icon--approve">
            <ElIconStamp
              un-w="6"
              un-h="6"
            />
          </div>
          <span>审批人</span>
        </div>
        <div
          class="flow-add-pop__item"
          @click="onSelect('cc')"
          v-click-outside="() => popVisible = false"
        >
          <div class="flow-add-pop__icon flow-add-pop__icon--cc">
            <ElIconPromotion
              un-w="6"
              un-h="6"
            />
          </div>
          <span>抄送人</span>
        </div>
        <div
          class="flow-add-pop__item"
          @click="onSelect('condition_group')"
          v-click-outside="() => popVisible = false"
        >
          <div class="flow-add-pop__icon flow-add-pop__icon--condition">
            <ElIconShare
              un-w="6"
              un-h="6"
            />
          </div>
          <span>条件分支</span>
        </div>
      </div>
    </el-popover>
    <div class="flow-add-btn__line"></div>
  </div>
  <div
    v-else
    class="flow-add-btn flow-add-btn--readonly"
  >
    <div class="flow-add-btn__line flow-add-btn__line--long"></div>
  </div>
</template>

<script lang="ts" setup>
import { ClickOutside as vClickOutside } from "element-plus";
import type { InsertableNodeType } from "./FlowTypes";

defineProps<{
  readonly?: boolean;
}>();

const emit = defineEmits<{
  add: [type: InsertableNodeType];
}>();

let popVisible = $ref(false);

function onSelect(type: InsertableNodeType) {
  popVisible = false;
  emit("add", type);
}
</script>

<style scoped>
.flow-add-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.flow-add-btn__line {
  width: 2px;
  height: 16px;
  background: #cacaca;
}

.flow-add-btn__line--long {
  height: 32px;
}

.flow-add-btn--readonly {
  pointer-events: none;
}

.flow-add-btn__circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #3296fa;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.flow-add-btn__circle:hover {
  background: #1a7be0;
  transform: scale(1.1);
}

.flow-add-pop {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 8px 0;
}

.flow-add-pop__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: color 0.2s;
}

.flow-add-pop__item:hover {
  color: #333;
}

.flow-add-pop__icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  border: 1px solid #e8e8e8;
}

.flow-add-pop__item:hover .flow-add-pop__icon {
  transform: scale(1.08);
}

.flow-add-pop__icon--approve {
  color: #ff943e;
  background: #fff7f0;
}

.flow-add-pop__icon--cc {
  color: #3296fa;
  background: #f0f7ff;
}

.flow-add-pop__icon--condition {
  color: #15bc83;
  background: #f0fbf6;
}
</style>
