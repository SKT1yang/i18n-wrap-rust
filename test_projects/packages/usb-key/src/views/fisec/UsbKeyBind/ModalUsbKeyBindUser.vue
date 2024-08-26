<!--
 * @name: 用户绑定 USB Key\解绑 USB Key
 * @description: 弹窗
-->
<template>
  <Modal
    :title="type === 'bind' ? t('绑定 USB Key') : t('解绑 USB Key')"
    v-model:open="dialogVisible"
    @cancel="closeModal"
    :destroy-on-close="true"
  >
    <Form
      :model="dataForm"
      :rules="rules"
      ref="formRef"
      :label-col="{ span: language === 'en' ? 10 : 6 }"
    >
      <FormItem :label="`${t('用户名')}:`" name="label">
        <Input
          v-model:value="dataForm.username"
          disabled
          :maxlength="16"
          :placeholder="t('请输入用户名')"
        />
      </FormItem>
      <FormItem :label="`${t('设备序列号')}:`" name="sn">
        <Select
          v-model:value="dataForm.sn"
          :options="snOptions"
          :filter-option="filterOption"
          show-search
          :placeholder="t('请选择设备序列号')"
          allowClear
          @change="checkSn"
        />
      </FormItem>
      <FormItem :label="`${t('管理员 PIN')}:`" name="pin">
        <InputPassword
          v-model:value="dataForm.pin"
          :maxlength="30"
          :placeholder="t('请输入管理员 PIN')"
        />
      </FormItem>
    </Form>

    <template #footer>
      <div>
        <Button @click="closeModal">{{ t('取消') }}</Button>
        <Button type="primary" @click="handleSubmit" v-if="showOkBtn">{{
          type === 'bind' ? t('绑定') : t('解绑')
        }}</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue'
/* 第三方模块 */
import { Modal, Form, FormItem, Input, Button, Select, InputPassword } from 'ant-design-vue'
import { filterOption } from '@guolisec/utils'
/* 本地模块 */
import { useUSBKeyBindUser } from '../../../controller/useFisec'
import { t, language } from '../../../languages/useLanguage'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  // 解绑或者绑定USBKey
  type: {
    type: String as PropType<'bind' | 'unbind'>,
    required: true,
    default: 'bind'
  },
  record: {
    type: Object as PropType<{
      name?: string
      username?: string
      sn?: string
    }>,
    default: () => {}
  }
})

const emit = defineEmits(['update:visible', 'refresh'])

const {
  snOptions,
  dialogVisible,
  dataForm,
  rules,
  showOkBtn,
  handleSubmit,
  closeModal,
  checkSn,
  formRef
} = useUSBKeyBindUser(props, emit)
</script>
