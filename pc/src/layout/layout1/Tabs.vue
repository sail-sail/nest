<template>
<div
  ref="tabs_divRef"
>
  <div
    v-for="(item, i) in tabs"
    :key="item.path"
    class="tab_div"
    :class="{ tab_active: item.active, tab_fixed: item.fixed }"
    @click="activeTab(item)"
    @dblclick="onClose(item)"
  >
    <el-dropdown
      ref="dropdownRef"
      trigger="contextmenu"
      @command="menuCommand($event, item)"
      @visible-change="visibleChange($event, i)"
    >
      <template #default>
        <div
          :class="{
            tab_label: !item?.icon,
            tab_icon: item?.icon,
          }"
          :title="item.lbl"
        >
          <div
            v-if="!item?.icon"
            class="tab_label"
          >
            <span>
              {{ item.lbl }}
            </span>
          </div>
          <div
            v-else-if="item?.icon && (item?.icon === 'iconfont-home-fill' && !config.indexIsEmpty)"
            class="tab_icon"
            :style="{
              paddingLeft: item.closeable !== false ? '6px' : undefined,
            }"
            un-box-border
          >
            <el-icon
              size="20"
            >
              <i
                v-if="item?.icon === 'iconfont-home-fill'"
                un-i="iconfont-home-fill"
              ></i>
            </el-icon>
          </div>
        </div>
      </template>
      <template #dropdown>
        <el-dropdown-menu>
          
          <el-dropdown-item
            command="close"
          >
            关闭
          </el-dropdown-item>
          
          <el-dropdown-item
            command="closeOther"
            :disabled="tabs.length <= 1"
          >
            关闭其他
          </el-dropdown-item>
          
          <el-dropdown-item
            command="closeAll"
          >
            全部关闭
          </el-dropdown-item>
          
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div
      v-if="item.closeable !== false"
      class="tab_close_div"
    >
      <ElIconClose
        class="tab_close"
        @click.stop="onClose(item)"
      />
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import type {
  TabInf,
} from "@/store/tabs";

import type {
  SortableEvent,
} from "sortablejs";

import Sortable from "sortablejs";

import config from "@/utils/config";

const router = useRouter();
const tabsStore = useTabsStore();

const emit = defineEmits<{
  (e: "refreshActive_line"): void;
  (e: "refreshScrollVisible"): void;
}>();

const props = withDefaults(
  defineProps<{
    tabs?: TabInf[ ],
  }>(),
  {
    tabs: () => [ ],
  },
);

const tabs_divRef = $ref<HTMLDivElement>();

const tabs = $ref(toRef(props, "tabs"));

async function activeTab(tab: TabInf) {
  tabsStore.activeTab(tab);
  await router.push({
    path: tab.path,
    query: tab.query,
  });
}

async function onClose(tab: TabInf) {
  await tabsStore.removeTab(tab);
  if (tabsStore.actTab) {
    await activeTab(tabsStore.actTab);
  }
}

async function menuCommand(command: string, tab: TabInf) {
  switch (command) {
    case "close":
      await onClose(tab);
      break;
    case "closeOther":
      await tabsStore.closeOtherTabs(tab);
      break;
    case "closeAll":
      await tabsStore.closeOtherTabs();
      break;
  }
}

const dropdownRef = $ref<InstanceType<typeof ElDropdown>[]>([ ]);

function visibleChange(visible: boolean, index: number) {
  if (!visible) {
    return;
  }
  for (let i = 0; i < dropdownRef.length; i++) {
    const dropdownRefItem = dropdownRef[i];
    if (i === index) {
      continue;
    }
    dropdownRefItem.handleClose();
  }
}

function initTabsSort() {
  if (!tabs_divRef) {
    return;
  }
  Sortable.create(
    tabs_divRef,
    {
      animation: 150,
      async onEnd(event: SortableEvent) {
        const { oldIndex, newIndex } = event;
        if (oldIndex == null || newIndex == null) {
          return;
        }
        await tabsStore.moveTab(oldIndex, newIndex);
        await activeTab(tabsStore.tabs[newIndex]);
        if (oldIndex !== newIndex) {
          emit("refreshActive_line")
        }
      },
      filter(_, el?: HTMLElement) {
        if (!el) {
          return true;
        }
        if (el.classList.contains("tab_fixed")) {
          return true;
        }
        if (!el.classList.contains("tab_div")) {
          return true;
        }
        return false;
      },
    },
  );
}

onMounted(function() {
  initTabsSort();
});

useResizeObserver($$(tabs_divRef), function() {
  emit("refreshScrollVisible");
});

defineExpose({ tabs_divRef: $$(tabs_divRef) });
</script>

<style lang="scss" scoped>
.tab_div {
  display: flex;
  position: relative;
  cursor: default;
  padding-left: 6px;
  padding-right: 6px;
}
.tab_div:hover {
  transition: width 1s;
  background-color: var(--el-menu-hover-bg-color);
  .tab_close {
    opacity: 1;
  }
}
.tab_active {
  background-color: var(--el-menu-hover-bg-color);
  .tab_label {
    color: var(--el-menu-active-color);
  }
  .tab_close {
    opacity: 1;
    color: var(--el-menu-active-color);
  }
}
.tab_label {
  min-width: 80px;
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
}
.tab_icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
.tab_close_div {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 3px;
  margin-right: -3px;
  width: 15px;
  height: 15px;
}
.tab_close {
  opacity: 0;
  transition: opacity .5s,background-color .5s;
  font-size: 13px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 50%;
}
.tab_close:hover {
  color: red;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
