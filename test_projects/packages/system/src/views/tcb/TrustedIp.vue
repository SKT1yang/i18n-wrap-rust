<!--
 * @Name: Do not edit
 * @Description: Do not edit
 * @Author: lkq
 * @Date: 2022-03-21 15:05:08
 * @LastEditTime: 2024-03-01 14:14:55
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="trusted-ip space-y-4">
    <Form layout="inline">
      <FormItem>
        <Button type="primary" @click="addIpRule">新增 IP</Button>
      </FormItem>
    </Form>

    <!-- 导出记录表格 -->
    <Table :columns="columns" :data-source="dataList" :pagination="false" :loading="state.tableLoading" size="small"
      bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Popconfirm title="确定要删除吗?" ok-text="确认" cancel-text="取消" @confirm="deleteIpRule(record)"
            :disabled="deleteButtonDisabled">
            <Button type="link" danger :disabled="deleteButtonDisabled">删除</Button>
          </Popconfirm>
        </template>
      </template>
    </Table>

    <TrustedAddModal ref="trustedAddModalRef" :type="'ip'" @refreshData="refreshData" />
  </div>
</template>
<script setup name="TrustedIp" lang="ts">
import type { ColumnProps } from "ant-design-vue/es/table";
import { reactive, ref, onMounted } from 'vue'
import {
  Form,
  FormItem,
  Popconfirm,
  Button,
  Table,
  message,
} from 'ant-design-vue';
import TrustedAddModal from './TrustedAddModal.vue';
import {
  getIpRuleApi,
  deleteIpRuleApi,
} from '../../model/tcb';

const emit = defineEmits(['refresh'])

// 其他数据
const state = reactive({
  tableLoading: false, // 表格加载状态
});

const dataList = ref([]);
const columns: ColumnProps[] = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
    customRender: (t) => `${t.index + 1}`,
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    width: 250,
    align: 'center',
  },
]

// 组件实例
const trustedAddModalRef = ref();

// 页面加载时
onMounted(() => {
  getIpRule();
  emit('refresh')
});

// 获取IP访问规则

async function getIpRule() {
  state.tableLoading = true;
  try {
    const res = await getIpRuleApi()
    state.tableLoading = true;
    dataList.value = res.map((item) => {
      return { ip: item };
    });
  } finally {
    state.tableLoading = false;
    return dataList.value
  }
}

// 删除
const deleteButtonDisabled = ref(false)
const deleteIpRule = (record) => {
  deleteButtonDisabled.value = true
  deleteIpRuleApi({ ip: record.ip }).then(() => {
    message.success('删除成功');
    getIpRule();
    emit('refresh')
  }).finally(() => {
    deleteButtonDisabled.value = false
  });
};

// 追加
const addIpRule = () => {
  trustedAddModalRef.value.openModal();
};

// 刷新
const refreshData = () => {
  getIpRule();
};

// 暴露变量
defineExpose({
  getIpRule,
  dataList,
});
</script>
