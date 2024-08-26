/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-04-12 11:12:51
 * @path: \feature-vue\platform\front\system\src\controller\upgrade\useSystemUpgrade.ts
 */

import {
  ref,
  computed,
  ExtractPropTypes,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
} from "vue";

import { useVModel, formatToDateTime } from "@guolisec/utils";
import type { TableProps } from "ant-design-vue/es/table";
import type { FileType } from "ant-design-vue/es/upload/interface";
import { Modal } from "ant-design-vue";

import { message } from "@guolisec/toast";
import type { UploadProps, UploadFile } from "ant-design-vue";
import {
  upgrade,
  getUpgradeRecord,
  upgradeDetail,
  reboot,
  countRunningTaskNumber,
} from "../../service/upgrade";

export function useSystemUpgrade() {
  const tableData = ref([]);

  const total = ref();
  const currentPage = ref(1);
  const pageSize = ref(10);
  const sort = ref("createTime,desc");

  const pagination = computed(() => {
    return {
      total: total.value,
      current: currentPage.value,
      pageSize: pageSize.value,
    };
  });

  const handleTableChange: TableProps["onChange"] = (
    pag,
    _filters,
    sorter: any
  ) => {
    pageSize.value = pag.pageSize || pageSize.value;
    currentPage.value = pag.current || currentPage.value;
    if (sorter && sorter.field) {
      const { order, field } = sorter as any;
      sort.value = order === "ascend" ? `${field},asc` : `${field},desc`;
    }
    getUpgradeRecordData();
  };

  const dialogVisible = ref(false);

  onMounted(() => {
    getUpgradeRecordData();
  });

  const fileList = ref<FileType[]>([]);

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (extension.toLowerCase() !== "bin") {
      message.warning("只能上传bin文件");
    } else {
      fileList.value = [file];
    }
    return false;
  };

  // 文件删除
  const handleRemove = (file: UploadFile<any>) => {
    if (progressShow.value) {
      message.warning("正在更新中");
      return;
    } else {
      const index = fileList.value.indexOf(file as FileType);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    }
  };

  async function handleUpload() {
    const taskQueueNumber = await countRunningTaskNumber();
    Modal.confirm({
      iconType: "warning",
      centered: true,
      title: "确认更新",
      content: taskQueueNumber
        ? "检测到当前有任务正在执行，现在更新会打断该任务。现在更新吗？"
        : "现在更新吗？",
      onOk() {
        const data = new FormData();
        data.append("multipartFile", fileList.value[0]);
        initProgressInterval();
        upgrade(data)
          .then(() => {
            handleUpdateSuccess();
          })
          .catch(() => {
            handleError();
          });
      },
    });
  }

  // 更新记录查询
  async function getUpgradeRecordData() {
    const res = await getUpgradeRecord({
      page: currentPage.value,
      size: pageSize.value,
      sort: sort.value,
    });

    tableData.value = res.content;
    total.value = res.totalElements;
  }

  //系统更新成功
  const handleUpdateSuccess = () => {
    message.success("升级成功!正在重启,请耐心等待三分钟....");
    fileList.value = [];
    getUpgradeRecordData();
    clearProgressInterval();
  };

  //系统更新失败
  const handleError = () => {
    fileList.value = [];
    clearProgressInterval();
  };

  // 上传文件进度条

  const percentage = ref(0);

  const progressShow = ref(false);

  const progressTimer = ref<number | null>(null);

  function initProgressInterval() {
    progressShow.value = true;
    percentage.value = 0;
    progressTimer.value = setInterval(() => {
      if (percentage.value === 100) {
        return;
      } else {
        percentage.value += 1;
      }
    }, 50);
  }

  function clearProgressInterval() {
    clearInterval(progressTimer.value!);
    progressShow.value = false;
  }

  // 重启设备
  async function rebootEquip() {
    await reboot();
    message.success("重启设备成功！");
  }

  onUnmounted(() => {
    clearProgressInterval();
  });

  return {
    fileList,
    tableData,
    dialogVisible,
    percentage,
    progressShow,
    pagination,
    handleTableChange,
    beforeUpload,
    handleRemove,
    handleUpload,
    formatToDateTime,
    rebootEquip,
  };
}

export function useUpgradeDetailModal(
  props: Readonly<
    ExtractPropTypes<{
      visible: {
        type: BooleanConstructor;
        required: true;
      };
    }>
  >,
  emit: (event: "update:visible" | "refresh", ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, "visible", emit);

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      initTime();
      window.addEventListener("scroll", handleScroll, true);
    }
  });

  const detailDataList = ref<string[]>();
  const toBottom = ref(true); // 是否要去底部
  const scrollTop = ref(0); //记录操作滚动条前保存的位置

  // 获取更新详情
  async function getUpgradeDetailData() {
    const res = await upgradeDetail();

    detailDataList.value = res.split("\n");
    if (toBottom.value) {
      scrollToBottom();
    }
  }

  const detailRef = ref<HTMLDivElement>();

  // 自动滚动到底部
  const scrollToBottom = async () => {
    await nextTick();
    detailRef.value!.scrollTop = detailRef.value?.scrollHeight ?? 0;
    scrollTop.value = detailRef.value?.scrollTop ?? 0;
  };

  // 滚动条操作后方法
  const handleScroll = () => {
    if (detailRef.value!.scrollTop < scrollTop.value) {
      //当前滚动条位置小于记录位置，说明滚动条上移，取消自动滚动到底部
      toBottom.value = false;
    } else if (
      detailRef.value!.scrollHeight - detailRef.value!.clientHeight ===
      detailRef.value!.scrollTop
    ) {
      //滚动条移到底部，继续触发自动滚动到底部
      toBottom.value = true;
    }
  };

  const detailTimer = ref();
  // 定时器初始化
  const initTime = () => {
    getUpgradeDetailData();
    detailTimer.value = setInterval(() => {
      getUpgradeDetailData();
    }, 2000);
  };

  function handleClose() {
    clearInterval(detailTimer.value);
    detailTimer.value = null;
    dialogVisible.value = false;
    detailDataList.value = [];
    window.removeEventListener("scroll", handleScroll, true);
    emit("refresh");
  }

  onUnmounted(()=> {
    clearInterval(detailTimer.value);
    detailTimer.value = null;
    dialogVisible.value = false;
  })

  return {
    detailRef,
    dialogVisible,
    detailDataList,
    handleClose,
  };
}
