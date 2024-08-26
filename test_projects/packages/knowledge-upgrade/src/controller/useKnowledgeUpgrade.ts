/*
 * @name: 知识库升级
 * @description: Do not edit
 * @date: 2023-09-19 13:21:22
 * @path: \knowledge-upgrade\src\controller\useKnowledgeUpgrade.ts
 */
/* 类型文件 */
import type {
  KnowledgeType,
  KnowledgeBase,
  KnowledgeRecord,
} from '../types/upgrade';
/* 第三方模块 */
import { onMounted, ref, watch, nextTick, computed } from 'vue';

/* 本地共享模块 */
import { useVModel } from '@guolisec/utils';
import { message } from '@guolisec/toast';
import { formatToDateTime } from '@guolisec/utils';
/* 业务模块 */
import { injectUpgradeKnowledgeContext } from '../utils';
import {
  getKnowledgeBase,
  getKnowledgeUpgradeRecord,
  assetStoreUpgrade,
} from '../service/upgrade';

export function useKnowledgeUpgrade(props) {
  /**
   * 获取知识库数据
   */
  const knowledgeBaseData = ref<KnowledgeBase[]>([]);
  async function getKnowledgeBaseData() {
    const { content } = await getKnowledgeBase();
    if (props.limitLibs?.length > 0) {
      // 如果有指定的库，就只显示指定的库
      const result = content.filter((item) => {
        return props.limitLibs.some((libName) => {
          return item.type.toLowerCase() == libName.toLowerCase();
        });
      });
      return (knowledgeBaseData.value = result);
    }
    knowledgeBaseData.value = content;
  }

  onMounted(() => {
    getKnowledgeBaseData();
  });

  return { knowledgeBaseData, getKnowledgeBaseData };
}

export function useUpgradeItem(
  props: { readonly data: KnowledgeBase },
  emit: (event: 'loading', ...args: any[]) => void
) {
  const currentKnowledgeBase = computed(() => props.data);
  const { sn = 'csmp', noLicense = false } = injectUpgradeKnowledgeContext();
  /**
   * 获取最近的升级记录
   */
  const lastestRecordData = ref<KnowledgeRecord>();
  async function getUpgradeRecordData() {
    const { content } = await getKnowledgeUpgradeRecord({
      size: 1,
      page: 1,
      type: currentKnowledgeBase.value.type,
      sort: 'createTime,desc',
      sn,
    });
    lastestRecordData.value = content[0];
  }

  /**
   * 更新
   */
  const uploadStatus = ref(false);

  watch(
    () => uploadStatus.value,
    (loading) => {
      emit('loading', Boolean(loading));
    }
  );

  async function uploadFile() {
    uploadStatus.value = true;
    try {
      await assetStoreUpgrade(
        {
          name: props.data.name,
          typeName: props.data.typeName,
        },
        noLicense
      );
      message.success(`${currentKnowledgeBase.value.typeName}升级成功！`);
    } finally {
      uploadStatus.value = false;
      getUpgradeRecordData();
    }
  }

  const dialogVisible = ref(false);
  function handleOpenModal() {
    dialogVisible.value = true;
  }

  onMounted(() => {
    getUpgradeRecordData();
  });

  return {
    currentKnowledgeBase,
    lastestRecordData,
    uploadFile,
    uploadStatus,
    formatToDateTime,
    dialogVisible,
    handleOpenModal,
  };
}

export function useUpgradeRecordModal(
  props: {
    readonly visible: boolean;
    readonly type: KnowledgeType;
  },
  emit: (event: 'update:visible', ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, 'visible', emit);

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      getUpgradeRecordData();
    }
  });

  /**
   * 分页、排序
   */
  const currentPage = ref(1);
  const total = ref(0);

  const sort = ref('createTime,desc');

  /**
   * 表格数据发生改变
   */
  function handleTableChange(pagination, _filters, sorter) {
    const { current } = pagination;
    currentPage.value = current;

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
    getUpgradeRecordData();
  }

  /**
   * 获取升级记录
   */
  const tableColumns = ref([
    {
      title: '序号',
      align: 'center',
      width: 70,
      key: 'index',
      customRender: ({ index }) => {
        return (currentPage.value - 1) * 10 + index + 1;
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      //   align: "center",
    },
    {
      title: '升级时间',
      align: 'center',
      sorter: true,
      dataIndex: 'createTime',
      defaultSortOrder: 'descend',
      key: 'createTime',
      customRender: ({ text }) => {
        return text ? formatToDateTime(text) : '-';
      },
    },
  ]);

  const upgradeRecordData = ref<KnowledgeRecord[]>();
  const { sn = 'csmp' } = injectUpgradeKnowledgeContext();
  async function getUpgradeRecordData() {
    const { content, totalElements } = await getKnowledgeUpgradeRecord({
      size: 10,
      page: 1,
      type: props.type,
      sort: sort.value,
      sn,
    });
    upgradeRecordData.value = content;
    total.value = totalElements;
  }

  /**
   * 关闭弹窗
   */
  function handleClose() {
    dialogVisible.value = false;
  }

  return {
    dialogVisible,
    upgradeRecordData,
    tableColumns,
    total,
    currentPage,
    handleTableChange,
    handleClose,
  };
}
