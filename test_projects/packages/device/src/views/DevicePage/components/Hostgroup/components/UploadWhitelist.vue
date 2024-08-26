<!--
 * @Name: 修改接口弹窗
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-03-28 09:19:22
 * @LastEditTime: 2023-12-14 15:09:07
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="">
    <Modal :open="open" :mask-closable="true" :can-fullscreen="false" @cancel="emit('update:open', false)"
      :cancel-text="'取消导入'" :ok-text="'确认导入'" @ok="handleSubmit" :show-cancel-btn="false" :show-ok-btn="false">
      <template #title>导入白名单</template>
      <div style="margin-bottom: 15px">
        <Upload :show-upload-list="false" :file-list="state.fileList" @remove="handleRemove" :disabled="uploading"
          accept=".xlsx" :before-upload="beforeUpload" :custom-request="uploadFile">
          <Button type="primary" :loading="uploading">
            <UploadOutlined />
            请选择文件上传
          </Button>
        </Upload>
      </div>
      <a @click="downloadTemplate" style="margin-left: 15px">点击下载白名单导入模板</a>
    </Modal>
  </div>
</template>
<script setup name="UploadWhitelist" lang="ts">
import { Button, Upload, Modal, message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';

import {
  downloadByData,
  exportHpsFileWhiteApi,
  importFileWhiteApi,
} from '../../../../../model/device';
import { reactive, ref, watch } from 'vue';


const state = reactive<any>({
  record: undefined,
  groupIdList: undefined,
  uuidList: undefined,
  fileList: [],
  uuids: undefined,
});
const parentProps = defineProps<{ open: boolean, record: any }>()

watch(parentProps, () => {
  state.record = parentProps.record;
  state.groupIdList = { groupIdList: parentProps.record?.id };
  state.uuids = parentProps.record?.hpsGroupRecordList.map((item) => {
    return item.uuid;
  });
}, {
  deep: true
})

const handleSubmit = () => {
  uploadFile();
};

const downloadTemplate = async () => {
  const data = await exportHpsFileWhiteApi({});
  downloadByData(data, '白名单导入模板.xlsx', 'text/xlsx');
};

const uploading = ref(false);
const beforeUpload = (file) => {
  let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
  if (extension.toLowerCase() !== 'xlsx') {
    message.warning({
      content: '只能上传xlsx文件',
    });
    return false;
  } else {
    state.fileList = [file];
  }
  // return false;
};
const emit = defineEmits(['success', 'update:open']);
const uploadFile = async () => {
  uploading.value = true;
  const form = new FormData();
  form.append('file', state.fileList[0]);
  state.uuidList = { uuidList: state.uuids };
  importFileWhiteApi(form, state.uuidList)
    .then(async () => {
      uploading.value = false;
      await message.success('上传成功，准备开始导入', 1);
      emit('success');
      emit('update:open', false)
    })
    .finally(() => {
      uploading.value = false;
    });
};
const handleRemove = () => {
  state.fileList = [];
};
</script>
