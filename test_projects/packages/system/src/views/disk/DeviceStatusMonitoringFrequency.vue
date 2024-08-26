<!--
 * @name: 设备状态监测频率
 * @description: 展示和修改设备状态监测频率时间
 * @date: 2023-06-26 09:20:58
 * @path: \feature-vue\platform\front\system\src\views\disk\DeviceStatusMonitoringFrequency.vue
-->
<template>
  <Form :model="dataForm" :rules="rules" ref="dataFormRef" :label-col="{ style: { width: '110px' } }">
    <FormItem label="状态监测频率" name="interval">
      <InputNumber v-model:value="dataForm.interval" :min="1" :max="1440" :precision="0" class="w-40"
        addon-after="分钟" />
    </FormItem>
    <FormItem label="是否启用" name="enabled">
      <Switch v-model:checked="dataForm.enabled" :checked-value="1" :un-checked-value="0" />
    </FormItem>
    <FormItem :wrapper-col="{ style: { marginLeft: '110px' } }">
      <Button :loading="loading" :disabled="loading" @click="handleSubmit">保存</Button>
    </FormItem>
  </Form>
</template>
<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import { ref, onMounted } from 'vue'
import {
  Form,
  FormItem,
  InputNumber,
  Button,
  FormInstance,
  message,
  Switch
} from 'ant-design-vue';
import {
  getStatusMonitoringFrequencyApi,
  setScanIntervalApi
} from '../../model/disk';

// 表单实例
const dataFormRef = ref<FormInstance>();

let dataForm = ref<{
  id?: number;
  interval?: number;
  enabled: 0 | 1
}>({
  id: undefined,
  // 设备状态监测频率时间
  interval: undefined,
  enabled: 0
});

let rules: Record<string, Rule[]> = {
  interval: [{ required: true, message: '请输入状态监测频率', trigger: 'blur' }]
}

async function getInfo() {
  const { id, scanInterval } = await getStatusMonitoringFrequencyApi(1)
  const scanIntervalObject = JSON.parse(scanInterval)
  dataForm.value = { id, interval: scanIntervalObject.interval, enabled: scanIntervalObject.enabled }
}

// 保存按钮loading
let loading = ref(false);

async function handleSubmit() {
  loading.value = true
  try {
    await dataFormRef.value?.validate()
    await setScanIntervalApi(dataForm.value)
    message.success('操作成功')
    getInfo();
  } finally {
    loading.value = false
  }
}

// 页面加载时
onMounted(() => {
  getInfo()
});
</script>
