<!--
 * @name: 重置用户PIN
 * @description: 弹窗
-->
<template>
  <Modal
    :title="t('重置用户PIN')"
    v-model:open="dialogVisible"
    @cancel="closeModal"
    :destroy-on-close="true"
  >
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 6 }">
      <FormItem :label="`${t('设备序列号')}:`" name="sn">
        <Input
          v-model:value="dataForm.sn"
          disabled
          :maxlength="16"
          :placeholder="t('请输入设备序列号')"
        />
      </FormItem>
      <FormItem :label="`${t('管理员 PIN')}:`" name="pinAdmin">
        <InputPassword
          v-model:value="dataForm.pinAdmin"
          :maxlength="30"
          :placeholder="t('请输入管理员 PIN')"
        />
      </FormItem>
      <FormItem :label="`${t('新用户 PIN')}:`" name="pin">
        <InputPassword
          v-model:value="dataForm.pin"
          :maxlength="30"
          :placeholder="t('请输入新用户PIN')"
        />
      </FormItem>
      <FormItem :label="`${t('确认新用户 PIN')}:`" name="confirmPin">
        <InputPassword
          v-model:value="dataForm.confirmPin"
          @blur="doubleCheck"
          :maxlength="30"
          :placeholder="t('请确认新用户PIN')"
        />
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
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue'
import type { UsbKeyAppInfoItem } from '../../../types/fisec'
/* 第三方模块 */
import { Modal, Form, FormItem, Input, Button, InputPassword } from 'ant-design-vue'
/* 本地模块 */
import { useRestPin } from '../../../controller/useFisec'
import { t } from '../../../languages/useLanguage'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  record: {
    type: Object as PropType<UsbKeyAppInfoItem>,
    default: () => {}
  }
})

const emit = defineEmits(['update:visible', 'refresh'])

const { dialogVisible, dataForm, rules, handleSubmit, closeModal, doubleCheck } = useRestPin(
  props,
  emit
)
</script>
