/*
 * @name: 漏洞库
 * @description: Do not edit
 */

/* 类型文件 */
import type { Vulnerability } from '../types/vulStore';
/* 第三方模块 */
import { onMounted, ref } from 'vue';
/* 本地共享模块 */
import { formatToDateTime } from '@guolisec/utils';
import dayjs from 'dayjs';
/* 业务模块 */
import { findVulListByPage } from '../service/vulStore';

export function useVulStore() {
  const queryForm = ref<{
    dateRange?: [string, string];
    level?: number;
  }>({
    dateRange: ['', ''],
  });

  /**
   * 分页、排序
   */
  const currentPage = ref(1);
  const size = ref(10);
  const total = ref(0);
  const sort = ref('');

  /**
   * 表格数据发生改变
   */
  function handleTableChange(pagination, _filters, sorter) {
    const { current, pageSize } = pagination;
    currentPage.value = current;
    size.value = pageSize;

    const { order, columnKey } = sorter;
    switch (order) {
      case 'ascend':
        sort.value = `${columnKey},asc`;
        break;
      case 'descend':
        sort.value = `${columnKey},desc`;
        break;
      default:
        sort.value = '';
    }
    getVulStoreData();
  }

  // 漏洞等级
  const levelList = ref([
    {
      label: '高风险',
      value: 1,
    },
    {
      label: '中风险',
      value: 2,
    },
    {
      label: '低风险',
      value: 3,
    },
  ]);

  /**
   * 获取列表数据
   */
  const tableColumns = ref([
    {
      title: '序号',
      align: 'center',
      width: 80,
      key: 'index',
      customRender: ({ index }) => {
        return (currentPage.value - 1) * size.value + index + 1;
      },
    },
    {
      title: '漏洞标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '发布时间',
      dataIndex: 'pubDate',
      key: 'pubDate',
      align: 'center',
      width: 170,
      // sorter: true,
      customRender: ({ text }) => {
        return text ? formatToDateTime(text) : '-';
      },
    },
    {
      title: '详情',
      dataIndex: 'detail',
      ellipsis: true,
    },
    {
      title: '解决方案',
      dataIndex: 'solution',
      ellipsis: true,
    },
    {
      title: '补丁',
      dataIndex: 'patch',
      ellipsis: true,
    },
    {
      title: '参考 URL',
      dataIndex: 'referenceUrl',
      ellipsis: true,
    },
    {
      title: 'CNNVD 类型',
      dataIndex: 'cnnvdType',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'CNNVD 威胁类型',
      dataIndex: 'cnnvdThreatType',
      width: 170,
      ellipsis: true,
    },
    {
      title: 'CNVD 影响',
      dataIndex: 'cnvdImpact',
      width: 150,
      ellipsis: true,
    },
  ]);

  const tableLoading = ref(false);
  const tableData = ref<Vulnerability[]>([]);
  async function getVulStoreData() {
    const { dateRange, level } = queryForm.value;
    let createTime: string[] | undefined = undefined;
    if (dateRange && dateRange.length > 0) {
      createTime = [];
      createTime[0] = dayjs(dateRange[0]).toISOString();
      createTime[1] = dayjs(dateRange[1]).toISOString();
    }
    tableLoading.value = true;
    try {
      const { content, totalElements } = await findVulListByPage({
        size: size.value,
        page: currentPage.value,
        sort: sort.value,
        createTime,
        level,
      });
      tableData.value = content;
      total.value = totalElements;
    } finally {
      tableLoading.value = false;
    }
  }

  function handleSearch() {
    currentPage.value = 1;
    getVulStoreData();
  }

  onMounted(() => {
    getVulStoreData();
  });

  return {
    queryForm,
    levelList,
    tableLoading,
    tableData,
    tableColumns,
    handleSearch,
    total,
    currentPage,
    size,
    handleTableChange,
  };
}
