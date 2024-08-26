<!--
 * @name: 关联事件配置 新增关联事件弹窗
 * @author: bwb
 * @description: 关联事件配置 新增关联事件弹窗
 * @path: \event\src\views\policy\Safety\components\SelectEventModal\index.vue
-->
<template>
  <Modal :open="parentProps.open" @cancel="emit('update:open', false)" :title="title" width="1200px" :min-height="700"
    :show-cancel-btn="false" :show-ok-btn="false">
    <Form :wrapper-col="{ span: 17 }" :label-col="{ span: 5 }" layout="inline" :model="form">
      <FormItem name="name" style="width:500px" label='事件名称'>
        <Input v-model:value="form.name" :maxlength="30" placeholder='请输入数据名称'></Input>
      </FormItem>
      <FormItem name="typeId" style="width:500px" label="事件类型">
        <Cascader :expand-trigger="'hover'" change-on-select v-model:value="form.typeId" :options="casOptions.list"
          :fieldNames="{ label: 'name', value: 'id', children: 'eventTypes' }" placeholder='请选择事件类型' />
      </FormItem>
      <div class="w-full flex flex-end">
        <Button @click="reset" class="m-r-2">重置</Button>
        <Button type="primary" @click="() => { tableData.current = 1; query() }">查询</Button>
      </div>
    </Form>
    资产列表
    <Table @change="handleChange" :columns="columns" :data-source="tableData.list" :pagination="pagin" size="small"
      rowKey="id" bordered :searchInfo="searchInfo">
      <template #bodyCell="{ column, record }">
        <template v-if="column.title == '操作'">
          <Button type="primary" @click="handleSubmit(record)">设为关联事件</Button>
        </template>
      </template>
    </Table>
  </Modal>
</template>

<script name="SelectEventModal" lang="ts" setup>
import { computed, reactive, ref, unref, watch } from 'vue';
import { Modal, Table, message, Button, Input, Form, FormItem, Cascader } from "ant-design-vue"
import { EventStoreName, IEvent, IAssociateEventStore } from './types/event';
import { Event } from './types/event.class';
import type { TableColumnsType } from "ant-design-vue"

import {
  getEventStoreTreeApi,
  getEventStoreApi,
  modifyEventComposeSettingApi,
  createEventComposeSettingApi,
} from '../../../../../model/policy';
import { getPagin } from '../../../../../utils/getPagin';

const casOptions = reactive<{ list: any[] }>({ list: [] });

const { tableData, pagin } = getPagin();
const emit = defineEmits(['refresh', 'continue', 'update:open', 'finish']);
const handleChange = (event) => {
  tableData.current = event.current;
  tableData.pageSize = event.pageSize;
  query()
}

// 操作的表单
let dataForm = reactive<IAssociateEventStore>({
  id: 0,
  eventStoreA: new Event(),
  eventStoreB: new Event(),
  eventStoreC: new Event(),
});

// 关联事件列表行下标
let currentIdx = ref<number>(0);

// 本次操作的事件keyname
let currentEventStoreName = ref<EventStoreName>('eventStoreA');

const parentProps = defineProps<{ open: boolean, idx: any, record: any, eventStoreName: any }>()

watch(() => parentProps.open, () => {
  if (!parentProps.open) return;
  getEventStoreTreeApi().then((res) => {
    casOptions.list = res
  })
  Object.assign(dataForm, parentProps.record);
  currentIdx.value = parentProps.idx;
  currentEventStoreName.value = parentProps.eventStoreName;
  //重置表单后会自动reload表格
  reset();
  query()
}, {
  deep: true
})

const reset = () => {
  form.name = undefined;
  form.typeId = undefined;
}

// 查看数据
const columns: TableColumnsType = [
  {
    title: '事件名',
    dataIndex: 'name',
    align: 'center',
    ellipsis: true
  },
  {
    title: '事件类型',
    dataIndex: 'type',
    align: 'center',
    ellipsis: true
  }, {
    title: '操作',
    dataIndex: 'operation',
    align: 'center'
  }
];

const form = reactive<{ name?: string, typeId: any }>({
  name: undefined,
  typeId: undefined
});

const searchInfo = reactive<any>({});

const isEdit = computed(() => {
  return dataForm.id > 0;
});

const title = computed(() => {
  const event = currentEventStoreName.value.slice(-1);
  return isEdit.value ? '修改关联事件' + event : '新增关联事件' + event;
});

function query() {
  getEventStoreApi({
    page: tableData.current,
    size: tableData.pageSize,
    name: form.name,
    typeId: form.typeId,
  }).then((res) => {
    tableData.total = res.totalElements;
    tableData.list = res.content
  })
}

async function handleSubmit(record: any) {
  try {
    dataForm[currentEventStoreName.value] = { ...record };
    let pickList: IEvent[] = [];
    ['eventStoreA', 'eventStoreB', 'eventStoreC'].forEach((key) => {
      if (dataForm[key].name) {
        pickList.push(dataForm[key]);
      }
    });
    let repeatFlag = false;
    // 数据大于两个时开始校验重复
    if (pickList.length >= 2) {
      for (let i = 1; i < pickList.length; i++) {
        if (pickList[i].name === pickList[i - 1].name) {
          repeatFlag = true;
        }
      }
    }
    if (repeatFlag) {
      message.warning('存在重复事件名!');
    } else {
      if (unref(isEdit)) {
        await modifyEventComposeSettingApi(dataForm);
        message.success('修改关联事件成功!');
        emit('refresh');
      } else {
        // 事件添加完整后直接调用接口
        if (dataForm.eventStoreA.id && dataForm.eventStoreB.id && dataForm.eventStoreC.id) {
          await createEventComposeSettingApi(dataForm);
          message.success('新增关联事件成功!');
          emit('finish');
          emit('refresh');
        } else {
          message.success('请继续添加事件！');
          emit(
            'continue',
            JSON.parse(JSON.stringify(dataForm))
          );
        }
      }
    }
  } finally {
    emit('update:open', false);
  }
}
</script>
