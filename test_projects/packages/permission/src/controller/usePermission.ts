/*
 * @name: Do not edit
 * @description: Do not edit
 */
/* 类型文件 */
import type { PermissionItem } from '@guolisec/types';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { TableProps } from 'ant-design-vue/es/table';
/* 第三方模块 */
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue';
import { message } from '@guolisec/toast';
import {
  useVModel,
  isEmptyValue,
  useBehaviorMonitor,
  log,
} from '@guolisec/utils';
import { Modal } from 'ant-design-vue';
import { useRouter } from '@guolisec/routerable';
/* 共享模块 */
import { pathValidator } from '../utils';
/* 业务模块 */
import {
  getPermissionList,
  modifyPermission,
  createPermission,
  deletePermission,
} from '../service/permission';
import { logout } from '..';
import { getLoginTime as getLoginTimeApi } from '../model/login';

/**
 * 权限列表
 */
function usePermission() {
  onMounted(() => {
    doSearch();
  });

  const queryForm = reactive({
    name: '', // 唯一标识
    title: '', // 菜单名称
  });
  const dataList = ref<PermissionItem[]>([]);
  const total = ref<number>();
  const currentPage = ref(1);
  const pageSize = ref(15);

  const pagination = computed(() => {
    return {
      total: total.value,
      current: currentPage.value,
      pageSize: pageSize.value,
    };
  });

  async function getDataList() {
    const { content, totalElements } = await getPermissionList({
      ...queryForm,
      page: currentPage.value,
      size: pageSize.value,
    });
    dataList.value = content;
    total.value = totalElements;
  }

  function doSearch() {
    currentPage.value = 1;
    getDataList();
  }

  const handleTableChange: TableProps['onChange'] = (pag) => {
    pageSize.value = pag.pageSize || pageSize.value;
    currentPage.value = pag.current || currentPage.value;
    getDataList();
  };

  const updateVisible = ref<boolean>(false);
  const mode = ref<'create' | 'modify'>('create');
  const current = ref();
  function handleCreate() {
    current.value = {};
    mode.value = 'create';
    updateVisible.value = true;
  }
  function handleModify(row: PermissionItem) {
    current.value = row;
    mode.value = 'modify';
    updateVisible.value = true;
  }

  /**
   *删除路由
   */
  async function handleDelete(records: PermissionItem[]) {
    if (records.length > 0) {
      try {
        await Modal.confirm({
          title: '提示',
          content: '删除前请确认已没有系统使用该页面，确认删除?',
          okText: '确定',
          cancelText: '取消',
          type: 'warning',
        });
        const ids = records.map((i) => i.id);
        await deletePermission({
          ids,
        });
        message.success('删除成功！');
        doSearch();
      } finally {
        await doSearch();
      }
    } else {
      message.warning('请选择要批量删除的路由!');
    }
  }

  return {
    queryForm,
    pagination,
    dataList,
    currentPage,
    current,
    updateVisible,
    mode,
    getDataList,
    doSearch,
    handleTableChange,
    handleCreate,
    handleModify,
    handleDelete,
  };
}

/**
 * 权限修改/新增
 */
function usePermissionUpdate(
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
    return props.mode === 'create' ? '新增权限' : '修改权限';
  });

  const activeName = ref('basic');

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      await formRef.value?.resetFields();
      activeName.value = 'basic';
      if (props.mode === 'modify') {
        Object.assign(dataForm.value, props.current);
      }
    }
  });
  const dataForm = ref<PermissionItem>({
    id: -1,
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
  });

  const rules = ref<Record<string, Rule[]>>({
    name: [
      {
        required: true,
        validator: (_rule: Rule, value: string) => {
          if (value) {
            const letterMatch = value.match(/[A-Z]/);
            if (isEmptyValue(letterMatch) || letterMatch?.index !== 0) {
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
      // {
      //   validator: pathValidator,
      //   trigger: 'blur',
      // },
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
    props.mode === 'modify'
      ? await modifyPermission(dataForm.value)
      : await createPermission([dataForm.value]);
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

/*
 * @name: 用户行为监测
 * @description: 1. 前端通过路由 meta.monitorBehavior === true 进行用户无操作超时机制注入， 注意动态菜单和动态路由默认检测（true）
 */

function useMonitor() {
  const router = useRouter();
  /**
   * 是否监测
   * @returns boolean
   */
  function needMonitor() {
    return router?.currentRoute.value?.meta?.monitorBehavior === true;
  }

  // 获取token有效时长
  async function getLoginTime() {
    return (await getLoginTimeApi()) * 60 * 1000;
  }
  const { watchRouteChange } = useBehaviorMonitor(
    needMonitor,
    logout,
    getLoginTime,
    {}
  );

  watch(
    () => router.currentRoute.value.path,
    () => {
      log('路由发生改变，watchRouteChange执行了');
      watchRouteChange();
    },
    {
      immediate: true,
    }
  );
}

export { usePermission, usePermissionUpdate, useMonitor };
