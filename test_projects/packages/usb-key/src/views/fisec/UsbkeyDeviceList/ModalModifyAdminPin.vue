<!--
 * @name: 修改管理员PIN
 * @description: 弹窗
-->
<template>
  <Modal
    :title="t('修改管理员PIN')"
    v-model:open="dialogVisible"
    @cancel="closeModal"
    :destroy-on-close="true"
  >
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 7 }">
      <FormItem :label="`${t('设备序列号')}:`" name="sn">
        <Input
          v-model:value="dataForm.sn"
          disabled
          :maxlength="16"
          :placeholder="t('请输入设备序列号')"
        />
      </FormItem>
      <FormItem :label="`${t('旧管理员 PIN')}:`" name="oldPin">
        <InputPassword
          v-model:value="dataForm.oldPin"
          :maxlength="30"
          :placeholder="t('请输入旧管理员 PIN')"
        />
      </FormItem>
      <FormItem :label="`${t('新管理员 PIN')}:`" name="newPin">
        <InputPassword
          v-model:value="dataForm.newPin"
          :maxlength="30"
          :placeholder="t('请输入新管理员 PIN')"
        />
      </FormItem>
      <FormItem :label="`${t('确认新管理员 PIN')}:`" name="confirmPin">
        <InputPassword
          v-model:value="dataForm.confirmPin"
          @blur="doubleCheck"
          :maxlength="30"
          :placeholder="t('请确认新管理员 PIN')"
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
import { useModifyAdminPin } from '../../../controller/useFisec'
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

const { dialogVisible, dataForm, rules, handleSubmit, closeModal, doubleCheck } = useModifyAdminPin(
  props,
  emit
)
</script>
