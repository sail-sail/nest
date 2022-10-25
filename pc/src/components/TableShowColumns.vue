<template>
<el-dropdown
  ref="dropdownRef"
  trigger="click"
  :hide-on-click="false"
  @command="handleCommand"
>
  <el-button>
    <slot></slot>
    <el-icon class="el-icon--right">
      <arrow-down />
    </el-icon>
  </el-button>
  <template #dropdown>
    <el-dropdown-menu
      v-if="props.tableColumns && props.tableColumns.length > 0"
      style="min-width: 100px;white-space: nowrap;"
    >
      <el-dropdown-item
        :command="{ action: 'reset' }"
      >
        <el-icon>
          <RefreshLeft></RefreshLeft>
        </el-icon>
        <span>
          还原
        </span>
      </el-dropdown-item>
      <el-dropdown-item
        v-for="(item, i) in props.tableColumns"
        :key="item.prop"
        :divided="i === 0"
        :command="{ action: 'item', item }"
      >
        <el-icon>
          <Select v-if="!item.hide"></Select>
        </el-icon>
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </template>
</el-dropdown>
</template>

<script setup lang="ts">
import {
  ElButton,
  ElIcon,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from "element-plus";

import {
  ArrowDown,
  Select,
  RefreshLeft,
} from "@element-plus/icons-vue";

interface ColumnType {
  prop: string,
  label: string,
  hide?: boolean,
  width?: string|number,
}

const emit = defineEmits([
  "storeColumns",
  "resetColumns",
]);

const props = withDefaults(
  defineProps<{
    tableColumns: ColumnType[];
  }>(),
  {
    tableColumns: undefined,
  },
);

let dropdownRef: typeof ElDropdown = $ref();

function handleCommand(command: { action: "reset"|"item", item?: ColumnType }) {
  const action = command.action;
  if (action === "reset") {
    if (dropdownRef) {
      dropdownRef.handleClose();
    }
    emit("resetColumns");
  } else {
    let tableColumns = [ ...props.tableColumns ];
    const item = command.item;
    if (!item) {
      return;
    }
    const idx = tableColumns.indexOf(item);
    if (item) {
      tableColumns[idx] = { ...item, hide: !item.hide };
    }
    emit("storeColumns", tableColumns);
  }
}
</script>
