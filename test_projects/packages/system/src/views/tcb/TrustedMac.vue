<!--
 * @Name: Do not edit
 * @Description: Do not edit
 * @Author: lkq
 * @Date: 2022-03-21 15:05:32
 * @LastEditTime: 2024-03-01 14:15:27
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="trusted-mac space-y-4">
    <Form layout="inline">
      <FormItem>
        <Button type="primary" @click="addMac">新增 MAC</Button>
      </FormItem>
    </Form>

    <!-- 导出记录表格 -->
    <Table :columns="columns" :data-source="dataList" :pagination="false" :loading="state.tableLoading" size="small"
      bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Popconfirm title="确定要删除吗?" ok-text="确认" cancel-text="取消" @confirm="deleteMac(record)"
            :disabled="deleteButtonDisabled">
            <Button type="link" danger :disabled="deleteButtonDisabled">删除</Button>
          </Popconfirm>
        </template>
      </template>
    </Table>

    <TrustedAddModal ref="trustedAddModalRef" :type="'mac'" @refreshData="refreshData" />
  </div>
</template>
<script setup name="TrustedMac" lang="ts">
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
  getMacListApi,
  deleteMacApi,
} from '../../model/tcb';

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
    title: 'Mac',
    dataIndex: 'mac',
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
  getMacList();
});

// 获取Mac列表
const getMacList = () => {
  state.tableLoading = true;
  getMacListApi()
    .then((res) => {
      state.tableLoading = true;
      dataList.value = res.map((item) => {
        return { mac: item };
      });
    })
    .finally(() => {
      state.tableLoading = false;
    });
};

// 删除
const deleteButtonDisabled = ref(false)
const deleteMac = (record) => {
  deleteButtonDisabled.value = true
  deleteMacApi({ mac: record.mac }).then(() => {
    message.success('删除成功');
    getMacList();
  }).finally(() => {
    deleteButtonDisabled.value = false
  });
};

// 追加
const addMac = () => {
  trustedAddModalRef.value.openModal();
};

// 刷新
const refreshData = () => {
  getMacList();
};

// 暴露变量
defineExpose({
  getMacList,
  dataList
});
</script>
