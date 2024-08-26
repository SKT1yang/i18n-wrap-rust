/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-03-15 14:07:12
 * @path: \permission\src\controller\useRoute.ts
 */

/* 类型文件 */
import type { Ref } from 'vue';
import type {
  PermissionTreeItem,
  PermissionItem,
  SystemInfo,
} from '@guolisec/types';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
/* 第三方模块 */
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { message } from '@guolisec/toast';
import { useVModel, isEmptyValue } from '@guolisec/utils';
import { Modal } from 'ant-design-vue';
/* 共享模块 */
import { pathValidator } from '../utils';
/* 业务模块 */
import {
  getSystemPermission,
  setSystemPermission,
  modifySystemPermission,
  deleteSystemPermission,
} from '../service/route';
import { getPermissionList } from '../model/permission';
import { useSystemId } from './useSystem/useSystemId';

/**
 * 路由表格树
 */
export function useRoute(props: { readonly current: SystemInfo }) {
  onMounted(() => {
    doSearch();
  });
  const dataList = ref<PermissionTreeItem[]>([]);

  async function getDataList() {
    const systemId = useSystemId({
      systemId: props.current.id,
    });
    if (systemId.value) {
      dataList.value = (await getSystemPermission(systemId.value)) || [];
    }
  }

  function doSearch() {
    getDataList();
  }

  const createVisible = ref(false);
  const modifyVisible = ref(false);
  const mode = ref<'create' | 'modify'>('create');
  const current = ref();
  function handleCreate() {
    current.value = {};
    mode.value = 'create';
    createVisible.value = true;
  }
  function handleModify(row: PermissionTreeItem) {
    current.value = row;
    mode.value = 'modify';
    modifyVisible.value = true;
  }

  /**
   *删除路由
   */
  async function handleDelete(records: PermissionTreeItem[]) {
    if (records.length > 0) {
      try {
        Modal.confirm({
          title: '提示',
          content: '删除后，该路由下所有子路由都将删除，确认删除?',
          okText: '确定',
          cancelText: '取消',
          type: 'warning',
          async onOk() {
            const ids = records.map((i) => i.id);
            await deleteSystemPermission(ids);
            message.success('删除成功！');
            doSearch();
          },
        });
      } finally {
        doSearch();
      }
    } else {
      message.warning('请选择要批量删除的路由!');
    }
  }

  return {
    dataList,
    current,
    createVisible,
    modifyVisible,
    mode,
    doSearch,
    handleCreate,
    handleModify,
    handleDelete,
  };
}

/**
 * 新增系统路由
 */
export function useRouteCreate(
  props: {
    readonly visible: boolean;
    readonly systemId: number;
  },
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void,
  formRef: Ref<FormInstance | undefined>
) {
  const routeTree = ref<PermissionTreeItem[]>([]);

  type SelectItem = PermissionItem & {
    disabled?: boolean;
  };
  const permissionList = ref<SelectItem[]>([]);

  async function getRouteTreeOptions() {
    routeTree.value = await getSystemPermission(props.systemId, {
      disabled: false,
    });
    routeTree.value.unshift({
      ...permissionTreeItemFactory(),
      title: '顶级路由',
    });
  }

  async function getPermissionOptions() {
    const { content } = await getPermissionList({
      page: 1,
      size: 100000,
    });
    permissionList.value = content;
  }

  const dataForm = ref<{
    pid: number;
    permissionIds: number[];
  }>({
    pid: 0,
    permissionIds: [],
  });

  const rules = ref<Record<string, Rule[]>>({
    pid: [
      {
        required: true,
        message: '请输入菜单名称',
        trigger: 'blur',
      },
    ],
    permissionIds: [
      {
        required: true,
        message: '请输入菜单名称',
        trigger: 'blur',
      },
    ],
  });

  // 弹窗相关
  const dialogVisible = useVModel(props, 'visible', emit);
  function closeModal() {
    dialogVisible.value = false;
    emit('refresh');
  }

  // 初始化
  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      await formRef.value?.resetFields();
      await getRouteTreeOptions();
      await getPermissionOptions();
    }
  });

  const title = computed(() => {
    return '新增系统路由';
  });

  /**
   * 上级目录和目标目录不能一样
   * 两边id不是同一张表
   */
  function handleSelectVisibleChange() {
    permissionList.value.forEach((permission) => {
      if (currentTreeSelectNameList.value.includes(permission.name)) {
        permission.disabled = true;
      } else {
        permission.disabled = false;
      }
    });
  }

  const currentTreeSelectNameList = ref<string[]>([]);
  function handleTreeSelect(_id: number, labelList: string[]) {
    currentTreeSelectNameList.value = labelList;
    // 同步禁用，如果相同，目标路由置空初始化
    dataForm.value.permissionIds = permissionList.value
      .filter((item) => {
        return (
          dataForm.value.permissionIds.includes(item.id) &&
          !labelList.includes(item.name)
        );
      })
      .map((route) => {
        return route.id;
      });
    // 更新禁用
    handleSelectVisibleChange();
  }

  // 保存
  async function handleSubmit() {
    await formRef.value?.validate();
    const selectedRoutes = permissionList.value
      .filter((item) => {
        return dataForm.value.permissionIds.includes(item.id);
      })
      .map((route) => {
        return {
          ...route,
          pid: dataForm.value.pid,
        };
      });
    await setSystemPermission({
      systemId: props.systemId,
      routes: selectedRoutes,
    });
    message.success('操作成功');
    emit('refresh');
    closeModal();
  }

  return {
    dataForm,
    rules,
    dialogVisible,
    title,
    permissionList,
    routeTree,
    closeModal,
    handleSubmit,
    handleSelectVisibleChange,
    handleTreeSelect,
  };
}

/**
 * 修改系统路由
 */
export function useRouteModify(
  props: {
    readonly systemId: number;
    readonly visible: boolean;
    readonly current: PermissionTreeItem;
  },
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void,
  formRef: Ref<FormInstance | undefined>
) {
  const dialogVisible = useVModel(props, 'visible', emit);
  function closeModal() {
    dialogVisible.value = false;
    emit('refresh');
  }

  const routeTree = ref<PermissionTreeItem[]>([]);
  async function getRouteTreeOptions() {
    routeTree.value = await getSystemPermission(props.systemId, {
      disabled: false,
    });
    routeTree.value.unshift({
      ...permissionTreeItemFactory(),
      title: '顶级路由',
    });
  }

  const title = computed(() => {
    return '修改系统路由';
  });

  const activeName = ref('basic');

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      formRef.value?.resetFields();
      await getRouteTreeOptions();
      activeName.value = 'basic';
      Object.assign(dataForm.value, props.current);
    }
  });
  const dataForm = ref(permissionTreeItemFactory());

  const rules = ref<Record<string, Rule[]>>({
    pid: [
      {
        required: true,
        message: '请输入上级路由',
        trigger: 'blur',
      },
    ],
    name: [
      {
        required: true,
        validator: (_rule, value: string) => {
          if (value) {
            const letterMatch = value.match(/[A-Z]/);
            if (
              (letterMatch && isEmptyValue(letterMatch)) ||
              letterMatch?.index !== 0
            ) {
              return Promise.reject('必须大写字母开头');
            } else {
              if (value.replace(/[a-zA-Z]/g, '') === '') {
                return Promise.resolve();
              } else {
                return Promise.reject('只允许包含英文字母');
              }
            }
          } else {
            return Promise.reject('请输入路由的唯一标识name');
          }
        },
        trigger: 'blur',
      },
    ],
    path: [
      {
        required: true,
        validator: (_rule, value: string) => {
          if (isEmptyValue(value)) {
            return Promise.reject('请填写路由本身路径');
          }
          if (
            value &&
            (value.replace(/\/*[a-z|-]+/, '') === '' || value === '/')
          ) {
            return Promise.resolve();
          } else {
            return Promise.reject('请输入正确格式的路径');
          }
        },
        trigger: 'blur',
      },
    ],
    redirect: [
      {
        validator: pathValidator,
        trigger: 'blur',
      },
    ],
    title: [
      {
        required: true,
        message: '请输入菜单名称',
        trigger: 'blur',
      },
    ],
    realPath: [
      {
        validator: pathValidator,
        trigger: 'blur',
      },
    ],
    hasChildClick: [
      {
        validator: pathValidator,
        trigger: 'blur',
      },
    ],
  });
  // 保存
  async function handleSubmit() {
    await formRef.value?.validate();
    await modifySystemPermission(dataForm.value);
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
    routeTree,
    closeModal,
    handleSubmit,
  };
}

/**
 * 配置系统路由
 */
export function useRouteModal(
  props: {
    readonly visible: boolean;
    readonly current: SystemInfo;
  },
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void
) {
  // 弹窗相关
  const dialogVisible = useVModel(props, 'visible', emit);
  function closeModal() {
    dialogVisible.value = false;
    emit('refresh');
  }

  const title = computed(() => {
    return '配置系统路由';
  });

  // 保存
  async function handleSubmit() {
    emit('refresh');
    closeModal();
  }

  return {
    dialogVisible,
    title,
    handleSubmit,
    closeModal,
  };
}

function permissionTreeItemFactory() {
  return {
    id: 0,
    pid: 0,
    name: '',
    path: '',
    redirect: '',
    props: '',
    component: '',
    title: '',
    icon: '',
    dynamicLevel: 1,
    orderNo: 1,
    realPath: '',
    fullPath: '',
    transitionName: '',
    currentActiveMenu: '',
    hasChildClick: '',
    frameSrc: '',
    hideMenu: false,
    carryParam: false,
    ignoreRoute: false,
    ignoreAuth: false,
    single: false,
    hideBreadcrumb: false,
    ignoreKeepAlive: false,
    affix: false,
    hideChildrenInMenu: false,
    hideTab: false,
    isLink: false,
    hidePathForChildren: false,
    subNavigator: false,
    monitorBehavior: true,
  };
}
