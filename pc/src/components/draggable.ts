import {
  computed,
  ref,
  type Ref,
  type Directive,
  type DirectiveBinding,
} from "vue";

import { useDraggable } from "../compositions/draggable";

function getParentEl(el: HTMLElement, clazz: string) {
  let parent = el.parentElement;
  while (parent && !parent.classList.contains(clazz)) {
    parent = parent.parentElement;
  }
  return parent;
}

function updatedFn(el: HTMLElement, binding: DirectiveBinding) {
  const targetRef: Ref<HTMLElement | undefined> = ref();
  const dragRef: Ref<HTMLElement | undefined> = ref();
  let isDraggable0 = false;
  if (binding.value === false) {
    isDraggable0 = false;
  } else {
    isDraggable0 = true;
  }
  const dialogHeaderEl = getParentEl(el, "el-dialog__header");
  if (!dialogHeaderEl) {
    return;
  }
  const dialogEl = getParentEl(dialogHeaderEl, "el-dialog");
  if (!dialogEl) {
    return;
  }
  targetRef.value = dialogEl;
  if (isDraggable0) {
    dialogHeaderEl.classList.add("is-draggable");
  }
  dragRef.value = dialogHeaderEl;
  useDraggable(targetRef, dragRef, computed(() => isDraggable0));
}

export const draggable: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding, vnode, prevVNode) {
    updatedFn(el, binding);
  },
};
