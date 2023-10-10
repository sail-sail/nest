<template>
<tm-app
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  
  <CustomForm
    ref="formRef"
    v-model="model"
    :label-width="200"
  >
    
    <CustomFormItem
      label="发放月份"
      field="pay_month"
    >
      <view
        un-h="32px"
        un-flex="~"
        un-items="center"
      >
        {{ model.pay_month_lbl }}
      </view>
    </CustomFormItem>
    
    <CustomFormItem
      label="姓名"
      field="lbl"
    >
      <CustomInput
        v-model="model.lbl"
        :readonly="true"
      >
      </CustomInput>
    </CustomFormItem>
    
    <CustomFormItem
      label="工号"
      field="job_num"
    >
      <CustomInput
        v-model="model.job_num"
        :readonly="true"
      >
      </CustomInput>
    </CustomFormItem>
    
    <CustomFormItem
      label="公司"
      field="company"
    >
      <CustomInput
        v-model="model.company"
        :readonly="true"
      >
      </CustomInput>
    </CustomFormItem>
    
    <CustomFormItem
      label="应发工资(元)"
      field="gross_pay"
    >
      <CustomInput
        v-model="model.gross_pay"
        :readonly="true"
      >
      </CustomInput>
    </CustomFormItem>
    
    <CustomFormItem
      label="代缴社保(元)"
      field="social_security"
    >
      <CustomInput
        v-model="model.social_security"
        :readonly="true"
      >
      </CustomInput>
    </CustomFormItem>
    
    <CustomFormItem
      label="代缴个税(元)"
      field="individual_tax"
    >
      <CustomInput
        v-model="model.individual_tax"
        :readonly="true"
      >
      </CustomInput>
    </CustomFormItem>
    
    <CustomFormItem
      label="个人自付(元)"
      field="self_pay"
    >
      <CustomInput
        v-model="model.self_pay"
        :readonly="true"
      >
      </CustomInput>
    </CustomFormItem>
    
    <CustomFormItem
      label="实发工资(元)"
      field="net_pay"
    >
      <CustomInput
        v-model="model.net_pay"
        :readonly="true"
      >
      </CustomInput>
    </CustomFormItem>
    
    <CustomFormItem
      label="备注"
      field="rem"
    >
      <CustomInput
        v-model="model.rem"
        :readonly="true"
      >
      </CustomInput>
    </CustomFormItem>
    
  </CustomForm>
  
  <view
    un-m="x-2"
  >
    <tm-modal
      v-if="model.is_confirm === 0"
      title="工资条"
      ok-text="确认"
      :overlay-click="false"
      @ok="onConfirm"
    >
      <template #trigger>
        <tm-button
          label="确认"
          block
        ></tm-button>
      </template>
      <view
        un-h="130px"
        un-w="full"
        un-flex="~ col"
        un-justify="center"
        un-items="center"
      >
        确认工资条吗？
      </view>
    </tm-modal>
    <tm-button
      v-else
      label="已确认"
      block
      disabled
    ></tm-button>
  </view>
  
  <AppLoading></AppLoading>
  <tm-message
    ref="msgRef"
    :lines="2"
  ></tm-message>
</tm-app>
</template>

<script lang="ts" setup>
import type {
  PayslipModel,
} from "#/types";

import {
  checkLogin,
} from "../index/Api";

import {
  findById,
  confirmPayslip,
} from "./Api";

checkLogin();

let msgRef = $ref<InstanceType<typeof TmMessage>>();
let formRef = $ref<InstanceType<typeof CustomForm>>();

let model = $ref<Partial<PayslipModel>>({
});

let id = $ref("");

watch(
  () => id,
  refresh,
);

async function refresh() {
  if (!id) {
    return;
  }
  const res = await findById(id);
  if (!res) {
    await nextTick();
    msgRef?.show({
      model: "error",
      text: "工资条不存在",
    });
    return;
  }
  model = res;
}

async function onConfirm() {
  if (!formRef || !msgRef) {
    return;
  }
  
  const {
    isPass,
  } = formRef.validate();
  
  if (!isPass) {
    msgRef.show({
      model: "error",
      text: "请检查输入项",
    });
    return;
  }
  
  model.is_confirm = 1;
  await confirmPayslip(id);
  
  await refresh();
  
  msgRef.show({
    model: "success",
    text: "确认成功",
  });
}

onLoad((query?: AnyObject) => {
  id = query?.id as string;
})
</script>
