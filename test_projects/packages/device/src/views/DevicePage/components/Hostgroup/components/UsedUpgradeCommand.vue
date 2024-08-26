<template>
  <div>
    <Card size="small" class="m-b-1">
      <Form>
        <Row justify="space-between">
          <Col :span="8">
          <FormItem label="当前版本">
            <Select v-model:value="fileVersion" placeholder="请选择当前版本" allow-clear :options="fileVersionOption"></Select>
          </FormItem>
          </Col>
          <Col :span="2" />
          <Col :span="8">
          <FormItem label="IP">
            <Input v-model:value="computerIP" placeholder="请输入IP地址"></Input>
          </FormItem>
          </Col>
          <Col :span="2">
          <Button type="primary" @click="query">查询</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <div>
      <Button class="float-right" @click="upgrade('all')" type="primary"> 升级全部 </Button>
      <Button class="float-right m-r-3" @click="upgrade('batch')" type="primary" :disabled="selectedRows.length === 0">
        升级选中
      </Button>
    </div>
    <Table size="small" bordered :pagination="pagin" v-model:row-selection="rowSelection" row-key="clientID"
      @change="handleChange" :data-source="tableData.list" :columns="columns">
    </Table>
    <UsedUpgradeCommandModal :mytype="type" :clientIDs="selectedRows" :preVersion="preVersion" :computerIP="computerIP"
      v-model:open="open" @confirm="handleConfirm" :groupId="props.groupId ?? 1" />
  </div>
</template>

<script name="UsedUpgradeCommand" lang="tsx" setup>
import { getUploadFileApi, getHitClientApi, } from '../../../../../model/device';
import { Button, Table, Form, FormItem, Row, Col, Select, Input, Card } from "ant-design-vue"
import type { TableColumnsType } from "ant-design-vue"
import UsedUpgradeCommandModal from './UsedUpgradeCommandModal.vue';
import { computed, onMounted, reactive, ref } from 'vue';

// 按钮disabled状态 根据是否选中判断
const selected = ref(false)
// 多选选中行
const selectedRows = ref<any[]>([])
// 表格多选对象
const rowSelection = reactive({
  onChange: (e) => {
    selectedRows.value = e
    if (e.length > 0) {
      selected.value = true
    } else {
      selected.value = false
    }
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
const fileVersion = ref();
const props = defineProps({
  groupId: {
    type: Number,
  },
});
const type = ref(undefined);
const preVersion = ref();
const open = ref(false);
const computerIP = ref();
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
    title: 'IP',
    dataIndex: 'computerIP',
    align: 'center'
  },
  {
    title: '当前版本',
    dataIndex: 'version',
    align: 'center',
    customRender({ text }) {
      return text ? text.split('/')[text.split('/').length - 1] : '-';
    },
  }
];

const fileVersionOption = ref();
onMounted(async () => {
  const { content } = await getUploadFileApi();
  fileVersionOption.value = [...content, { label: 'HPS1000_V2.0', value: 'HPS1000_V2.0' }];
  query();
})

const query = () => {
  getHitClientApi({
    page: tableData.current,
    size: tableData.pageSize,
    status: 1,
    registerType: 1,
    groupId: props.groupId,
    fileVersion: fileVersion.value,
    computerIP: computerIP.value
  }).then(res => {
    let indexShow = 1 + (tableData.current - 1) * tableData.pageSize
    tableData.list = res.content.map(res => {
      return { ...res, index: indexShow++ }
    })
    tableData.total = res.totalElements
  })
}

const handleChange = (e) => {
  tableData.current = e.current;
  tableData.pageSize = e.pageSize;
  query()
}

const upgrade = (target) => {
  type.value = target;
  preVersion.value = fileVersion.value;
  open.value = true;
};

function handleConfirm() {
  selectedRows.value.length = 0;
  query();
}
</script>
