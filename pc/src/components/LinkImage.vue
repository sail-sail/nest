<template>
<div>
  <el-link
    v-if="urlList.length > 0"
    type="primary"
    @click="linkClk"
  >
    <slot name="default">
      {{ urlList.length }}
    </slot>
  </el-link>
  <div
    v-else
    style="color: light-gray;"
  >
    (无)
  </div>
  <teleport
    v-if="urlList.length > 0 && showImageViewer"
    to="body"
  >
    <el-image-viewer
       hide-on-click-modal
      :url-list="urlList"
      @close="showImageViewer = false"
    ></el-image-viewer>
  </teleport>
</div>
</template>

<script lang="ts" setup>
import {
  ElImageViewer,
  ElLink,
} from "element-plus";
import { baseURL } from '@/utils/axios';

const props = withDefaults(
  defineProps<{
    modelValue: string|null;
  }>(),
  {
    modelValue: "",
  },
);

let urlList = $computed(() => {
  const list: string[] = [];
  if (!props.modelValue) return list;
  let ids = props.modelValue.split(",").filter((x) => x);
  for (let id of ids) {
    id = encodeURIComponent(id);
    list.push(`${ baseURL }/api/oss/download/?id=${ id }`);
  }
  return list;
});

let showImageViewer = $ref(false);

function linkClk() {
  showImageViewer = !showImageViewer;
}
</script>

<style lang="scss" scoped>
</style>
