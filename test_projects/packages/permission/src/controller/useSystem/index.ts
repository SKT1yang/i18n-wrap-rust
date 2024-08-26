/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-03-15 09:41:09
 * @path: \permission\src\controller\useSystem\index.ts
 */

/* 类型文件 */
import type { SystemInfo } from '@guolisec/types';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
/* 第三方模块 */
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { message } from '@guolisec/toast';
import { useVModel } from '@guolisec/utils';
import { Modal } from 'ant-design-vue';
/* 共享模块 */
/* 业务模块 */
import {
  getAllSystemList,
  modifyDynamicSystem,
  createDynamicSystem,
  deleteDynamicSystem,
} from '../../service/system';
import { switchActiveSystemApi } from '../../model/system';
import { createSystemContext } from './useSystemContext';
import { logout } from '../../service/login';

/**
 * 系统列表
 */
export function useSystem() {
  onMounted(() => {
    getDataList();
  });
  const dataList = ref<SystemInfo[]>([]);

  async function getDataList() {
    dataList.value = await getAllSystemList();
  }

  const updateVisible = ref(false);
  const mode = ref<'create' | 'modify'>('create');
  const current = ref<SystemInfo>({
    active: false,
    clientId: '',
    description: '',
    id: 0,
    sysName: '',
    homePageUrl: '',
    model: '',
  });

  // 注入systemInfo上下文
  createSystemContext(current);

  /**
   * 新增系统
   */
  function handleCreate() {
    current.value = {
      active: false,
      clientId: '',
      description: '',
      id: 0,
      sysName: '',
      homePageUrl: '',
      model: '',
    };
    mode.value = 'create';
    updateVisible.value = true;
  }

  /**
   * 修改系统
   */
  function handleModify(row) {
    current.value = row;
    mode.value = 'modify';
    updateVisible.value = true;
  }

  /**
   *删除系统
   */
  async function handleDelete(records: SystemInfo[]) {
    if (records.length > 0) {
      try {
        Modal.confirm({
          title: '提示',
          content: '删除系统后，配置的路由权限全部清除，确认删除?',
          okText: '确定',
          cancelText: '取消',
          type: 'warning',
        });
        const ids = records.map((i) => i.id);
        await deleteDynamicSystem({
          ids,
        });
        message.success('删除成功！');
        getDataList();
      } finally {
        await getDataList();
      }
    } else {
      message.warning('请选择要批量删除的系统!');
    }
  }

  /**
   * 配置系统权限
   */
  const routeVisible = ref(false);
  async function handleRoute(row) {
    current.value = row;
    routeVisible.value = true;
  }

  /**
   * 配置系统角色
   */
  const roleVisible = ref(false);
  async function handleRole(row) {
    current.value = row;
    roleVisible.value = true;
  }

  /**
   * 配置系统用户
   */

  const userVisible = ref(false);
  async function handleUser(row) {
    current.value = row;
    userVisible.value = true;
  }

  /**
   * 切换系统
   */
  async function handleSwitchSystem(record) {
    Modal.confirm({
      iconType: 'warning',
      title: '提示',
      content: `确定切换系统?`,
      async onOk() {
        await switchActiveSystemApi({
          id: record.id,
        });
        await getDataList();
        logout('切换成功，请重新登录系统！');
      },
    });
  }

  return {
    dataList,
    current,
    updateVisible,
    routeVisible,
    roleVisible,
    userVisible,
    mode,
    getDataList,
    handleCreate,
    handleModify,
    handleDelete,
    handleRoute,
    handleRole,
    handleUser,
    handleSwitchSystem,
  };
}

/**
 * 权限修改/新增
 */
export function useSystemUpdate(
  props: {
    readonly visible: boolean;
    readonly current: Record<string, any>;
    readonly mode: 'create' | 'modify';
  },
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void
) {
  const formRef = ref<FormInstance>();
  const dialogVisible = useVModel(props, 'visible', emit);
  function closeModal() {
    dialogVisible.value = false;
    emit('refresh');
  }

  const title = computed(() => {
    return props.mode === 'create' ? '新增系统' : '修改系统';
  });

  const activeName = ref('basic');

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      await formRef.value?.resetFields();
      if (props.mode === 'modify') {
        Object.assign(dataForm.value, props.current);
      }
    }
  });
  const dataForm = ref<SystemInfo>({
    id: -1,
    active: false,
    clientId: '',
    description: '',
    sysName: '',
    homePageUrl: '',
    model: '',
  });

  const rules = ref<Record<string, Rule[]>>({
    sysName: [
      {
        required: true,
        message: '请输入系统名称',
        trigger: 'blur',
      },
    ],
    clientId: [
      {
        required: true,
        message: '请输入 clientId',
        trigger: 'blur',
      },
    ],
    model: [
      {
        required: true,
        message: '请输入规格型号',
        trigger: 'blur',
      },
    ],
    homePageUrl: [
      {
        required: true,
        message: '请输入系统主页路径',
        trigger: 'blur',
      },
    ],
  });
  // 保存
  async function handleSubmit() {
    props.mode === 'modify'
      ? await modifyDynamicSystem(dataForm.value)
      : await createDynamicSystem(dataForm.value);
    message.success('操作成功');
    emit('refresh');
    closeModal();
  }

  return {
    dataForm,
    rules,
    dialogVisible,
    title,
    activeName,
    formRef,
    closeModal,
    handleSubmit,
  };
}
