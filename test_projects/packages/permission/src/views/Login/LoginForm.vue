<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-13 13:41:36
 * @path: \permission\src\views\Login\LoginForm.vue
-->
<template>
  <Form :model="loginForm" class="w-100" @keypress.enter="handleLogin">
    <FormItem>
      <Input size="large" v-model:value="loginForm.username" :placeholder="t('请输入名称')"
        @blur="handleCheckUsbKey(loginForm.username)">
      <template #prefix>
        <i class="i-base-user text-lg text-gray-400"></i>
      </template>
      </Input>
    </FormItem>
    <FormItem>
      <InputPassword size="large" v-model:value="loginForm.password" :placeholder="t('请输入密码')">
        <template #prefix>
          <i class="i-base-lock text-lg text-gray-400"></i>
        </template>
      </InputPassword>
    </FormItem>
    <FormItem>
      <div class="flex">
        <Input v-model:value="loginForm.validateCode" :placeholder="t('请输入验证码')">
        <template #prefix>
          <i class="i-base-shield-check-line text-lg text-gray-400"></i>
        </template>
        </Input>
        <img class="h-10 w-50 ml-2" :src="verifyCodeImg" fit="contain" @click="updateVerifyCodeInfo" />
      </div>
    </FormItem>
    <FormItem name="pin" class="enter-x text-center" v-if="loginForm.sn && loginForm.mode === 0">
      <InputPassword size="large" v-model:value="loginForm.pin" :maxlength="30" :placeholder="t('请输入PIN')">
        <template #prefix>
          <i class="i-base-lock text-lg text-gray-400"></i>
        </template>
      </InputPassword>
      <Button type="link" class="text-base" @click="changeMode">{{ t('忘记PIN码或丢失USB Key?') }}</Button>
    </FormItem>

    <FormItem name="recoveryCode" class="enter-x" v-if="usbKey && loginForm.sn && loginForm.mode === 1">
      <InputPassword size="large" v-model:value="loginForm.recoveryCode" :maxlength="30" :placeholder="t('请输入恢复代码')">
        <template #prefix>
          <i class="i-base-key-line text-lg text-gray-400"></i>
        </template>
      </InputPassword>
      <div class="machine-code flex justify-between text-base pt-2 cursor-pointer" @click="handleCopy">
        <span>
          <span>{{ t('机器码') }}:</span>
          <span>{{ loginForm.random }}</span>
        </span>
        <i class="i-base-copy-line"></i>
      </div>
    </FormItem>
    <FormItem>
      <Button class="login_btn w-full" type="primary" size="large" @click="handleLogin">
        <span class="text-lg tracking-widest">{{ t('登录') }}</span>
      </Button>
    </FormItem>
    <FormItem class="enter-x" v-if="usbKey && loginForm.sn && loginForm.mode === 1">
      <Button size="large" block @click="changeMode">
        <span class="tracking-1">{{ t('返回') }}</span>
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
import { Button, Form, FormItem, Input, InputPassword } from 'ant-design-vue'
import { useLogin } from '../../controller/useLogin'
import { t } from '@/languages/useLanguage'

const {
  loginForm,
  usbKey,
  verifyCodeImg,
  changeMode,
  handleCheckUsbKey,
  handleCopy,
  handleLogin,
  updateVerifyCodeInfo
} = useLogin()
</script>

<style scoped>
@import url('./style/login-btn.css');
</style>


