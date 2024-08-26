<!--
 * @Name: 数据快照
 * @Description: 数据备份-数据快照
 * @Author: lkq
 * @Date: 2022-03-18 13:50:59
 * @LastEditTime: 2023-06-27 15:42:10
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="systemBackUpDataSnapshot space-y-4">
    <Form layout="inline" :model="searchForm">
      <FormItem>
        <Space>
          <DatePicker.RangePicker v-model:value="searchForm.dateRange" :show-time="{
            defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
          }" :allow-clear="false" />
          <Button @click="doSearch">
            <template #icon>
              <i class="i-base-search-line"></i>
            </template>
            查询
          </Button>
          <Popconfirm title="确定要创建快照吗?" ok-text="确认" cancel-text="取消" @confirm="createSnapshots">
            <Button type="primary" :loading="state.createButtonLoading">创建快照</Button>
          </Popconfirm>
        </Space>
      </FormItem>
    </Form>
    <!-- 导出记录表格 -->
    <Table :data-source="tableData" :columns="columns" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <div class="space-x-4">
            <Popconfirm title="确定要恢复到快照吗?" ok-text="确认" cancel-text="取消" @confirm="recover(record)">
              <Button class="ml-2" danger>恢复到快照</Button>
            </Popconfirm>
            <Popconfirm title="确定要删除快照吗?" ok-text="确认" cancel-text="取消" @confirm="deleteSnapshot(record)">
              <Button class="ml-2" danger>删除</Button>
            </Popconfirm>
          </div>
        </template>
      </template>
    </Table>
  </div>
</template>
<script setup name="SystemBackUpDataSnapshot" lang="ts">
import type { ColumnProps } from "ant-design-vue/es/table";
import { ref, reactive, onMounted } from 'vue'
import {
  Form,
  FormItem,
  DatePicker,
  Space,
  Button,
  Popconfirm,
  Table,
  message,
} from 'ant-design-vue';
import { formatToDate } from '@guolisec/utils';
import dayjs from 'dayjs';
import type { Dayjs } from "dayjs";
import {
  getSnapshotApi,
  createSnapshotApi,
  restoreSnapshotApi,
  deleteSnapshotApi,
} from '../../model/backup';

// 查询表单
let searchForm = reactive<{
  dateRange: [Dayjs, Dayjs]
}>({
  dateRange: [dayjs().startOf('month'), dayjs().endOf('day')],
});

// 其他数据
const state = reactive({
  createButtonLoading: false, // 创建快照按钮状态
});

const tableData = ref([]);

const columns: ColumnProps[] = [
  {
    title: '快照名称',
    dataIndex: 'snapshotName',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'dateCreated',
    align: 'center',
    customRender: ({ text }) => {
      return formatToDate(text, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
  },
]

const doSearch = () => {
  getOutputRecord()
};

// 获取快照数据
async function getOutputRecord() {
  const queryForm = getTime(searchForm.dateRange);
  tableData.value = await getSnapshotApi(queryForm);
}

// 时间范围兼容处理
const getTime = (dateRange) => {
  if (dateRange === null) {
    return {
      startTime: '',
      endTime: '',
    };
  } else {
    return {
      startTime: dateRange[0].toISOString(),
      endTime: dateRange[1].toISOString(),
    };
  }
};

// 创建快照
const createSnapshots = () => {
  if (searchForm.dateRange) {
    state.createButtonLoading = true;
    createSnapshotApi()
      .then(() => {
        message.success(
          '正在备份，不同数据量的数据备份需要花费的时间不同，可能需要几秒或几分钟，请稍后查询...',
        );
        doSearch();
      })
      .finally(() => {
        state.createButtonLoading = false;
      });
  } else {
    message.warning('时间不能为空!');
  }
};

// 恢复快照
const recover = (record) => {
  record.isRecover = true;
  restoreSnapshotApi(record.snapshotName).then((res) => {
    record.isRecover = false;
    if (res.accepted) {
      message.success('数据备份恢复中....');
    } else {
      message.error('数据恢复失败！');
    }
  });
};

// 删除快照
const deleteSnapshot = (record) => {
  deleteSnapshotApi(record.snapshotName).then(() => {
    message.success('删除成功');
    doSearch();
  });
};

onMounted(() => {
  doSearch()
})
</script>
