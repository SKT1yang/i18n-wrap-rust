<!--
 * @name: 配置远程管理端平台IP地址
 * @description: 方便自身系统平台管理
-->
<template>
  <Form ref="formRef" :model="dataForm" :rules="rules" layout="inline">
    <FormItem label="远程管理地址" name="body" :label-col="{ style: { width: '100px' } }">
      <Input v-model:value="dataForm.body" placeholder="远程管理平台的 IP 地址" allow-clear :maxlength="24"
        :disabled="!isEditStatus || isEditLoading" />
    </FormItem>
    <FormItem>
      <Button class="buttonMargin" @click="handleEdit" v-show="isEditStatus" :loading="isEditLoading">
        应用
      </Button>
      <Button class="buttonMargin" @click="()=>{isEditStatus = true}" v-show="!isEditStatus">
        修改
      </Button>
    </FormItem>
  </Form>

</template>
<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { ref, onMounted } from 'vue'
import { Form, FormItem, Input, Button, FormInstance, message } from 'ant-design-vue';
import {
  getClientIpApi,
  setClientIpApi,
  setRegisterIpApi
} from '../../model/cascade';

import { ipValidate } from '@guolisec/utils';

const props = defineProps({
  editClientIpWrapper: {
    type: Function,
  },
});

// 表单实例
const formRef = ref<FormInstance>();

const dataForm = ref({
  id: '',
  body: ''
});

const rules = ref<Record<string, Rule[]>>({
  body: [
    {
      required: false,
      validator: ipValidate({
        allowEmpty: true
      }),
      trigger: 'blur',
    },
  ]
})

onMounted(() => {
  formRef.value?.clearValidate()
  getClientIp();
});

const isEditStatus = ref(false)
async function getClientIp() {
  const res = await getClientIpApi()
  dataForm.value = res[0]
  isEditStatus.value = dataForm.value.body ? false : true
};

const isEditLoading = ref(false)
async function handleEdit() {
  try {
    isEditLoading.value = true

    // 资产健康监测：如果当前有扫描或监测任务正在执行，提示用户当前任务可能会异常结束
    if (props.editClientIpWrapper && typeof props.editClientIpWrapper === 'function') {
      await props.editClientIpWrapper(setClientIp)
    } else {
      await setClientIp()
    }
    isEditStatus.value = false
  } finally {
    isEditLoading.value = false
  }
}

async function setClientIp() {
  await formRef.value?.validateFields()
  await setClientIpApi(dataForm.value)
  await setRegisterIpApi({
    ip: dataForm.value.body
  })
  message.success('修改成功');
  getClientIp();
};
</script>
