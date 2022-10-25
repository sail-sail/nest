<#
const column = columns.find((item) => item.foreignTabs?.length > 0);
const foreignTabs = column?.foreignTabs || [ ];
#><template>
<el-dialog
  v-model="dialogVisible"
  :fullscreen="fullscreen"
  append-to-body
  :close-on-click-modal="false"
  class="custom_dialog large_dialog"
  top="0"
  :before-close="beforeClose"
>
  <template #header>
    <div
      v-draggable
      class="dialog_title"
    >
      <div class="title_lbl">
        <span class="dialogTitle_span">
          {{ dialogTitle }}
        </span>
      </div>
      <el-icon
        class="full_but"
        @click="setFullscreen"
      >
        <FullScreen />
      </el-icon>
    </div>
  </template>
  <div
    flex="~ [1_0_0] col basis-[inherit]"
    overflow-hidden
  >
    <div
      flex="~ [1_0_0] col basis-[inherit]"
      overflow-auto
      p="5"
      justify-start
      items-center
    >
      <el-tabs
        v-model="tabName"
        
        class="el-flex-tabs"
        flex="~ [1_0_0] col"
        w="full"
      ><#
      for (let im = 0; im < foreignTabs.length; im++) {
        const item = foreignTabs[im];
        const itemTable = item.table;
        const itemTableUp = itemTable.substring(0,1).toUpperCase() + itemTable.substring(1);
      #>
        
        <el-tab-pane
          lazy
          :label="'<#=item.label#>' + (<#=itemTable#>Total != null ? ` (${ <#=itemTable#>Total })` : '')"
          name="<#=item.label#>"
        >
          <<#=itemTableUp#>List
            :<#=item.column#>="dialogModel.id"
            @add="useAllFindDebounce"
            @remove="useAllFindDebounce"
            @revert="useAllFindDebounce"
          ></<#=itemTableUp#>List>
        </el-tab-pane><#
        }
        #>
        
      </el-tabs>
    </div>
    <div
      p="y-2.5"
      flex
      justify-center
      items-center
    >
      
      <el-button
        plain
        @click="cancelClk"
      >
        <template #icon>
          <CircleClose />
        </template>
        <span>关闭</span>
      </el-button>
      
    </div>
  </div>
</el-dialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElTabs,
  ElTabPane,
  ElIcon,
  ElButton,
} from "element-plus";

import {
  CircleClose,
  FullScreen,
} from "@element-plus/icons-vue";

import { useFullscreenEfc } from "@/compositions/fullscreen";<#
for (let im = 0; im < foreignTabs.length; im++) {
  const item = foreignTabs[im];
  const itemTable = item.table;
  const itemTableUp = itemTable.substring(0,1).toUpperCase() + itemTable.substring(1);
#>

import <#=itemTableUp#>List from "@/views/<#=itemTable#>/List.vue";

import {
  findCount as findCount<#=itemTableUp#>,
} from "@/views/<#=itemTable#>/Api";<#
}
#>

let inited = $ref(false);
let { fullscreen, setFullscreen } = $(useFullscreenEfc());

let dialogTitle = $ref("关联列表");
let dialogVisible = $ref(false);
let dialogAction = $ref("list");

let dialogModel = $ref<{
  id: string | undefined,
}>({
  id: undefined,
});

let tabName = $ref("<#=foreignTabs[0]?.label || ""#>");<#
for (let im = 0; im < foreignTabs.length; im++) {
  const item = foreignTabs[im];
  const itemTable = item.table;
  const itemTableUp = itemTable.substring(0,1).toUpperCase() + itemTable.substring(1);
#>

let <#=itemTable#>Total = $ref<number>();

async function useFindCount<#=itemTableUp#>() {
  const <#=item.column#> = [ dialogModel.id! ];
  <#=itemTable#>Total = await findCount<#=itemTableUp#>(
    {
      <#=item.column#>,
    },
  );
}<#
}
#>

async function useAllFindCount() {
  await Promise.all([<#
    for (let im = 0; im < foreignTabs.length; im++) {
      const item = foreignTabs[im];
      const itemTable = item.table;
      const itemTableUp = itemTable.substring(0,1).toUpperCase() + itemTable.substring(1);
    #>
    useFindCount<#=itemTableUp#>(),<#
    }
    #>
  ]);
}

let findTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

function useAllFindDebounce() {
  clearTimeout(findTimeout);
  findTimeout = setTimeout(useAllFindCount, 0);
}

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(value: OnCloseResolveType) { };

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    model?: {
      id?: string;
      ids?: string[];
    };
    action?: "list";
  },
) {
  inited = false;
  dialogVisible = true;
  const dialogPrm = new Promise<OnCloseResolveType>((resolve) => {
    onCloseResolve = function(arg: OnCloseResolveType) {
      dialogVisible = false;
      resolve(arg);
    };
  });
  const title = arg?.title;
  const model = arg?.model;
  const action = arg?.action;
  dialogAction = action || "list";
  if (title) {
    dialogTitle = title;
  }
  if (dialogAction === "list") {
    dialogModel.id = model?.id;
    await useAllFindCount();
  }
}

/** 点击取消关闭按钮 */
function cancelClk() {
  onCloseResolve({
    type: "cancel",
  });
}


async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({ showDialog });
</script>
