<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-03-15 10:03:40
 * @path: \permission\src\views\System\SystemUpdateModal.vue
-->

<template>
  <Modal :title="title" v-model:open="dialogVisible" :footer="false">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 6 }" @finish="handleSubmit">
      <FormItem name="sysName" label="系统名称:">
        <Input v-model:value="dataForm.sysName" allowClear placeholder="请输入系统名称" />
      </FormItem>
      <FormItem name="clientId" label="clientId:">
        <Input v-model:value="dataForm.clientId" allowClear placeholder="请输入 clientId" />
      </FormItem>
      <FormItem name="model" label="规格型号:">
        <Input v-model:value="dataForm.model" allowClear placeholder="请输入规格型号" />
      </FormItem>
      <FormItem name="homePageUrl" label="系统主页路径:">
        <Input v-model:value="dataForm.homePageUrl" allowClear placeholder="请输入系统主页路径" />
      </FormItem>
      <FormItem name="description" label="系统描述:">
        <Textarea v-model:value="dataForm.description" allowClear placeholder="请输入系统描述" />
      </FormItem>
      <div class="flex flex-end space-x-5">
        <Button @click="closeModal">取消</Button>
        <Button type="primary" html-type="submit">确定</Button>
      </div>
    </Form>
  </Modal>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { Modal, Form, FormItem, Input, Button, Textarea } from 'ant-design-vue';
import { useSystemUpdate } from '../../controller/useSystem'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object,
    default: () => { }
  },
  mode: {
    type: String as PropType<'create' | 'modify'>,
    default: 'create'
  }
});

const emit = defineEmits(['update:visible', 'refresh']);

const { dataForm, rules, dialogVisible, title, formRef, handleSubmit, closeModal } = useSystemUpdate(props, emit)

</script>