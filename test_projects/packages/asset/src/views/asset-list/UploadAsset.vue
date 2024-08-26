<!--
 * @name: 导入资产
 * @description: Do not edit
-->
<template>
  <Upload :show-upload-list="false" accept=".xlsx,.xls,.csv" v-model:file-list="fileList" :max-count="1"
    :before-upload="beforeUpload" :disabled="loading" :custom-request="handleUpload" :multiple="false">
    <Button :loading="loading" :disabled="loading">
      {{ t("导入") }}
    </Button>
  </Upload>
</template>

<script lang='ts' setup>
import { type UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import { ref } from 'vue'
import { Button, Upload } from 'ant-design-vue';
import { message } from '@guolisec/toast'
import {
  importAssetTableApi,
  importAnGangExcelApi
} from '@/model/list'
import { t } from '@/languages/useLanguage'
import { isShowByFeature } from './context/useListContext';

const emit = defineEmits(['refresh'])

const fileList = ref([])

const loading = ref(false)

async function handleUpload(options: UploadRequestOption<any>) {
  const file = options.file
  if (file) {
    loading.value = true
    const formData = new window.FormData();
    formData.append('multipartFile', file)
    try {
      await importAssetTable(formData)

    } finally {
      loading.value = false
      emit('refresh')
    }
  }
}

function beforeUpload(file) {
  let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
  if (!['xlsx', 'xls', 'csv'].includes(extension.toLowerCase())) {
    message.warning(t("只能上传xlsx,xls,csv文件"));
    return false;
  } else {
    return true
  }
}

const showAngang = ref(isShowByFeature('an-gang'))
async function importAssetTable(formData) {
  // 隐藏鞍钢特性，使用常规导入
  return showAngang.value ? await importAnGangExcel(formData) : await importAssetExcel(formData)
}

async function importAnGangExcel(formData) {
  const res = await importAnGangExcelApi(formData)
  if (Array.isArray(res)) {
    res.forEach(item => {
      message.warning(item)
    })
  } else {
    message.success(res)
  }
}

async function importAssetExcel(formData) {
  await importAssetTableApi(formData)
  message.success(t("导入成功"));
}
</script>