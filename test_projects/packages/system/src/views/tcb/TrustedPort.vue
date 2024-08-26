<!--
 * @name: 端口开放规则
 * @description: Do not edit
 * @path: \system\src\views\tcb\TrustedPort.vue
-->
<template>
  <div class="trusted-ip space-y-4">
    <Form layout="inline" :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 4 }">
      <FormItem>
        <InputNumber class="w-64" v-model:value="dataForm.port" placeholder="请输入端口" :min="1" :max="65535" />
      </FormItem>
      <FormItem>
        <Select class="min-w-50" v-model:value="dataForm.proto" :options="options" placeholder="请选择协议" allowClear
          :filter-option="filterOption" show-search />
      </FormItem>
      <FormItem>
        <Button type="primary" @click="addPort">追加</Button>
      </FormItem>
    </Form>

    <!-- 端口开放规则表格 -->
    <Table :columns="columns" :data-source="dataList" :pagination="false" size="small" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Button type="link" @click="deletePort(record)" danger>删除</Button>
        </template>
      </template>
    </Table>

    <TrustedAddModal ref="trustedAddModalRef" :type="'ip'" @refreshData="refreshData" />
  </div>
</template>
<script setup name="TrustedIp" lang="ts">
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { ColumnProps } from "ant-design-vue/es/table";
import { filterOption } from '@guolisec/utils';
import { ref, onMounted } from 'vue'
import {
  Form,
  FormItem,
  Modal,
  Button,
  Select,
  Table,
  message,
  InputNumber
} from 'ant-design-vue';
import TrustedAddModal from './TrustedAddModal.vue';
import {
  ethPortAddApi,
  ethPortDeleteApi,
  ethPortRuleGetApi
} from '../../model/tcb';

// 其他数据
const dataForm = ref({
  port: undefined, // 端口
  proto: undefined
});

const formRef = ref<FormInstance>()

const rules: Record<string, Rule[]> = {
  port: [
    { required: true, message: '请输入端口', trigger: 'blur' },
  ],
  proto: [
    { required: true, message: '请选择协议', trigger: 'change' }
  ]
};

const options = [
  {
    label: 'TCP',
    value: 'tcp',
  },
  {
    label: 'UDP',
    value: 'udp',
  },
]

const dataList = ref([]);
const columns: ColumnProps[] = [
  {
    title: '端口',
    dataIndex: 'port',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    width: 250,
    align: 'center',
  },
]

// 页面加载时
onMounted(() => {
  getDataList();
});

async function getDataList() {
  const res = await ethPortRuleGetApi()
  dataList.value = res.map(port => {
    return {
      port
    }
  })
}


// 删除
function deletePort(record) {

  Modal.confirm({
    iconType: 'warning',
    title: '提示',
    content: `确认删除？`,
    async onOk() {
      let item = record.port.split('/');
      await ethPortDeleteApi({
        port: item[0],
        proto: item[1],
      })
      message.success('删除成功！');
      await getDataList();
    },
  });
}

// 追加
async function addPort() {
  await formRef.value?.validate()
  await ethPortAddApi(dataForm.value)
  message.success('删除成功');
  getDataList()
  formRef.value?.resetFields()
};

// 刷新
const refreshData = () => {
  getDataList();
};
</script>
