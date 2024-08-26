<!--
 * @name: 鉴权次数弹窗
 * @description: Do not edit
-->
<template>
  <Modal :title="t('新增')" v-model:open="dialogVisible">
    <Form layout="inline" :model="dataForm" :rules="rules" ref="formRef" label-width="140px">
      <FormItem name="maxFaildNum" :label="`${t('最大鉴别失败次数')}:`">
        <InputNumber v-model:value="dataForm.maxFaildNum" :min="1" :max="10" :placeholder="t('鉴别次数')" allowClear />
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
import { Modal, Form, FormItem, InputNumber, Button } from 'ant-design-vue';
import { t } from '@/languages/useLanguage'
import { useUserFailNumber } from '../../controller/useUser'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
});

const emit = defineEmits(['update:visible', 'refresh']);


const { dataForm, rules, closeModal, handleSubmit, dialogVisible } = useUserFailNumber(props, emit)

</script>