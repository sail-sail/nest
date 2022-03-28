<template>
<div style="width: 100%;height: 100%;position: relative;" @mouseenter="imgMouseenter" @mouseleave="imgMouseleave">
  <el-image
    v-bind="$attrs"
    :src="urlList[nowIndex]"
  >
    <template #placeholder>
      <el-icon style="font-size: inherit;" color="gray">
        <Loading></Loading>
      </el-icon>
    </template>
    <template #error>
      <el-icon style="font-size: inherit;" color="gray">
        <Loading v-if="indexStore.loading > 0"></Loading>
        <Picture v-else></Picture>
      </el-icon>
    </template>
  </el-image>
  <transition name="fade">
    <div v-if="showUpload" class="upload_div">
      <div class="upload_toolbar">
        <el-button @click="uploadClk">上传</el-button>
        <el-button v-if="urlList.length > 0" plain type="danger" @click="deleteClk">删除</el-button>
      </div>
      <div class="upload_padding" v-if="urlList.length > 0">
        <el-button
          :disabled="nowIndex <= 0"
          size="small"
          :icon="ArrowLeft"
          @click="previousClk"
        ></el-button>
        <span style="color: yellowgreen;margin-left: 10px;margin-right: 10px;">
          {{ nowIndex + 1 }} / {{ urlList.length }}
        </span>
        <el-button
          :disabled="nowIndex >= urlList.length - 1"
          size="small"
          :icon="ArrowRight"
          @click="nextClk"
        ></el-button>
      </div>
    </div>
  </transition>
  <input type="file"
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
  ElButton,
} from "element-plus";
import {
  Picture,
  Loading,
  ArrowLeft,
  ArrowRight,
} from "@element-plus/icons-vue";
import { baseURL, uploadFile } from "@/utils/axios";
import useIndexStore from "@/store/index";
import { watch } from "vue";

const emit = defineEmits([ "update:modelValue" ]);

const indexStore = useIndexStore();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    maxFileSize?: number;
    maxSize?: number;
  }>(),
  {
    modelValue: "",
    maxFileSize: 1024 * 1024 * 50,
    maxSize: 1,
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
  return ids.map((id) => `${ baseURL }/api/minio/download?id=${ encodeURIComponent(id) }`);
});

let fileRef = $ref(undefined);

async function inputChg() {
  if (!fileRef) return;
  const idArr = modelValue.split(",").filter((x) => x);
  if (idArr.length >= props.maxSize) {
    fileRef.value = "";
    ElMessage.error(`最多只能上传 ${ props.maxSize } 张图片`);
    return;
  }
  const file = fileRef.files[0];
  fileRef.value = "";
  if (!file) return;
  if (file.size > props.maxFileSize) {
    ElMessage.error(`文件大小不能超过 ${ props.maxFileSize / 1024 / 1024 }M`);
    return;
  }
  const data = await uploadFile(file);
  if (data.code !== 0) {
    ElMessage.error(data.msg || "上传失败!");
    return;
  }
  ElMessage.success("上传成功!");
  const id = data.data;
  idArr.push(id);
  modelValue = idArr.join(",");
  nowIndex = idArr.length - 1;
  emit("update:modelValue", modelValue);
}

// 点击上传图片
function uploadClk() {
  if (!fileRef) return;
  const idArr = modelValue.split(",").filter((x) => x);
  if (idArr.length >= props.maxSize) {
    fileRef.value = "";
    ElMessage.error(`最多只能上传 ${ props.maxSize } 张图片`);
    return;
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
  ElMessage.success("删除成功!");
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
  background-color: rgba($color: #000, $alpha: .3);
  cursor: pointer;
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
  margin-bottom: 5px;
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

