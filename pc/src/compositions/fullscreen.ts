import { ref } from "vue";

const fullscreenClass = "dialog_fullscreen";

function getParentEl(el: HTMLElement, clazz: string): HTMLElement {
  let parent = el.parentElement;
  while (parent && !parent.classList.contains(clazz)) {
    parent = parent.parentElement;
  }
  return parent;
}

export function useFullscreenEffect() {
  const fullscreen = ref(false);
  function setFullscreen(e: any) {
    const dialogEl = getParentEl(e.target, "el-dialog");
    dialogEl.style.left = "0";
    dialogEl.style.top = "0";
    if (!fullscreen.value) {
      dialogEl.classList.add(fullscreenClass);
      fullscreen.value = true;
    } else {
      dialogEl.classList.remove(fullscreenClass);
      fullscreen.value = false;
    }
  }
  return { fullscreen, setFullscreen };
}
