<template>
<div
  un-w="full"
  un-h="full"
  un-pos-relative
  :un-border="urlList.length === 0 ? '~ gray-200 dark:gray-500' : ''"
  un-rounded
  @mouseenter="imgMouseenter"
  @mouseleave="imgMouseleave"
>
  <el-image
    v-bind="$attrs"
    :src="urlList[nowIndex]"
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
          <Loading></Loading>
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
          v-if="indexStore.loading > 0"
          color="gray"
        >
          <Loading></Loading>
        </el-icon>
        
        <el-icon
          v-else
          color="gray"
          :size="28"
        >
          <Picture></Picture>
        </el-icon>
        
      </div>
    </template>
  </el-image>
  <transition name="fade">
    <div
      v-if="showUpload"
      class="upload_div"
      un-rounded
    >
      
      <div class="upload_toolbar">
        
        <ElIcon
          size="22"
          un-text="white"
          un-cursor-pointer
          un-rounded
          @click="uploadClk"
        >
          <Upload />
        </ElIcon>
        
        <ElIcon
          size="22"
          un-m="l-3"
          un-text="white"
          un-cursor-pointer
          un-rounded
          @click="deleteClk"
        >
          <Delete />
        </ElIcon>
        
      </div>
      
      <div
        class="upload_padding"
        v-if="urlList.length > 1"
        un-h="7"
        un-flex="~"
        un-justify-center
        un-items-center
        un-bg="[rgba(0,0,0,.4)]"
      >
        
        <ElIcon
          v-if="!(nowIndex <= 0)"
          size="14"
          un-bg="white hover:[var(--el-color-primary)]"
          un-cursor-pointer
          un-rounded-full
          @click="previousClk"
        >
          <ArrowLeft />
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
          <ArrowRight />
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
</div>
</template>

<script lang="ts" setup>
import {
  ElMessage,
  ElMessageBox,
  ElImage,
  ElIcon,
} from "element-plus";

import {
  Picture,
  Loading,
  ArrowLeft,
  ArrowRight,
  Upload,
  Delete,
} from "@element-plus/icons-vue";

import {
  getDownloadUrl,
  uploadFile,
} from "@/utils/axios";

import useIndexStore from "@/store/index";
import { watch } from "vue";

const emit = defineEmits([ "update:modelValue" ]);

const indexStore = useIndexStore();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    maxFileSize?: number;
    maxSize?: number;
    accept?: string;
  }>(),
  {
    modelValue: "",
    maxFileSize: 1024 * 1024 * 50,
    maxSize: 1,
    accept: "image/png,image/jpeg,image/svg+xml",
  },
);

let modelValue = $ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  if (modelValue !== newVal) {
    modelValue = newVal;
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
    });
    return url;
  });
});

let fileRef = $ref<HTMLInputElement>();

async function inputChg() {
  if (!fileRef) {
    return;
  }
  let idArr = modelValue.split(",").filter((x) => x);
  if (props.maxSize > 1) {
    if (idArr.length >= props.maxSize) {
      fileRef.value = "";
      ElMessage.error(`最多只能上传 ${ props.maxSize } 张图片`);
      return;
    }
  }
  const file = fileRef?.files?.[0];
  fileRef.value = "";
  if (!file) {
    return;
  }
  if (file.size > props.maxFileSize) {
    ElMessage.error(`文件大小不能超过 ${ props.maxFileSize / 1024 / 1024 }M`);
    return;
  }
  const id = await uploadFile(file);
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
function uploadClk() {
  if (!fileRef) return;
  const idArr = modelValue.split(",").filter((x) => x);
  if (props.maxSize > 1) {
    if (idArr.length >= props.maxSize) {
      fileRef.value = "";
      ElMessage.error(`最多只能上传 ${ props.maxSize } 张图片`);
      return;
    }
  }
  fileRef.click();
}

// 删除图片
async function deleteClk() {
  try {
    await ElMessageBox.confirm("确定删除当前图片吗？");
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
  flex: 1 0 0;
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
