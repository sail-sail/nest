### 后台任务

1. 当后端的接口执行的时间超长, 超过1分钟时, 浏览器会自动断开链接

1. 所以, 设计后台任务, 当后端接口执行时间超长, 超过40秒时, 会自动切换到 `后台任务`

1. 此时, 前端会弹出提示 `已切换到后台任务`, 并同时弹出 `后台任务列表`

1. `后台任务列表`: 名称lbl, 开始时间begin_time, 结束时间end_time, 状态state`[{value: "running", label: "运行中"},{value: "success", label: "成功"},{value: "fail", label: "失败"},{value: "cancel", label: "取消"}]`,结果类型type`[{value: "text", label: "文本"},{value: "download", label: "下载"},{value: "inline", label: "查看"},{value: "tag", label: "标签"}]`, 执行结果result, 错误信息err_msg