<!--
 * @name: 迁移时未使用
 * @author: bwb
 * @description: 迁移时未使用
 * @path: \network\src\views\FlowPage\components\FlowSetRemarkModal.vue
-->
<template>
  <Modal :open="open" @cancel="emit('update:open', false)" :ok-button-props="{ loading: loading }" title="设置备注"
    :min-height="50" :mask-closable="false" :can-fullscreen="false" @ok="handleSubmit">
    <Form :model="form">
      <FormItem label="备注" name="remark"><Input allow-clear autocomplete="off" v-model:value="form.remark"
          placeholder='请输入备注' showCount :maxlength="30"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script setup name="FlowSetRemark" lang="ts">
import { saveInterfaceRemarkApi } from '../../../model/flow';
import { ref, watch } from 'vue';
import { message, Modal, Input, Form, FormItem } from "ant-design-vue"
const emit = defineEmits(['setRemark', 'update:open']);
const form = ref<{ remark?: string }>({ remark: undefined })

let interfaceName = ref('');
let ip = ref('');

const parentProps = defineProps<{ open: boolean, networkInterface: any, ip: any, remark: any }>()
watch(() => parentProps.open, () => {
  if (parentProps.open == true) {
    form.value.remark = undefined;
    interfaceName.value = parentProps.networkInterface
    ip.value = parentProps.ip
    if (parentProps.remark) {
      form.value.remark = parentProps.remark;
    }
  }
})
const loading = ref(false)
// 保存
async function handleSubmit() {
  try {
    loading.value = true;
    saveInterfaceRemarkApi({
      interfaceName: interfaceName.value,
      ip: ip.value,
      remark: form.value.remark,
    }).then(() => {
      message.success('保存成功');
      emit('setRemark', form.value.remark);
      emit('update:open', false)
    });
  } finally {
    loading.value = false;
  }
}
</script>
