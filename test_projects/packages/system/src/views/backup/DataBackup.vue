<!--
 * @name: 数据备份
 * @description: Do not edit
 * @date: 2023-06-26 14:04:36
 * @path: \system\src\views\backup\DataBackup.vue
-->
<template>
  <div class="systemBackUpDataBackup space-y-4">
    <Form layout="inline">
      <FormItem>
        <Space>
          <Button @click="doSearch">
            <i class="i-base-refresh-line"></i>
            刷新
          </Button>
          <Popconfirm title="确定要删除选中记录吗?" ok-text="确认" cancel-text="取消" @confirm="deleteBatch">
            <Button type="primary" danger>
              <i class="i-base-delete-bin"></i>批量删除
            </Button>
          </Popconfirm>

          <Button @click="openExportModal">
            <i class="i-base-download-2-line"></i>
            导出
          </Button>
          <Upload :file-list="state.fileList" :before-upload="beforeUpload" :disabled="state.uploading"
            :show-upload-list="false" :custom-request="uploadFile" accept=".bin">
            <Button :loading="state.uploading">
              <i class="i-base-upload-2-line"></i>
              导入
            </Button>
          </Upload>
        </Space>
      </FormItem>
    </Form>
    <!-- 备份列表 -->
    <Table :data-source="tableData" :columns="columns" :pagination="pagination" :row-selection="rowSelection" row-key="id"
      bordered @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <div class="space-x-4">
            <Button type="primary" @click="download(record)">下载</Button>
            <Popconfirm title="确定要备份吗?" ok-text="确认" cancel-text="取消" @confirm="deleteOne(record)">
              <Button class="ml-2" danger>删除</Button>
            </Popconfirm>
          </div>
        </template>
      </template>
    </Table>
  </div>

  <DataBackupExportModal ref="exportModalRef" @getOutputRecord="doSearch" />
</template>
<script setup name="SystemBackUpDataBackup" lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import {
  Form,
  FormItem,
  Space,
  Button,
  Popconfirm,
  Upload,
  notification,
  Table,
} from 'ant-design-vue';
import type { TableProps, ColumnProps } from "ant-design-vue/es/table";
import type { Key } from 'ant-design-vue/es/table/interface';
import DataBackupExportModal from './DataBackupExportModal.vue';
import { formatToDate } from '@guolisec/utils';
import {
  getBackupRecordApi,
  deleteBackupRecordFileApi,
  downloadBackupFileApi,
  importBackupFileApi,
} from '../../model/backup';
import { message } from '@guolisec/toast';

// 其他数据
let state = reactive({
  tableLoading: false,
  uploading: false,
  fileList: [], // 上传文件
});

const tableData = ref([]);

const total = ref();
const currentPage = ref(1);
const pageSize = ref(10);
const sort = ref("createTime,desc");

const pagination = computed(() => {
  return {
    total: total.value,
    current: currentPage.value,
    pageSize: pageSize.value,
  };
});

const handleTableChange: TableProps["onChange"] = (
  pag,
  _filters,
  sorter: any
) => {
  pageSize.value = pag.pageSize || pageSize.value;
  currentPage.value = pag.current || currentPage.value;
  if (sorter && sorter.field) {
    const { order, field } = sorter as any;
    sort.value = order === "ascend" ? `${field},asc` : `${field},desc`;
  }
  getBackupRecord();
};

const columns: ColumnProps[] = [
  {
    title: '导出时间',
    dataIndex: 'createTime',
    align: 'center',
    ellipsis: true,
    sorter: true,
    customRender: ({ text }) => {
      return formatToDate(text, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '数据时间',
    dataIndex: 'startTime',
    align: 'center',
    ellipsis: true,
    sorter: true,
    customRender: ({ text }) => {
      return formatToDate(text, 'YYYY-MM-DD');
    },
  },
  {
    title: '文件名',
    dataIndex: 'fileName',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '文件大小',
    dataIndex: 'sizeStr',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    ellipsis: true,
    sorter: true,
    customRender: ({ text }) => {
      if (text === 0) {
        return '导出中';
      } else if (text === 1) {
        return '成功';
      } else if (text === 2) {
        return '失败';
      } else {
        return '异常';
      }
    },
  },
  {
    title: '文件大小',
    dataIndex: 'sizeStr',
    align: 'center',
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
  },
]

const ids = ref<Key[]>([]) // 表格选中数据
const rowSelection: TableProps['rowSelection'] = {
  onChange(selectedRowKeys) {
    ids.value = selectedRowKeys
  },
}

// 组件
const exportModalRef = ref();

// 刷新
const doSearch = () => {
  currentPage.value = 1
  getBackupRecord()
};

// 获取备份记录
async function getBackupRecord() {
  const res = await getBackupRecordApi({
    page: currentPage.value,
    size: pageSize.value,
    sort: sort.value,
  });

  tableData.value = res.content;
  total.value = res.totalElements;
}

// 批量删除
const deleteBatch = () => {
  if (ids.value.length === 0) {
    message.warning('请选择需要删除的记录');
  } else {
    deleteRecord(ids.value);
  }
};

// 单个删除
const deleteOne = (record) => {
  deleteRecord([record.id]);
};

// 删除备份
const deleteRecord = (ids) => {
  deleteBackupRecordFileApi({ idList: ids }).then(() => {
    message.success('删除成功');
    getBackupRecord();
  });
};

// 导出备份
const download = (record) => {
  downloadBackupFileApi({
    id: record.id,
  }).then((res) => {
    handleBlob(res, record.fileName);
  });
};

const handleBlob = (data, name) => {
  const blob = new Blob([data], {
    type: 'application/zip',
  });
  const url = window.URL.createObjectURL(blob); // 创建下载的链接
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  document.body.appendChild(a);
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  notification.warning({
    message: '成功',
    description: '导出成功',
    duration: 0,
  });
};

// 上传文件之前的钩子
const beforeUpload = (file) => {
  let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
  if (extension.toLowerCase() !== 'bin') {
    notification.warning({
      message: '警告',
      description: '只能上传bin文件',
    });
  } else {
    state.fileList = [file];
  }
};

// 上传文件
const uploadFile = () => {
  state.uploading = true;
  const formData = new window.FormData();
  formData.append('multipartFile', state.fileList[0]);
  message.success('数据导入中，请耐心等待！');
  // 接口error的message需要页面没有其他message时才会显示，所以等success结束后访问接口
  setTimeout(() => {
    importBackupFileApi(formData)
      .then(() => {
        message.success('数据导入成功');
      })
      .catch(() => {
        // todo 导入失败提示未测试
      })
      .finally(() => {
        state.uploading = false;
        state.fileList = [];
      });
  }, 3500);
};

// 导出弹窗
const openExportModal = () => {
  exportModalRef.value.openModal();
};

onMounted(() => {
  getBackupRecord()
})
</script>
