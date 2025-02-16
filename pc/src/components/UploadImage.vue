<template>
<div
  ref="uploadImageRef"
  un-w="full"
  un-flex="~ [1_0_0] row wrap"
  un-overflow="auto"
  un-max="h-59"
  un-items="center"
  un-gap="2"
  un-m="l-1px"
  :style="{
    'min-height': `${ (props.itemHeight + 4) }px`,
  }"
  v-bind="$attrs"
>
  <div
    v-for="(item, i) in thumbList"
    :key="item"
    un-relative
    class="upload_image_item"
    tabindex="0"
    @keydown.enter="onView(i)"
    @keydown.space="onView(i)"
    @keydown.delete="onDelete(i)"
    @keydown.backspace="onDelete(i)"
  >
    <div
      un-cursor-pointer
      un-rounded
      un-b="1 solid transparent hover:gray-700 hover:dark:gray-300"
      un-transition="border-color"
      un-p="0.25"
      un-box-border
      un-text="0"
      @click="onView(i)"
    >
      <el-image
        :src="item"
        un-rounded
        :style="{
          height: `${ props.itemHeight }px`,
        }"
        un-min="w-10"
        un-max="w-50"
        un-object-cover
        un-pointer-events-none
        un-select-none
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
            un-h="full"
            un-aspect-ratio="1"
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
    </div>
    <div
      v-if="!props.readonly"
      un-absolute
      un-right="0"
      un-top="0"
      un-flex="~"
      un-justify-center
      un-items-center
      un-bg="transparent hover:red"
      un-text="red hover:white"
      un-rounded="full"
      un-p="0.5"
      un-box-border
      un-cursor-pointer
      @click.stop="onDelete(i)"
    >
      <el-icon
        :size="16"
      >
        <ElIconClose />
      </el-icon>
    </div>
  </div>
  <div
    v-if="props.pageInited && !props.readonly && thumbList.length < props.maxSize"
    class="upload_image_empty"
    :style="{
      height: `${ (props.itemHeight + 4) }px`,
      width: `${ (props.itemHeight + 4) }px`,
    }"
    un-p="0.75"
    un-box-border
    tabindex="0"
    @keydown.z.ctrl="onUndo"
    @keydown.enter="onUpload"
  >
    <div
      un-b="1 dotted gray-300 hover:[var(--el-color-primary)]"
      un-flex="~"
      un-justify-center
      un-items-center
      un-cursor-pointer
      un-rounded
      un-h="full"
      un-w="full"
      un-transition="border-color"
      un-relative
      @click="onUpload"
    >
      <el-icon
        color="gray"
        :size="28"
      >
        <ElIconPlus />
      </el-icon>
      <div
        v-if="!props.readonly && oldModelValue1"
        un-absolute
        un-right="-.5"
        un-top="-1"
        un-flex="~"
        un-justify-center
        un-items-center
        un-bg="transparent hover:gray"
        un-text="gray hover:white"
        un-rounded="full"
        un-p="0.5"
        un-box-border
        un-cursor-pointer
        @click.stop="onUndo"
      >
        <el-icon
          :size="16"
        >
          <div
            un-i="iconfont-undo-fill"
          ></div>
        </el-icon>
      </div>
    </div>
  </div>
</div>
<input
  ref="fileRef"
  type="file"
  :accept="accept"
  style="display: none;"
  @change="onInput"
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
</template>

<script lang="ts" setup>
import Sortable from "sortablejs";

import type {
  SortableEvent,
} from "sortablejs";

import {
  checkImageMaxSize,
} from "@/utils/image_util";

const {
  nsAsync,
} = useI18n();

import type {
  InputMaybe,
} from "#/types";

const emit = defineEmits<
  (e: "update:modelValue", value?: string | null) => void
>();

const props = withDefaults(
  defineProps<{
    modelValue?: InputMaybe<string>;
    maxFileSize?: number;
    maxSize?: number;
    accept?: string;
    readonly?: boolean;
    compress?: boolean;
    maxImageWidth?: number;
    maxImageHeight?: number;
    itemHeight?: number;
    pageInited?: boolean;
    db?: string;
    isPublic?: boolean;
  }>(),
  {
    modelValue: undefined,
    maxFileSize: 1024 * 1024 * 50,
    maxSize: 1,
    accept: "image/webp,image/png,image/jpeg,image/svg+xml",
    readonly: false,
    compress: true,
    maxImageWidth: 1920,
    maxImageHeight: 1080,
    itemHeight: 100,
    pageInited: false,
    db: "",
    isPublic: false,
  },
);

let modelValue1 = $ref(props.modelValue);
let oldModelValue1 = $ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  if (modelValue1 !== newVal) {
    modelValue1 = newVal;
    nowIndex = 0;
  }
});

let nowIndex = $ref(0);

const urlList = $computed(() => {
  if (!modelValue1) {
    return [ ];
  }
  const ids = modelValue1.split(",").filter((x) => x);
  return ids.map((id) => {
    const url = getDownloadUrl({
      id,
      inline: "1",
    }, "oss");
    return url;
  });
});


const thumbList = $computed(() => {
  if (!modelValue1) {
    return [ ];
  }
  const ids = modelValue1.split(",").filter((x) => x);
  return ids.map((id) => {
    const url = getImgUrl({
      id,
      height: props.itemHeight,
    });
    return url;
  });
});

const fileRef = $ref<HTMLInputElement>();

let loading = $ref(false);

async function onInput() {
  if (!fileRef) {
    return;
  }
  let idArr: string[] = [ ];
  if (modelValue1) {
    idArr = modelValue1.split(",").filter((x) => x);
  }
  if (props.maxSize > 1) {
    if (idArr.length >= props.maxSize) {
      fileRef.value = "";
      ElMessage.error(await nsAsync("最多只能上传 {0} 张图片", props.maxSize));
      return;
    }
  }
  let file = fileRef?.files?.[0];
  fileRef.value = "";
  if (!file) {
    return;
  }
  if (file.size > props.maxFileSize) {
    ElMessage.error(await nsAsync("文件大小不能超过 {0}M", props.maxFileSize / 1024 / 1024));
    return;
  }
  
  file = await checkImageMaxSize(
    file,
    {
      compress: props.compress,
      maxImageWidth: props.maxImageWidth,
      maxImageHeight: props.maxImageHeight,
    },
  );
  
  let id = undefined;
  loading = true;
  try {
    id = await uploadFile(file, undefined, {
      db: props.db,
      isPublic: props.isPublic,
    });
  } finally {
    loading = false;
  }
  if (!id) {
    return;
  }
  if (props.maxSize === 1) {
    idArr = [ id ];
    modelValue1 = id;
    nowIndex = 0;
  } else {
    idArr.push(id);
    modelValue1 = idArr.join(",");
    nowIndex = idArr.length - 1;
  }
  emit("update:modelValue", modelValue1);
  nextTick(focus);
}

// 点击上传图片
async function onUpload() {
  if (!fileRef) {
    return;
  }
  let idArr: string[] = [ ];
  if (modelValue1) {
    idArr = modelValue1.split(",").filter((x) => x);
  }
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
async function onDelete(
  nowIndex: number,
) {
  try {
    await ElMessageBox.confirm(await nsAsync("确定删除当前图片吗？"));
  } catch (err) {
    return;
  }
  oldModelValue1 = modelValue1;
  let idArr: string[] = [ ];
  if (modelValue1) {
    idArr = modelValue1.split(",").filter((x) => x).filter((_, i) => i !== nowIndex);
  }
  modelValue1 = idArr.join(",");
  if (nowIndex >= idArr.length) {
    nowIndex = idArr.length - 1;
  } else if (nowIndex > 0) {
    nowIndex--;
  }
  emit("update:modelValue", modelValue1);
  nextTick(focus);
}

// 还原图片
async function onUndo() {
  if (!oldModelValue1) {
    return;
  }
  modelValue1 = oldModelValue1;
  oldModelValue1 = "";
  emit("update:modelValue", modelValue1);
  nextTick(focus);
}

let showImageViewer = $ref(false);

function onView(i?: number) {
  if (i !== undefined) {
    nowIndex = i;
  }
  showImageViewer = !showImageViewer;
}

const uploadImageRef = $ref<HTMLDivElement>();

watch(
  () => props.pageInited,
  async () => {
    if (!props.pageInited) {
      return;
    }
    if (!uploadImageRef) {
      return;
    }
    Sortable.create(
      uploadImageRef,
      {
        animation: 150,
        draggable: ".upload_image_item",
        onEnd: function (event: SortableEvent) {
          const { oldIndex, newIndex } = event;
          if (oldIndex == null || newIndex == null) {
            return;
          }
          modelValue1 = modelValue1 || "";
          const ids = modelValue1.split(",").filter((x) => x);
          const id = ids.splice(oldIndex, 1)[0];
          ids.splice(newIndex, 0, id);
          modelValue1 = ids.join(",");
          emit("update:modelValue", modelValue1);
        },
        filter: function(_, el) {
          if (!el) {
            return true;
          }
          return !el.classList.contains("upload_image_item");
        },
        preventOnFilter: false,
      },
    );
  },
  {
    immediate: true,
    deep: true,
  },
);

let isFocus = $ref(false);

watch(
  () => [
    isFocus,
    uploadImageRef,
  ],
  () => {
    if (!uploadImageRef || !isFocus) {
      return;
    }
    const upload_image_itemArr = uploadImageRef.getElementsByClassName("upload_image_item") as HTMLCollectionOf<HTMLDivElement>;
    if (upload_image_itemArr.length > 0) {
      upload_image_itemArr[0].focus();
    } else {
      const upload_image_emptyArr = uploadImageRef.getElementsByClassName("upload_image_empty") as HTMLCollectionOf<HTMLDivElement>;
      if (upload_image_emptyArr.length > 0) {
        upload_image_emptyArr[0].focus();
      }
    }
  },
);

function focus() {
  isFocus = true;
  if (!uploadImageRef) {
    return;
  }
  const upload_image_itemArr = uploadImageRef.getElementsByClassName("upload_image_item") as HTMLCollectionOf<HTMLDivElement>;
  if (upload_image_itemArr.length > 0) {
    upload_image_itemArr[0].focus();
  } else {
    const upload_image_emptyArr = uploadImageRef.getElementsByClassName("upload_image_empty") as HTMLCollectionOf<HTMLDivElement>;
    if (upload_image_emptyArr.length > 0) {
      upload_image_emptyArr[0].focus();
    }
  }
}

defineExpose({
  focus,
});
</script>
