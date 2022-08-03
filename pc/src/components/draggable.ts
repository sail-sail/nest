import { computed, ComputedRef, Directive, DirectiveBinding, ref, Ref } from "vue";
import { useDraggable } from "../compositions/draggable";

let targetRef: Ref<HTMLElement | undefined> = ref();
let dragRef: Ref<HTMLElement | undefined> = ref();
let isDraggable0 = false;
let isFullScreen0 = false;
let isDraggable: ComputedRef<boolean> = computed(() => isDraggable0 && !isFullScreen0);

function updatedFn(el: HTMLElement, binding: DirectiveBinding) {
  if (binding.value === false) {
    isDraggable0 = false;
  } else {
    isDraggable0 = true;
  }
  const dialogEl = el.parentElement?.parentElement;
  if (!dialogEl) {
    return;
  }
  targetRef.value = dialogEl;
  isFullScreen0 = dialogEl.classList.contains("is-fullscreen");
  if (isDraggable0) {
    dialogEl.classList.add("is-draggable");
  } else {
    dialogEl.classList.remove("is-draggable");
  }
  dragRef.value = el;
  useDraggable(targetRef, dragRef, isDraggable);
}

export const draggable: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding, vnode, prevVNode) {
    updatedFn(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding, vnode, prevVNode) {
    if (binding.value === false) {
      isDraggable0 = false;
    } else {
      isDraggable0 = true;
    }
    const dialogEl = el.parentElement?.parentElement;
    if (!dialogEl) {
      return;
    }
    targetRef.value = dialogEl;
    isFullScreen0 = dialogEl.classList.contains("is-fullscreen");
    if (isDraggable0) {
      dialogEl.classList.add("is-draggable");
    } else {
      dialogEl.classList.remove("is-draggable");
    }
    dragRef.value = el;
  },
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding, vnode, prevVNode) {
    isDraggable0 = false;
  },
};
