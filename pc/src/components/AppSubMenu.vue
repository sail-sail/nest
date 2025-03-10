<template>
<template
  v-for="item in menus"
  :key="item.id"
>
  <el-sub-menu
    v-if="!item.route_path && item._isShow !== false"
    :index="item.id"
    :show-timeout="0"
    :hide-timeout="0"
  >
    <template #title>
      <el-icon>
        <ElIconFolderOpened v-if="openedIndex.includes(item.id)" />
        <ElIconFolder v-else />
      </el-icon>
      <span>{{ item.lbl }}</span>
    </template>
    <AppSubMenu
      v-if="item.children"
      :children="(item.children as MenuModel[])"
      :opened-index="openedIndex"
      :lvl="lvl"
    ></AppSubMenu>
  </el-sub-menu>
  <el-menu-item
    v-else-if="item._isShow !== false"
    :index="item.id"
    :route="{ path: item.route_path }"
    :class="{ top_menu_item: lvl === 1 }"
  >
    <el-icon v-if="lvl > 0">
      <ElIconDocument />
    </el-icon>
    <span>
      {{ item.route_path ? "" : "-" }}
      {{ item.lbl }}
    </span>
  </el-menu-item>
</template>
</template>

<script setup lang="ts">
import type {
  MenuModel as MenuModel0,
} from "#/types";

type MenuModel = MenuModel0 & {
  children: MenuModel[];
  _isShow?: boolean;
}

const props = withDefaults(
  defineProps<{
    children?: MenuModel[];
    openedIndex?: MenuId[];
    lvl?: number;
  }>(),
  {
    children: () => [ ],
    openedIndex: () => [ ],
    lvl: 0,
  },
);

const menus = $ref(toRef(props, "children"));
const openedIndex = $ref(toRef(props, "openedIndex"));
let lvl = $ref(props.lvl);
lvl++;

</script>

<style lang="scss" scoped>
.top_menu_item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0;
  padding-bottom: 0;
  height: 40px;
}
</style>
