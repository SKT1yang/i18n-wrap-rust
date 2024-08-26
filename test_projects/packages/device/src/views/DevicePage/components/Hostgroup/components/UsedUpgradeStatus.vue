<template>
  <div>
    <Button class="float-right" @click="query" type="primary"> 刷新 </Button>
    <Table @change="handleChange" size="small" bordered :pagination="pagin" :columns="columns"
      :data-source="tableData.list">
    </Table>
  </div>
</template>

<script name="UsedUpgradeStatus" lang="tsx" setup>
import { formatToDate } from '@guolisec/utils';
import { Tag, Table, Button } from 'ant-design-vue';
import { computed, reactive, watch } from 'vue';
import { getUpdateStatusApi } from "../../../../../model/device"
import type { TableColumnsType } from "ant-design-vue"

const props = defineProps({
  groupId: {
    type: Number,
  },
});
const tableData = reactive<{ list: any[], current: number, pageSize: number, total: number }>({ list: [], current: 1, pageSize: 10, total: 0 })

const pagin = computed(() => ({
  current: tableData.current,
  showSizeChanger: true,
  defaultPageSize: tableData.pageSize,
  total: tableData.total,
  showQuickJumper: true,
  showTotal: () => `共${tableData.total}条信息,共${Math.ceil(tableData.total / tableData.pageSize)}页`,
}))

const columns: TableColumnsType = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center'
  },
  {
    title: '客户端ID',
    dataIndex: 'clientID',
    align: 'center'
  },
  {
    title: 'IP地址',
    dataIndex: 'clientIp',
    align: 'center'
  },
  {
    title: '升级版本',
    dataIndex: 'fileVersion',
    customRender({ text }) {
      return text ? text.split('/')[text.split('/').length - 1] : '-';
    },
    align: 'center'
  },
  {
    title: '升级状态',
    dataIndex: 'allowUpdate',
    customRender({ text }) {
      const t = text ? 1 : 0;
      const runstatusSet = ['准备更新', '正在更新'];
      const colorSet = ['default', 'green'];
      return <Tag color={colorSet[t]}>{runstatusSet[t]}</Tag>;
    },
    align: 'center'
  },
  {
    title: '升级时间',
    dataIndex: 'createTime',
    customRender: ({ text }) => {
      return formatToDate(text, 'YYYY-MM-DD HH:mm:ss');
    },
    align: 'center'
  },
];

const query = () => {
  getUpdateStatusApi({
    page: tableData.current,
    size: tableData.pageSize,
    groupId: props.groupId,
    registerType: 1,
  }).then((res) => {
    let indexShow = 1 + (tableData.current - 1) * tableData.pageSize
    tableData.list = res.content.map(value => {
      return { ...value, index: indexShow++ }
    });
    tableData.total = res.totalElements;
  })
}

const handleChange = (e) => {
  tableData.current = e.current;
  tableData.pageSize = e.pageSize;
  query()
}

watch(props, () => {
  query()
}, {
  deep: true,
  immediate: true
})
</script>
