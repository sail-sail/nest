<template>
<view
  un-w="full"
  un-flex="~ [1_0_0] row wrap"
  un-gap="2"
  un-box-border
  class="custom_upload_image"
  :class="{
    'custom_upload_image_readonly': readonly,
  }"
>
  
  <view
    v-for="(item, index) of imgUrlArr"
    :key="downloadUrlArr[index] || item || index"
    un-relative
    un-overflow="hidden"
    un-rounded="md"
    un-border="1 solid [var(--color-border)]"
    un-box-border
    :style="{
      width: props.itemSize,
      height: props.itemSize,
    }"
    class="custom_upload_image_item"
  >
    
    <image
      :src="item"
      mode="aspectFill"
      un-w="full"
      un-h="full"
      webp
      @click="onPreview(index)"
    ></image>
    
    <view
      v-if="!readonly"
      un-absolute
      un-top="0"
      un-right="0"
      un-z="1"
      un-w="5"
      un-h="5"
      un-rounded="full"
      un-bg="white/50"
      un-flex="~"
      un-justify="center"
      un-items="center"
      @click.stop="onDelete(index)"
    >
      <tm-icon
        :size="30"
        color="red"
        name="close-line"
      ></tm-icon>
    </view>
    
  </view>
  
  <view
    v-if="!readonly && idArr.length < props.maxSize"
    un-rounded="md"
    un-b="1 dashed [var(--color-readonly)]"
    un-box-border
    un-flex="~"
    un-justify="center"
    un-items="center"
    un-text="[var(--color-placeholder)]"
    class="custom_upload_image_add"
    :style="{
      width: props.itemSize,
      height: props.itemSize,
      opacity: uploading ? '0.72' : undefined,
    }"
    un-cursor="pointer"
    @click="onChooseImage"
  >
    
    <view
      un-flex="~ col"
      un-items="center"
      un-gap="1"
    >
      <tm-icon
        :size="40"
        color="var(--color-placeholder)"
        :name="uploading ? 'loader-4-line' : 'add-line'"
      ></tm-icon>
      <view
        v-if="props.placeholder"
        un-text="xs center"
        un-p="x-2"
      >
        {{ props.placeholder }}
      </view>
    </view>
    
  </view>
  
  <view
    v-else-if="readonly && props.pageInited && idArr.length === 0"
    un-rounded="md"
    un-border="1 dashed [var(--color-border)]"
    un-box-border
    un-flex="~"
    un-justify="center"
    un-items="center"
    un-text="[var(--color-placeholder)] center"
    class="custom_upload_image_empty"
    :style="{
      width: props.itemSize,
      height: props.itemSize,
    }"
  >
    {{ props.readonlyPlaceholder || '' }}
  </view>
  
</view>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: "update:modelValue", value?: string): void,
  (e: "change", value?: string): void,
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    readonly?: boolean;
    pageInited?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    maxSize?: number;
    itemSize?: string;
    width?: number;
    height?: number;
    quality?: number;
    sourceType?: ("album" | "camera")[];
    db?: string;
    isPublic?: boolean;
  }>(),
  {
    modelValue: undefined,
    readonly: undefined,
    pageInited: true,
    placeholder: "上传图片",
    readonlyPlaceholder: undefined,
    maxSize: 9,
    itemSize: "160rpx",
    width: 320,
    height: 320,
    quality: 80,
    sourceType: () => [ "album", "camera" ],
    db: undefined,
    isPublic: false,
  },
);

const tmFormItemReadonly = inject<ComputedRef<boolean> | undefined>("tmFormItemReadonly", undefined);

const readonly = $computed(() => {
  if (props.readonly != null) {
    return props.readonly;
  }
  if (tmFormItemReadonly) {
    return tmFormItemReadonly.value;
  }
  return false;
});

let modelValue1 = $ref(props.modelValue || "");

watch(
  () => props.modelValue,
  () => {
    const nextValue = props.modelValue || "";
    if (modelValue1 !== nextValue) {
      modelValue1 = nextValue;
    }
  },
  {
    immediate: true,
  },
);

const idArr = $computed(() => {
  if (!modelValue1) {
    return [ ];
  }
  return modelValue1.split(",").map((item) => item.trim()).filter((item) => item);
});

const imgUrlArr = $computed(() => {
  if (idArr.length === 0) {
    return [ ];
  }
  return getImgUrlArr({
    id: idArr.join(","),
    width: props.width,
    height: props.height,
    quality: props.quality,
  });
});

const downloadUrlArr = $computed(() => {
  if (idArr.length === 0) {
    return [ ];
  }
  return getDownloadUrlArr({
    id: idArr.join(","),
    inline: "1",
  });
});

let uploading = $ref(false);

function updateModelValue(
  value: string,
) {
  modelValue1 = value;
  const nextValue = value || undefined;
  emit("update:modelValue", nextValue);
  emit("change", nextValue);
}

async function chooseImagePaths(
  count: number,
) {
  let tempFilePaths: string[] = [ ];
  
  // #ifdef MP-WEIXIN
  const mediaRes = await uni.chooseMedia({
    count,
    mediaType: [ "image" ],
    sourceType: props.sourceType,
  });
  tempFilePaths = (mediaRes.tempFiles || [ ]).map((item) => item.tempFilePath).filter((item) => item);
  // #endif
  
  // #ifndef MP-WEIXIN
  const imageRes = await uni.chooseImage({
    count,
    sourceType: props.sourceType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
  tempFilePaths = (imageRes.tempFilePaths || [ ]).filter((item) => item);
  // #endif
  
  return tempFilePaths;
}

async function onChooseImage() {
  if (readonly || uploading) {
    return;
  }
  const remainSize = props.maxSize - idArr.length;
  if (remainSize <= 0) {
    uni.showToast({
      title: `最多上传${ props.maxSize }张`,
      icon: "none",
    });
    return;
  }
  let tempFilePaths: string[] = [ ];
  try {
    tempFilePaths = await chooseImagePaths(remainSize);
  } catch (err) {
    return;
  }
  if (tempFilePaths.length === 0) {
    return;
  }
  const nextIdArr = [ ...idArr ];
  let isChanged = false;
  uploading = true;
  try {
    for (const filePath of tempFilePaths) {
      let id = "";
      try {
        id = await uploadFile({
          filePath,
          showErrMsg: true,
          db: props.db,
          isPublic: props.isPublic,
        });
      } catch (err) {
        if (isChanged) {
          updateModelValue(nextIdArr.join(","));
        }
        throw err;
      }
      if (!id) {
        continue;
      }
      nextIdArr.push(id);
      isChanged = true;
    }
  } finally {
    uploading = false;
  }
  if (isChanged) {
    updateModelValue(nextIdArr.join(","));
  }
}

async function onDelete(
  index: number,
) {
  if (readonly || uploading) {
    return;
  }
  const res = await uni.showModal({
    content: "确定删除当前图片吗？",
  });
  if (!res.confirm) {
    return;
  }
  const nextIdArr = idArr.filter((_, i) => i !== index);
  updateModelValue(nextIdArr.join(","));
}

async function onPreview(
  index: number,
) {
  if (imgUrlArr.length === 0) {
    return;
  }
  const urls = downloadUrlArr.length > 0 ? downloadUrlArr : imgUrlArr;
  await uni.previewImage({
    current: urls[index],
    urls,
  });
}
</script>

<style lang="scss" scoped>
.custom_upload_image_readonly {
  .custom_upload_image_item,
  .custom_upload_image_empty {
    border-color: var(--color-readonly-border, var(--color-border));
  }
}
</style>