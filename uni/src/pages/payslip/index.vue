<template>
<tm-app
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <view
    un-flex="~ [1_0_0] col"
    un-overflow-auto
  >
    <tm-form
      ref="formRef"
      v-model="model"
      :label-width="200"
      :transprent="true"
      :margin="[0, 0]"
      :padding="[0, 0]"
    >
      
      <tm-form-item
        label="发放月份"
        field="pay_month"
        :margin="[0, 0]"
      >
        <CustomInput
          v-model="model.pay_month"
          :readonly="true"
        >
        </CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="姓名"
        field="lbl"
        :margin="[20, 0]"
      >
        <CustomInput
          v-model="model.lbl"
          :readonly="true"
        >
        </CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="工号"
        field="job_num"
        :margin="[20, 0]"
      >
        <CustomInput
          v-model="model.job_num"
          :readonly="true"
        >
        </CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="公司"
        field="company"
      >
        <CustomInput
          v-model="model.company"
          :readonly="true"
        >
        </CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="应发工资(元)"
        field="gross_pay"
      >
        <CustomInput
          v-model="model.gross_pay"
          :readonly="true"
        >
        </CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="代缴社保(元)"
        field="social_security"
      >
        <CustomInput
          v-model="model.social_security"
          :readonly="true"
        >
        </CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="代缴个税(元)"
        field="individual_tax"
      >
        <CustomInput
          v-model="model.individual_tax"
          :readonly="true"
        >
        </CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="个人自付(元)"
        field="self_pay"
      >
        <CustomInput
          v-model="model.self_pay"
          :readonly="true"
        >
        </CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="实发工资(元)"
        field="net_pay"
      >
        <CustomInput
          v-model="model.net_pay"
          :readonly="true"
        >
        </CustomInput>
      </tm-form-item>
      
    </tm-form>
  </view>
  
  <view
    un-m="x-2"
  >
    <tm-modal
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

checkLogin();

let msgRef = $ref<InstanceType<typeof TmMessage>>();
let formRef = $ref<InstanceType<typeof TmForm>>();

let model = $ref<Partial<PayslipModel>>({
});

let id = $ref("");

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
  
  // await confirmPayslip(id);
  
  msgRef.show({
    model: "success",
    text: "确认成功",
  });
}

onLoad((query?: AnyObject) => {
  id = query?.id as string;
})
</script>
