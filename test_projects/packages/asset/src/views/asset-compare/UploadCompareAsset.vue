<!--
 * @name: 导入需要对比的资产
 * @description: Do not edit
 * @path: \asset\src\views\list\UploadAsset.vue
-->
<template>
  <Upload :show-upload-list="false" accept=".xlsx,.xls,.csv" v-model:file-list="fileList" :max-count="1"
    :before-upload="beforeUpload" :disabled="loading" :custom-request="handleUpload" :multiple="false">
    <Button type="primary" :loading="loading" :disabled="loading">
      <i class="i-base-upload-line align-icon"></i>
      导入资产核查清单
    </Button>
  </Upload>
</template>

<script lang='ts' setup>
import { type UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import { ref } from 'vue'
import { Button, Upload } from 'ant-design-vue';
import { message } from '@guolisec/toast'
import { compareAssetApi } from '../../model/compare'

const emit = defineEmits(['refresh'])

const fileList = ref([])

const loading = ref(false)

async function handleUpload(options: UploadRequestOption<any>) {
  const file = options.file
  if (file) {
    loading.value = true
    const formData = new window.FormData();
    formData.append('multipartFile', file)
    message.success(`正在导入`);
    try {
      await compareAssetApi(formData)
      message.success(`导入成功`);
    } catch (e) {
      console.warn("@guolisec/asset handleUpload", e)
      message.error(e?.response?.data?.message)
    } finally {
      loading.value = false
      emit('refresh')
    }
  }
}

function beforeUpload(file) {
  let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
  if (!['xlsx', 'xls', 'csv'].includes(extension.toLowerCase())) {
    message.warning(`只能上传xlsx,xls,csv文件`);
    return false;
  } else {
    return true
  }
}
</script>