/*
 * @name: Do not edit
 * @description: Do not edit
 */
import type { SystemInfo } from '@guolisec/types';
import { ref, reactive, onMounted, computed } from 'vue';
import { usePermissionStoreWithOut } from '../model/store';
import { useVModel } from '@guolisec/utils';
import { getRoleList } from '../service/role';
import { t } from '@/languages';

export function useRole(props: {
  readonly systemInfo: SystemInfo;
  readonly scope: 'all' | 'normal';
}) {
  const permissionStore = usePermissionStoreWithOut();

  const queryForm = reactive({
    name: '', // 角色名
  });

  // 账号列表
  const dataList = ref([]);

  async function getDataList() {
    const { normal, all } = await getRoleList(queryForm);
    if (props.scope === 'normal') {
      dataList.value = normal;
    } else {
      dataList.value = all;
    }
  }

  onMounted(() => {
    getDataList();
  });

  return {
    queryForm,
    dataList,
    getDataList,
    currentUser: permissionStore.getUserInfo,
  };
}

/**
 * 配置系统角色
 */
export function useRoleModal(
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
    return t('配置系统角色');
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
