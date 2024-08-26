<template>
  <Modal :title="'配置'" :open="open" @cancel="parentFunc('update:open', false)" :ok-button-props="{ loading: butLoading }"
    :can-fullscreen="false" :ok-text="'确认'" :cancel-text="'取消'" @ok="handleSubmit" destroy-on-close>
    <Form>
      <FormItem required>
        <Select v-model:value="fileVersion" allow-clear :options="options"></Select>
      </FormItem>
    </Form>
  </Modal>
</template>

<script lang="ts" setup>
import { Modal, Form, FormItem, Select, message } from "ant-design-vue"
import { getUploadFileApi, distributeUploadFileApi } from '../../../../../model/device';
import { ref, onMounted } from "vue";

const butLoading = ref(false)
const parentProps = defineProps<{ open: boolean, clientIDs: any, preVersion: any, computerIP: any, groupId: number }>()
const parentFunc = defineEmits(['update:open', 'confirm'])
const options = ref([]);
const clientIDs = ref([]);
const preVersion = ref('');
const computerIP = ref('');
const type = ref('');

const fileVersion = ref();

onMounted(() => {
  getUploadFileApi().then((res) => {
    options.value = res.content;
  })
})

const handleSubmit = async () => {
  butLoading.value = true;
  const data = {
    clientIDs: undefined,
    fileVersion: fileVersion.value,
    preVersion: preVersion.value,
    computerIP: computerIP.value,
    registerType: 1,
    groupId: parentProps.groupId,
  };
  if (type.value === 'batch') {
    data.clientIDs = clientIDs.value as any;
  }
  try {
    await distributeUploadFileApi(data);
    message.success('成功！');
    parentFunc('update:open', false)
    parentFunc('confirm');
  } catch (e) {
    butLoading.value = false
  }
};
</script>