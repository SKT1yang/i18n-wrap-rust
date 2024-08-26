/*
 * @name: 报表管理
 * @description:
 * @date: 2023-09-13 15:03:07
 * @path: \feature-vue\platform\front\reports\src\controller\useReportsConfig.ts
 */

/* 类型文件 */
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form';
import type { ReportsConfig } from '../types/reports';
/* 第三方模块 */
import { onMounted, ref, ExtractPropTypes, watch, nextTick } from 'vue';

/* 本地共享模块 */
import { useVModel } from '@guolisec/utils';
import { message } from '@guolisec/toast';
import { t } from '@/entry/languages/useLanguage';
/* 业务模块 */
import { queryReportTask, updateReportTask } from '../service/reports';

export function useReportConfig() {
  /**
   * 获取列表数据
   */
  const tableColumns = ref([
    {
      title: `${t('任务名称')}`,
      dataIndex: 'jobName',
    },
    {
      title: `${t('备注')}`,
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: `${t('状态')}`,
      dataIndex: 'isPause',
      key: 'isPause',
      width: 120,
      align: 'center',
    },
  ]);
  const tableData = ref<ReportsConfig[]>([]);
  async function getReportTasksData() {
    const res = await queryReportTask();
    tableData.value = res;
  }

  /**
   * 切换状态
   */
  async function handleSwitchChange(record: ReportsConfig, checked: boolean) {
    await updateReportTask({ ...record, isPause: !checked });
    await getReportTasksData();
    message.success(`${t('修改成功！')}`);
  }

  /**
   * 新增配置
   */
  const dialogVisible = ref(false);
  function handleAddConfig() {
    dialogVisible.value = true;
  }

  onMounted(() => {
    getReportTasksData();
  });

  return {
    tableData,
    tableColumns,
    getReportTasksData,
    handleSwitchChange,
    dialogVisible,
    handleAddConfig,
  };
}

export function useAddTemplateModal(
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
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, 'visible', emit);

  const title = ref(`${t('新建任务')}`);

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();

      await formRef.value?.resetFields();
    }
  });

  const formRef = ref<FormInstance>();

  const formData = ref<{
    reportName?: string; // 报告标题
    type: '日报' | '周报' | '月报'; // 报告类型
    format: 'word' | 'pdf' | 'html'; // 报告格式
    settime?: string; // 日报规则
    setweek?: '周一' | '周二' | '周三' | '周四' | '周五' | '周六' | '周日'; // 周报规则
    setmonth?: '月初' | '月中' | '月末'; // 月报规则
    content?: string;
  }>({
    type: '日报',
    format: 'word',
  });

  const rules = ref<Record<string, Rule[]>>({
    reportName: [
      {
        required: true,
        message: `${t('请输入报告标题')}`,
        trigger: 'blur',
      },
    ],
    settime: [
      {
        required: true,
        message: `${t('请检查规则')}`,
        trigger: 'change',
      },
    ],
    setweek: [
      {
        required: true,
        validator: (_rule, _value) => {
          const { setweek, settime } = formData.value;
          if (setweek && settime) {
            Promise.resolve();
          } else {
            Promise.reject(t('请检查规则'));
          }
        },
        trigger: 'change',
      },
    ],
    setmonth: [
      {
        required: true,
        message: `${t('请检查规则')}`,
        trigger: 'change',
      },
    ],
  });

  // 内容选项
  const contentOptions = [
    {
      label: `${t('资产统计')}`,
      value: '资产统计',
    },
    {
      label: `${t('协议统计')}`,
      value: '协议统计',
    },
    {
      label: `${t('事件统计')}`,
      value: '事件统计',
    },
    {
      label: `${t('攻击统计')}`,
      value: '攻击统计',
    },
  ];

  /**
   * 确定新增、确定修改
   */
  const confirmButtonStatus = ref(false);

  async function handleConfirm() {
    await formRef.value?.validate();
    confirmButtonStatus.value = true;
    try {
      // formData.value.id ? modifyTasks() : addTasks()
    } finally {
      confirmButtonStatus.value = false;
    }
  }

  const handleSave = () => {
    formRef.value?.validateFields();
  };

  /**
   * 关闭弹窗
   */
  function handleClose() {
    dialogVisible.value = false;
    emit('refresh');
  }

  return {
    dialogVisible,
    formRef,
    formData,
    rules,
    title,
    contentOptions,
    handleConfirm,
    handleSave,
    handleClose,
    confirmButtonStatus,
  };
}
