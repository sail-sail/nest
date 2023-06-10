<#
const column = columns.find((item) => item.foreignTabs?.length > 0);
const foreignTabs = column?.foreignTabs || [ ];
#><template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  click-modal-close
>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-overflow-auto
      un-p="x-2"
      un-justify-start
      un-items-center
    >
      <el-tabs
        v-model="tabName"
        type="card"
        class="el-flex-tabs"
        un-flex="~ [1_0_0] col"
        un-w="full"
      ><#
      for (let im = 0; im < foreignTabs.length; im++) {
        const item = foreignTabs[im];
        const itemTable = item.table;
        const itemTableUp = itemTable.substring(0,1).toUpperCase() + itemTable.substring(1);
      #>
        
        <el-tab-pane
          lazy
          :label="'<#=item.label#>' + (<#=itemTable#>Total ? ` (${ <#=itemTable#>Total })` : '')"
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
      un-p="y-2.5"
      un-flex
      un-justify-center
      un-items-center
    >
      
      <el-button
        plain
        @click="cancelClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ n("关闭") }}</span>
      </el-button>
      
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup><#
for (let im = 0; im < foreignTabs.length; im++) {
  const item = foreignTabs[im];
  const itemTable = item.table;
  const itemTableUp = itemTable.substring(0,1).toUpperCase() + itemTable.substring(1);
#>

import <#=itemTableUp#>List from "@/views/<#=item.mod#>/<#=itemTable#>/List.vue";

import {
  findCount as findCount<#=itemTableUp#>,
} from "@/views/<#=item.mod#>/<#=itemTable#>/Api";<#
}
#>

const {
  n,
  initI18ns,
} = useI18n("/<#=mod#>/<#=table#>");

let inited = $ref(false);

let dialogAction = $ref<"list">("list");

let dialogModel = $ref<{
  id?: string,
}>({ });

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

let onCloseResolve = function(_value: OnCloseResolveType) { };

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    model?: {
      id?: string;
    };
    action?: typeof dialogAction;
  },
) {
  inited = false;
  const title = arg?.title || n("关联列表");
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "large",
    title,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  dialogAction = action || "list";
  if (dialogAction === "list") {
    dialogModel.id = model?.id;
    await useAllFindCount();
  }
  inited = true;
  return await dialogRes.dialogPrm;
}

/** 初始化ts中的国际化信息 */
async function initI18nsEfc() {
  const {
    initI18ns,
  } = useI18n();
  const codes: string[] = [
    "关联列表",
  ];
  await initI18ns(codes);
}
initI18nsEfc();

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
