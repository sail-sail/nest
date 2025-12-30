<template>
<view
  un-flex="~ [1_0_0] col"
  un-overflow="hidden"
  un-relative
>
  
  <scroll-view
    un-flex="~ [1_0_0] col"
    un-overflow="hidden"
    scroll-y
    enable-back-to-top
    enable-flex
  >
    
    <view
      un-m="x-1"
    >
      
      <tm-form
        ref="formRef"
        v-model="dyn_page_input"
        :label-width="180"
        :rules="form_rules"
        @submit="onSave"
      >
        
        <!-- 路由 -->
        <tm-form-item
          label="路由"
          name="code"
          :required="false"
        >
          <CustomInput
            v-model="dyn_page_input.code"
            placeholder="请输入 路由"
          ></CustomInput>
        </tm-form-item>
        
        <!-- 名称 -->
        <tm-form-item
          label="名称"
          name="lbl"
        >
          <CustomInput
            v-model="dyn_page_input.lbl"
            placeholder="请输入 名称"
          ></CustomInput>
        </tm-form-item>
        
        <!-- 父菜单 -->
        <tm-form-item
          label="父菜单"
          name="parent_menu_id"
          :required="false"
        >
          <CustomSelectModal
            v-model="dyn_page_input.parent_menu_id"
            placeholder="请选择 父菜单"
            :method="getListMenu"
          ></CustomSelectModal>
        </tm-form-item>
        
        <!-- 所属角色 -->
        <tm-form-item
          label="所属角色"
          name="role_ids"
          :required="false"
        >
          <CustomSelectModal
            v-model="dyn_page_input.role_ids"
            placeholder="请选择 所属角色"
            :method="getListRole"
            multiple
          ></CustomSelectModal>
        </tm-form-item>
        
        <!-- 排序 -->
        <tm-form-item
          label="排序"
          name="order_by"
        >
          <CustomInput
            v-model="dyn_page_input.order_by"
            type="number"
            placeholder="请输入 排序"
          ></CustomInput>
        </tm-form-item>
        
        <!-- 备注 -->
        <tm-form-item
          label="备注"
          name="rem"
          :required="false"
        >
          <CustomInput
            v-model="dyn_page_input.rem"
            type="textarea"
            height="120"
            placeholder="请输入 备注"
          ></CustomInput>
        </tm-form-item>
        
      </tm-form>
      
    </view>
    
    <!-- 选项卡 -->
    <view
      un-m="x-1"
    >
      <tm-tabs
        v-model="inlineForeignTabIdx"
        color=""
        :list="[
          '动态页面字段',
        ]"
      ></tm-tabs>
    </view>
    
    <!-- 动态页面字段 -->
    <view
      v-if="inlineForeignTabIdx === 0"
      un-m="x-1"
    >
      
      <view
        un-sticky
        un-top="-.5"
        un-bg="[var(--page-bg)]"
        un-z="3"
      >
        
        <!-- 操作栏 -->
        <view
          un-flex="~"
        >
          
          <view
            un-flex="[1_0_0]"
            un-overflow="hidden"
          ></view>
          
          <view
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            :class="{
              'text-gray-500': index_selected_dyn_page_field.length > 0,
              'text-gray-300': index_selected_dyn_page_field.length === 0,
            }"
            @click="onUpDynPageField"
          >
            <view
              un-i="iconfont-arrow_up"
            ></view>
          </view>
          
          <view
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            :class="{
              'text-gray-500': index_selected_dyn_page_field.length > 0,
              'text-gray-300': index_selected_dyn_page_field.length === 0,
            }"
            @click="onDownDynPageField"
          >
            <view
              un-i="iconfont-arrow_down"
            ></view>
          </view>
          
          <view
            un-text="[var(--color-primary)]"
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            @click="onAddDynPageField"
          >
            新增
          </view>
          
          <view
            un-text="[var(--color-primary)]"
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            @click="onEditDynPageField"
          >
            编辑
          </view>
          
          <view
            un-text="red"
            un-p="x-2 y-2"
            un-box-border
            un-cursor="pointer"
            @click="onDeleteDynPageField"
          >
            删除
          </view>
          
        </view>
        
        <!-- 表头 -->
        <view
          un-flex="~ none"
          un-h="10"
          un-items="center"
          un-text="gray-600"
          un-b="0 solid gray-200 b-1"
        >
          
          <!-- 全选 -->
          <view
            un-w="10"
            un-h="full"
            un-flex="~"
            un-justify="center"
            un-items="center"
          >
            <tm-checkbox
              :show-label="false"
              :model-value="dyn_page_input?.dyn_page_field?.length && index_selected_dyn_page_field.length === dyn_page_input?.dyn_page_field?.length"
              @update:model-value="onSelectAllDynPageField($event, dyn_page_input?.dyn_page_field?.length || 0)"
            ></tm-checkbox>
          </view>
          
          <!-- 编码 -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            编码
          </view>
          
          <!-- 名称 -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            名称
          </view>
          
          <!-- 类型 -->
          <view
            un-h="full"
            un-flex="~ [1_0_auto]"
            un-justify="center"
            un-items="center"
          >
            类型
          </view>
          
        </view>
        
      </view>
        
      <view
        v-if="!inited"
        un-m="t-14"
        un-flex="~"
        un-justify="center"
        un-text="gray-500"
      >
        加载中, 请稍后...
      </view>
          
      <view
        v-else-if="!dyn_page_input?.dyn_page_field?.length"
        un-m="t-14"
        un-flex="~"
        un-justify="center"
        un-text="gray-500"
      >
        (暂无动态页面字段)
      </view>
      
      <!-- 数据行 -->
      <view
        v-for="(dyn_page_field, index) of dyn_page_input?.dyn_page_field || [ ]"
        :key="index"
        un-flex="~ none"
        un-h="12"
        un-items="center"
        un-text="gray-600"
        un-b="0 solid transparent b-1"
        :style="{
          'padding-top': index === 0 ? '8rpx' : '0',
          'border-color': index_selected_dyn_page_field.includes(index) ? 'var(--color-primary)' : undefined,
        }"
      >
        
        <!-- 勾选框 -->
        <view
          un-w="10"
          un-h="full"
          un-flex="~"
          un-justify="center"
          un-items="center"
        >
          <tm-checkbox
            :show-label="false"
            :model-value="index_selected_dyn_page_field.includes(index)"
            @update:model-value="onSelectDynPageField($event, index)"
          ></tm-checkbox>
        </view>
        
        <!-- 编码 -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-items="center"
          un-break="all"
          @click="onRowDynPageField(index)"
        >
          {{ dyn_page_field.code }}
        </view>
        
        <!-- 名称 -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-items="center"
          un-break="all"
          @click="onRowDynPageField(index)"
        >
          {{ dyn_page_field.lbl }}
        </view>
        
        <!-- 类型 -->
        <view
          un-h="full"
          un-flex="~ [1_0_0]"
          un-overflow="hidden"
          un-items="center"
          un-break="all"
          @click="onRowDynPageField(index)"
        >
          {{ dyn_page_field.type }}
        </view>
        
      </view>
      
    </view>
    
    <view
      un-p="t-[350px]"
      un-box-border
    ></view>
    
  </scroll-view>
  
  <view
    un-p="x-2 b-2"
    un-box-border
    un-flex="~"
    un-justify="center"
    un-items="center"
    un-gap="x-4"
  >
    
    <view
      v-if="dialogAction === 'edit' && dyn_page_id"
      un-flex="1"
    >
      <tm-button
        block
        color="info"
        @click="onCopy"
      >
        复制
      </tm-button>
    </view>
    
    <view
      un-flex="1"
    >
      <tm-button
        :disabled="!inited"
        block
        @click="formRef?.submit()"
      >
        确定
      </tm-button>
    </view>
    
  </view>
  
  <AppLoading></AppLoading>
  
  <!-- 动态页面字段 -->
  <DynPageFieldDetailModal
    ref="dyn_page_field_detail_modal_ref"
  ></DynPageFieldDetailModal>
  
</view>
</template>

<script setup lang="ts">
import {
  findOneDynPage,
  createDynPage,
  updateByIdDynPage,
  getDefaultInputDynPage,
  intoInputDynPage,
} from "./Api.ts";

import {
  getListMenu,
  getListRole,
} from "./Api.ts";

import TmForm from "@/uni_modules/tm-ui/components/tm-form/tm-form.vue";

// 动态页面字段
import DynPageFieldDetailModal from "@/pages/dyn_page_field/DetailModal.vue";

let inited = $ref(false);

let dyn_page_id = $ref<DynPageId>();

let dyn_page_input = $ref<DynPageInput>({ });
let dyn_page_model = $ref<DynPageModel>();

const form_rules: Record<string, TM.FORM_RULE[]> = {
  lbl: [
    {
      required: true,
      message: "请输入 名称",
    },
  ],
  order_by: [
    {
      required: true,
      message: "请输入 排序",
    },
  ],
};

type ActionType = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<ActionType>("add");

const formRef = $ref<InstanceType<typeof TmForm>>();

/** 复制 */
async function onCopy() {
  if (!dyn_page_id) {
    return;
  }
  uni.redirectTo({
    url: `/pages/dyn_page/Detail?dyn_page_id=${ encodeURIComponent(dyn_page_id) }&action=copy`,
  });
}

/** 保存 */
async function onSave(
  formSubmitResult?: TM.FORM_SUBMIT_RESULT,
) {
  if (!inited) {
    return;
  }
  if (formSubmitResult?.isPass === false) {
    return;
  }
  
  if (props.beforeSave) {
    const canSave = await props.beforeSave(dyn_page_input);
    if (!canSave) {
      return;
    }
  }
  
  if (dialogAction === "copy" || dialogAction === "add") {
    await createDynPage(
      dyn_page_input,
    );
    await uni.navigateBack();
    uni.$emit("/pages/dyn_page/List:refresh");
  } else if (dialogAction === "edit") {
    if (!dyn_page_id) {
      uni.showToast({
        title: "修改失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    await updateByIdDynPage(
      dyn_page_id,
      dyn_page_input,
    );
    await uni.navigateBack();
    uni.$emit("/pages/dyn_page/List:refresh");
  }
  
}

/** 刷新 */
async function onRefresh() {
  formRef?.resetValidation();
  if (dialogAction === "add") {
    dyn_page_input = await getDefaultInputDynPage();
    dyn_page_input.order_by = props.order_by;
  } else if (dialogAction === "copy") {
    if (!dyn_page_id) {
      uni.showToast({
        title: "复制失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    dyn_page_model = await findOneModel(
      {
        id: dyn_page_id,
        is_deleted: 0,
      },
      undefined,
      {
        notLoading: true,
      },
    );
    if (!dyn_page_model) {
      uni.showToast({
        title: "动态页面 已被删除",
        icon: "none",
      });
    }
    dyn_page_input = intoInputDynPage(
      dyn_page_model,
    );
    dyn_page_input.order_by = props.order_by;
  } else if (dialogAction === "edit") {
    dyn_page_model = await findOneModel(
      {
        id: dyn_page_id,
        is_deleted: 0,
      },
      undefined,
      {
        notLoading: true,
      },
    );
    if (!dyn_page_model) {
      uni.showToast({
        title: "动态页面 已被删除",
        icon: "none",
      });
    }
    dyn_page_input = intoInputDynPage(
      dyn_page_model,
    );
  }
}

const inlineForeignTabIdx = $ref<number>(0);

/** 动态页面字段 */
dyn_page_input.dyn_page_field = dyn_page_input.dyn_page_field || [ ];
const inlineForeignTabDynPageField = useInlineForeignTab(
  () => dyn_page_input.dyn_page_field,
);

const index_selected_dyn_page_field = $(inlineForeignTabDynPageField.index_selected);
const onRowDynPageField = inlineForeignTabDynPageField.onRow;
const onUpDynPageField = inlineForeignTabDynPageField.onUp;
const onDownDynPageField = inlineForeignTabDynPageField.onDown;
const onDeleteDynPageField = inlineForeignTabDynPageField.onDelete;
const onSelectDynPageField = inlineForeignTabDynPageField.onSelect;
const onSelectAllDynPageField = inlineForeignTabDynPageField.onSelectAll;

const dyn_page_field_detail_modal_ref = $ref<InstanceType<typeof DynPageFieldDetailModal>>();

/** 新增 */
async function onAddDynPageField() {
  
  if (
    !inited || !dyn_page_field_detail_modal_ref ||
    !dyn_page_model
  ) {
    return;
  }
  
  let order_by = 1;
  if ((dyn_page_model.dyn_page_field?.length || 0) > 0) {
    const max_order_by = Math.max(...dyn_page_model.dyn_page_field.map((it) => it.order_by || 0));
    order_by = max_order_by + 1;
  }
  
  const res = await dyn_page_field_detail_modal_ref.showDialog({
    action: "add",
    title: "新增 动态页面字段",
    model: {
      order_by,
    },
  });
  
  if (res.type === "cancel") {
    return;
  }
  
  const input = res.input;
  
  dyn_page_input.dyn_page_field = dyn_page_input.dyn_page_field || [ ];
  dyn_page_input.dyn_page_field.push(input);
  
  dyn_page_model.dyn_page_field.push({
    ...input,
    is_deleted: 0,
  } as DynPageFieldModel);
  
  dyn_page_model.dyn_page_field.sort((a, b) => (a.order_by || 0) - (b.order_by || 0));
  dyn_page_input = intoInputDynPage(dyn_page_model);
  
}

/** 编辑 */
async function onEditDynPageField() {
  
  if (
    !inited || !dyn_page_field_detail_modal_ref ||
    !dyn_page_model
  ) {
    return;
  }
  
  if (index_selected_dyn_page_field.length > 1) {
    uni.showToast({
      title: "只能单选 动态页面字段",
      icon: "none",
    });
    return;
  }
  if (index_selected_dyn_page_field.length === 0) {
    uni.showToast({
      title: "请选择要编辑的 动态页面字段",
      icon: "none",
    });
    return;
  }
  
  const index = index_selected_dyn_page_field[0];
  
  const res = await dyn_page_field_detail_modal_ref.showDialog({
    action: "edit",
    title: "编辑 动态页面字段",
    findOne: async function(
      search?: DynPageFieldSearch,
      sort?: Sort[],
      opt?: GqlOpt,
    ): Promise<DynPageFieldModel | undefined> {
      return dyn_page_model?.dyn_page_field?.[index];
    },
  });
  
  if (res.type === "cancel") {
    return;
  }
  
  const input = res.input;
  
  dyn_page_input.dyn_page_field = dyn_page_input.dyn_page_field || [ ];
  dyn_page_input.dyn_page_field.splice(index, 1, input);
  
  if (dyn_page_model && dyn_page_model.dyn_page_field) {
    Object.assign(dyn_page_model.dyn_page_field[index], input);
    dyn_page_model.dyn_page_field.sort((a, b) => (a.order_by || 0) - (b.order_by || 0));
    dyn_page_input = intoInputDynPage(dyn_page_model);
  }
  
}

async function initFrame() {
  await onRefresh();
  inited = true;
}

const props = withDefaults(
  defineProps<{
    /** 是否初始化页面, 默认为 true */
    init?: boolean;
    action?: ActionType;
    dyn_page_id?: DynPageId;
    findOne?: typeof findOneDynPage;
    beforeSave?: (input: DynPageInput) => Promise<boolean>;
    order_by?: number;
  }>(),
  {
    init: true,
    action: undefined,
    dyn_page_id: undefined,
    findOne: undefined,
    beforeSave: undefined,
    order_by: undefined,
  },
);

let findOneModel: typeof findOneDynPage = findOneDynPage;

watch(
  () => [
    props.action,
    props.dyn_page_id,
    props.findOne,
  ],
  () => {
    if (props.action) {
      dialogAction = props.action;
    }
    if (props.dyn_page_id) {
      dyn_page_id = props.dyn_page_id;
    }
    if (props.findOne) {
      findOneModel = props.findOne;
    } else {
      findOneModel = findOneDynPage;
    }
  },
  {
    immediate: true,
  },
);

onLoad(async function(query?: AnyObject) {
  const dyn_page_id_str = query?.dyn_page_id;
  const action = query?.action;
  if (action === "add") {
    dialogAction = "add";
  } else if (action === "copy") {
    dialogAction = "copy";
  } else if (action === "edit") {
    dialogAction = "edit";
  }
  if (dyn_page_id_str) {
    dyn_page_id = decodeURIComponent(dyn_page_id_str) as DynPageId | undefined;
    if (!action) {
      dialogAction = "edit";
    }
  }
  await initFrame();
});

async function initOrRefresh() {
  if (!inited) {
    await initFrame();
  } else {
    await onRefresh();
  }
}

defineExpose({
  refresh: initOrRefresh,
});
</script>
