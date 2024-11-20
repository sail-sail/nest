<template>
<el-link
  type="primary"
  @click="linkClk"
>
  <slot name="default">
    {{ attLen }}
  </slot>
</el-link>
<AttDialog
  ref="attDialogRef"
  @change="attDialogChg"
></AttDialog>
</template>

<script lang="ts" setup>
import AttDialog from "./AttDialog.vue";

const emit = defineEmits([
  "change",
  "update:modelValue",
]);

const props = withDefaults(
  defineProps<{
    modelValue: string|null;
    maxSize?: number;
    maxFileSize?: number;
    readonly?: boolean;
    accept?: string;
    db?: string;
    isPublic?: boolean;
  }>(),
  {
    modelValue: "",
    maxSize: 1,
    maxFileSize: 1024 * 1024 * 50,
    readonly: false,
    accept: "",
    db: undefined,
    isPublic: false,
  },
);

let modelValue: string = $ref("");

watch(
  () => props.modelValue,
  (newVal) => {
    if (modelValue !== newVal) {
      modelValue = newVal || "";
    }
  },
  {
    immediate: true,
  },
);

let attLen = $computed(() => {
  if (!modelValue) return 0;
  return modelValue.split(",").length;
});

let attDialogRef = $ref<InstanceType<typeof AttDialog>>();

async function linkClk(e?: MouseEvent) {
  if (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
  } 
  if (!attDialogRef) {
    return;
  }
  await attDialogRef.showDialog({
    model: {
      modelValue,
      maxSize: props.maxSize,
      maxFileSize: props.maxFileSize,
      readonly: props.readonly,
      accept: props.accept,
      db: props.db,
      isPublic: props.isPublic,
    },
  });
}

function attDialogChg(modelValue: string) {
  emit("update:modelValue", modelValue);
  emit("change", modelValue);
}
</script>

<style lang="scss" scoped>
</style>
