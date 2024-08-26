<!--
 * @Name: 修改接口弹窗
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-03-28 09:19:22
 * @LastEditTime: 2023-12-14 15:08:34
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="">
    <Modal v-bind="$attrs" :title="!isUpdate ? '新建分组' : '管理分组'" :height="800" :mask-closable="true" :open="open"
      :can-fullscreen="false" :width="'70%'" :cancel-text="!isUpdate ? '取消新建' : '取消修改'"
      @cancel="emit('update:open', false)" :ok-text="!isUpdate ? '确认新建' : '确认修改'" @ok="handleSubmit">
      <Form :model="form">
        <Row>
          <Col :span="10">
          <FormItem label="分组名">
            <Input placeholder="请输入分组名" v-model:value="form.label" :maxlength="30" required></Input>
          </FormItem>
          </Col>
          <Col :span="3" />
          <Col :span="10">
          <FormItem label="分组描述">
            <Input placeholder="请输入描述语" v-model:value="form.remarks" :maxlength="30" required></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="titles">
        <div class="title">未添加主机列表</div>
        <div class="gap"></div>
        <div class="title">已添加主机列表</div>
      </div>
      <Transfer pagination :show-select-all="false" show-search v-model:target-keys="targetKeys"
        :data-source="state.hostList" :filter-option="transferFilter" :operations="['加入分组', '移出分组']"
        :rowKey="(record) => record.uuid" @change="onChange">
        <template #children="{ filteredItems, selectedKeys, onItemSelect, onItemSelectAll }">
          <Table bordered :columns="columns" size="small" :data-source="filteredItems"
            :row-selection="getRowSelection({ selectedKeys, onItemSelect, onItemSelectAll })" />
        </template>
      </Transfer>
    </Modal>
  </div>
</template>
<script setup name="GroupModal" lang="ts">
import { Transfer, Table, Modal, Form, message, FormItem, Input, Row, Col } from 'ant-design-vue';

import {
  addHpsGroupApi,
  getNoGroupHpsRegisterApi,
  getHpsAliveStatusApi,
  getScheduleStatusApi,
} from '../../../../../model/device';
import { reactive, ref, watch } from 'vue';

const emit = defineEmits(['success', 'update:open']);
const data = defineProps<{ open: boolean, isUpdate: boolean, id: any, record: any }>();

const form = reactive({ label: undefined, remarks: undefined })
const targetKeys = ref<string[]>([]);

const parentId = ref<number>();

// 分组内的主机（判断状态要用到）
const tempHosts = ref([]);

const columns = [
  {
    dataIndex: ['environmentVO', 'hostName'],
    title: '设备名称',
  },
  {
    dataIndex: 'ip',
    title: 'IP 地址',
  },
  {
    dataIndex: 'uuid',
    title: '序列号',
  }
];

const transferFilter = (inputValue, item) => {
  if (
    item.hostName.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
    item.ip.indexOf(inputValue) !== -1 ||
    item.uuid.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
  ) {
    return item;
  }
};

const getRowSelection = ({ selectedKeys, onItemSelect, onItemSelectAll }) => {
  return {
    onSelect({ key }, selected) {
      onItemSelect(key, selected);
    },
    onSelectAll(selected: boolean, selectedRows) {
      const treeSelectedKeys = selectedRows.map(({ key }) => key);
      onItemSelectAll(treeSelectedKeys, selected);
    },
    selectedRowKeys: selectedKeys,
  };
};

const state = reactive<any>({
  record: undefined,
  hostList: [],
});

watch(data, async () => {
  form.label = undefined;
  form.remarks = undefined;
  targetKeys.value = [];
  if (data.isUpdate) {
    state.record = data.record;
    parentId.value = data.record?.parentId;
    state.hostList = await getNoGroupHpsRegisterApi({ groupId: data.record.id });
    const hpsGroupRecordList = data.record.hpsGroupRecordList;
    tempHosts.value = data.record.hpsGroupRecordList;
    if (hpsGroupRecordList.length > 0) {
      targetKeys.value = hpsGroupRecordList.map((item) => {
        return item.uuid;
      });
    }
    form.label = data.record.label;
    form.remarks = data.record.remarks;
  } else {
    state.hostList = await getNoGroupHpsRegisterApi();
  }
}, {
  immediate: true,
  deep: true
})

const handleSubmit = async () => {
  const data_p = {
    isUpdate: data.isUpdate,
    id: undefined,
    label: form.label,
    remarks: form.remarks,
    hostUuidList: targetKeys.value,
    isStrict: true,
    parentId: parentId.value,
  };
  if (data_p.isUpdate) {
    data_p.id = state.record.id;
  }
  await addHpsGroupApi(data_p);
  message.success(`${data.isUpdate ? '修改' : '新建'}成功！`);
  emit('update:open', false)
  emit('success');
};


// 检查列表中是否有存活的主机
const checkAliveHost = (list) => {
  return list.some((item) => {
    return item.isAlive;
  });
};

// 主机扫描状态
const getScanStatus = async (uuids) => {
  const aliveStatus = await getHpsAliveStatusApi({ uuidList: uuids });
  if (tempHosts.value.length > 0) {
    tempHosts.value.forEach((hps) => {
      // @ts-ignore
      hps.isAlive = aliveStatus[hps.uuid];
    });
  }

  if (tempHosts.value.length > 0) {
    const res = await getScheduleStatusApi({ uuids: uuids });
    // 如果返回数据为空，就设为未扫描，且流程结束
    if (res.length < 1) {
      tempHosts.value.forEach((hps) => {
        // @ts-ignore
        hps.processStatus = true;
      });
    }
    // 更新表格数据（扫描状态）
    res.forEach((item) => {
      tempHosts.value.forEach((hps) => {
        // 这里要注意 查询状态接口返回数据中的uuid 是不是和 弹窗列表中的uuid 一样
        // @ts-ignore
        if (hps.uuid === item.uuid) {
          // 完整流程标志：结束or未结束
          // @ts-ignore
          hps.processStatus = item.processStatus;
        }
      });
    });
    // 判断分组内是否存在处于扫描流程中的主机，存在返回true，不存在返回false
    const hasScanningHost = tempHosts.value.some((item) => {
      // @ts-ignore
      return item.processStatus === false && item.isAlive;
    });
    // 判断分组内是否有存活的主机
    const hasAliveHost = checkAliveHost(tempHosts.value);
    return hasAliveHost && hasScanningHost;
  }
};

const onChange = async (t, direction, moveKeys) => {
  console.log('onChange', t, direction, moveKeys);
  if (direction === 'left') {
    const isScanning = await getScanStatus(moveKeys);
    if (isScanning) {
      Modal.warning({
        iconType: 'warning',
        title: '警告',
        content: `移出分组的主机中包含正在扫描的主机！`,
      });
    }
  }
};
</script>
<style scoped>
.titles {
  display: flex;
  margin-bottom: 8px;

}

.gap {
  width: 108px;
  flex: none;
}

.title {
  flex: 1 1 50%;
  color: white;
  font-size: 1rem;
}
</style>
