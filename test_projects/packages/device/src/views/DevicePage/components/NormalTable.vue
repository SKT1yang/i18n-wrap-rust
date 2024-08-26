<template>
  <div>
    <Form>
      <Row class="space-x-3">
        <FormItem>
          <Input placeholder="请输入资产名称" v-model:value="searchForm.name"
            @change="_ => parentEmit('update:searchForm', { ...searchForm, name: searchForm.name })"></Input>
        </FormItem>
        <FormItem>
          <Input placeholder="请输入IP地址" v-model:value="searchForm.assetIp"
            @change="_ => parentEmit('update:searchForm', { ...searchForm, assetIp: searchForm.assetIp })"></Input>
        </FormItem>
        <FormItem class="w-50">
          <Cascader :value="tempGroup" changeOnSelect expand-trigger="hover" @change="onSelect" :options="treeData.data"
            :placeholder="'请填写资产组'">
          </Cascader>
        </FormItem>
        <FormItem class="w-50">
          <Select allow-clear class="w-[10em]" placeholder="请选择运行状态" @select="onSelectStatus"
            :options="statusTable"></Select>
        </FormItem>
        <FormItem>
          <Button @click="parentEmit('query')">查询</Button>
        </FormItem>
        <FormItem>
          <Button :disabled="!selected" @click="updateAll">批量升级</Button>
        </FormItem>
      </Row>
    </Form>
    <Table :size="'small'" :columns="columns" :data-source="data.list" :scroll="{ x: 2000 }" @change="handleChange"
      :pagination="pagin" :row-key="row => row.id" :row-selection="rowSelection">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'runStatus'">
          <Tag :color="colorSet[record.runStatus]">{{ runstatusSet[record.runStatus] }}</Tag>
        </template>
        <template v-if="column.dataIndex == 'operation'">
          <Button type="link" @click="handleView(record)" v-show="record.isSupportRateSetting">管理</Button>
          <Divider type="vertical" v-show="record.isSupportRateSetting"></Divider>
          <Button type="link" @click="handleUpdate(record)" :disabled="record.runStatus === 0">升级</Button>
        </template>
        <template v-if="rateColumns.includes(column.title as string)">
          <div>
            <span :style="decideByRecord(column, record)">{{ getUsage(column, record) }}%</span> /
            <span style="color: #909399">{{ getRate(column, record) }}%</span>
          </div>
        </template>
      </template>
    </Table>
    <UpdateModal :record="record" v-model:open="open" @query="parentEmit('query')"></UpdateModal>
  </div>
</template>

<script lang='ts' setup>
import { reactive, ref, computed } from 'vue';
import { Button, Row, Input, FormItem, Form, Select, Table, Cascader, Tag, Divider } from 'ant-design-vue'
import { assetGroupTree } from "../../../model/device"
import { columns } from "../../../views/DevicePage/columns/index"
import { useStore } from "../../../model/deviceStore"
import UpdateModal from './UpdateModal.vue';
import { go } from '@guolisec/routerable';


const open = ref(false);
const { data } = useStore();
const parentProps = defineProps<{ searchForm: any, parentPage: string }>()
const parentEmit = defineEmits(['update:searchForm', 'query'])
const runstatusSet = ['离线', '在线', '闲置'];
const colorSet = ['red', 'green', 'default'];
const rateColumns = ['CPU 使用率', '内存使用率', '磁盘使用率'];
const rateName = ['cpu', 'rom', 'ram'];

const showInPolicy = computed(() => {
  if (parentProps.parentPage) {
    return parentProps.parentPage === 'policy';
  } else {
    return true;
  }
});
// 按钮disabled状态 根据是否选中判断
const selected = ref(false)
// 多选选中行
const selectedRows = ref()
// 表格多选对象
const rowSelection = reactive({
  onChange: (e) => {
    selectedRows.value = e
    if (e.length > 0) {
      selected.value = true
    } else {
      selected.value = false
    }
  }
})
const pagin = computed(() => ({
  current: data.current,
  pageSize: data.pageSize,
  showQuickJumper: true,
  defaultPageSize: 10,
  total: data.total,
  showTotal: () => `共${data.total}条信息,共${Math.ceil(data.total / data.pageSize)}页`,
}))

const getUsage = (column, record) => {
  return record.resourceDTO?.usagePage[0] ? record.resourceDTO?.usagePage[0][rateName[rateColumns.indexOf(column.title)] + 'Usage'] : '-'
}

const getRate = (column, record) => {
  return record.resourceDTO?.resourceRate[rateName[rateColumns.indexOf(column.title)] + 'Rate'] ?? '-'
}

const decideByRecord = (column, record) => {
  const usage = record.resourceDTO?.usagePage[0] ? record.resourceDTO?.usagePage[0][rateName[rateColumns.indexOf(column.title)] + 'Usage'] ?? '-' : '-';
  const rate = record.resourceDTO?.resourceRate[rateName[rateColumns.indexOf(column.title)] + 'Rate'] ?? '-';
  let fontColor = 'color: #d1d1d1';
  if (usage && rate && usage > rate) {
    fontColor = 'color: red';
  }
  return { fontColor }
}

const statusTable = [{ value: '0', label: '离线' }, { value: '1', label: '在线' }, { value: '2', label: '闲置' }];
let tempGroup = ref();
let tempGroupKey = ref();

const onSelect = (value, option) => {
  tempGroup.value = option ? option[option.length - 1].label : undefined
  tempGroupKey.value = value;
  parentEmit('update:searchForm', { ...parentProps.searchForm, assetGroupId: tempGroupKey.value })
}

const onSelectStatus = (value, option) => {
  parentEmit('update:searchForm', { ...parentProps.searchForm, runStatus: value })
}

const treeData = reactive<{ data: any }>({ data: [] })

const allTreeNodeID: string[] = []
const transform2treeform = (res) => {
  return res.map((value) => {
    allTreeNodeID.push(value.id)
    if (Array.isArray(value.children)) {
      return {
        title: value.label,
        key: value.id,
        label: value.label,
        value: value.id,
        children: transform2treeform(value.children)
      }
    } else {
      return {
        title: value.label,
        label: value.label,
        value: value.id,
        key: value.id
      }
    }
  })
}

assetGroupTree().then((res) => {
  treeData.data = transform2treeform(res)
})
const handleChange = (e, _f, sorter) => {
  data.current = e.current;
  data.pageSize = e.pageSize;
  data.sort = sorter.order ? sorter.field + "," + (sorter.order as string).match(/(.*)end/)![1] : undefined;
  parentEmit("query")
}

const record = ref();
const handleUpdate = (record_p) => {
  open.value = true;
  record.value = record_p
}

const updateAll = () => {
  open.value = true;
  let tempArray = data.list.filter(value => {
    return selectedRows.value.includes(value.id)
  }).map((value) => {
    return value.sn;
  })
  record.value = {
    sn: tempArray
  }
}

function handleView(record) {
  go({
    name: 'preference',
    query: {
      name: record.name,
      ip: record.assetIp,
      status: record.runStatus,
      sn: record.sn,
      id: record.resourceDTO?.resourceRate.id,
      cpu: record.resourceDTO?.resourceRate?.cpuRate,
      ram: record.resourceDTO?.resourceRate?.ramRate,
      rom: record.resourceDTO?.resourceRate?.romRate,
      activeKey: data.key,
    },
  });
}
</script>
<style scoped></style>