/*
 * @name: 报表列表
 * @description: Do not edit
 */
/* 类型文件 */
import type { FormInstance } from "ant-design-vue";
import type { Rule } from "ant-design-vue/lib/form";
import type { Report } from "../types/reports";
/* 第三方模块 */
import { onMounted, ref, ExtractPropTypes, watch, nextTick } from "vue";
import { Modal } from "ant-design-vue";
/* 本地共享模块 */
import { useVModel } from "@guolisec/utils";
import { message } from "@guolisec/toast";
import { formatToDateTime, downloadByData } from "@guolisec/utils";
import { t } from "@/entry/languages/useLanguage";
/* 业务模块 */
import {
  queryReport,
  downloadReport,
  deleteReport,
  modifyReport,
} from "../service/reports";

export function useReportList() {
  /**
   * 分页、排序
   */
  const currentPage = ref(1);
  const size = ref(10);
  const total = ref(0);

  const sort = ref("createTime,desc");

  /**
   * 表格数据发生改变
   */
  function handleTableChange(pagination, _filters, sorter) {
    const { current, pageSize } = pagination;
    currentPage.value = current;
    size.value = pageSize;

    const { order, columnKey } = sorter;
    switch (order) {
      case "ascend":
        sort.value = `${columnKey},asc`;
        break;
      case "descend":
        sort.value = `${columnKey},desc`;
        break;
      default:
        sort.value = "";
    }
    getReportListData();
  }
  /**
   * 获取列表数据
   */
  const tableColumns = ref([
    {
      title: `${t("序号")}`,
      align: "center",
      width: 70,
      key: "index",
      customRender: ({ index }) => {
        return (currentPage.value - 1) * size.value + index + 1;
      },
    },
    {
      title: `${t("报表名称")}`,
      dataIndex: "reportName",
      width: 270,
      align: "center",
    },
    // {
    //   title: "报表类型",
    //   dataIndex: "type",
    //   key: "type",
    // },
    {
      title: `${t("备注")}`,
      dataIndex: "remarks",
    },
    {
      title: `${t("时间")}`,
      align: "center",
      width: 240,
      sorter: true,
      dataIndex: "createTime",
      defaultSortOrder: "descend",
      key: "createTime",
      customRender: ({ text }) => {
        return text ? formatToDateTime(text) : "-";
      },
    },
    {
      title: `${t("操作")}`,
      dataIndex: "action",
      key: "action",
      align: "center",
      width: 200,
    },
  ]);
  const tableData = ref<Report[]>([]);
  async function getReportListData() {
    const { content, totalElements } = await queryReport({
      size: size.value,
      page: currentPage.value,
      sort: sort.value,
      types: reportType.value,
    });
    tableData.value = content;
    total.value = totalElements;
  }

  function handleSearch() {
    currentPage.value = 1;
    getReportListData();
  }

  /**
   * 报表类型
   */
  const reportType = ref<1 | 2 | 3>(1);

  function handleChangeReportType() {
    selectedRowKeys.value = [];
    handleSearch();
  }

  /**
   * 删除报表
   */
  async function handleDeleteReport(ids: number[]) {
    await deleteReport({ ids });
    message.success(`${t("删除成功！")}`);
    handleSearch();
  }

  /**
   * 批量删除报表
   */
  const selectedRowKeys = ref<number[]>([]); // 勾选的id列表
  function handleSelectionChange(selectionRowKeys) {
    selectedRowKeys.value = selectionRowKeys;
  }
  async function handleMutilDelete() {
    if (selectedRowKeys.value.length > 0) {
      Modal.confirm({
        title: `${t("提示")}`,
        content: `${t("确定删除选中的报表吗？")}`,
        style: {
          top: "30%",
        },
        okText: `${t("确定")}`,
        onOk: async () => {
          await handleDeleteReport(selectedRowKeys.value);
          selectedRowKeys.value = [];
        },
      });
    } else {
      message.warning(`${t("请选择要删除的报表！")}`);
    }
  }

  /**
   * 修改报表
   */
  const dialogVisible = ref(false);
  const row = ref<Report>();
  function handleEditReport(record: Report) {
    dialogVisible.value = true;
    row.value = record;
  }

  /**
   * 下载报表
   */
  async function handleDownloadReport(record: Report) {
    const res = await downloadReport({
      id: record.id,
      typeId: 0,
    });
    downloadByData(res, record.reportName + ".docx", "application/msword");
    message.success(`${t("下载成功！")}`);
  }

  onMounted(() => {
    getReportListData();
  });

  return {
    total,
    currentPage,
    size,
    tableData,
    tableColumns,
    dialogVisible,
    row,
    reportType,
    selectedRowKeys,
    handleSearch,
    handleTableChange,
    handleChangeReportType,
    handleDeleteReport,
    handleSelectionChange,
    handleMutilDelete,
    handleEditReport,
    handleDownloadReport,
  };
}

export function useEditReportModal(
  props: Readonly<
    ExtractPropTypes<{
      visible: {
        type: BooleanConstructor;
        required: true;
      };
      current: {
        type: ObjectConstructor;
        default: () => {};
      };
    }>
  >,
  emit: (event: "update:visible" | "refresh", ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, "visible", emit);

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      await formRef.value?.resetFields();

      const { reportName, remarks } = props.current;
      formData.value = { reportName, remarks };
    }
  });

  const formRef = ref<FormInstance>();

  const formData = ref<{
    reportName?: string;
    remarks?: string;
  }>({});

  const rules = ref<Record<string, Rule[]>>({
    reportName: [
      {
        required: true,
        message: `${t("请输入报表名称")}`,
        trigger: "blur",
      },
    ],
  });

  /**
   * 确定修改
   */
  const confirmButtonStatus = ref(false);

  async function handleConfirm() {
    await formRef.value?.validate();
    confirmButtonStatus.value = true;
    try {
      await editReport();
      handleClose();
    } finally {
      confirmButtonStatus.value = false;
    }
  }

  async function editReport() {
    const { reportName, remarks } = formData.value;
    modifyReport({
      id: props.current.id,
      reportName: reportName!,
      remarks,
    });
    message.success(`${t("修改报表成功！")}`);
  }

  /**
   * 关闭弹窗
   */
  function handleClose() {
    dialogVisible.value = false;
    emit("refresh");
  }

  return {
    dialogVisible,
    formRef,
    formData,
    rules,
    handleConfirm,
    handleClose,
    confirmButtonStatus,
  };
}

export function useDownloadReportModal(
  props: Readonly<
    ExtractPropTypes<{
      visible: {
        type: BooleanConstructor;
        required: true;
      };
      current: {
        type: ObjectConstructor;
        default: () => {};
      };
    }>
  >,
  emit: (event: "update:visible" | "refresh", ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, "visible", emit);

  const title = ref(`${t("报表下载")}`);

  const typeId = ref(0);

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      typeId.value = 0;
    }
  });

  /**
   * 确定下载
   */
  const confirmButtonStatus = ref(false);

  async function handleConfirm() {
    confirmButtonStatus.value = true;
    try {
      let mime = "";
      let fileType = "";
      if (typeId.value === 0) {
        mime = "application/msword";
        fileType = ".docx";
      } else if (typeId.value === 1) {
        mime = "application/pdf";
        fileType = ".pdf";
      } else if (typeId.value === 2) {
        mime = "application/html";
        fileType = ".html";
      }
      const { id, reportName } = props.current;
      const res = await downloadReport({ id, typeId: typeId.value });
      downloadByData(res, reportName + fileType, mime);
      message.success(`${t("下载报表成功！")}`);
      handleClose();
    } finally {
      confirmButtonStatus.value = false;
    }
  }

  /**
   * 关闭弹窗
   */
  function handleClose() {
    dialogVisible.value = false;
    emit("refresh");
  }

  return {
    dialogVisible,
    title,
    handleConfirm,
    handleClose,
    confirmButtonStatus,
  };
}
