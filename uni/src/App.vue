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

onLaunch((async(options?: App.LaunchShowOption) => {
  const indexStore = useIndexStore();
  indexStore.setLaunchOptions(options);
  
  // #ifdef WEB
  if (await initWxoCfg()) return;
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
