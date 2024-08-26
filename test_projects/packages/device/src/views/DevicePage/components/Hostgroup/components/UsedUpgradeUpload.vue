<template>
  <Space style="margin-bottom: 15px">
    <Upload :show-upload-list="true" :file-list="stateWrap.fileList" @remove="handleRemove" :disabled="uploading"
      :before-upload="beforeUpload" :max-count="1">
      <Button> 选取升级文件 </Button>
    </Upload>
    <Button type="primary" :loading="uploading" :disabled="stateWrap.fileList.length === 0" @click="uploadFile">
      上传
    </Button>
    <Button type="primary" @click="query()"> 刷新 </Button>
  </Space>
  <Table @change="handleChange" size="small" bordered :columns="columns" :data-source="tableData.list"
    :pagination="pagin"></Table>
</template>

<script name="UsedUpgradeUpload" lang="tsx" setup>
import { formatToDate } from '@guolisec/utils';
import type { TableColumnsType } from "ant-design-vue"
import { uploadHostGuardServerApi, getUploadFileApi } from "../../../../../model/device"
import { Button, Upload, Space, message, Table } from 'ant-design-vue';
import { reactive, ref, computed, onMounted } from 'vue';

const tableData = reactive<{ list: any[], current: number, pageSize: number, total: number }>({ list: [], current: 1, pageSize: 10, total: 0 })
const pagin = computed(() => ({
  current: tableData.current,
  showSizeChanger: true,
  defaultPageSize: tableData.pageSize,
  total: tableData.total,
  showQuickJumper: true,
  showTotal: () => `共${tableData.total}条信息,共${Math.ceil(tableData.total / tableData.pageSize)}页`,
}))
const stateWrap = reactive<any>({
  fileList: [],
});

const uploading = ref(false);

const beforeUpload = (file) => {
  stateWrap.fileList = [file];
  return false;
};

const uploadFile = () => {
  uploading.value = true;
  const form = new FormData();
  form.append('multipartFile', stateWrap.fileList[0]);
  uploadHostGuardServerApi(form)
    .then(async () => {
      uploading.value = false;
      await message.success('上传成功', 1);
      stateWrap.fileList = [];
      query();
    })
    .finally(() => {
      uploading.value = false;
    });
};

const handleRemove = () => {
  stateWrap.fileList = [];
};

const columns: TableColumnsType = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center'
  },
  {
    title: '文件名称',
    dataIndex: 'fileVersion',
    align: 'center'
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    align: 'center',
    customRender: ({ text }) => {
      return formatToDate(text, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
const query = () => {
  getUploadFileApi().then(res => {
    let indexShow = 1 + (tableData.current - 1) * tableData.pageSize
    tableData.list = res.content.map(value => {
      return { ...value, index: indexShow++ }
    });
    tableData.total = res.totalElements
  })
}

const handleChange = (e) => {
  tableData.current = e.current;
  tableData.pageSize = e.pageSize;
  query()
}

onMounted(() => {
  query()
})
</script>
