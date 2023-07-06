<template>
<div
  @click="linkClk"
  un-flex="~ gap-1"
  un-p="y-0.5"
  un-box-border
  un-rounded
  un-cursor-pointer
>
  <template
    v-if="urlList.length > 0"
  >
    <el-image
      v-for="url in urlList"
      :key="url"
      :src="url"
      fit="contain"
      loading="lazy"
      un-rounded
      un-object-contain
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
  <Teleport to="body">
    <el-image-viewer
      v-if="originalUrlList.length > 0 && showImageViewer"
      hide-on-click-modal
      :url-list="originalUrlList"
      @close="showImageViewer = false"
    ></el-image-viewer>
  </Teleport>
</div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: string | null;
    width?: number;
    height?: number;
    quality?: number;
  }>(),
  {
    modelValue: "",
    format: "webp",
    width: 46,
    height: 46,
    quality: 60,
  },
);

let urlList = $computed(() => {
  const list: string[] = [];
  if (!props.modelValue) return list;
  let ids = props.modelValue.split(",").filter((x) => x);
  for (let id of ids) {
    const url = getImgUrl({
      id,
      format: "webp",
      width: props.width,
      height: props.height,
      quality: props.quality,
    });
    list.push(url);
  }
  return list;
});

let originalUrlList = $computed(() => {
  const list: string[] = [];
  if (!props.modelValue) return list;
  let ids = props.modelValue.split(",").filter((x) => x);
  for (let id of ids) {
    const url = getImgUrl({
      id,
      format: "webp",
      quality: 100,
    });
    list.push(url);
  }
  return list;
});

let showImageViewer = $ref(false);

function linkClk() {
  showImageViewer = !showImageViewer;
}
</script>
