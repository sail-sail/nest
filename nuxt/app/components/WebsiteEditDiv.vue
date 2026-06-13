<template>
<div
  class="website-editable-block"
  :class="{
    'website-editable-block--editing': isEditing,
  }"
  @contextmenu.prevent="openContextMenu"
>
  <slot
    :val="resolvedVal"
    :is-editing="isEditing"
    :allow_types="props.allow_types"
    :type="resolvedModel?.type"
  />

  <Teleport to="body">
    <div
      v-if="showContextMenu"
      class="website-editable-block-menu"
      :style="{
        top: `${menuPosition.y}px`,
        left: `${menuPosition.x}px`,
      }"
      @click.stop
    >
      <button
        type="button"
        class="website-editable-block-menu__item"
        @click="handleEditClick"
      >
        编辑
      </button>
    </div>
  </Teleport>
</div>
</template>

<script setup lang="ts">
import {
  useIsWebsiteEdit,
  useCompCnfs,
} from "@/app/composables/comp_cnf/index.ts";

const props = withDefaults(
  defineProps<{
    group?: string;
    lbl?: string;
    allow_types?: ("text" | "textarea" | "richtext" | "image")[];
  }>(),
  {
    group: undefined,
    lbl: undefined,
    allow_types: () => ["text", "textarea", "richtext", "image"],
  },
);
const isEditing = computed(() => useIsWebsiteEdit().value);
const showContextMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });

const resolvedModel = computed(() => useCompCnfs().value.find(m => m.group === props.group && m.lbl === props.lbl));

const resolvedVal = computed(() => {
  const valStr = resolvedModel.value?.val;
  const val = valStr ? JSON.parse(valStr) : undefined;
  return val;
});

function openContextMenu(event: MouseEvent) {
  if (!isEditing.value) {
    return;
  }

  event.preventDefault();
  menuPosition.value = { x: event.clientX, y: event.clientY };
  showContextMenu.value = true;
}

function closeContextMenu() {
  showContextMenu.value = false;
}

function handleEditClick() {
  closeContextMenu();
  onClick();
}

function onClick() {
  if (!isEditing.value) {
    return;
  }

  const model = resolvedModel.value;
  window.parent.postMessage({
    action: "openCompCnfDetail",
    payload: {
      id: model?.id,
      lbl: props.lbl,
      group: props.group,
      action: model ? "edit" : "add",
      allow_types: props.allow_types,
    },
  }, "*");
}

onMounted(() => {
  document.addEventListener("click", closeContextMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeContextMenu);
});
</script>

<style scoped>
.website-editable-block {
  display: inline-block;
}

.website-editable-block--editing {
  cursor: context-menu;
  /* box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.5); */
  outline: 1px dashed #409eff;
  outline-offset: -1px;
}

.website-editable-block-menu {
  position: fixed;
  z-index: 9999;
  display: inline-flex;
  flex-direction: column;
  min-width: 96px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.website-editable-block-menu__item {
  border: 0;
  background: transparent;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #111827;
}

.website-editable-block-menu__item:hover {
  background-color: #f3f4f6;
}
</style>
