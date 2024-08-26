<!--
 * @name: 关联事件配置
 * @author: bwb
 * @description: 关联事件配置
 * @path: \event\src\views\policy\Safety\index.vue
-->
<template>
  <div class="p-4">
    <Card>
      <Row>
        <Col :span="12">
        关联事件清单
        </Col>
        <Col :span="12" align="end">
        <Button @click="handleCreate" :disabled="!newable" class="mb-2" type="primary">
          <div class="flex flex-center">
            <div class="i-base-add-circle-line m-r-2 scale-125"></div>
            新增关联事件
          </div>
        </Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" bordered @change="handleChange" :pagination="pagin" rowKey='id' :columns="columns"
        :data-source="tableData.list">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'action'">
            <Popconfirm :title="record.id !== -1 ? '是否确认删除' : '是否确认取消'" v-if="record.id == -1 || record.id !== 0"
              @confirm="handleDelete(record)">
              <Button danger>{{ record.id !== -1 ? '删除' : '取消' }}</Button>
            </Popconfirm>
          </template>
        </template>
      </Table>
      <SelectEventModal v-model:open="open" :record="record" :idx="idx" :eventStoreName="eventStoreName" @refresh="query"
        @finish="newable = true" @continue="handleSuccess" />
    </Card>
  </div>
</template>

<script name="AssetList" lang="tsx" setup>
import { Tag, Button, Card, Table, Modal, message, Row, Col, Popconfirm } from 'ant-design-vue';
import {
  EventStoreName,
  IAssociateEventStore,
  CustomRenderOpt,
  getEventComposeSettingListApi,
  deleteEventComposeSettingApi,
} from '../../../model/policy';
import type { TableColumnsType } from "ant-design-vue"
import { Event } from './components/SelectEventModal/types/event.class';
import SelectEventModal from "./components/SelectEventModal/index.vue"
import { onMounted, reactive, ref } from 'vue';
import { getPagin } from '../../../utils/getPagin';

const newable = ref(true)
const { tableData, pagin } = getPagin();

const handleChange = (e) => {
  if (newable.value == false) {
    Modal.confirm({
      content: "是否中断新增操作？",
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        tableData.current = e.current
        tableData.pageSize = e.pageSize
        newable.value = true;
        query();
      }
    })
  } else {
    tableData.current = e.current
    tableData.pageSize = e.pageSize
    query();
  }
}

onMounted(() => {
  query()
})

const tableLoading = ref(false)
const query = async () => {
  tableLoading.value = true;
  await getEventComposeSettingList({
    page: tableData.current,
    size: tableData.pageSize,
  }).then((res) => {
    tableLoading.value = false;
    let indexShow = 1 + tableData.pageSize * (tableData.current - 1)
    tableData.total = res.totalElements
    tableData.list = res.content.map(value => {
      return { ...value, indexShow: indexShow++ }
    })
  })
}

function customRenderFactory(eventStoreName: EventStoreName) {
  return (opt: CustomRenderOpt) => {
    const eventStore = opt.record[eventStoreName];
    if (eventStore.id) {
      return (
        <Tag
          class="cursor-pointer table_tag"
          color={'pink'}
          onClick={() => {
            handleSelect(opt.record, opt.index, eventStoreName);
          }}
        >
          {eventStore.name}
        </Tag>
      );
    } else {
      return (
        <div class='w-full flex flex-center'>
          <Button
            class='flex flex-center'
            type={'primary'}
            onClick={() => {
              handleSelect(opt.record, opt.index, eventStoreName);
            }}
          >
            <div class="i-base-add-circle-line scale-125"></div>
          </Button>
        </div>
      );
    }
  };
}

// 查看数据
const columns: TableColumnsType = [
  {
    title: '序号',
    dataIndex: 'indexShow',
    align: 'center',
    width: 100
  },
  {
    title: '事件A',
    dataIndex: 'eventStoreA',
    customRender: customRenderFactory('eventStoreA'),
    align: 'center',
    width: 500
  },
  {
    title: '事件B',
    dataIndex: 'eventStoreB',
    customRender: customRenderFactory('eventStoreB'),
    align: 'center',
    width: 500
  },
  {
    title: '事件C',
    dataIndex: 'eventStoreC',
    customRender: customRenderFactory('eventStoreC'),
    align: 'center',
    width: 500
  }, {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 300
  }
];

function getEventComposeSettingList(queryForm) {
  return getEventComposeSettingListApi(queryForm);
}

function handleCreate() {
  newable.value = false
  let operateRecord = reactive<IAssociateEventStore>({
    id: -1,
    eventStoreA: new Event(),
    eventStoreB: new Event(),
    eventStoreC: new Event(),
  });
  // 加一为新增栏占位
  tableData.total = tableData.total + 1;
  // 移动到最后一页
  tableData.current = Math.floor(tableData.total / tableData.pageSize) + 1
  // 查询最后一页数据
  query().then(() => {
    // 添加新增栏
    tableData.list.push(operateRecord)
  })
}

const open = ref(false)
const record = ref()
const idx = ref()
const eventStoreName = ref()

function handleSelect(record_p: IAssociateEventStore, idx_p: number, eventStoreName_p: EventStoreName) {
  record.value = record_p;
  idx.value = idx_p;
  eventStoreName.value = eventStoreName_p;
  open.value = true;
}

/**
 *删除数据
 */
async function handleDelete(record) {
  if (record.id == -1) {
    deleteOne(record)
    return;
  }
  await deleteEventComposeSettingApi(record);
  message.success('删除成功！');
  query().then(() => {
    handleEmptyPage();
  })
}
const handleEmptyPage = () => {
  if (tableData.list.length == 0) {
    if (tableData.current != 1) {
      tableData.current = tableData.current - 1;
      query();
    }
  }
}

/**
 * 更新资产列表
 */
function handleSuccess(
  dataForm: IAssociateEventStore,
) {
  tableData.list[tableData.list.length - 1] = dataForm
}

const deleteOne = (record) => {
  if (record.id == -1) {
    tableData.list.pop();
    handleEmptyPage();
    newable.value = true;
  }
}
</script>

<style scoped>
::v-deep .table_tag {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
