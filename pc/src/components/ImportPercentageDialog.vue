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
const {
  ns,
  nsAsync,
} = useI18n();

const props = defineProps<{
  percentage: number;
  dialog_visible: boolean;
}>();

const emit = defineEmits<
  (
    e: "stop",
  ) => void
>();

let dialogTitle = $ref(ns("正在导入"));
let dialogVisible = $ref(false);

watch(
  () => props.dialog_visible,
  () => {
    dialogVisible = props.dialog_visible;
  },
);

async function beforeClose(done: (stop: boolean) => void) {
  try {
    await ElMessageBox.confirm(await nsAsync(`确定停止导入?`), {
      confirmButtonText: await nsAsync("停止导入"),
      cancelButtonText: await nsAsync("我再想想"),
      type: "warning",
    });
  } catch (err) {
    return;
  }
  done(false);
  dialogVisible = false;
  emit("stop");
}
</script>
