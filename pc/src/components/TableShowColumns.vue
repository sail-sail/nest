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
      <ElIconArrowDown />
    </el-icon>
  </el-button>
  <template #dropdown>
    <el-dropdown-menu
      v-if="props.tableColumns && props.tableColumns.length > 0"
      un-min="w-[100px]"
      un-space-nowrap
    >
      <el-dropdown-item
        :command="{ action: 'reset' }"
      >
        <el-icon>
          <ElIconRefreshLeft />
        </el-icon>
        <span>
          {{ ns("还原") }}
        </span>
      </el-dropdown-item>
      <el-dropdown-item
        v-for="(item, i) in props.tableColumns"
        :key="item.prop"
        :divided="i === 0"
        :command="{ action: 'item', item }"
      >
        <el-icon>
          <ElIconSelect
            v-if="!item.hide"
          />
        </el-icon>
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </template>
</el-dropdown>
</template>

<script setup lang="ts">
const {
  ns,
  // nsAsync,
} = useI18n();

interface ColumnType {
  prop: string,
  label: string,
  hide?: boolean,
  width?: string|number,
}

const emit = defineEmits<{
  (e: "storeColumns", tableColumns: ColumnType[]): void
  (e: "resetColumns"): void
}>();

const props = withDefaults(
  defineProps<{
    tableColumns?: ColumnType[];
  }>(),
  {
    tableColumns: undefined,
  },
);

const dropdownRef = $ref<InstanceType<typeof ElDropdown>>();

function handleCommand(command: { action: "reset"|"item", item?: ColumnType }) {
  const action = command.action;
  if (action === "reset") {
    if (dropdownRef) {
      dropdownRef.handleClose();
    }
    emit("resetColumns");
  } else {
    const tableColumns = [ ...props.tableColumns ?? [ ] ];
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
