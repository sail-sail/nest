<template>
<div
  un-flex="~ gap-1"
  un-p="y-0.5"
  un-box-border
  un-rounded
  un-cursor-pointer
  un-justify-center
  un-items-center
>
  <template
    v-if="urlList.length > 0"
  >
    <el-image
      v-for="(url, i) in urlList"
      :key="url"
      :src="url"
      fit="contain"
      loading="lazy"
      un-rounded
      un-object-contain
      :preview-src-list="originalUrlList"
      :initial-index="i"
      :preview-teleported="true"
      :infinite="false"
      :hide-on-click-modal="true"
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
    un-flex="~ [1_0_0]"
    un-overflow-hidden
    un-justify-center
    un-items-center
    un-cursor-default
  >
    (无)
  </div>
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
    width: 32,
    height: 32,
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
</script>
