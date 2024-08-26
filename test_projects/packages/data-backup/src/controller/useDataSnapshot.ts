/*
 * @name: 控制层
 * @description: D数据快照
 * @date: 2023-10-10 10:53:35
 * @path: \data-backup\src\controller\useDataSnapshot.ts
 */
/* 类型文件 */
import type { ColumnsType } from "ant-design-vue/es/table/interface";
import type { Snapshot } from "../types/dataSnapshot";
import type { Dayjs } from "dayjs";
/* 第三方模块 */
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
/* 本地共享模块 */
import { formatToDateTime } from "@guolisec/utils";
import { message } from "@guolisec/toast";
/* 业务模块 */
import {
  getSnapshots,
  createSnapshot,
  recoverSnapshot,
  deleteSnapshot,
} from "../service/dataSnapshot";

export function useDataSnapshot() {
  /**
   * 查询表单
   */
  const queryForm = ref<{
    dateRange?: [Dayjs, Dayjs];
  }>({ dateRange: [dayjs().startOf("month"), dayjs().endOf("day")] });

  /**
   * 分页
   */
  const currentPage = ref(1);
  // const size = ref(10);
  const total = ref(0);
  const sort = ref("createTime,desc");

  /**
   * 表格数据发生改变
   */
  function handleTableChange(pagination, _filters, _sorter) {
    const { current } = pagination;
    currentPage.value = current;
    // size.value = pageSize;

    // const { order, columnKey } = sorter;
    // switch (order) {
    //   case "ascend":
    //     sort.value = `${columnKey},asc`;
    //     break;
    //   case "descend":
    //     sort.value = `${columnKey},desc`;
    //     break;
    //   default:
    //     sort.value = "";
    // }
    handlePagpinate(currentPage.value);

    // getFtpSettingsData();
  }

  const showTime = {
    defaultValue: [
      dayjs("00:00:00", "HH:mm:ss"),
      dayjs("23:59:59", "HH:mm:ss"),
    ],
  };

  /**
   * 获取表格数据
   */
  const tableColumns = ref([
    {
      title: "序号",
      align: "center",
      width: 80,
      key: "index",
      customRender: ({ index }) => {
        return (currentPage.value - 1) * 10 + index + 1;
      },
    },
    {
      title: "快照名称",
      dataIndex: "snapshotName",
      align: "center",
    },

    {
      title: "创建时间",
      dataIndex: "dateCreated",
      align: "center",
      customRender: ({ text }) => {
        return formatToDateTime(text, "YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "操作",
      key: "action",
      dataIndex: "action",
      width: 190,
      align: "center",
    },
  ]);

  const tableData = ref<Snapshot[]>([]);
  const snapshotsData = ref<Snapshot[]>([]);
  async function getSnapshotsData() {
    const { dateRange } = queryForm.value;
    let startTime = "";
    let endTime = "";
    if (dateRange) {
      startTime = dayjs(dateRange[0]).toISOString();
      endTime = dayjs(dateRange[1]).toISOString();
    }
    const content = await getSnapshots({
      startTime,
      endTime,
    });
    snapshotsData.value = content;
    total.value = content.length;
    handlePagpinate(currentPage.value);
  }

  function handlePagpinate(page: number) {
    const start = (page - 1) * 10;
    const end = page * 10 < total.value ? page * 10 : total.value;
    console.log(page, start, end);
    tableData.value = snapshotsData.value.slice(start, end);
  }

  function handleSearch() {
    currentPage.value = 1;
    getSnapshotsData();
  }

  onMounted(() => {
    getSnapshotsData();
  });

  /**
   * 创建快照
   */
  const createButtonStatus = ref(false);
  async function handleCreate() {
    const { dateRange } = queryForm.value;
    if (dateRange) {
      createButtonStatus.value = true;
      try {
        await createSnapshot();
        message.success(
          "正在备份，不同数据量的数据备份需要花费的时间不同，可能需要几秒或几分钟，请稍后查询！"
        );
      } finally {
        createButtonStatus.value = false;
        handleSearch();
      }
    } else {
      message.warning("时间不能为空!");
    }
  }

  /**
   * 恢复快照
   */
  async function handleRecover(record) {
    record.isRecover = true;
    try {
      const res = await recoverSnapshot(record.snapshotName);
      if (res.accepted) {
        message.success("数据备份恢复中，请耐心等待！");
      } else {
        message.error("数据恢复失败！");
      }
    } finally {
      record.isRecover = false;
    }
  }

  /**
   * 删除快照
   */
  async function handleDelete(record) {
    console.log(record, "record");
    await deleteSnapshot(record.snapshotName);
    message.success("删除成功！");
    handleSearch();
  }

  return {
    queryForm,
    total,
    currentPage,
    sort,
    handleTableChange,
    showTime,
    tableData,
    tableColumns,
    handleSearch,
    createButtonStatus,
    handleCreate,
    handleRecover,
    handleDelete,
  };
}
