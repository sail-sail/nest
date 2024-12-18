const fullscreenClass = "dialog_fullscreen";
const isDraggableClass = "is-draggable";

function getParentEl(el: HTMLElement, clazz: string) {
  let parent = el.parentElement;
  while (parent && !parent.classList.contains(clazz)) {
    parent = parent.parentElement;
  }
  return parent;
}

export function useFullscreenEfc() {
  let fullscreen = $ref(false);
  let isDraggable = $ref(false);
  function setFullscreen(e: MouseEvent) {
    if (!e.target || !(e.target instanceof HTMLElement)) {
      return;
    }
    const dialogHeaderEl = getParentEl(e.target, "el-dialog__header");
    if (!dialogHeaderEl) {
      return;
    }
    const dialogEl = getParentEl(dialogHeaderEl, "el-dialog");
    if (!dialogEl) {
      return;
    }
    dialogEl.style.left = "0";
    dialogEl.style.top = "0";
    if (!fullscreen) {
      dialogEl.classList.add(fullscreenClass);
      isDraggable = dialogHeaderEl.classList.contains(isDraggableClass);
      dialogHeaderEl.classList.remove(isDraggableClass);
      fullscreen = true;
    } else {
      dialogEl.classList.remove(fullscreenClass);
      if (isDraggable) {
        dialogHeaderEl.classList.add(isDraggableClass);
      }
      fullscreen = false;
    }
    const customEvent = new CustomEvent(
      "fullscreenchange",
      {
        detail: {
          fullscreen,
        },
      },
    );
    dialogHeaderEl.dispatchEvent(customEvent);
  }
  return $$({
    fullscreen,
    setFullscreen,
  });
}
