
function addUnit(value: string | number, defaultUnit = 'px') {
  if (!value) return '';
  if (isNaN(Number(value))) {
    return value;
  } else {
    return `${value}${defaultUnit}`;
  }
}

export const useDraggable = (
  targetRef: Ref<HTMLElement | undefined>,
  dragRef: Ref<HTMLElement | undefined>,
  draggable: ComputedRef<boolean>
) => {
  let transform = {
    offsetX: 0,
    offsetY: 0,
  };

  const onMousedown = (e: MouseEvent) => {
    e.preventDefault();
    const downX = e.clientX;
    const downY = e.clientY;
    const { offsetX, offsetY } = transform;

    const targetRect = targetRef.value!.getBoundingClientRect();
    const targetLeft = targetRect.left;
    const targetTop = targetRect.top;
    // const targetWidth = targetRect.width;
    // const targetHeight = targetRect.height;

    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    const minLeft = -targetLeft + offsetX - targetRect.width + 100;
    const minTop = -targetTop + offsetY;
    const maxLeft = clientWidth - targetLeft - 50 + offsetX;
    const maxTop = clientHeight - targetTop - 50 + offsetY;

    const onMousemove = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      for (let i = 0; i < 5; i++) {
        if (!target) return;
        if (target.classList.contains("el-dialog")) {
          break;
        }
        if (!target.parentElement) {
          break;
        }
        target = target.parentElement;
      }
      if (!target || target.classList.contains("is-fullscreen")) {
        return;
      }
      const moveX = Math.min(
        Math.max(offsetX + e.clientX - downX, minLeft),
        maxLeft
      );
      const moveY = Math.min(
        Math.max(offsetY + e.clientY - downY, minTop),
        maxTop
      );

      transform = {
        offsetX: moveX,
        offsetY: moveY,
      };
      targetRef.value!.style.transform = `translate(${addUnit(
        moveX
      )}, ${addUnit(moveY)})`;
    };

    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    };

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);
  };
  
  function onDragreset(e: Event) {
    const customEvent = e as CustomEvent;
    if (customEvent.detail.fullscreen) {
      transform = {
        offsetX: 0,
        offsetY: 0,
      };
      targetRef.value!.style.transform = 'translate(0, 0)';
    }
  } 

  const onDraggable = () => {
    if (dragRef.value && targetRef.value) {
      dragRef.value.addEventListener('mousedown', onMousedown);
      dragRef.value.addEventListener('fullscreenchange', onDragreset);
    }
  };

  const offDraggable = () => {
    if (dragRef.value && targetRef.value) {
      dragRef.value.removeEventListener('mousedown', onMousedown);
    }
  };

  watchEffect(() => {
    if (draggable.value) {
      onDraggable();
    } else {
      offDraggable();
    }
  });

  // onBeforeUnmount(() => {
  //   offDraggable();
  // });
};
