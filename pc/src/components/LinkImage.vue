<template>
<div>
  <el-link v-if="urlList.length > 0" @click="linkClk" type="primary">
    <slot name="default">
      {{ urlList.length }}
    </slot>
  </el-link>
  <div style="color: light-gray;" v-else>
    0
  </div>
  <teleport to="body" v-if="urlList.length > 0 && showImageViewer">
    <el-image-viewer :urlList="urlList" @close="showImageViewer = false" hideOnClickModal></el-image-viewer>
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
  const list = [];
  if (!props.modelValue) return list;
  let ids = props.modelValue.split(",").filter((x) => x);
  for (let id of ids) {
    id = encodeURIComponent(id);
    list.push(`${ baseURL }/api/oss/download?id=${ id }`);
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
