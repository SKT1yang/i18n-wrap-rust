<!--
 * @name: 紧急登录恢复代码
 * @description: Do not edit
-->
<template>
  <Modal :title="t('紧急登录恢复代码')" v-model:open="dialogVisible" @close="closeModal">
    <Form
      :model="dataForm"
      :rules="rules"
      ref="formRef"
      :label-col="{ span: language === 'en' ? 6 : 4 }"
    >
      <FormItem :label="`${t('机器码')}:`" name="random">
        <Input
          v-model:value="dataForm.random"
          :placeholder="t('请输入机器码')"
          allow-clear
          :maxlength="6"
        />
      </FormItem>
    </Form>
    <div class="h-75 flex items-center justify-center cursor-pointer text-2xl font-bolder">
      <span v-if="dataForm.code" @click="handleCopy" class="text-green">
        {{ dataForm.code }}
      </span>
      <span v-else> {{ t('恢复代码待生成') }} </span>
    </div>

    <template #footer>
      <div>
        <Button @click="closeModal">{{ t('取消') }}</Button>
        <Button type="primary" @click="handleSubmit">{{ t('生成恢复代码') }}</Button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts" setup name="EmergencyLoginModal">
import type { Rule } from 'ant-design-vue/es/form'
import type { FormInstance } from 'ant-design-vue'
import { ref, watch } from 'vue'
import { Modal, Form, FormItem, Input, Button } from 'ant-design-vue'
import { message } from '@guolisec/toast'
import { getUSBKeyRecoveryCodeApi } from '../../../model/fisec'
import { useVModel, useClipboard } from '@guolisec/utils'
import { t, language } from '../../../languages/useLanguage'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'refresh'])
const dialogVisible = useVModel(props, 'visible', emit)

const formRef = ref<FormInstance>()

function closeModal() {
  dialogVisible.value = false
  emit('refresh')
}

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      dataForm.value.code = ''
      await formRef.value?.resetFields()
    }
  }
)

const dataForm = ref({
  random: '',
  code: ''
})
const rules: Record<string, Rule[]> = {
  random: [
    {
      required: true,
      message: t('请输入机器码'),
      trigger: 'blur'
    }
  ]
}

const { copy, copied } = useClipboard()

const handleSubmit = async () => {
  await formRef.value?.validate()
  dataForm.value.code = await getUSBKeyRecoveryCodeApi(dataForm.value.random)
  handleCopy()
}

function handleCopy() {
  if (!dataForm.value.code) {
    return
  }
  copy(dataForm.value.code)
  if (copied) {
    message.success(t('恢复代码已粘贴'))
  }
}
</script>
