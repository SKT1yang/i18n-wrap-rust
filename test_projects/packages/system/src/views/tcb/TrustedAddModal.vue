<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-27 15:50:16
 * @path: \feature-vue\platform\front\system\src\views\tcb\TrustedAddModal.vue
-->
<template>
  <Modal v-model:open="state.visible" :title="title" width="400px" :mask-closable="false"  @ok="save"
    @cancel="closeModal" :confirmLoading="confirmLoading" :closable="false">
    <Form :model="dataForm" :label-col="{ span: 5 }" style="margin-top: 30px" ref="dataFormRef">
      <FormItem v-if="props.type === 'ip'" label="IP" name="ip" :rules="[
        {
          required: true,
          validator: ipValidate(),
          trigger: 'blur',
        },
      ]">
        <Input v-model:value="dataForm.ip" placeholder="IP" allow-clear />
      </FormItem>
      <FormItem v-if="props.type === 'mac'" label="MAC" name="mac"
        :rules="[{ required: true, validator: macValidate(), trigger: 'blur' }]">
        <Input v-model:value="dataForm.mac" allow-clear placeholder="MAC" />
      </FormItem>
    </Form>
  </Modal>
</template>
<script setup name="TrustedAddModal" lang="ts">
import { reactive, ref, computed } from 'vue'
import { Modal, Form, FormItem, Input, FormInstance, message } from 'ant-design-vue';
import { ipValidate, macValidate } from '@guolisec/utils';
import { addIpRuleApi, addMacApi } from '../../model/tcb';

// 父组件传值
const props = defineProps({
  type: { type: String, default: '' },
});

const emit = defineEmits(['refreshData']);

const title = computed(() => {
  return props.type === 'ip' ? '新增 IP' : '新增 MAC'
})

let dataForm = reactive({
  ip: '', // IP
  mac: '', // MAC
});

let state = reactive({
  visible: false,
});

const confirmLoading = ref(false)

// 表单实例
const dataFormRef = ref<FormInstance>();

// 打开弹框
const openModal = () => {
  state.visible = true;
};

// 关闭弹框
const closeModal = () => {
  state.visible = false;
  dataFormRef.value?.resetFields();
};

// 保存
const save = () => {
  dataFormRef.value?.validateFields().then(() => {
    if (props.type === 'ip') {
      addIP();
    } else {
      addMac();
    }
  });
};

// 保存IP
const addIP = () => {
  confirmLoading.value = true
  addIpRuleApi({ ip: dataForm.ip }).then(() => {
    message.success('新增成功！');
    emit('refreshData');
    closeModal();
  }).finally(() => {
    confirmLoading.value = false
  });
};

// 保存Mac
const addMac = () => {
  confirmLoading.value = true
  addMacApi({ mac: dataForm.mac }).then(() => {
    message.success('新增成功！');
    emit('refreshData');
    closeModal();
  }).finally(() => {
    confirmLoading.value = false
  });
};

// 暴露变量
defineExpose({
  openModal,
});
</script>
