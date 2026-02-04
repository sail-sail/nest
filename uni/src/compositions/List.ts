import {
  findOneDynPage,
} from "@/pages/dyn_page/Api";

import {
  findOneMenu,
} from "@/pages/menu/Api.ts";

/**
 * 刷新动态页面标题
 */
export function useMenuTitle(
  pagePath: MaybeRefOrGetter<string>,
) {
  
  const menu_model = ref<MenuModel>();
  
  async function refreshMenuTitle() {
    
    const pagePathValue = toValue(pagePath);
    
    if (!pagePathValue) {
      menu_model.value = undefined;
      await uni.setNavigationBarTitle({
        title: " ",
      });
      return;
    }
    
    const store_key = "useMenuTitle.menu:" + pagePathValue;
    
    menu_model.value = await findOneMenu(
      {
        route_path: pagePathValue,
        is_enabled: [ 1 ],
      },
      undefined,
      {
        notLoading: true,
      },
    );
    if (menu_model.value?.lbl && menu_model.value.lbl.trim() !== "") {
      await uni.setNavigationBarTitle({
        title: menu_model.value.lbl,
      });
    }
    uni.setStorageSync(store_key, menu_model.value);
    
  }
  
  const stopWatch = watch(
    () => toValue(pagePath),
    async (pagePath) => {
      
      if (!pagePath) {
        menu_model.value = undefined;
        await uni.setNavigationBarTitle({
          title: " ",
        });
        return;
      }
      
      const store_key = "useMenuTitle.menu:" + pagePath;
      // 先尝试从缓存加载菜单标题
      const cached_menu = uni.getStorageSync(store_key) as MenuModel | null;
      if (cached_menu?.lbl && cached_menu.lbl.trim() !== "") {
        await uni.setNavigationBarTitle({
          title: cached_menu.lbl,
        });
      }
      
      refreshMenuTitle();
      
    },
    {
      immediate: true,
    },
  );
  
  return {
    menu_model,
    refreshMenuTitle,
    stop: stopWatch,
  };
  
}

/** 初始化动态页面表单字段 */
export function useDynPageFields(
  pagePath: MaybeRefOrGetter<string>,
) {
  const dyn_page_field_models = ref<DynPageFieldModel[]>([ ]);
  // let abortController: AbortController | null = null;
  
  async function refreshDynPageFields() {
    
    const pagePathValue = toValue(pagePath);
    
    // 取消之前的请求
    // if (abortController) {
    //   abortController.abort();
    // }
    // abortController = new AbortController();
    
    if (!pagePathValue) {
      dyn_page_field_models.value = [ ];
      return;
    }
    
    const store_key = "useDynPageFields.dyn_page_model:" + pagePathValue;
    
    const dyn_page_model = await findOneDynPage({
      code: pagePathValue,
      is_enabled: [ 1 ],
    });
    
    if (!dyn_page_model) {
      uni.removeStorageSync(store_key);
      dyn_page_field_models.value = [ ];
      return;
    }
    
    uni.setStorageSync(store_key, dyn_page_model);
    const dyn_page_field = (dyn_page_model.dyn_page_field ?? [ ]) as DynPageFieldModel[];
    dyn_page_field_models.value = dyn_page_field;
    
  }
  
  const stopWatch = watch(
    () => toValue(pagePath),
    async (pagePath) => {
      
      if (!pagePath) {
        dyn_page_field_models.value = [ ];
        return;
      }
      
      const store_key = "useDynPageFields.dyn_page_model:" + pagePath;
      
      // 先尝试从缓存加载
      const dyn_page_model = uni.getStorageSync(store_key) as DynPageModel | null;
      if (dyn_page_model) {
        const dyn_page_field = (dyn_page_model.dyn_page_field ?? [ ]) as DynPageFieldModel[];
        dyn_page_field_models.value = dyn_page_field;
      }
      
      refreshDynPageFields();
      
    },
    {
      immediate: true,
    },
  );
  
  return {
    dyn_page_field_models,
    refreshDynPageFields,
    stop: stopWatch,
  };
}
