<!--
 * @name: 批量分组资产弹窗
 * @description: Do not edit
-->
<template>
  <Modal :title="t('资产分组')" v-model:open="dialogVisible" :width="450" :closable="false" :mask-closable="false">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 6 }">
      <FormItem name="assetGroupId" :label="`${t('资产组')}:`">
        <SelectTreeAssetGroup v-model:value="dataForm.assetGroupId" />
      </FormItem>
    </Form>

    <template #footer>
      <div>
        <Button @click="closeModal">{{ t("取消") }}</Button>
        <Button type="primary" @click="handleSubmit">{{ t("确定") }}</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
/* 第三方模块 */
import { ref, watch } from 'vue'
import { Modal, Form, FormItem, Button } from 'ant-design-vue';
import { message } from '@guolisec/toast'
import { useVModel } from '@guolisec/utils';
/* 本地模块 */
import SelectTreeAssetGroup from '@/views/form/SelectTreeAssetGroup.vue';
import { setAssetGroupIdApi } from '@/model/group'
import { t } from '@/languages/useLanguage'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  assetIds: {
    type: Object as PropType<number[]>,
    default: () => []
  },
});

const dataForm = ref({
  assetGroupId: undefined, // 资产组
});

const rules = ref<Record<string, Rule[]>>({
  assetGroupId: [
    {
      required: true,
      message: t("请选择资产组"),
      trigger: "change",
    }
  ],
});

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)
const formRef = ref<FormInstance>()

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      formRef.value?.resetFields()
    }
  },
)

// 保存
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    await setAssetGroupIdApi({
      assetGroupId: dataForm.value.assetGroupId,
      assetIdList: props.assetIds,
    });
    message.success(t('操作成功'));
    emit('refresh');
    closeModal();
  } finally {
  }
}

function closeModal() {
  dialogVisible.value = false
}

</script>