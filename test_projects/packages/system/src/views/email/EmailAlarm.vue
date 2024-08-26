<!--
 * @name:邮件告警
 * @description: 系统设置-邮件告警
 * @path: \system\src\views\email\EmailAlarm.vue
-->
<template>
  <div class="systemConfigMailAlarm">
    <Form :model="mailForm" :label-col="{ span: 10 }" :wrapper-col="{ span: 4 }" style="margin-top: 30px"
      ref="mailFormRef">
      <FormItem label="邮件通知开关" name="flag">
        <Switch v-model:checked="mailForm.flag" />
      </FormItem>
      <FormItem label="SMTP服务器" name="host" :rules="[{
        required: true, validator: ipValidate({
          errorMsg: '请输入正确SMTP服务器'
        }), trigger: 'blur'
      }]">
        <Input v-model:value.trim="mailForm.host" :maxlength="60" />
      </FormItem>
      <FormItem label="SMTP端口" name="port" :rules="[{ required: true, validator: portValidate(), trigger: 'blur' }]">
        <Input v-model:value.trim="mailForm.port" :maxlength="60" />
      </FormItem>
      <FormItem label="邮件账号" name="username" :rules="[
        { required: true, message: '请输入邮件账号', trigger: 'blur' },
        { validator: mailValidate(), trigger: 'blur' },
      ]">
        <Input v-model:value.trim="mailForm.username" :maxlength="60" />
      </FormItem>
      <FormItem label="邮件密码" name="password" :rules="[{ required: true, message: '请输入邮件密码', trigger: 'blur' }]">
        <InputPassword v-model:value.trim="mailForm.password" :maxlength="60" />
      </FormItem>
      <FormItem label="收件人" name="recipients" :rules="[
        { required: true, message: '请输入收件人', trigger: 'blur' },
        { validator: mailValidate(), trigger: 'blur' },
      ]">
        <Input v-model:value.trim="mailForm.recipients" :maxlength="60" />
      </FormItem>
      <FormItem label="邮件主题" name="subject" :rules="[{ required: true, message: '请输入邮件主题', trigger: 'blur' }]">
        <Input v-model:value.trim="mailForm.subject" :maxlength="60" />
      </FormItem>
      <FormItem :wrapper-col="{ offset: 11, span: 6 }">
        <Button type="primary" :loading="buttonLoading" @click="handleSubmit">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Form,
  FormItem,
  Switch,
  Button,
  Input,
  message,
  FormInstance,
  InputPassword,
} from 'ant-design-vue';
import { getEmailAlarmInfoApi, modifyEmailAlarmInfoApi } from '../../model/email';

import { ipValidate, portValidate, mailValidate } from '@guolisec/utils';

let mailForm = ref({
  flag: false, // 邮件通知开关
  host: '', // SMTP服务器
  port: undefined, // SMTP端口
  username: '', // 邮件账号
  password: '', // 邮件密码
  recipients: '', // 收件人
  subject: '', // 邮件主题
});

// 保存按钮loading状态
let buttonLoading = ref(false);

// 表单实例
const mailFormRef = ref<FormInstance>();

// 页面加载时
onMounted(() => {
  getMail();
});

// 获取邮件高级设置
async function getMail() {
  const res = await getEmailAlarmInfoApi()
  mailForm.value = res;
}

// 保存邮件告警
async function handleSubmit() {
  await mailFormRef.value?.validateFields()
  buttonLoading.value = true;
  try {
    const res = await modifyEmailAlarmInfoApi(mailForm.value)
    mailForm.value = res;
    message.success('修改成功');
    buttonLoading.value = false;
  } finally {
    buttonLoading.value = false;
    getMail();
  }

};
</script>
