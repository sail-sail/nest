<template>
<div
  un-w="full"
  un-h="full"
  un-pos-relative
  :class="{ 'border_wrap': urlList.length === 0 }"
  un-rounded
  @mouseenter="imgMouseenter"
  @mouseleave="imgMouseleave"
>
  <el-image
    v-bind="$attrs"
    :src="urlList[nowIndex]"
    un-object-contain
    un-rounded
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
          v-if="loading"
          color="gray"
        >
          <ElIconLoading />
        </el-icon>
        
        <el-icon
          v-else
          color="gray"
          :size="28"
        >
          <ElIconPicture />
        </el-icon>
        
      </div>
    </template>
  </el-image>
  <transition name="fade">
    <div
      v-if="!readonly && showUpload"
      class="upload_div"
      un-rounded
    >
      
      <div class="upload_toolbar">
        
        <ElIcon
          size="22"
          un-cursor-pointer
          un-rounded
          @click="uploadClk"
          :title="ns('上传')"
        >
          <ElIconUpload
            un-text="white"
          />
        </ElIcon>
        
        <ElIcon
          v-if="urlList.length > 0"
          size="22"
          un-cursor-pointer
          un-rounded
          @click="onView"
          :title="ns('预览')"
        >
          <ElIconView
            un-text="white"
          />
        </ElIcon>
        
        <ElIcon
          size="22"
          un-cursor-pointer
          un-rounded
          @click="deleteClk"
          :title="ns('删除')"
        >
          <ElIconDelete
            un-text="red-300"
          />
        </ElIcon>
        
      </div>
      
      <div
        class="upload_padding"
        v-if="urlList.length > 1"
        un-h="7"
        un-flex="~"
        un-justify-center
        un-items-center
        un-bg="[rgba(0,0,0,.3)]"
      >
        
        <ElIcon
          v-if="!(nowIndex <= 0)"
          size="14"
          un-bg="white hover:[var(--el-color-primary)]"
          un-cursor-pointer
          un-rounded-full
          @click="previousClk"
        >
          <ElIconArrowLeft />
        </ElIcon>
        
        <div
          un-text="[yellowgreen]"
          un-m="l-1 r-1"
        >
          {{ nowIndex + 1 }} / {{ urlList.length }}
        </div>
        
        <ElIcon
          v-if="!(nowIndex >= urlList.length - 1)"
          size="14"
          un-bg="white hover:[yellowgreen]"
          un-cursor-pointer
          un-rounded-full
          @click="nextClk"
        >
          <ElIconArrowRight />
        </ElIcon>
        
      </div>
      
    </div>
  </transition>
  <input
    type="file"
    :accept="accept"
    @change="inputChg"
    style="display: none;"
    ref="fileRef"
  />
  <Teleport to="body">
    <el-image-viewer
      v-if="urlList.length > 0 && showImageViewer"
      hide-on-click-modal
      :url-list="urlList"
      :initial-index="nowIndex"
      @close="showImageViewer = false"
    ></el-image-viewer>
  </Teleport>
</div>
</template>

<script lang="ts" setup>
const {
  ns,
  nsAsync,
} = useI18n();

import type {
  InputMaybe,
} from "#/types";

const emit = defineEmits<
  (e: "update:modelValue", value: string) => void
>();

const props = withDefaults(
  defineProps<{
    modelValue: InputMaybe<string>;
    maxFileSize?: number;
    maxSize?: number;
    accept?: string;
    readonly?: boolean;
  }>(),
  {
    modelValue: "",
    maxFileSize: 1024 * 1024 * 50,
    maxSize: 1,
    accept: "image/webp,image/png,image/jpeg,image/svg+xml",
    readonly: false,
  },
);

let modelValue = $ref(props.modelValue || "");

watch(() => props.modelValue, (newVal) => {
  if (modelValue !== newVal) {
    modelValue = newVal || "";
    nowIndex = 0;
  }
});

let nowIndex = $ref(0);

let urlList = $computed(() => {
  if (!modelValue) return [ ];
  const ids = modelValue.split(",").filter((x) => x);
  return ids.map((id) => {
    const url = getDownloadUrl({
      id,
      inline: "1",
    }, "oss");
    return url;
  });
});

let fileRef = $ref<HTMLInputElement>();

let loading = $ref(false);

async function inputChg() {
  if (!fileRef) {
    return;
  }
  let idArr = modelValue.split(",").filter((x) => x);
  if (props.maxSize > 1) {
    if (idArr.length >= props.maxSize) {
      fileRef.value = "";
      ElMessage.error(await nsAsync("最多只能上传 {0} 张图片", props.maxSize));
      return;
    }
  }
  const file = fileRef?.files?.[0];
  fileRef.value = "";
  if (!file) {
    return;
  }
  if (file.size > props.maxFileSize) {
    ElMessage.error(await nsAsync("文件大小不能超过 {0}M", props.maxFileSize / 1024 / 1024));
    return;
  }
  let id = "";
  loading = true;
  try {
    id = await uploadFile(file);
  } finally {
    loading = false;
  }
  if (!id) {
    return;
  }
  if (props.maxSize === 1) {
    idArr = [ id ];
    modelValue = id;
    nowIndex = 0;
  } else {
    idArr.push(id);
    modelValue = idArr.join(",");
    nowIndex = idArr.length - 1;
  }
  emit("update:modelValue", modelValue);
}

// 点击上传图片
async function uploadClk() {
  if (!fileRef) return;
  const idArr = modelValue.split(",").filter((x) => x);
  if (props.maxSize > 1) {
    if (idArr.length >= props.maxSize) {
      fileRef.value = "";
      ElMessage.error(await nsAsync("最多只能上传 {0} 张图片", props.maxSize));
      return;
    }
  }
  fileRef.click();
}

// 删除图片
async function deleteClk() {
  try {
    await ElMessageBox.confirm(await nsAsync("确定删除当前图片吗？"));
  } catch (err) {
    return;
  }
  const idArr = modelValue.split(",").filter((x, i) => x).filter((_, i) => i !== nowIndex);
  modelValue = idArr.join(",");
  if (nowIndex >= idArr.length) {
    nowIndex = idArr.length - 1;
  } else if (nowIndex > 0) {
    nowIndex--;
  }
  // ElMessage.success("删除成功!");
  emit("update:modelValue", modelValue);
}

let showUpload = $ref(false);

function imgMouseenter() {
  showUpload = true;
}

function imgMouseleave() {
  showUpload = false;
}

function previousClk() {
  if (nowIndex > 0) {
    nowIndex--;
  }
}

function nextClk() {
  if (nowIndex < urlList.length - 1) {
    nowIndex++;
  }
}

let showImageViewer = $ref(false);

function onView() {
  showImageViewer = !showImageViewer;
}
</script>

<style lang="scss" scoped>
.el-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload_div {
  position: absolute;
  bottom: 0px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba($color: #000, $alpha: .5);
}
.upload_toolbar {
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
.upload_padding {
  // margin-bottom: 5px;
  display: flex;
  width: 100%;
  justify-content: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.border_wrap {
  @apply b-1 b-solid b-gray-200 dark:b-gray-500;
}
</style>
