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
        v-model="dyn_page_data_input"
        :label-width="180"
        :rules="form_rules"
        @submit="onSave"
      >
        
      </tm-form>
      
    </view>
    
    <view
      un-p="t-[350px]"
      un-box-border
    ></view>
    
  </scroll-view>
  
  <view
    v-if="dialogAction !== 'view'"
    un-p="x-2 b-2"
    un-box-border
    un-flex="~"
    un-justify="center"
    un-items="center"
    un-gap="x-4"
  >
    
    <tm-drawer
      v-model:show="operationDrawerShow"
      title="操作"
      un-w="full"
      :show-close="true"
      :show-footer="true"
      size="auto"
    >
      
      <template #trigger>
        <tm-button
          block
          color="info"
          @click="operationDrawerShow = true"
        >
          <view
            un-flex="~"
            un-justify="center"
            un-items="center"
          >
            
            <view>
              操作
            </view>
            
            <view
              un-i="iconfont-caret_top"
            ></view>
            
          </view>
        </tm-button>
      </template>
      
      <template #footer>
        <tm-button
          block
          color="info"
          @click="operationDrawerShow = false;"
        >
          <view
            un-flex="~"
            un-justify="center"
            un-items="center"
            un-gap="x-1"
          >
            
            <view>
              关闭
            </view>
            
            <view
              un-i="iconfont-caret_bottom"
            ></view>
            
          </view>
        </tm-button>
      </template>
      
      <view
        un-p="4"
        un-box-border
        un-w="full"
        un-flex="~ col"
        un-gap="y-4"
      >
        <template
          v-if="dialogAction === 'edit'"
        >
          <tm-button
            v-if="dyn_page_data_model?. === DynPageDataAudit.Unaudited"
            block
            @click="operationDrawerShow = false; onAuditPass();"
          >
            审核通过
          </tm-button>
          
          <tm-button
            v-if="dyn_page_data_model?. === DynPageDataAudit.Unaudited"
            block
            color="danger"
            @click="operationDrawerShow = false; onAuditReject();"
          >
            审核拒绝
          </tm-button>
          
          <tm-button
            v-if="dyn_page_data_model?. === DynPageDataAudit.Unsubmited || dyn_page_data_model?. === DynPageDataAudit.Rejected"
            block
            @click="operationDrawerShow = false; onAuditSubmit();"
          >
            审核提交
          </tm-button>
          
          <tm-button
            v-if="dyn_page_data_model?. === DynPageDataAudit.Audited || dyn_page_data_model?. === DynPageDataAudit.Reviewed"
            block
            color="warn"
            @click="operationDrawerShow = false; onAuditReverse();"
          >
            反审核
          </tm-button>
          
          <CustomDivider
            :show-text="false"
            un-p="y-0 x-0"
          ></CustomDivider>
          
        </template>
        
        <template
          v-if="dialogAction === 'edit'"
        >
        
          <tm-button
            block
            color="info"
            @click="onCopy"
          >
            复制
          </tm-button>
          
          <tm-button
            :disabled="!inited || is_form_hydrating"
            block
            @click="operationDrawerShow = false; formRef?.submit();"
          >
            编辑
          </tm-button>
          
        </template>
        
        <template
          v-if="dialogAction === 'copy' || dialogAction === 'add'"
        >
          
          <tm-button
            :disabled="!inited || is_form_hydrating"
            block
            @click="formRef?.submit()"
          >
            新增
          </tm-button>
          
        </template>
        
      </view>
      
    </tm-drawer>
    
  </view>
  
  <AppLoading></AppLoading>
  
</view>
</template>

<script setup lang="ts">
import {
  findOneDynPageData,
  createDynPageData,
  updateByIdDynPageData,
  getDefaultInputDynPageData,
  intoInputDynPageData,
} from "./Api.ts";

import {
} from "./Api.ts";

import TmForm from "@/uni_modules/tm-ui/components/tm-form/tm-form.vue";

let inited = $ref(false);

let dyn_page_data_id = $ref<DynPageDataId>();

let dyn_page_data_input = $ref<DynPageDataInput>({ });
let dyn_page_data_model = $ref<DynPageDataModel>();

const form_rules: Record<string, TM.FORM_RULE[]> = {
};

type ActionType = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<ActionType>("add");
let isReadonly = $ref(false);

watch(
  () => dialogAction,
  () => {
    if (dialogAction === "view") {
      isReadonly = true;
    }
  },
  {
    immediate: true,
  },
);

const formRef = $ref<InstanceType<typeof TmForm>>();
let is_form_hydrating = $ref(false);

let operationDrawerShow = $ref(false);

/** 复制 */
async function onCopy() {
  if (!dyn_page_data_id) {
    return;
  }
  uni.redirectTo({
    url: `/pages/dyn_page_data/Detail?dyn_page_data_id=${ encodeURIComponent(dyn_page_data_id) }&action=copy`,
  });
}

/** 保存 */
async function onSave(
  formSubmitResult?: TM.FORM_SUBMIT_RESULT,
) {
  if (dialogAction === "view") {
    return;
  }
  if (!inited || is_form_hydrating) {
    return;
  }
  if (formSubmitResult?.isPass === false) {
    const firstValid = formSubmitResult.firstValid;
    if (firstValid) {
      uni.showToast({
        title: firstValid.message,
        icon: "none",
      });
    }
    return;
  }
  
  if (props.beforeSave) {
    const canSave = await props.beforeSave(dyn_page_data_input);
    if (!canSave) {
      return;
    }
  }
  
  if (dialogAction === "copy" || dialogAction === "add") {
    await createDynPageData(
      dyn_page_data_input,
    );
    await uni.showModal({
      content: "新增成功",
      showCancel: false,
    });
    await uni.navigateBack();
    uni.$emit("/pages/dyn_page_data/List:refresh");
  } else if (dialogAction === "edit") {
    if (!dyn_page_data_id) {
      uni.showToast({
        title: "修改失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    await updateByIdDynPageData(
      dyn_page_data_id,
      dyn_page_data_input,
    );
    await uni.showModal({
      content: "修改成功",
      showCancel: false,
    });
    await uni.navigateBack();
    uni.$emit("/pages/dyn_page_data/List:refresh");
  }
  
}

/** 审核提交 */
async function onAuditSubmit() {
  if (!dyn_page_data_id) {
    return;
  }
  const { confirm } = await uni.showModal({
    title: "审核提交",
    content: "确定要审核提交吗",
    showCancel: true,
  });
  if (!confirm) {
    return;
  }
  await auditSubmitDynPageData(dyn_page_data_id);
  await uni.showModal({
    content: "审核提交成功",
    showCancel: false,
  });
  await onRefresh();
  uni.$emit("/pages/dyn_page_data/List:refresh");
}

/** 反审核 */
async function onAuditReverse() {
  if (!dyn_page_data_id) {
    return;
  }
  const { confirm } = await uni.showModal({
    title: "反审核",
    content: "确认要反审核吗",
    showCancel: true,
  });
  if (!confirm) {
    return;
  }
  await auditReverseDynPageData(dyn_page_data_id);
  await uni.showModal({
    content: "反审核成功",
    showCancel: false,
  });
  await onRefresh();
  uni.$emit("/pages/dyn_page_data/List:refresh");
}

/** 审核通过 */
async function onAuditPass() {
  if (!dyn_page_data_id) {
    return;
  }
  const { confirm } = await uni.showModal({
    title: "审核通过",
    content: "确定要审核通过吗",
    showCancel: true,
  });
  if (!confirm) {
    return;
  }
  await auditPassDynPageData(dyn_page_data_id);
  await uni.showModal({
    content: "审核通过成功",
    showCancel: false,
  });
  await onRefresh();
  uni.$emit("/pages/dyn_page_data/List:refresh");
}

/** 审核拒绝 */
async function onAuditReject() {
  if (!dyn_page_data_id) {
    return;
  }
  const { confirm, content } = await uni.showModal({
    title: "审核拒绝",
    content: "请输入原因",
    editable: true,
    placeholderText: "请输入原因",
  });
  if (!confirm) {
    return;
  }
  const rem = (content || "").trim();
  if (!rem) {
    uni.showToast({
      title: "请输入原因",
      icon: "none",
    });
    return;
  }
  await auditRejectDynPageData(dyn_page_data_id, {
    rem,
  } as any);
  await uni.showModal({
    content: "审核拒绝成功",
    showCancel: false,
  });
  await onRefresh();
  uni.$emit("/pages/dyn_page_data/List:refresh");
}



/** 刷新 */
async function onRefresh() {
  is_form_hydrating = true;
  try {
    formRef?.resetValidation();
    if (dialogAction === "add") {
      dyn_page_data_input = await getDefaultInputDynPageData();
    } else if (dialogAction === "copy") {
      if (!dyn_page_data_id) {
        uni.showToast({
          title: "复制失败, id 不能为空",
          icon: "none",
        });
        return;
      }
      dyn_page_data_model = await findOneModel(
        {
          id: dyn_page_data_id,
          is_deleted: 0,
        },
        undefined,
        {
          notLoading: true,
        },
      );
      if (!dyn_page_data_model) {
        uni.showToast({
          title: "动态页面数据 已被删除",
          icon: "none",
        });
      }
      dyn_page_data_input = intoInputDynPageData(
        dyn_page_data_model,
      );
    } else if (dialogAction === "edit" || dialogAction === "view") {
      dyn_page_data_model = await findOneModel(
        {
          id: dyn_page_data_id,
          is_deleted: 0,
        },
        undefined,
        {
          notLoading: true,
        },
      );
      if (!dyn_page_data_model) {
        uni.showToast({
          title: "动态页面数据 已被删除",
          icon: "none",
        });
      }
      dyn_page_data_input = intoInputDynPageData(
        dyn_page_data_model,
      );
    }
  } finally {
    await nextTick();
    is_form_hydrating = false;
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
    dyn_page_data_id?: DynPageDataId;
    findOne?: typeof findOneDynPageData;
    beforeSave?: (input: DynPageDataInput) => Promise<boolean>;
  }>(),
  {
    init: true,
    action: undefined,
    dyn_page_data_id: undefined,
    findOne: undefined,
    beforeSave: undefined,
  },
);

let findOneModel: typeof findOneDynPageData = findOneDynPageData;

watch(
  () => [
    props.action,
    props.dyn_page_data_id,
    props.findOne,
  ],
  () => {
    if (props.action) {
      dialogAction = props.action;
    }
    if (props.dyn_page_data_id) {
      dyn_page_data_id = props.dyn_page_data_id;
    }
    if (props.findOne) {
      findOneModel = props.findOne;
    } else {
      findOneModel = findOneDynPageData;
    }
  },
  {
    immediate: true,
  },
);

onLoad(async function(query?: AnyObject) {
  const dyn_page_data_id_str = query?.dyn_page_data_id;
  const action = query?.action;
  if (action === "add") {
    dialogAction = "add";
  } else if (action === "copy") {
    dialogAction = "copy";
  } else if (action === "edit") {
    dialogAction = "edit";
  }
  if (dyn_page_data_id_str) {
    dyn_page_data_id = decodeURIComponent(dyn_page_data_id_str) as DynPageDataId | undefined;
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
