<!--
 * @name: 资产组新增/修改弹窗
 * @description: Do not edit
-->
<template>
  <Modal :title="title" v-model:open="dialogVisible" @cancel="closeModal" :closable="false" :mask-closable="false">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 5 }">
      <FormItem name="label" :label="t('资产组名称')">
        <Input v-model:value="dataForm.label" :maxlength="16" :placeholder="t('请输入资产组名称')" autocomplete="off" />
      </FormItem>
      <FormItem name="remarks" :label="t('备注')">
        <Textarea :autoSize="{ minRows: 3, maxRows: 3 }" v-model:value="dataForm.remarks" :maxlength="50"
          :placeholder="t('请输入备注')" autocomplete="off" />
      </FormItem>
    </Form>
    <template #footer>
      <div>
        <Button @click="closeModal">{{ t("取消") }}</Button>
        <Button type="primary" @click="handleSubmit" :loading="confirmLoading">{{ t("确定") }}</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { FormInstance } from 'ant-design-vue';
import type { IAssetGroupTreeItem } from '@guolisec/types';
import { Rule } from 'ant-design-vue/es/form';
import { PropType } from 'vue';
/* 第三方模块 */
import { ref, watch, computed, nextTick } from 'vue'
import { message } from '@guolisec/toast'
import { Modal, Form, FormItem, Input, Button, Textarea } from 'ant-design-vue';
import { useVModel, withoutSpacialCharValidate } from '@guolisec/utils';
/* 本地模块 */
import { updateAssetGroupApi } from '@/model/group'
import { t } from '@/languages/useLanguage'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  assetGroup: {
    type: Object as PropType<IAssetGroupTreeItem>,
    default: () => { }
  },
  mode: {
    type: String as PropType<'create' | 'modify'>,
    default: 'create'
  },
});

const title = computed(() => (props.mode === 'create' ? t('新增资产组') : t('编辑资产组')));

const dataForm = ref({
  label: "", // 资产组名称
  remarks: '', // 备注
});

const rules = ref<Record<string, Rule[]>>({
  label: [
    {
      validator: withoutSpacialCharValidate({
        emptyMsg: "请输入资产组名称",
      }),
      trigger: "blur",
    }
  ]
});

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)
const formRef = ref<FormInstance>()

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      await nextTick()
      formRef.value?.resetFields()
      dataForm.value = {
        label: "", // 资产组名称
        remarks: '', // 备注
      }
      if (props.mode === 'modify') {
        Object.assign(dataForm.value, props.assetGroup)
      }
    }
  },
)

// 保存
const confirmLoading = ref(false)
async function handleSubmit() {
  confirmLoading.value = true
  try {
    await formRef.value?.validate()
    const form = props.mode === 'create'
      ? {
        parentId: props.assetGroup.id,
        ...dataForm.value
      }
      : {
        id: props.assetGroup.id,
        ...dataForm.value
      }
    await updateAssetGroupApi(form)
    message.success(t('操作成功'))
    emit('refresh');
    closeModal();
  } finally {
    confirmLoading.value = false
  }
}

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}

</script>