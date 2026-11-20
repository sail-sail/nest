<script setup lang="ts">
import {
  useTmConfig,
} from "./uni_modules/tm-ui/libs/config";

import { handleMessageReadFromQuery } from "./utils/message_read";

const tm = useTmConfig()
tm.config.mode = "light";

uni.onThemeChange(({ theme }) => {
  tm.config.mode = theme === 'dark' ? 'dark' : 'light'
});

// #ifdef H5
import {
  initWxWorkCfg,
} from "./utils/WxWorkUtil";
// #endif

onLaunch((async(options?: App.LaunchShowOption) => {
  const indexStore = useIndexStore();
  indexStore.setLaunchOptions(options);
  
  // 企微消息落地: URL 带 _message_id 时异步标记已读, 不阻塞启动
  handleMessageReadFromQuery(options?.query);
  
  // #ifdef H5
  await initWxWorkCfg();
  // #endif
  
  await checkLogin(options);
  
}));

onShow((options?: App.LaunchShowOption) => {
  // 从后台切回时落地页可能换了, 同样处理一次
  handleMessageReadFromQuery(options?.query);
});

</script>

<style lang="scss">

/* 图标必须 */
@use "./uni_modules/tm-ui/css/remixicon.min.css";
/* 自定预处理类，可选 */
// @use "./uni_modules/tm-ui/css/tmui.min.css";

@use "./assets/style/common.scss";

</style>
