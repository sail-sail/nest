
const dirtyRoutePath = ref("");

export default function() {
  
  async function fireDirty(
    routePath: string,
  )  {
    dirtyRoutePath.value = routePath;
    await nextTick();
    dirtyRoutePath.value = "";
  }
  
  function onDirty(
    callback: () => void | PromiseLike<void>,
    routePath?: string,
  )  {
    if (!routePath) {
      const t = getCurrentInstance();
      if (!t) {
        throw new Error("getCurrentInstance is null");
      }
      routePath = t.type?.name as string;
      if (!routePath) {
        throw new Error("routePath is empty");
      }
    }
    const isDirty = ref(false);
    const isActivated = ref(false);
    
    const dirtyWatch = watch(
      dirtyRoutePath,
      async () => {
        if (!dirtyRoutePath.value) {
          return;
        }
        if (routePath !== dirtyRoutePath.value) {
          return;
        }
        if (!isActivated.value) {
          isDirty.value = true;
          return;
        }
        isDirty.value = true;
        await nextTick();
        if (isDirty.value) {
          isDirty.value = false;
          await callback();
        }
      },
    );
    
    onActivated(async () => {
      isActivated.value = true;
      if (isDirty.value) {
        isDirty.value = false;
        await callback();
      }
    });
    
    onDeactivated(() => {
      isActivated.value = false;
    });
    
    onBeforeUnmount(() => {
      dirtyWatch();
    });
    
    return function () {
      nextTick(function() {
        isDirty.value = false;
      });
    };
  }
  
  return {
    fireDirty,
    onDirty,
  };
  
};
