<script>
import * as god from '@/god'

export default {
  name: 'PageHome',
  data() {
    return {
      title: 'Hello',
      res: {},
    }
  },
  onLoad() {},
  methods: {
    async onTestRequest() {
      const res = await god.api.get()
      console.log('res>>>', res)
      if (res.success) {
        this.res = res
      } else {
        god.uniapp.toast(res.msg)
      }
    },
  },
}
</script>

<template>
  <view class="flex flex-col justify-center items-center p-[20px]">
    <image class="w-[200rpx] h-[200rpx] mt-24" src="/static/images/logo.png" />
    <view class="mt-[20px]">
      <text class="text-[36rpx] text-[#8f8f94]">{{ title }}</text>
    </view>
    <u-button type="primary" text="测试请求" @tap="onTestRequest" />
    <view class="mt-[20px]">
      <text class="text-[36rpx] text-[#8f8f94]">{{ res }}</text>
    </view>
  </view>
</template>
