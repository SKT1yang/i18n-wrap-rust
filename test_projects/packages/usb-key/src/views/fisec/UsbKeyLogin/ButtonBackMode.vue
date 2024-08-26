<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <FormItem class="enter-x" v-if="sn && mode === 1">
    <Button ghost size="large" block @click="changeMode">
      <span class="text-white tracking-1">{{ t('返回') }}</span>
    </Button>
  </FormItem>
</template>

<script lang="ts" setup>
import { Button, FormItem } from 'ant-design-vue'
import { t } from '../../../languages/useLanguage'

// usbkey设备序列号（其实是查询绑定关系，也就是当前登录用户之前绑定usbkey设备序列号）
const sn = defineModel<string>('sn', {
  default: ''
})
// usbkey登录模式，0为正常模式，1为紧急登录模式，默认为0
const mode = defineModel<0 | 1>('mode', {
  default: 0
})

function changeMode() {
  mode.value = mode.value === 1 ? 0 : 1
}
</script>
