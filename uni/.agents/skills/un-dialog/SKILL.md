---
name: un-dialog
description: uni 移动端通用弹窗封装
compatibility: Uni-app 微信小程序
metadata:
  version: "1.0"
---

- 新增 uni/src/components/CustomDialog/CustomDialog.vue，底层封装 tm-modal，同时支持 v-model:show 与 Promise 式 showDialog()
- showDialog(options) 支持 title/notice、auto|medium|large 预设尺寸、beforeConfirm、closeResult/confirmResult
- 业务弹窗迁移后可通过 customDialogRef.resolve(result) 结束 Promise，不再手写 onCloseResolve
