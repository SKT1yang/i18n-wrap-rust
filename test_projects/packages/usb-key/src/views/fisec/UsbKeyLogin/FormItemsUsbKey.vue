<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <FormItem name="pin" class="enter-x text-center" v-if="loginForm.sn && loginForm.mode === 0">
    <InputPassword v-model:value="loginForm.pin" :maxlength="30" :placeholder="t('请输入PIN')">
      <template #prefix>
        <i class="i-base-lock text-lg text-gray-400"></i>
      </template>
    </InputPassword>
    <Button type="link" class="text-base" @click="changeMode"
      >{{ t('忘记PIN码或丢失USB Key') }}?</Button
    >
  </FormItem>

  <FormItem name="recoveryCode" class="enter-x" v-if="loginForm.sn && loginForm.mode === 1">
    <InputPassword
      v-model:value="loginForm.recoveryCode"
      :maxlength="30"
      :placeholder="t('请输入恢复代码')"
    >
      <template #prefix>
        <i class="i-base-key-line text-lg text-gray-400"></i>
      </template>
    </InputPassword>
    <div
      class="machine-code flex justify-between text-base pt-2 cursor-pointer"
      @click="handleCopy"
    >
      <span>{{ t('机器码') }}: {{ loginForm.random }}</span>
      <i class="i-base-copy-line"></i>
    </div>
  </FormItem>
</template>

<script lang="ts" setup>
import { Button, FormItem, InputPassword } from 'ant-design-vue'
import { useUsbKeyLogin } from '../../../controller/useFisec'
import { t } from '../../../languages/useLanguage'
import type { UsbKeyLoginForm } from '../../../types/fisec'

const loginForm = defineModel<UsbKeyLoginForm>('value', {
  default: {
    sn: '',
    pin: '',
    mode: 1,
    recoveryCode: '',
    random: ''
  }
})

const { changeMode, handleCopy } = useUsbKeyLogin(loginForm)
</script>
