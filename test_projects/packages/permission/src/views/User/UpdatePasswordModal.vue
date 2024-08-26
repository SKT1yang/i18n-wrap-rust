<!--
 * @name: 修改密码
 * @description: Do not edit
-->
<template>
  <Modal :title="t('修改密码')" v-model:open="dialogVisible">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: language === 'en' ? 8 : 4 }">
      <FormItem name="username" :label="`${t('用户名')}:`">
        <Input v-model:value="dataForm.username" disabled :placeholder="t('请输入用户名')" allowClear />
      </FormItem>
      <FormItem name="password" :label="`${t('原密码')}:`">
        <Password v-model:value="dataForm.password" :placeholder="t('请输入原密码')" />
      </FormItem>
      <FormItem name="newPassword" :label="`${t('新密码')}:`">
        <Password v-model:value="dataForm.newPassword" :placeholder="t('请输入新密码')" />
      </FormItem>
      <FormItem name="confirmPassword" :label="`${t('确认密码')}:`">
        <Password v-model:value="dataForm.confirmPassword" @blur="checkDoubleHandle" :placeholder="t('请再次输入密码')" />
      </FormItem>
    </Form>

    <template #footer>
      <div>
        <Button @click="closeModal">{{ t('取消') }}</Button>
        <Button type="primary" @click="handleSubmit">{{ t('确定') }}</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup name="CreateUserModal" lang="ts">
import { Modal, Form, FormItem, Input, Button } from 'ant-design-vue';
import { useUpdatePassword } from '../../controller/useUser'
import { t, language } from '@/languages/useLanguage'

const Password = Input.Password

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object,
    default: () => {
      return {}
    }
  }
});

const emit = defineEmits(['update:visible', 'refresh']);

const { dataForm, rules, dialogVisible, formRef, checkDoubleHandle, closeModal, handleSubmit } = useUpdatePassword(props, emit)
</script>