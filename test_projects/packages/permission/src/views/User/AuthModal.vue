
<!--
 * @name: 权限配置弹窗
 * @description: Do not edit
-->
<template>
  <Modal :title="t('用户授权')" v-model:open="dialogVisible">
    <Form :model="dataForm" :rules="rules" ref="formRef">
      <FormItem prop="roleId" :label="`${t('角色名称')}:`">
        <Select v-model:value="dataForm.roleId" :placeholder="t('请选择权限')" allowClear>
          <SelectOption v-for="item in normalRoleList" :value="item.id" :key="item.id">
            {{ item.name }}
          </SelectOption>
        </Select>
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
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from "ant-design-vue/es/form";
import { ref, watch } from 'vue'
import { message } from '@guolisec/toast'
import { usePermissionStoreWithOut } from '../../model/store'
import { Modal, Form, FormItem, Button, Select, SelectOption } from 'ant-design-vue'
import { useVModel } from '@guolisec/utils'
import { setUserRole, getRoleList } from '../../service/role'
import { t } from '@/languages/useLanguage'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object,
    default: () => {
      return {}
    }
  }
});

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)
const permissionStore = usePermissionStoreWithOut()

const formRef = ref<FormInstance>()

const systemId = permissionStore.getSystemInfo?.id

let dataForm = ref({
  id: 0,
  roleId: 0,
});
const rules = ref<Record<string, Rule[]>>({
  roleId: [
    {
      required: true,
      message: t('请选择权限'),
      trigger: 'change',
    },
  ]
})

// 角色列表
let normalRoleList = ref<
  {
    id: number;
    name: string;
    privilege: number;
  }[]
>([]);


watch(
  () => props.visible,
  async (val) => {
    if (val) {
      formRef.value?.resetFields()
      dataForm.value.id = props.current.id
      dataForm.value.roleId = props.current.roleId === 0 ? undefined : props.current.roleId
      if (systemId) {
        const { normal } = await getRoleList()
        normalRoleList.value = normal;
      }
    }
  },
)

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}

// 保存
async function handleSubmit() {
  await formRef.value?.validate();
  if (systemId && dataForm.value.roleId) {
    const res = await setUserRole({
      systemId,
      ...dataForm.value,
    })
    message.success(res);
    emit('refresh');
    closeModal();
  }
}
</script>