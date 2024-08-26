
<!--
 * @name: 新增修改角色弹窗
 * @description: Do not edit
-->
<template>
  <Modal :title="isEdit ? t('修改角色') : t('新增角色')" v-model:open="dialogVisible" :width="500">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 5 }">
      <FormItem name="name" :label="t('角色名')">
        <Input v-model:value="dataForm.name" :maxlength="20" :disabled="isEdit" :placeholder="t('请输入角色名')" allowClear />
      </FormItem>
      <FormItem name="remark" :label="t('备注')">
        <Input v-model:value="dataForm.remark" :maxlength="100" :placeholder="t('请输入备注')" allowClear />
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
/* 类型文件 */
import type { PropType } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { Role } from '../../types/role'
/* 第三方模块 */
import { ref, watch, computed } from 'vue'
import { message } from '@guolisec/toast'
import { Modal, Form, FormItem, Button, Input } from 'ant-design-vue'
import { useVModel } from '@guolisec/utils'
/* 本地模块 */
import { usePermissionStoreWithOut } from '../../model/store'
import { modifyRoleInfo, createRole } from '../../service/role'
import { t } from '@/languages/useLanguage'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object as PropType<Role>,
    default: () => {
      return {}
    }
  }
});

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)
const permissionStore = usePermissionStoreWithOut()

const isEdit = computed(() => {
  return Boolean(props.current.id)
})

const formRef = ref<FormInstance>()

const systemId = permissionStore.getSystemInfo?.id

let dataForm = ref({
  name: '',
  remark: '',
});
const rules = ref<Record<string, Rule[]>>({
  name: [
    {
      required: true,
      message: t('请输入角色名'),
      trigger: 'blur',
    },
  ],
})


watch(
  () => props.visible,
  async (val) => {
    if (val) {
      await formRef.value?.resetFields()
      dataForm.value.name = props.current.name
      dataForm.value.remark = props.current.remark
    }
  },
)

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}

// 保存
async function handleSubmit() {
  if (isEdit.value) {
    await modifyRoleInfo(Object.assign(props.current, dataForm.value))
    message.success(t('修改角色成功'));
  } else {
    systemId && await createRole({
      name: dataForm.value.name,
      remark: dataForm.value.remark,
      privilege: 1,
      systemId,
    })
    message.success(t('新增角色成功'));
  }
  emit('refresh');
  closeModal();
}
</script>