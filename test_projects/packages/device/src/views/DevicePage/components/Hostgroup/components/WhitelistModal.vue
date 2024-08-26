<template>
  <div>
    <Modal :open="open" :height="800" :mask-closable="true" :can-fullscreen="false" :width="1000" :show-cancel-btn="false"
      :show-ok-btn="false" @visible-change="handleVisibleChange">
      <template #title>
        <label>批量扫描白名单</label>
        <span class="title_append" v-if="titleAppend">/&nbsp;{{ titleAppend }} </span>
        <span class="title_append" style="color: #ed6f6f">*此操作只对 V2.0 设备生效</span>
      </template>
      <div class="m-b-]15px">
        <Button type="primary" class="mr-2" @click="handleStartScan" :disabled="data.length < 1 || isScanning">
          <CaretRightOutlined />开始扫描
        </Button>
        <Button type="primary" class="mr-2" danger @click="confirmStop" :disabled="data.length < 1 || !isScanning">
          <StopFilled />终止扫描
        </Button>
        <Button @click="handleClickUpload" :disabled="data.length < 1 || isScanning">
          <UploadOutlined />导入白名单
        </Button>
      </div>
      <Table bordered :columns="columns" :data-source="data" @change="handleTableChange" :pagination="{
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
        showQuickJumper: true,
      }" :rowKey="'uuid'" :loading="loading" :row-class-name="deadRowStyle">
        <template #bodyCell="{ column, record, index }">
          <div v-if="column.key === 'currentSchedule'">
            <div style="display: flex" v-if="record.isAlive">
              <Progress :percent="record.currentSchedule" stroke-linecap="square" :trailColor="'#464646'"
                :status="barStatus(record)" />
            </div>
            <div v-else>--</div>
          </div>
          <div v-if="column.key === 'index'">
            {{ index + 1 + (current - 1) * pageSize }}
          </div>
        </template>
      </Table>
    </Modal>
    <UploadWhitelist v-model:open="UploadModal" :record="record" @success="handleUploadDone" />
  </div>
</template>
<script setup name="WhitelistModal" lang="tsx">
import { Table, Button, Progress, Tag, Modal, message } from 'ant-design-vue';
import { CaretRightOutlined, UploadOutlined, StopFilled } from '@ant-design/icons-vue';

import {
  sendFileWhiteScanByGroupApi,
  stopFileWhiteScanByGroupApi,
  showFileScanStatusByGroupApi,
  getHpsIsAliveByGroupApi,
  showScheduleByGroupApi,
} from '../../../../../model/device'

import UploadWhitelist from './UploadWhitelist.vue';
import { reactive, ref, watch } from 'vue';

// 表格列
const columns = [
  {
    title: '序号',
    key: 'index',
  },
  {
    dataIndex: ['environmentVO', 'hostName'],
    title: '设备名称',
    key: 'name',
  },
  {
    dataIndex: 'ip',
    title: 'IP 地址',
    key: 'ip',
  },
  {
    dataIndex: 'isAlive',
    title: '在线状态',
    key: 'isAlive',
    customRender: ({ text }) => {
      return text ? <Tag color="green">在线</Tag> : <Tag color="red">离线</Tag>;
    },
  },
  {
    dataIndex: 'scanFlowStatus',
    title: '流程状态',
    key: 'status',
    customRender: ({ text, record }) => {
      // 原来的扫描状态 0:未扫描;1:扫描中;2:扫描出错;3:扫描结束
      // 现在的扫描状态： 未扫描 扫描中 扫描结束 数据开始同步 数据同步中 数据同步异常中断 数据同步结束
      const l = [
        '未扫描', //0
        '扫描中', //1
        '扫描出错', //2
        '扫描结束', //3
        '数据开始同步', //4
        '数据同步中', //5
        '数据同步出错', //6
        '流程结束', //7
        '导入中', //8
        '导入出错', //9
        '导入结束', //10
      ];
      if (!record.isAlive) {
        return '--';
      }
      return l[text] ? l[text] : '未扫描';
    },
  },
  {
    dataIndex: 'currentSchedule',
    title: '进度',
    key: 'currentSchedule',
    width: 150,
  },
];

// 分页
const current = ref(1);
const pageSize = ref(10);
const handleTableChange = (pagination) => {
  current.value = pagination.current;
  pageSize.value = pagination.pageSize;
};

// 响应式数据
const state = reactive<any>({
  record: undefined,
  timerId: undefined,
});

// 加载中标记
const loading = ref<boolean>(false);

// 扫描中标记
const isScanning = ref<boolean>(false);

// 初始虚假进度
const fakeValue = ref<number>(5);

// 弹窗title后面追加的内容
const titleAppend = ref('');

// 弹窗表格数据
const data = ref<any[]>([]);
const parentProps = defineProps<{ record: any, open: boolean }>()

watch(parentProps, () => {
  state.record = parentProps.record;
  data.value = state.record.hpsGroupRecordList.filter((item) => {
    // 只有 2.0 的主机才有扫描功能，所以需要筛选
    return item.registerType === 2;
  });
  // 如果表格已有数据，就启动轮询检查一下
  if (data.value.length > 0) {
    // const allIds = getUuids();
    startLoop();
  }
}, {
  deep: true
})
// 状态
const getScanStatus = async () => {
  const aliveStatus = await getHpsIsAliveByGroupApi({ groupId: state.record.id });
  if (data.value.length > 0) {
    data.value.forEach((hps) => {
      hps.isAlive = aliveStatus[hps.uuid];
    });
  }

  if (data.value.length > 0) {
    // const res = await getScheduleStatusApi({ uuids: uuids });
    const res = await showFileScanStatusByGroupApi({ groupId: state.record.id });
    // 如果返回数据为空，就设为未扫描，且流程结束
    if (res.length < 1) {
      data.value.forEach((hps) => {
        hps.scanFlowStatus = 0;
        hps.processStatus = true;
      });
    }
    // 更新表格数据（扫描状态）
    res.forEach((item) => {
      data.value.forEach((hps) => {
        // 这里要注意 查询状态接口返回数据中的uuid 是不是和 弹窗列表中的uuid 一样
        if (hps.uuid === item.uuid) {
          /**
           * 出现过这种情况，不知如何描述状态
           * 
           *  id: 293
              insertStatus: 3
              processStatus: true
              scanStatus: 1
              uuid: "1F07451F-2D01-12B6-B44C-27FE24B0A26A"
           */
          // 扫描状态
          hps.scanFlowStatus = item.scanStatus;
          // 模式标志：扫描or导入
          hps.actionMode = item.actionMode;
          // 导入状态
          if (item.actionMode === 2) {
            const d = {
              1: 8,
              2: 9,
              3: 10,
            };
            hps.scanFlowStatus = d[item.scanStatus];
          }
          // 进度
          hps.currentSchedule = item.scanStatus === 3 && hps.isAlive ? 100 : 0;
          // 插入状态
          hps.insertStatus = item.insertStatus;
          // 完整流程标志：结束or未结束
          hps.processStatus = item.processStatus;
          // 数据同步状态，以及，流程结束状态
          if ((item.scanStatus === 3 || item.scanStatus === 0) && item.insertStatus === 1) {
            hps.scanFlowStatus = 5;
          }
          // 流程结束，且没有出错
          if (item.scanStatus === 3 && item.processStatus) {
            hps.scanFlowStatus = 7;
          }
          // 流程结束，但是出错了
          if (item.processStatus && item.insertStatus === 0) {
            if (item.actionMode === 1 && item.scanStatus === 2) {
              hps.scanFlowStatus = 2;
            }
            if (item.actionMode === 2 && item.scanStatus === 2) {
              hps.scanFlowStatus = 9;
            }
          }
          if (item.processStatus && item.insertStatus === 2) {
            hps.scanFlowStatus = 6;
          }
        }
      });
    });
    // 判断分组内是否存在处于扫描流程中的主机，存在返回true，不存在返回false
    const hasScanningHost = data.value.some((item) => {
      return item.processStatus === false && item.isAlive;
    });
    // 判断分组内是否有存活的主机
    const hasAliveHost = checkAliveHost(data.value);
    return hasAliveHost && hasScanningHost;
    // return hasScanningHost;
  }
};

// 点击开始扫描
const handleStartScan = async () => {
  message.info('开始扫描！');
  // const uuids = getUuids();
  // await getFileWhiteScanApi({ uuids: uuids });
  await sendFileWhiteScanByGroupApi({ groupId: state.record.id });
  startLoop();
  if (!checkAliveHost(data.value)) {
    message.info('主机已离线！');
  }
};

// 检查列表中是否有存活的主机
const checkAliveHost = (list) => {
  return list.some((item) => {
    return item.isAlive;
  });
};

// 进度条状态
const barStatus = (record) => {
  // 如果离线，进度条状态置为默认
  if (!record.isAlive) {
    return 'active';
  }
  // 如果在线，进度条状态根据扫描状态显示相应的图标
  if (record.scanFlowStatus === 7) {
    return 'success';
  } else if (
    record.scanFlowStatus === 2 ||
    record.scanFlowStatus === 6 ||
    record.scanFlowStatus === 9
  ) {
    return 'exception';
  } else {
    return 'active';
  }
};

// 轮询请求
const startLoop = async () => {
  // if (!uuids) {
  //   return false;
  // }
  loading.value = true;

  // 扫描状态
  isScanning.value = await getScanStatus();
  // 如果没有正在扫描的就清除定时器，并且不再获取进度
  if (!isScanning.value) {
    clearTimeout(state.timerId);
    loading.value = false;
    return false;
  }

  // 扫描进度
  // getScheduleApi({ uuids: uuids }).then((res) => {
  showScheduleByGroupApi({ groupId: state.record.id }).then((res) => {
    data.value.forEach((hps) => {
      res.forEach((item) => {
        if (hps.uuid === item.uuid) {
          hps.currentSchedule = hps.isAlive ? item.currentSchedule : 0;
          hps.version = item.version;
          // scheduleStatus是进度接口返回的描述状态的字段，不知道和扫描状态接口返回的字段有什么不一样
          hps.scheduleStatus = item.scheduleStatus;
        }
      });
      // 没有进度返回时先给个虚假值
      if (
        (hps.scanFlowStatus === 1 || hps.scanFlowStatus === 8) &&
        (hps.currentSchedule === undefined || hps.currentSchedule < 5)
      ) {
        hps.currentSchedule = hps.isAlive ? fakeValue.value : 0;
      }
    });
    loading.value = false;
    state.timerId = setTimeout(() => {
      clearTimeout(state.timerId);
      startLoop();
    }, 2000);
  });
};

// 弹窗切换的回调
const handleVisibleChange = (visible) => {
  if (!visible) {
    clearTimeout(state.timerId);
  }
};

// 终止扫描确认
const confirmStop = () => {
  const hasSyncingHost = data.value.some((hps) => {
    return hps.scanFlowStatus == 4 || hps.scanFlowStatus == 5;
  });
  Modal.confirm({
    iconType: 'warning',
    title: '警告',
    content: hasSyncingHost ? `数据同步终止，可能造成白名单数据生成有误` : `确认要终止扫描吗？`,
    okText: '确认终止',
    cancelText: '取消终止',
    async onOk() {
      handleStopScan();
    },
  });
};

// 终止扫描
const handleStopScan = async () => {
  // const uuids = getUuids();
  // await stopFileWhiteScanApi({ uuids: uuids });
  await stopFileWhiteScanByGroupApi({ groupId: state.record.id });
  data.value.forEach((hps) => {
    hps.currentSchedule = 0;
  });
  clearTimeout(state.timerId);
  // 终止后再更新一下扫描状态
  isScanning.value = await getScanStatus();
};

const UploadModal = ref(false);
const record = ref()
// 打开导入弹窗
const handleClickUpload = () => {
  UploadModal.value = true;
  record.value = state.record;
};

// 设置离线主机所在行为灰色
const deadRowStyle = (record) => {
  if (!record.isAlive) {
    return 'dead';
  }
};

const handleUploadDone = () => {
  // const uuids = getUuids();
  startLoop();
  if (!checkAliveHost(data.value)) {
    message.info('主机已离线！');
  }
};
</script>
<style lang="less" scoped>
.title_append {
  color: #d9d9d9;
  font-size: 13px;
  margin-left: 17px;
  font-weight: normal;
}

::v-deep .dead {

  .ant-table-cell,
  .ant-progress-text {
    color: #707070;
  }
}
</style>
