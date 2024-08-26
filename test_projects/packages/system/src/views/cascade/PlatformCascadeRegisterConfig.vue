<!--
 * @name: 平台级联
 * @description: 级联之间都是平台而不是设备
 * @path: \system\src\views\cascade\PlatformCascadeRegisterConfig.vue
-->
<template>
  <div class="registerConfig">
    <Form ref="registerRef" :model="registerForm" :label-col="{ span: 10 }" :wrapper-col="{ span: 4 }">
      <FormItem label="上级平台IP" name="ip" :rules="[
        {
          required: false,
          validator: ipValidate({
            allowEmpty: true
          }),
          trigger: 'blur',
        },
      ]">
        <Input v-model:value="registerForm.ip" placeholder="请输入IP" allow-clear :maxlength="24" />
      </FormItem>
      <FormItem>
        <Button class="buttonMargin" type="primary" @click="saveRegister" style="margin-left: 767px">设置</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script setup name="RegisterConfig" lang="ts">
import { ref, onMounted } from 'vue'
import { Form, FormItem, Input, Button, FormInstance, message } from 'ant-design-vue';
import {
  getRegisterIpApi,
  setRegisterIpApi
} from '../../model/cascade';

import { ipValidate } from '@guolisec/utils';

// 表单实例
const registerRef = ref<FormInstance>();

const registerForm = ref({
  ip: '',
});

onMounted(() => {
  getRegisterIp();
});

async function getRegisterIp() {
  const res = await getRegisterIpApi()
  registerForm.value.ip = res === '127.0.0.1' ? '' : res;
};

async function saveRegister() {
  await registerRef.value?.validateFields()
  await setRegisterIpApi({
    ip: registerForm.value.ip,
  })
  await message.success('设置成功');
  getRegisterIp();
};
</script>
