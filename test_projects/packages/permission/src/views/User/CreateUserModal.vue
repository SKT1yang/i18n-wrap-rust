<!--
 * @name: 新增账号弹窗
 * @description: Do not edit
-->
<template>
  <Modal :title="t('新增')" v-model:open="dialogVisible">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: language === 'en' ? 8 : 4 }">
      <FormItem name="username" :label="t('账号名称')">
        <Input v-model:value="dataForm.username" :maxlength="20" :placeholder="t('请输入账号名称')" />
      </FormItem>
      <FormItem name="password" :label="t('密码')">
        <Password v-model:value="dataForm.password" :placeholder="t('请输入密码')" />
      </FormItem>
      <FormItem name="dbPassword" :label="t('确认密码')">
        <Password v-model:value="dataForm.dbPassword" @blur="checkDoubleHandle" :placeholder="t('请再次输入密码')" />
      </FormItem>
      <FormItem name="name" :label="t('姓名')">
        <Input v-model:value="dataForm.name" :placeholder="t('请输入姓名')" :maxLength="20" allowClear />
      </FormItem>
      <FormItem name="phone" :label="t('手机')">
        <Input v-model:value="dataForm.phone" :placeholder="t('请输入手机号')" allowClear />
      </FormItem>
    </Form>

    <template #footer>
      <div>
        <Button @click="closeModal" :disabled="confrimButtonLoading">{{ t('取消') }}</Button>
        <Button type="primary" @click="handleSubmit" :disabled="confrimButtonLoading" :loading="confrimButtonLoading">{{
          t('确定')
        }}</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { ref, watch } from 'vue'
import { message } from '@guolisec/toast'
import { Modal, Form, FormItem, Input, Button } from 'ant-design-vue';
import { useVModel } from '@guolisec/utils';
import { useCreateUser } from '../../controller/useUser'
import { t, language } from '@/languages/useLanguage'

const Password = Input.Password

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Array,
    default: () => []
  }
});

const { dataForm, rules, checkDoubleHandle, createUser } = useCreateUser()

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
      await formRef.value?.resetFields()
    }
  },
)

// 保存
const confrimButtonLoading = ref(false)
async function handleSubmit() {
  await formRef.value?.validate()
  try {
    confrimButtonLoading.value = true
    const isDouble = checkDoubleHandle();
    if (isDouble) {
      const msg: string = await createUser()
      message.success(msg);
      emit('refresh');
      closeModal();
    }
  } finally {
    confrimButtonLoading.value = false
  }

}
</script>