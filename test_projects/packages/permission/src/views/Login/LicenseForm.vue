<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <Alert show-icon type="info" :message="t('请将下面的机器码提供给软件厂商以获取授权码，将返回的授权码填入以完成授权！')" class="mb-4 w-100" />

  <Form :model="dataForm" class="w-100" @keypress.enter="handleSubmit">
    <FormItem :label="`${t('机器码')}:`">
      {{ machineCode }}
    </FormItem>
    <FormItem>
      <Input v-model:value="dataForm.licenseCode" :placeholder="t('请输入授权码')" allow-clear>
      <template #prefix>
        <i class="i-base-key-line text-lg text-gray-400"></i>
      </template>
      </Input>
    </FormItem>
    <FormItem>
      <Button class="login_btn w-full" type="primary" size="large" @click="handleSubmit">
        <span class="text-lg tracking-widest">{{ t('授 权') }}</span>
      </Button>
    </FormItem>
  </Form>
</template>

<script lang="ts" setup>
import { Button, Form, FormItem, Input, Alert } from 'ant-design-vue'
import { useLicense } from '../../controller/useLogin'
import { t } from '@/languages/useLanguage'

const {
  dataForm,
  machineCode,
  handleSubmit
} = useLicense()

</script>

<style scoped>
@import url('./style/login-btn.css');
</style>


