<template>
  <div>
    <Card size="small">
      <Form>
        <Row justify="space-between">
          <Col :span="6">
          <FormItem label="升级版本">
            <Select placeholder="请选择升级版本" allow-clear v-model:value="fileVersion"></Select>
          </FormItem>
          </Col>
          <Col :span="6">
          <FormItem label="更新状态">
            <Select allow-clear placeholder="请选择更新状态" v-model:value="statusCode" :options="fileOptions.options"></Select>
          </FormItem>
          </Col>
          <Col :span="2">
          <FormItem>
            <Button @click="query">查询</Button>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Table @change="handleChange" size="small" :columns="columns" bordered :pagination="pagin"
      :data-source="tableData.list"></Table>
  </div>
</template>

<script name="UsedUpgradeRecord" lang="tsx" setup>
import { getUploadHistoryApi, getUploadFileApi } from "../../../../../model/device"
import type { TableColumnsType } from "ant-design-vue"
import { formatToDate } from '@guolisec/utils';
import { Tag, Table, Form, FormItem, Row, Col, Select, Button, Card } from 'ant-design-vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const fileVersion = ref(), statusCode = ref();
const fileOptions = {
  options: [
    {
      label: '更新失败',
      value: 2,
    },
    {
      label: '更新成功',
      value: 3,
    },
  ],
  fileVersion: [],
}


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
    align: 'center',
    customRender({ text }) {
      return text ? text.split('/')[text.split('/').length - 1] : '-';
    },
  },
  {
    title: '升级状态',
    dataIndex: 'statusCode',
    align: 'center',
    customRender({ text, record }) {
      if (text === 2) {
        if (record.errorCode === 2) {
          return <Tag color="error">升级超时</Tag>;
        } else {
          return <Tag color="error">更新失败</Tag>;
        }
      } else {
        const d = {
          0: {
            text: '未更新',
            color: 'default',
          },
          1: {
            text: '更新中',
            color: 'processing',
          },
          3: {
            text: '更新成功',
            color: 'success',
          },
          4: {
            text: '更新中',
            color: 'processing',
          },
        };
        return <Tag color={d[text].color}>{d[text].text}</Tag>;
      }
    },
  },
  {
    title: '升级时间',
    dataIndex: 'createTime',
    align: 'center',
    customRender: ({ text }) => {
      return formatToDate(text, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];

const query = () => {
  getUploadHistoryApi({
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

onMounted(() => {
  getUploadFileApi().then(res => {
    fileOptions.fileVersion = res.content.map(value_p => {
      return { value: value_p.fileVersion, label: value_p.fileVersion }
    })
  })
})


const handleChange = (e) => {
  tableData.current = e.current;
  tableData.pageSize = e.pageSize;
  query()
}

watch(props, () => {
  query()
}, {
  immediate: true,
  deep: true
})
</script>
