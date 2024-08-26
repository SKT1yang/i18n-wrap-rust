<!--
 * @Name: 确认新增网口资产
 * @Description: 添加
-->
<template>
  <Modal :title="t('新增网口')" v-model:open="dialogVisible">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 6 }">
      <FormItem name="networkName" :label="t('网口名称')">
        <Input v-model:value="dataForm.networkName" :maxlength="10" :placeholder="t('请输入网口名称')" />
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
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { ref, watch } from 'vue';
import { Input, Modal, Button, Form, FormItem } from 'ant-design-vue';
import { useVModel } from '@guolisec/utils'
import { message } from '@guolisec/toast';
import { createNetworkApi } from '@/model/mergeAsset';
import { t } from '@/languages/useLanguage'

// 父组件传值
const props = defineProps<{
  visible: boolean;
  uid: string
}>();

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)
const formRef = ref<FormInstance>()

const dataForm = ref({
  networkName: '',
  mainUid: ''
})

const rules: Record<string, Rule[]> = {
  networkName: [
    {
      required: true,
      message: t("请输入网口名称"),
      trigger: "blur",
    }
  ],
}


// 弹窗逻辑
watch(
  () => props.visible,
  async (val) => {
    if (val) {
      dataForm.value.mainUid = props.uid;
      dataForm.value.networkName = '';
    }
  },
)

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}

async function handleSubmit() {
  await formRef.value?.validate()
  await createNetworkApi(dataForm.value);
  message.success(t('操作成功'));
  closeModal();
}
</script>
