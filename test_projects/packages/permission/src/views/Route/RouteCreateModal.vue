<!--
 * @name: 新增系统权限
 * @description: Do not edit
 * @date: 2023-03-15 10:03:40
 * @path: \permission\src\src\views\Route\RouteCreateModal.vue
-->

<template>
  <Modal :title="title" v-model:open="dialogVisible" :width="1200" @close="closeModal">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 4 }">
      <FormItem name="pid" label="上级路由:">
        <TreeSelect v-model:value="dataForm.pid" show-search :tree-data="routeTree" @change="handleTreeSelect"
          :field-names="{ label: 'title', children: 'children', value: 'id' }" />
      </FormItem>
      <FormItem name="permissionIds" label=" 目标路由:">
        <Select v-model:value="dataForm.permissionIds" placeholder="请选择要添加的路由" :filter-option="filterOptionMultiple"
          show-search allow-clear mode="multiple" @visible-change="handleSelectVisibleChange">
          <SelectOption v-for="permission in permissionList" :key="permission.id" :disabled="permission.disabled"
            :value="permission.id" :title="`${permission.title}(${permission.name})`">
            {{ permission.title }}({{ permission.name }})
          </SelectOption>
        </Select>
      </FormItem>
    </Form>

    <template #footer>
      <div>
        <Button @click="closeModal">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import { ref } from 'vue';
import { Modal, Form, FormItem, SelectOption, Button, TreeSelect, Select } from 'ant-design-vue';
import { useRouteCreate } from '../../controller/useRoute'
import { filterOptionMultiple } from '@guolisec/utils'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  systemId: {
    type: Number,
    default: 0
  },
});

const emit = defineEmits(['update:visible', 'refresh']);

const formRef = ref<FormInstance>()

const { dataForm, rules, dialogVisible, title, routeTree, permissionList, handleSubmit, closeModal, handleSelectVisibleChange, handleTreeSelect } = useRouteCreate(props, emit, formRef)

</script>