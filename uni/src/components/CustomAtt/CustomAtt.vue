<template>
<view
  un-w="full"
  un-flex="~ col"
  un-gap="2"
  class="custom_att"
>
  <view
    v-if="fileItems.length > 0"
    un-flex="~ col"
    un-gap="2"
  >
    <view
      v-for="item in fileItems"
      :key="item.id"
      un-flex="~ justify-between items-center"
      un-p="x-3 y-2"
      un-rounded="md"
      un-border="1 solid [var(--color-border)]"
      un-box-border
      un-bg="white"
    >
      <view
        un-flex="~ [1_0_0] items-center"
        un-min-w="0"
        un-cursor="pointer"
        @click="onDownload(item)"
      >
        <view
          un-ml="2"
          un-text="sm"
          un-truncate
          un-break-all
        >
          {{ item.lbl || item.id }}
        </view>
      </view>

      <view
        v-if="!readonly"
        un-p="1"
        un-cursor="pointer"
        @click.stop="onDelete(item.id)"
      >
        <tm-icon
          :size="24"
          color="red"
          name="close-line"
        ></tm-icon>
      </view>
    </view>
  </view>

  <view
    v-else
    un-p="x-3 y-2"
    un-rounded="md"
    un-border="1 dashed [var(--color-border)]"
    un-box-border
    un-text="sm [var(--color-placeholder)]"
  >
    {{ props.placeholder }}
  </view>

  <view
    v-if="!readonly && canAddMore"
    un-p="x-3 y-2"
    un-rounded="md"
    un-border="1 dashed [var(--color-readonly)]"
    un-box-border
    un-flex="~ items-center justify-center"
    un-text="sm [var(--color-placeholder)]"
    un-cursor="pointer"
    :class="{
      'custom_att_uploading': uploading,
    }"
    @click="onChooseFile"
  >
    <view
      un-text="sm"
    >
      {{ uploading ? '上传中…' : props.uploadText }}
    </view>
  </view>
</view>
</template>

<script lang="ts" setup>
import { getStatsOss } from "@/utils/graphql";
import { downloadFile, uploadFile } from "@/utils/request";

type FileItem = {
  id: string;
  lbl: string;
};

const emit = defineEmits<{
  (e: "update:modelValue", value?: string): void,
  (e: "change", value?: string): void,
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    readonly?: boolean;
    maxSize?: number;
    db?: string;
    isPublic?: boolean;
    placeholder?: string;
    uploadText?: string;
    accept?: string;
  }>(),
  {
    modelValue: "",
    readonly: false,
    maxSize: 9,
    db: undefined,
    isPublic: false,
    placeholder: "暂无附件",
    uploadText: "添加附件",
    accept: "",
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

function parseIdArr(value: string) {
  if (!value) {
    return [] as string[];
  }
  return value.split(",").map((item) => item.trim()).filter((item) => item);
}

const idArr = $computed(() => parseIdArr(modelValue1));

const canAddMore = $computed(() => {
  return !readonly && idArr.length < props.maxSize;
});

let uploading = $ref(false);
let fileItems = $ref<FileItem[]>([]);

watch(
  () => modelValue1,
  () => {
    void refreshFileItems();
  },
  {
    immediate: true,
  },
);

function updateModelValue(value: string) {
  modelValue1 = value;
  const nextValue = value || undefined;
  emit("update:modelValue", nextValue);
  emit("change", nextValue);
}

async function refreshFileItems() {
  const ids = idArr;
  if (ids.length === 0) {
    fileItems = [];
    return;
  }
  try {
    const stats = await getStatsOss(ids, {
      showErrMsg: false,
      notLoading: true,
    });
    const byId = new Map<string, string>();
    for (const item of stats) {
      if (item.id) {
        byId.set(item.id, item.lbl || item.id);
      }
    }
    fileItems = ids.map((id) => ({
      id,
      lbl: byId.get(id) || id,
    }));
  } catch {
    fileItems = ids.map((id) => ({
      id,
      lbl: id,
    }));
  }
}

async function onChooseFile() {
  if (readonly || uploading) {
    return;
  }
  const remainSize = props.maxSize - idArr.length;
  if (remainSize <= 0) {
    uni.showToast({
      title: `最多上传${ props.maxSize }个附件`,
      icon: "none",
    });
    return;
  }
  if (typeof uni.chooseFile !== "function") {
    uni.showToast({
      title: "当前平台不支持选择附件",
      icon: "none",
    });
    return;
  }
  let tempFiles: Array<{ path?: string; tempFilePath?: string; name?: string }> = [];
  try {
    const chooseRes = await uni.chooseFile({
      count: remainSize,
      extension: props.accept || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any) as any;
    tempFiles = (chooseRes?.tempFiles || []) as Array<{ path?: string; tempFilePath?: string; name?: string }>;
  } catch {
    return;
  }
  const filePaths = tempFiles
    .map((item) => item.path || item.tempFilePath)
    .filter((item): item is string => Boolean(item));
  if (filePaths.length === 0) {
    return;
  }
  const nextIdArr = [ ...idArr ];
  let isChanged = false;
  uploading = true;
  try {
    for (const filePath of filePaths) {
      try {
        const id = await uploadFile({
          filePath,
          showErrMsg: true,
          db: props.db,
          isPublic: props.isPublic,
        });
        if (id) {
          nextIdArr.push(id);
          isChanged = true;
        }
      } catch {
        if (isChanged) {
          updateModelValue(nextIdArr.join(","));
        }
        throw new Error("upload failed");
      }
    }
  } finally {
    uploading = false;
  }
  if (isChanged) {
    updateModelValue(nextIdArr.join(","));
  }
}

async function onDelete(id: string) {
  if (readonly || uploading) {
    return;
  }
  const res = await uni.showModal({
    content: "确定删除当前附件吗？",
  });
  if (!res.confirm) {
    return;
  }
  const nextIdArr = idArr.filter((item) => item !== id);
  updateModelValue(nextIdArr.join(","));
}

async function onDownload(item: FileItem) {
  if (!item.id) {
    return;
  }
  try {
    const res = await downloadFile({
      id: item.id,
    }, "oss", {
      showErrMsg: true,
    });
    if (res?.tempFilePath) {
      await uni.openDocument({
        filePath: res.tempFilePath,
        showMenu: true,
      });
    }
  } catch {
    // ignore
  }
}
</script>

<style lang="scss" scoped>
.custom_att_uploading {
  opacity: 0.72;
}
</style>
