<template>
<el-dialog
  v-model="dialogVisible"
  draggable
  append-to-body
  class="custom_dialog auto_dialog"
  :close-on-click-modal="false"
  top="0"
  :before-close="beforeClose"
>
  <template #header>
    <div
      v-draggable
      class="dialog_title"
    >
      <div class="title_lbl">
        <span class="title_span">{{ dialogTitle || " " }}</span>
      </div>
    </div>
  </template>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-justify-center
      un-items-center
      un-p="8"
      un-box-border
    >
      <el-progress
        un-w="full"
        :percentage="props.percentage"
        :text-inside="true"
        :stroke-width="24"
      ></el-progress>
    </div>
  </div>
</el-dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  percentage: number;
  dialog_visible: boolean;
}>();

const emit = defineEmits<
  (
    e: "cancel",
  ) => void
>();

let dialogTitle = $ref("正在导入");
let dialogVisible = $ref(false);

watch(
  () => props.dialog_visible,
  () => {
    dialogVisible = props.dialog_visible;
  },
);

async function beforeClose(done: (cancel: boolean) => void) {
  try {
    await ElMessageBox.confirm(`确定取消导入? `, {
      confirmButtonText: "取消导入",
      cancelButtonText: "我再想想",
      type: "warning",
    });
  } catch (err) {
    return;
  }
  done(false);
  dialogVisible = false;
  emit("cancel");
}
</script>
