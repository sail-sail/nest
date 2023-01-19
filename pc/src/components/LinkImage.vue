<template>
<div
  @click="linkClk"
>
  <template
    v-if="urlList.length > 0"
  >
    <el-image
      v-for="(url, i) in urlList"
      :key="url"
      :src="url"
      un-rounded
      :un-m="i > 0 ? 'l-1' : ''"
    >
      <template #placeholder>
        <div
          un-w="full"
          un-h="full"
          un-flex="~ [1_0_0] col"
          un-overflow-hidden
          un-justify-center
          un-items-center
        >
          <el-icon
            color="gray"
          >
            <ElIconLoading />
          </el-icon>
        </div>
      </template>
      <template #error>
        <div
          un-w="full"
          un-h="full"
          un-flex="~ [1_0_0] col"
          un-overflow-hidden
          un-justify-center
          un-items-center
        >
          
          <el-icon
            color="gray"
            :size="28"
          >
            <ElIconPicture />
          </el-icon>
          
        </div>
      </template>
    </el-image>
  </template>
  <div
    v-else
    un-text="[light-gray]"
  >
    (无)
  </div>
  <el-image-viewer
    v-if="urlList.length > 0 && showImageViewer"
    hide-on-click-modal
    :url-list="urlList"
    @close="showImageViewer = false"
  ></el-image-viewer>
</div>
</template>

<script lang="ts" setup>
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
    list.push(getDownloadUrl({
      id,
      inline: "1",
    }, "oss"));
  }
  return list;
});

let showImageViewer = $ref(false);

function linkClk() {
  showImageViewer = !showImageViewer;
}
</script>
