<!--
 * @name: 重置密码
 * @description: Do not edit
-->
<template>
  <Modal :title="t('重置密码')" v-model:open="dialogVisible">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: language === 'en' ? 9 : 6 }">
      <FormItem name="username" :label="t('用户名')">
        <Input v-model:value="dataForm.username" disabled :placeholder="t('请输入用户名')" allowClear />
      </FormItem>
      <FormItem name="rawPassword" :label="t('管理员密码')">
        <Password v-model:value="dataForm.rawPassword" :placeholder="t('请输入管理员密码')" />
      </FormItem>
      <FormItem name="newPassword" :label="t('新密码')">
        <Password v-model:value="dataForm.newPassword" :placeholder="t('请输入新密码')" />
      </FormItem>
      <FormItem name="confirmPassword" :label="t('确认密码')">
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
import type { FormInstance } from 'ant-design-vue';
import { ref, watch } from 'vue'
import { message } from '@guolisec/toast'
import { Modal, Form, FormItem, Input, Button } from 'ant-design-vue';
import { useVModel } from '@guolisec/utils';
import { useResetPassword } from '../../controller/useUser'
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

const { dataForm, rules, checkDoubleHandle, resetPassword, updateDataForm } = useResetPassword()

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)

const formRef = ref<FormInstance>()


function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      formRef.value?.resetFields()
      updateDataForm({
        id: props.current.id,
        username: props.current.username,
      })
    }
  },
)

// 保存
async function handleSubmit() {
  await formRef.value?.validate();
  const isDouble = checkDoubleHandle();
  if (isDouble) {
    const res = await resetPassword()
    res && message.success(res);
    emit('refresh');
    closeModal();
  }
}
</script>