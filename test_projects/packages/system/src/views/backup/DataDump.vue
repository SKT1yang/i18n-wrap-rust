<!--
 * @Name: 数据转储
 * @Description: 数据备份-数据转储
 * @Author: lkq
 * @Date: 2022-03-18 13:53:19
 * @LastEditTime: 2023-06-27 15:39:30
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="systemBackUpDataDump">
    <Form :model="dumpForm" :label-col="{ span: 10 }" :wrapper-col="{ span: 4 }" style="margin-top: 30px"
      ref="dumpFormRef">
      <FormItem label="FTP服务器" name="host" :rules="[
        {
          required: true, validator: ipValidate({
            emptyMsg: 'FTP服务器ip不能为空',
            errorMsg: 'FTP服务器ip不正确'
          }), trigger: 'blur'
        },
      ]">
        <Input v-model:value.trim="dumpForm.host" />
      </FormItem>
      <FormItem label="FTP端口" name="port" :rules="[{ required: true, validator: portValidate(), trigger: 'blur' }]">
        <Input v-model:value.trim="dumpForm.port" />
      </FormItem>
      <FormItem label="FTP用户名" name="userName" :rules="[{ required: true, message: 'FTP用户名不能为空', trigger: 'blur' }]">
        <Input v-model:value.trim="dumpForm.userName" />
      </FormItem>
      <FormItem label="FTP密码" name="password" :rules="[{ required: true, message: 'FTP密码不能为空', trigger: 'blur' }]">
        <InputPassword v-model:value.trim="dumpForm.password" />
      </FormItem>
      <FormItem :wrapper-col="{ offset: 10 }">
        <Button type="primary" :loading="buttonLoading" @click="save">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script setup name="SystemBackUpDataDump" lang="ts">
import { ref, onMounted } from 'vue'
import {
  Form,
  FormItem,
  Button,
  Input,
  InputPassword,
  message,
  FormInstance,
} from 'ant-design-vue';
import { getFtpSettingListApi, setFtpApi } from '../../model/backup';

import { ipValidate, portValidate } from '@guolisec/utils';

let dumpForm = ref({
  id: null,
  host: '', // FTP服务器
  port: '', // FTP端口
  password: '', // FTP密码
  userName: '', // FTP用户名
});

// 保存按钮loading状态
let buttonLoading = ref(false);

// 表单实例
const dumpFormRef = ref<FormInstance>();

// 页面加载时
onMounted(() => {
  getFtp();
});

// 获取FTP设置
const getFtp = () => {
  getFtpSettingListApi().then((res) => {
    if (res.length > 0) {
      dumpForm.value = res[0];
    }
  });
};

// 保存FTP
const save = () => {
  dumpFormRef.value?.validateFields().then(() => {
    buttonLoading.value = true;
    setFtpApi(dumpForm.value)
      .then(() => {
        message.success('修改成功');
        buttonLoading.value = false;
        getFtp();
      })
      .catch(() => {
        buttonLoading.value = false;
      });
  });
};
</script>
