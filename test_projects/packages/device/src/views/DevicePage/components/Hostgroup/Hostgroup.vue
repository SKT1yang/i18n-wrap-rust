<template>
  <div>
    <Row class="flex">
      <Col :span="5">
      <span class="mr-1 text-base text-white">主机分组</span>
      <PlusCircleOutlined v-if="showInDevice" @click="handleCreate()" :title="'新建分组'"
        class="text-lg text-white hover:text-blue-400" />
      <Tree highlight :clickRowToExpand="false" :treeData="treeData"
        :fieldNames="{ key: 'id', title: 'label', children: 'children' }" @select="handleGroupSelect"
        :selectedKeys="currentKey" class="tree_style">
        <template #title="scope">
          <div class="flex justify-between">
            <span class="w-30 overflow-ellipsis truncate text-white pl-2" style="font-size: 15px" :title="scope.label">{{
              scope.label }}</span>
            <span class="flex items-center mr-2">
              <PlusCircleOutlined v-if="showInDevice && scope.level < 3"
                class="mr-1 !text-white text-base !hover:text-blue-400" @click.stop="handleCreate(scope)"
                :title="'新建子分组'" />
              <EditOutlined v-if="showInDevice" class="mr-1 !text-white text-base !hover:text-blue-400" :title="'管理'"
                @click.stop="handleManage(scope)" />
              <CloudUploadOutlined v-if="showInDevice" class="mr-1 !text-white text-base !hover:text-blue-400"
                :title="'版本升级'" @click.stop="handleUpgrade(scope)" />
              <DeleteOutlined v-if="showInDevice" class="!text-red-400 text-base !hover:text-red-600" :title="'删除'"
                @click.stop="handleDeleteGroup(scope)" />
            </span>
          </div>
        </template>
      </Tree>
      </Col>
      <Col :span="19">
      <Form>
        <Row :justify="'space-between'">
          <Col :span="6">
          <FormItem label="设备名称">
            <Input placeholder='请输入设备名称' :maxlength="30" v-model:value="name" />
          </FormItem>
          </Col>
          <Col :span="6">
          <FormItem label="IP">
            <Input placeholder='请输入IP地址' :maxlength="30" v-model:value="ip" />
          </FormItem>
          </Col>
          <Col :span="6" />
          <Col :span="4">
          <FormItem>
            <Popconfirm title="是否确认删除?" ok-text="确认" cancel-text="取消" @confirm="handleDeleteHost()">
              <Button type="primary" danger :disabled="selectedRowKeys.length === 0">
                <DeleteOutlined />
                批量删除
              </Button>
            </Popconfirm>
            <Button class="m-l-3" @click="query()" type="primary">查询</Button>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="relative">
        <div class="text-white text-base px-2 py-1.5">主机列表</div>
        <Table :loading="loading" size="small" :pagination="pagin" :row-key="row => row.uuid" :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: (e) => {
            selectedRowKeys = e
          }
        }" @change="handleChange" :columns="hostColumns" :scroll="{ x: 2000 }" :data-source="hostTable.list">
          <template #bodyCell="{ column, record }">
            <template v-if="column.title == '版本'">
              <div class="overflow-text">
                {{ record.environmentVO.version }}
              </div>
            </template>
            <template v-if="column.dataIndex == 'deviceMode'">
              <template v-if="record.deviceMode == 0">
                <Tag color="default">未启用</Tag>
              </template>
              <template v-else-if="record.deviceMode == 1">
                <Tag color="orange">告警模式</Tag>
              </template>
              <template v-else-if="record.deviceMode == 2">
                <Tag color="success">防护模式</Tag>
              </template>
              <template v-else>
                <Tag color="default">未启用</Tag>
              </template>
            </template>
            <template v-if="column.dataIndex == 'status'">
              <template v-if="record.status">
                <Tag color="green"> 在线 </Tag>
              </template>
              <template v-else>
                <Tag color="red">离线</Tag>
              </template>
            </template>
            <template v-if="rateColumns.includes(column.title as string)">
              <div>
                <span :style="decideByRecord(column, record)">{{ getUsage(column, record) }}%</span> /
                <span style="color: #909399">{{ getRate(column, record) }}%</span>
              </div>
            </template>
            <template v-if="column.dataIndex == 'operation'">
              <Popconfirm title='是否确认删除' @confirm="handleDeleteHost(record)">
                <Button type="link">
                  删除
                </Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </div>
      </Col>
    </Row>
    <GroupModal v-model:open="groupModalOpen" :isUpdate="isUpdate" :id="id" :record="record" @success="refresh" />
    <UpgradeModal :record="record" v-model:open="UpgradeModalOpen" />
  </div>
</template>
<script name="HostGroup" lang="ts" setup>
import { hostColumns } from "./columns"
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons-vue';
import { Popconfirm, message, Tree, Table, Tag, Button, Modal, Row, Col, Form, FormItem, Input } from 'ant-design-vue';
import GroupModal from "./components/GroupModal.vue"
import UpgradeModal from "./components/UpgradeModal.vue"

import {
  getHpsGroupApi,
  deleteHpsGroupApi,
  deleteHpsRegisterApi,
  getHpsRegisterApi,
  getScheduleStatusApi,
  deleteClientIDApi,
} from '../../../../model/device';
import { computed, onMounted, ref, toRaw, reactive } from 'vue';


const loading = ref(false)
const hostTable = reactive<{ list: any[], current: number, pageSize: number, sort?: string, total: number }>({ list: [], current: 1, pageSize: 10, sort: undefined, total: 0 })
const groupModalOpen = ref(false)
const UpgradeModalOpen = ref(false)
const props = { parentPage: 'device' }
const rateName = ['cpu', 'rom', 'ram'];
const rateColumns = ['CPU 使用率', '内存使用率', '磁盘使用率'];
const name = ref();
const ip = ref();

const pagin = computed(() => ({
  current: hostTable.current,
  pageSize: hostTable.pageSize,
  showSizeChanger: true,
  showQuickJumper: true,
  defaultPageSize: 10,
  total: hostTable.total,
  showTotal: () => `共${hostTable.total}条信息,共${Math.ceil(hostTable.total / hostTable.pageSize)}页`,
}))

const selectedRowKeys = ref<any[]>([])

const handleChange = (e, _f, sorter) => {
  hostTable.current = e.current;
  hostTable.pageSize = e.pageSize;
  hostTable.sort = sorter.order ? sorter.field + "," + (sorter.order as string).match(/(.*)end/)![1] : undefined;
  query();
}

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
const showInDevice = computed(() => {
  if (props.parentPage) {
    return props.parentPage === 'device';
  } else {
    return true;
  }
});

const treeData = ref<any[]>([]);

// 当前选中的分组id
const currentKey = ref();

// 获取分组列表
const getGroupList = async (p?) => {
  treeData.value = await getHpsGroupApi(p);
};

// 选择分组
const handleGroupSelect = async (key) => {
  currentKey.value = key;
  reloadHost(currentKey.value)
};

// 刷新分组列表和主机列表
const refresh = () => {
  getGroupList();
};

const reloadHost = (groupId?) => {
  query(groupId);
  getHpsGroupApi().then(res => {
    treeData.value = res
  });
  selectedRowKeys.value.length = 0;
};

const id = ref()
const isUpdate = ref(false)
const handleCreate = (record?) => {
  groupModalOpen.value = true;
  isUpdate.value = false;
  id.value = record?.id
};

const record = ref();
const handleManage = (record_p) => {
  isUpdate.value = true;
  record.value = record_p
  groupModalOpen.value = true;
};

const handleUpgrade = (record_p) => {
  if (record_p.hpsGroupRecordList.length === 0) {
    return message.error('分组内没有主机！');
  }
  record.value = record_p
  UpgradeModalOpen.value = true;
};

// 扫描状态
const getScanStatus = async (uuids) => {
  const res = await getScheduleStatusApi({ uuids: uuids });
  return res.some((item) => {
    return !item.processStatus;
  });
};
const handleDeleteGroup = async (record) => {
  Modal.confirm({
    title: '提示',
    content: `确认删除分组？`,
    async onOk() {
      if (record.hpsGroupRecordList.length > 0) {
        const uuids = record.hpsGroupRecordList.map((ele) => {
          return ele.uuid;
        });
        const scanning = await getScanStatus(uuids);
        if (scanning) {
          return message.error('分组中存在正在扫描的主机！');
        }
      }
      await deleteHpsGroupApi([record.id]);
      message.success('删除成功！');

      // 如果删除的是当前选中的分组，删除完成后，就显示全部主机列表
      if (record.id === toRaw(currentKey.value)?.[0]) {
        currentKey.value = undefined;
      }
      // 刷新主机分组
      getGroupList();
    },
  });
};

const handleDeleteHost = async (record?) => {
  let uuids = [] as any;
  let clientIDs = [] as any;
  if (record) {
    if (record.registerType === 1) {
      clientIDs = [record.uuid];
    } else {
      uuids = [record.uuid];
    }
  } else {
    selectedRowKeys.value = hostTable.list.filter(value => {
      return selectedRowKeys.value.includes(value.uuid)
    })
    uuids = selectedRowKeys.value
      .filter((row) => {
        return row.registerType === 2;
      })
      .map((row) => {
        return row.uuid;
      });
    clientIDs = selectedRowKeys.value
      .filter((row) => {
        return row.registerType === 1;
      })
      .map((row) => {
        return row.uuid;
      });
  }
  if (record && record.status) {
    const scanning = await getScanStatus([...uuids, ...clientIDs]);
    if (scanning) {
      return message.error('无法删除正在扫描的主机！');
    }
  }
  if (uuids.length > 0) {
    const scanning = await getScanStatus([...uuids]);
    if (scanning) {
      return message.error('无法删除正在扫描的主机！');
    }
    await deleteHpsRegisterApi({ uuids: uuids });
  }
  if (clientIDs.length > 0) {
    await deleteClientIDApi({ clientIDs: clientIDs });
  }
  selectedRowKeys.value.length = 0
  message.success('删除成功！');
  reloadHost();
};

const query = (groupId?) => {
  loading.value = true;
  getHpsRegisterApi({ page: hostTable.current, size: hostTable.pageSize, hostName: name.value, ip: ip.value, groupId }).then((res) => {
    hostTable.list = res.content
    hostTable.total = res.totalElements
    loading.value = false;
  });
}

onMounted(() => {
  reloadHost();
});
</script>

<style scoped>
:deep(.ant-tree) {
  padding-top: 10px;
}

:deep(.ant-tree-switcher) {
  display: none;
}

:deep(.ant-tree-node-content-wrapper.ant-tree-node-selected) {
  background-color: #2362a3;
}

.tree_style {
  min-width: 300px;
}

.overflow-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: keep-all;
  overflow-wrap: break-word;
}
</style>
