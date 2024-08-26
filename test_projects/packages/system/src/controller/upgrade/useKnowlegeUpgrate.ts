/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-04-12 18:32:26
 * @path: \glsec\apps\rsmp\src\domain\system\controller\upgrade\useKnowlegeUpgrate.ts
 */
import { ref, computed, watch, nextTick, onMounted } from "vue";
import type { TableProps } from "ant-design-vue/es/table";
import { useVModel, formatToDateTime } from "@guolisec/utils";
import { Knowledge } from "../../types/knowledge";

import { message } from "@guolisec/toast";
import type { FileType } from "ant-design-vue/es/upload/interface";
import type { UploadRequestOption } from "ant-design-vue/es/vc-upload/interface";
import {
  knowledgeBase,
  uploadKnowledge,
  knowledgeUpgrade,
  knowledgeUpgradeRecord,
} from "../../service/upgrade";

export function useKnowlegeUpgrate() {
  onMounted(() => {
    getKnowlegesData();
  });

  const beforeUpload = (file: FileType) => {
    const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (extension.toLowerCase() !== "bin") {
      message.warning("只能上传bin文件");
    }
    return false;
  };
  const uploadStatus = ref(false);

  async function uploadFile(param: UploadRequestOption) {
    const data = new FormData();
    data.append("multipartFile", param.file);
    uploadStatus.value = true;
    try {
      await uploadKnowledge(data);
      getKnowlegesData();
    } finally {
      uploadStatus.value = false;
    }
  }

  const knowledgeList = ref<Knowledge[]>([]);

  async function getKnowlegesData() {
    const res = await knowledgeBase();
    knowledgeList.value = res.content;
  }

  async function hanldeKnowledgeUpgrade(item) {
    await knowledgeUpgrade({
      name: item.name,
    });
    message.success("升级成功");
  }

  const dialogVisible = ref(false);

  const row = ref<Knowledge>({
    createBy: "",
    createTime: "",
    id: 0,
    name: "",
    remoteUpgrade: false,
    selfUpgrade: false,
    type: "",
    typeName: "",
  });
  function handleOpenModal(item: Knowledge) {
    dialogVisible.value = true;
    row.value = item;
  }

  return {
    dialogVisible,
    beforeUpload,
    uploadFile,
    formatToDateTime,
    knowledgeList,
    row,
    uploadStatus,
    hanldeKnowledgeUpgrade,
    handleOpenModal,
  };
}

export function useUpgradeRecordModal(
  props: {
    readonly visible: boolean;
    readonly current: Record<string, any>;
  },
  emit: (event: "update:visible" | "refresh", ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, "visible", emit);

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      getKnowledgeRecordsData();
    }
  });

  const tableData = ref<Knowledge[]>([]);

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
    getKnowledgeRecordsData();
  };

  async function getKnowledgeRecordsData() {
    console.log(props.current, "props.current.type");
    const res = await knowledgeUpgradeRecord({
      page: currentPage.value,
      size: pageSize.value,
      type: props.current.type,
      sn: "csmp",
    });
    tableData.value = res.content;
    total.value = res.totalElements;
  }

  return {
    tableData,
    dialogVisible,
    pagination,
    handleTableChange,
    formatToDateTime,
  };
}
