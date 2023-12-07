<template>
<tm-app
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <view
    un-flex="~ [1_0_0] col"
    un-overflow="x-hidden y-auto"
  >
    <view>
      <swiper
        un-h="[500rpx]"
        un-w="full"
      >
        <swiper-item>
          <image
            un-h="[500rpx]"
            un-w="full"
            src="/static/home1.png"
          ></image>
        </swiper-item>
      </swiper>
    </view>
    <view
      un-min-h="[300px]"
      un-m="x-[28rpx] t--6"
      un-rounded-4
      un-shadow-md
      un-bg="white"
      un-z="2"
    >
      
    </view>
  </view>
  <AppLoading></AppLoading>
</tm-app>
</template>
