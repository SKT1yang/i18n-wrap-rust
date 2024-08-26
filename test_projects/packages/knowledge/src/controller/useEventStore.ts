/*
 * @name: 事件库
 * @description: Do not edit
 */

/* 类型文件 */
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type {
  EventTypeTree,
  Event,
  KnowledgeConfig,
} from '../types/eventStore';
import type { PropType } from 'vue';
/* 第三方模块 */
import {
  onMounted,
  ref,
  ExtractPropTypes,
  watch,
  nextTick,
  computed,
} from 'vue';
import { Modal } from 'ant-design-vue';
/* 本地共享模块 */
import { useVModel } from '@guolisec/utils';
import { message } from '@guolisec/toast';

/* 业务模块 */
import {
  getEventTypeTree,
  getEventStore,
  editEventStore,
  deleteEventStore,
  addEventStore,
} from '../service/eventStore';

export function useBasicStore(props: { readonly config: KnowledgeConfig }) {
  const eventGroup = computed(() => props.config?.type || 'normal');

  const queryForm = ref<{
    name?: string;
    typeList?: number[];
  }>({});

  /**
   * 获取事件类型数据
   */
  const eventTypeTreeData = ref<EventTypeTree[]>([]);

  async function getEventTypeTreeData() {
    const res = await getEventTypeTree();
    eventTypeTreeData.value = res;
  }

  /**
   * 分页、排序
   */
  const currentPage = ref(1);
  const size = ref(10);
  const total = ref(0);

  /**
   * 表格数据发生改变
   */
  function handleTableChange(pagination, _filters, _sorter) {
    const { current, pageSize } = pagination;
    currentPage.value = current;
    size.value = pageSize;

    selectedRowKeys.value = [];
    getEventStoreData();
  }

  const tableData = ref<Event[]>([]);
  async function getEventStoreData() {
    const { name, typeList } = queryForm.value;
    const { content, totalElements } = await getEventStore({
      size: size.value,
      page: currentPage.value,
      name,
      typeId: typeList ? typeList[typeList.length - 1] : undefined,
      eventGroup: eventGroup.value === 'normal' ? undefined : eventGroup.value,
    });
    tableData.value = content;
    total.value = totalElements;
  }

  function handleSearch() {
    currentPage.value = 1;
    getEventStoreData();
  }

  /**
   * 异常行为分析
   */
  async function handleChangeSwitch(
    record,
    type: 'abnormal' | 'alarm',
    checked
  ) {
    const data = {
      ...record,
      name: undefined,
    };
    data[type] = checked;
    await editEventStore(data);
    message.success(
      `${checked ? '开启' : '关闭'}${
        type === 'abnormal' ? '异常行为分析' : '安全事件告警'
      }成功！`
    );
    getEventStoreData();
  }

  /**
   * 删除报表
   */
  async function handleDeleteReport(ids: number[]) {
    await deleteEventStore(ids);
    message.success('删除成功！');
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
        title: '提示',
        content: '确认删除选中的事件吗?',
        style: {
          top: '30%',
        },
        okText: '确定',
        onOk: async () => {
          await handleDeleteReport(selectedRowKeys.value);
          selectedRowKeys.value = [];
        },
      });
    } else {
      message.warning('请选择要删除的事件!');
    }
  }

  /**
   * 修改事件行为
   */
  const settingDialogVisible = ref(false);
  const records = ref<Event[]>([]);
  const settingType = ref<'abnormal' | 'alarm' | 'threshold'>();
  function handleEditEvent(type: 'abnormal' | 'alarm' | 'threshold') {
    if (selectedRowKeys.value.length > 0) {
      records.value = [];
      settingType.value = type;
      tableData.value.forEach((item) => {
        if (selectedRowKeys.value.includes(item.id)) {
          records.value.push(item);
        }
      });
      settingDialogVisible.value = true;
    } else {
      message.warning('请至少选择一条事件！');
    }
  }

  /**
   * 新增新事件
   */
  const addDialogVisible = ref(false);
  function handleAddEvent() {
    addDialogVisible.value = true;
  }

  onMounted(() => {
    getEventStoreData();
    getEventTypeTreeData();
  });

  return {
    queryForm,
    eventTypeTreeData,
    tableData,
    handleSearch,
    getEventStoreData,
    total,
    currentPage,
    size,
    handleTableChange,
    handleChangeSwitch,
    handleDeleteReport,
    handleSelectionChange,
    selectedRowKeys,
    handleMutilDelete,
    settingDialogVisible,
    records,
    settingType,
    handleEditEvent,
    addDialogVisible,
    handleAddEvent,
  };
}

export function useEventSettingsModal(
  props: Readonly<
    ExtractPropTypes<{
      visible: {
        type: BooleanConstructor;
        required: true;
      };
      records: {
        type: PropType<Event[]>;
        default: () => [];
      };
      type: {
        type: PropType<'abnormal' | 'alarm' | 'threshold'>;
        default: () => 'abnormal';
      };
    }>
  >,
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, 'visible', emit);

  const title = ref('异常行为分析设置');

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      await formRef.value?.resetFields();
      if (props.type === 'abnormal') {
        title.value = '异常行为分析设置';
      } else if (props.type === 'alarm') {
        title.value = '安全事件告警设置';
      } else {
        title.value = '潜在危害分析设置';
      }
    }
  });

  /**
   * 表单
   */
  const formRef = ref<FormInstance>();

  const formData = ref<{
    abnormal?: boolean;
    alarm?: boolean;
    harmStatus?: boolean;
    unit?: string;
    threshold?: number;
  }>({
    abnormal: true,
    alarm: true,
    harmStatus: true,
    unit: '0',
    threshold: 1,
  });

  const rules = ref<Record<string, Rule[]>>({
    threshold: [
      {
        required: true,
        message: '请输入发生次数',
        trigger: 'blur',
      },
    ],
  });

  const alarmSettingData = ref([
    {
      label: '累计',
      value: '0',
      key: '0',
    },
    {
      label: '每分钟',
      value: '1',
      key: '1',
    },
    {
      label: '每小时',
      value: '2',
      key: '2',
    },
    {
      label: '每天',
      value: '3',
      key: '3',
    },
  ]);

  /**
   * 确定修改
   */
  const confirmButtonStatus = ref(false);

  async function handleConfirm() {
    await formRef.value?.validate();
    confirmButtonStatus.value = true;
    try {
      await editEventStoreData();
      handleClose();
    } finally {
      confirmButtonStatus.value = false;
    }
  }

  async function editEventStoreData() {
    const { type, records } = props;
    const { abnormal, alarm, harmStatus, unit, threshold } = formData.value;
    const promissList: Promise<any>[] = [];
    records.forEach((record) => {
      let data: Event | undefined = undefined;
      if (type === 'abnormal') {
        data = { ...record, abnormal: abnormal!, name: undefined };
      } else if (type === 'alarm') {
        data = { ...record, alarm: alarm!, name: undefined };
      } else {
        data = {
          ...record,
          unit: harmStatus ? unit! : '0',
          threshold: harmStatus ? threshold! : 0,
          name: undefined,
        };
      }
      promissList.push(editEventStore(data!));
    });
    await Promise.all(promissList);
    message.success(
      `${formData.value[type] ? '开启' : '关闭'}${title.value}成功!`
    );
  }

  /**
   * 关闭弹窗
   */
  function handleClose() {
    dialogVisible.value = false;
    emit('refresh');
  }

  return {
    dialogVisible,
    title,
    formRef,
    formData,
    rules,
    alarmSettingData,
    confirmButtonStatus,
    handleConfirm,
    handleClose,
  };
}

export function useAddEventStoreModal(
  props: Readonly<
    ExtractPropTypes<{
      visible: {
        type: BooleanConstructor;
        required: true;
      };
    }>
  >,
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, 'visible', emit);

  const title = ref('新增事件');

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      await formRef.value?.resetFields();
      getEventTypeTreeData();
    }
  });

  /**
   * 表单
   */
  const formRef = ref<FormInstance>();

  const formData = ref<{
    name: string;
    typeList: number[];
    level: 1 | 2 | 3 | 4;
    tag: string;
    description: string;
  }>({
    name: '',
    typeList: [],
    level: 1,
    tag: '',
    description: '',
  });

  const rules = ref<Record<string, Rule[]>>({
    name: [
      {
        required: true,
        message: '请输入事件名称',
        trigger: 'blur',
      },
    ],
    description: [
      {
        required: true,
        message: '请输入事件描述',
        trigger: 'blur',
      },
    ],
    typeList: [
      {
        required: true,
        message: '请输入事件类型',
        trigger: 'change',
      },
    ],
    level: [
      {
        required: true,
        message: '请输入事件级别',
        trigger: 'change',
      },
    ],
  });

  const eventLevelData = ref([
    {
      label: '高风险',
      value: 1,
      key: 1,
    },
    {
      label: '中风险',
      value: 2,
      key: 2,
    },
    {
      label: '低风险',
      value: 3,
      key: 3,
    },
    {
      label: '信息',
      value: 4,
      key: 4,
    },
  ]);

  /**
   * 获取事件类型数据
   */
  const eventTypeTreeData = ref<EventTypeTree[]>([]);

  async function getEventTypeTreeData() {
    const res = await getEventTypeTree();
    eventTypeTreeData.value = res;
  }

  /**
   * 确定修改
   */
  const confirmButtonStatus = ref(false);

  async function handleConfirm() {
    await formRef.value?.validate();
    confirmButtonStatus.value = true;
    try {
      await addEventStoreData();
      handleClose();
    } finally {
      confirmButtonStatus.value = false;
    }
  }

  async function addEventStoreData() {
    const { name, typeList, level, tag, description } = formData.value;
    let map = {
      1: 10,
      2: 5,
      3: 2,
      4: 1,
    };
    const score = map[level!];
    const eventId = typeList![typeList!.length - 1];
    await addEventStore({
      name: name,
      level: level,
      score,
      tag: tag,
      eventType: {
        id: eventId,
      },
      description,
      eventDescription: description,
    });
    message.success('新增事件成功！');
  }

  /**
   * 关闭弹窗
   */
  function handleClose() {
    dialogVisible.value = false;
    emit('refresh');
  }

  return {
    dialogVisible,
    title,
    formRef,
    formData,
    rules,
    eventLevelData,
    eventTypeTreeData,
    confirmButtonStatus,
    handleConfirm,
    handleClose,
  };
}
