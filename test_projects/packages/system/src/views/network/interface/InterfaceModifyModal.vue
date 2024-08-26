
<!--
 * @name: 修改接口弹窗
 * @description: Do not edit
-->
<template>
  <Modal title="修改接口信息" v-model:open="dialogVisible" :width="500" :closable="false" :mask-closable="false">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 4 }">
      <FormItem name="networkCardName" label="接口名称:">
        <Input v-model:value="dataForm.networkCardName" disabled placeholder="请输入接口名称" allowClear :maxlength="20" />
      </FormItem>
      <FormItem name="ip" label="IP地址:">
        <Input v-model:value="dataForm.ip" allowClear placeholder="请输入IP地址" />
      </FormItem>
      <FormItem name="subnetMask" label="子网掩码:">
        <Input v-model:value="dataForm.subnetMask" allowClear placeholder="请输入子网掩码" />
      </FormItem>
      <FormItem name="gateway" label="网关地址:">
        <Input v-model:value="dataForm.gateway" placeholder="请输入网关地址" allowClear />
      </FormItem>
    </Form>

    <template #footer>
      <div>
        <Button @click="closeModal" :disabled="confirmButtonLoading">取消</Button>
        <Button type="primary" @click="handleSubmit" :loading="confirmButtonLoading">确定</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup name="CreateUserModal" lang="ts">
import type { PropType } from 'vue';
import type { NetworkInterface } from '../../../types/interface';
import { Modal, Form, FormItem, Input, Button } from 'ant-design-vue';
import { useModifyInterface } from '../../../controller/useNetworkInterface';

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object as PropType<NetworkInterface>,
    default: () => {
      return {
        id: 0,
        ip: "",
        networkCardName: "",
        subnetMask: "",
        gateway: "",
        operation: "",
        switchStatus: false,
        switchSet: false,
        interfaceType: false,
        interfaceDirection: false,
        mgmt: false,
        ipSet: false,
        upFlow: "",
        downFlow: "",
        status: true
      }
    }
  }
});

const emit = defineEmits(['update:visible', 'refresh']);

const { dataForm, rules, dialogVisible, closeModal, handleSubmit, confirmButtonLoading } = useModifyInterface(props, emit)

</script>