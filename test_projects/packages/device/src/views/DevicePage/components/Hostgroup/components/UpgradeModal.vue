<template>
  <Modal :open="open" :width="1200" :mask-closable="true" @cancel="parentFunc('update:open', false)" :footer="false">
    <template #title>
      <label>版本升级</label>
      <span class="title_append" v-if="titleAppend">/&nbsp;{{ titleAppend }}</span>
    </template>
    <Tabs v-model:activeKey="activeName" :default-active-key="1" :size="'small'" @change="handleTabChange">
      <TabPane tab="V1.0 设备" :key="1">
        <Tabs v-model:activeKey="innerTabKey" :size="'small'" type="card" destroy-inactive-tab-pane>
          <TabPane tab="升级" :key="1">
            <UsedUpgradeCommand :groupId="groupId" />
          </TabPane>
          <TabPane tab="升级状态" :key="2">
            <UsedUpgradeStatus :groupId="groupId" />
          </TabPane>
          <TabPane tab="升级记录" :key="3">
            <UsedUpgradeRecord :groupId="groupId" />
          </TabPane>
          <TabPane tab="文件上传" :key="4">
            <UsedUpgradeUpload />
          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane tab="V2.0 设备" :key="2" v-if="state.hosts?.length > 0">
        <Upload :show-upload-list="false" :file-list="state.fileList" @remove="handleRemove" :disabled="uploading"
          :before-upload="beforeUpload" :custom-request="uploadFile">
          <Button type="primary" :loading="uploading">
            <UploadOutlined />
            请选择文件上传
          </Button>
        </Upload>
        <div class="flex items-center">
          <div class="m-4">更新包名称</div>
          <Select v-model:value="packageName" placeholder="请选择更新包名称" allow-clear style="width: 300px">
            <SelectOption v-for="item in packageNameList" :value="item.upgradePackageName" :key="item.id"
              :title="item.upgradePackageName">
              {{ item.upgradePackageName }}
            </SelectOption>
          </Select>
          <Button type="primary" class="mx-4" @click="handleSubmit" :disabled="!packageName">下发</Button>
        </div>
        <Table bordered :columns="columns" :data-source="tableData.list" @change="query" :pagination="pagin"
          :rowKey="'uuid'">
          <template #bodyCell="{ column, index }">
            <div v-if="column.key === 'index'">
              {{ index + 1 + (tableData.current - 1) * tableData.pageSize }}
            </div>
          </template>
        </Table>
      </TabPane>
    </Tabs>
  </Modal>
</template>
<script setup name="UpgradeModal" lang="ts">
import { Button, Upload, Table, Tabs, TabPane, message, Select, SelectOption, Modal } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { TableColumnsType } from "ant-design-vue"
import {
  getUpgradePackageNameApi,
  postDeliverUpgradePackageApi,
  uploadUpgradeFileApi,
  getHpsUpdateStatusApi,
} from '../../../../../model/device';

import UsedUpgradeCommand from './UsedUpgradeCommand.vue';
import UsedUpgradeStatus from './UsedUpgradeStatus.vue';
import UsedUpgradeRecord from './UsedUpgradeRecord.vue';
import UsedUpgradeUpload from './UsedUpgradeUpload.vue';
import { computed, reactive, ref, watch } from 'vue';

// 弹窗title后面追加的内容
const titleAppend = ref('');

const parentProps = defineProps<{ open: boolean, record: any }>()
const parentFunc = defineEmits(['update:open'])
const activeName = ref(1);
const innerTabKey = ref(1);

const columns: TableColumnsType = [
  {
    dataIndex: 'index',
    title: '序号',
    width: 80,
    align: 'center'
  },
  {
    dataIndex: ['environmentVO', 'hostName'],
    title: '设备名称',
    key: 'name',
    align: 'center'
  },
  {
    dataIndex: 'ip',
    title: 'IP 地址',
    key: 'ip',
    width: 100,
    align: 'center'
  },
  {
    dataIndex: 'version',
    title: '软件版本',
    key: 'version',
    align: 'center'
  },
  {
    dataIndex: 'status',
    title: '在线状态',
    key: 'online',
    width: 90,
    align: 'center',
    customRender: ({ text }) => {
      return text ? '在线' : '离线';
    },
  },
  {
    dataIndex: 'updateStatus',
    title: '升级状态',
    key: 'upgrade',
    minWidth: 150,
    align: 'center',
    customRender: ({ text }) => {
      const d = {
        '-1': '更新超时',
        '0': '升级失败',
        '1': '升级成功',
        '2': '版本升级中',
        '3': '版本升级文件已下发',
        '4': '版本升级文件接收失败',
        '5': '版本升级文件下发失败',
        '6': '主机卫士不在线，更新包未下发',
        '-100': '当前设备未升级',
        '10': '更新包等待下发',
        '-11': '主机卫士不在线',
        '20': '主机卫士下载版本升级文件中',
        '-20': '版本升级文件下发失败',
        '-22': '缺失版本升级文件',
        '30': '正在升级中',
        '-30': '版本升级文件接收失败',
        '-31': '版本升级文件接收超时',
      };
      return d[text];
    },
  },
];

const tableData = reactive<{ list: any[], current: number, pageSize: number, total: number }>({ list: [], current: 1, pageSize: 10, total: 0 })
const pagin = computed(() => ({
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`,
  showQuickJumper: true,
  total: tableData.total,
  pageSize: tableData.pageSize,
  current: tableData.current,
}));

const packageName = ref();
const packageNameList = ref<any[]>([]);
const row = ref();
const groupId = ref(-1);

const getHpsUpdateStatus = async (row, pageParams?) => {
  const { content, totalElements } = await getHpsUpdateStatusApi({
    groupId: row?.id,
    ...(pageParams || []),
  });
  let list: any[] = [];
  if (row?.hpsGroupRecordList?.length > -1) {
    list = row.hpsGroupRecordList;
  } else if (row?.value.hpsGroupRecordList?.length > -1) {
    list = row.value.hpsGroupRecordList;
  }
  const l = list.map((item) => {
    for (let index = 0; index < content.length; index++) {
      const element = content[index];
      if (item.uuid === element.uuid) {
        return { ...item, ...element };
      }
    }
  });
  tableData.total = totalElements;
  tableData.list = l.filter((item) => {
    return !!item
  });
  let indexShow = 1 + (tableData.current - 1) * tableData.pageSize
  tableData.list = tableData.list.map(value => {
    return { ...value, index: indexShow++ }
  })
};

watch(parentProps, () => {
  row.value = parentProps.record;
  query();
  groupId.value = parentProps.record?.id;
  state.qfHosts = [];
  state.hosts = [];
  parentProps.record?.hpsGroupRecordList.forEach((element) => {
    if (element.registerType === 1) {
      state.qfHosts.push(element);
    } else if (element.registerType === 2) {
      state.hosts.push(element);
    }
  });
  if (state.qfHosts.length > 0) {
    activeName.value = 1;
  } else {
    activeName.value = 2;
  }
}, {
  deep: true
})

watch(activeName, () => {
  packageName.value = undefined
  if (activeName.value === 1) {
    innerTabKey.value = 1;
  }
  if (activeName.value === 2) {
    initTab2();
  }
})

const initTab2 = async () => {
  getPackageName();
  getHpsUpdateStatus(row.value);
};

const getPackageName = async () => {
  packageNameList.value = await getUpgradePackageNameApi();
  console.log(packageName.value)
};

const handleSubmit = async () => {
  await postDeliverUpgradePackageApi({
    fileName: packageName.value,
    groupIdList: [row.value!.id],
  });
  message.success('下发升级包成功');
  parentFunc('update:open', false)
};

const handleTabChange = async (activeKey) => {
  if (activeKey === '2') {
    initTab2();
  }
};

const state = reactive<any>({
  record: undefined,
  groupIdList: undefined,
  fileList: [],
  table: [],
  qfHosts: [],
  hosts: [],
});

const uploading = ref(false);
const beforeUpload = (file) => {
  state.fileList = [file];
};
const uploadFile = () => {
  uploading.value = true;
  const form = new FormData();
  form.append('multipartFile ', state.fileList[0]);
  uploadUpgradeFileApi(form)
    .then(async () => {
      uploading.value = false;
      await message.success('上传成功', 1);
      getPackageName();
    })
    .finally(() => {
      uploading.value = false;
    });
};
const handleRemove = () => {
  state.fileList = [];
};

const query = (e?) => {
  if (e) {
    tableData.pageSize = e.pageSize;
    tableData.current = e.current;
  }
  getHpsUpdateStatus(row.value, { size: tableData.pageSize, page: tableData.current })
}
</script>
<style scoped>
.title_append {
  font-size: 13px;
  margin-left: 17px;
  font-weight: normal;
}
</style>
