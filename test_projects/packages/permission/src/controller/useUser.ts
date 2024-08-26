/*
 * @name: Do not edit
 * @description: Do not edit
 */
/* 类型文件 */
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';
import type { UserListModel } from '../types/user';
import type { TableProps } from 'ant-design-vue/es/table';

/* 第三方模块 */
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { http } from '@guolisec/request';
import { message } from '@guolisec/toast';
import {
  passwordValidate,
  phoneValidate,
  usernameValidate,
  useVModel,
  encrypt,
} from '@guolisec/utils';
/* 共享模块 */
import { t } from '@/languages';
/* 业务模块 */
import { usePermissionStoreWithOut } from '../model/store';
import {
  getUser,
  getUserMaxFaildNum,
  modifyMaxFailedNum,
  resetNewPassword,
  modifyUserPassword,
} from '../service/user';
import { getPublicKey } from '../model/login';

function useUser() {
  const permissionStore = usePermissionStoreWithOut();

  const queryForm = reactive({
    name: '', // 姓名
    username: '', // 账号名称
    roleId: undefined, // 角色
    phone: '', // 手机号
  });

  const total = ref();
  const currentPage = ref(1);
  const pageSize = ref(10);

  const pagination = computed(() => {
    return {
      total: total.value,
      current: currentPage.value,
      pageSize: pageSize.value,
    };
  });

  // 账号列表
  const dataList = ref<UserListModel[]>([]);

  // 角色列表
  const roleList = ref<
    {
      id: number;
      name: string;
    }[]
  >([]);

  async function getDataList() {
    const { content, totalElements } = await getUser({
      ...queryForm,
      page: currentPage.value - 1,
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

  onMounted(() => {
    getDataList();
  });

  return {
    queryForm,
    total,
    pageSize,
    dataList,
    roleList,
    currentPage,
    pagination,
    doSearch,
    handleTableChange,
    currentUser: permissionStore.getUserInfo,
  };
}

function useCreateUser() {
  const permissionStore = usePermissionStoreWithOut();

  const dataForm = ref({
    name: '', // 姓名
    username: '', // 账号名称
    password: '',
    dbPassword: '',
    role: undefined, // 角色
    phone: '', // 手机号
  });

  const rules = ref<Record<string, Rule[]>>({
    username: [
      {
        required: true,
        validator: usernameValidate(),
        trigger: 'blur',
      },
      { min: 2, max: 20, message: t('长度在2-20个字符'), trigger: 'blur' },
    ],
    password: [
      {
        required: true,
        validator: passwordValidate(),
        trigger: 'blur',
      },
    ],
    dbPassword: [
      {
        required: true,
        validator: passwordValidate(),
        trigger: 'blur',
      },
    ],
    name: [
      {
        required: true,
        message: t('请输入姓名'),
        trigger: 'blur',
      },
      { min: 2, max: 20, message: t('长度在2-20个字符'), trigger: 'blur' },
    ],
    phone: [
      {
        required: true,
        validator: phoneValidate(),
        trigger: 'blur',
      },
    ],
  });
  // 密码二重校验
  const checkDoubleHandle = () => {
    const password = dataForm.value.password;
    const dbPassword = dataForm.value.dbPassword;
    if (password && dbPassword && password !== dbPassword) {
      message.warning(t('两次密码不一致，请仔细校验'));
      return false;
    } else {
      return true;
    }
  };

  // 保存
  async function createUser(): Promise<string> {
    const publicKey = await getPublicKey();
    const encodePwByCryptoJS = encrypt(publicKey, dataForm.value.password);
    return await http.post({
      url: '/api/user/addUser',
      data: {
        ...dataForm.value,
        password: encodePwByCryptoJS,
        systemId: permissionStore.getSystemInfo?.id,
      },
    });
  }

  return {
    dataForm,
    rules,
    roleId: permissionStore.getUserInfo?.roleId,
    systemId: permissionStore.getSystemInfo?.id,
    checkDoubleHandle,
    getUser,
    createUser,
  };
}

function useUserFailNumber(
  props: {
    readonly visible: boolean;
  },
  emit
) {
  const dataForm = ref({
    maxFaildNum: 10,
  });

  const formRef = ref<FormInstance>();

  const rules: Record<string, Rule[]> = {
    maxFaildNum: [
      {
        required: true,
        message: t('请输入最大鉴别失败次数'),
        trigger: 'blur',
      },
    ],
  };

  const dialogVisible = useVModel(props, 'visible', emit);

  function closeModal() {
    dialogVisible.value = false;
    emit('refresh');
  }

  watch(
    () => props.visible,
    async (val) => {
      if (val) {
        await formRef.value?.resetFields();
        dataForm.value.maxFaildNum = await getUserMaxFaildNum();
      }
    }
  );

  // 保存
  async function handleSubmit() {
    await formRef.value?.validate();
    const res = await modifyMaxFailedNum({
      num: dataForm.value.maxFaildNum,
    });
    message.success(res);
    emit('refresh');
    closeModal();
  }

  return {
    dataForm,
    rules,
    dialogVisible,
    closeModal,
    handleSubmit,
  };
}

function useResetPassword() {
  const permissionStore = usePermissionStoreWithOut();
  const dataForm = ref({
    id: undefined,
    username: '',
    newPassword: '',
    rawPassword: '',
    confirmPassword: '',
  });

  function updateDataForm(opt) {
    Object.assign(dataForm.value, opt);
  }

  const rules = ref<Record<string, Rule[]>>({
    username: [
      {
        required: true,
        message: t('请输入账号名称'),
        trigger: 'blur',
      },
      { min: 2, max: 20, message: t('长度在2-20个字符'), trigger: 'blur' },
    ],
    rawPassword: [
      {
        required: true,
        validator: passwordValidate(),
        trigger: 'blur',
      },
    ],
    newPassword: [
      {
        required: true,
        validator: passwordValidate(),
        trigger: 'blur',
      },
    ],
    confirmPassword: [
      {
        required: true,
        validator: passwordValidate(),
        trigger: 'blur',
      },
    ],
  });
  // 密码二重校验
  const checkDoubleHandle = () => {
    const password = dataForm.value.newPassword;
    const dbPassword = dataForm.value.confirmPassword;
    if (password && dbPassword && password !== dbPassword) {
      message.warning(t('两次密码不一致，请仔细校验'));
      return false;
    } else {
      return true;
    }
  };

  // 保存
  async function resetPassword() {
    const publicKey = await getPublicKey();
    if (dataForm.value.id && permissionStore.getSystemInfo?.id) {
      return await resetNewPassword({
        id: dataForm.value.id,
        rawPassword: encrypt(publicKey, dataForm.value.rawPassword),
        password: encrypt(publicKey, dataForm.value.newPassword),
        systemId: permissionStore.getSystemInfo?.id,
      });
    }
  }

  return {
    dataForm,
    rules,
    roleId: permissionStore.getUserInfo?.roleId,
    systemId: permissionStore.getSystemInfo?.id,
    checkDoubleHandle,
    resetPassword,
    updateDataForm,
  };
}

/**
 * 配置系统用户
 */
function useUserModal(
  props: {
    readonly visible: boolean;
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
    return t('配置系统用户');
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

/**
 * 修改密码
 */
function useUpdatePassword(
  props: {
    readonly visible: boolean;
    readonly current: Record<string, any>;
  },
  emit: (event: 'refresh' | 'update:visible', ...args: any[]) => void
) {
  const permissionStore = usePermissionStoreWithOut();
  const dataForm = ref({
    username: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const dialogVisible = useVModel(props, 'visible', emit);

  const formRef = ref<FormInstance>();

  function updateDataForm(opt) {
    Object.assign(dataForm.value, opt);
  }

  const rules = ref<Record<string, Rule[]>>({
    username: [
      {
        required: true,
        message: t('请输入账号名称'),
        trigger: 'blur',
      },
      { min: 2, max: 20, message: t('长度在2-20个字符'), trigger: 'blur' },
    ],
    password: [
      {
        required: true,
        validator: passwordValidate(),
        trigger: 'blur',
      },
    ],
    newPassword: [
      {
        required: true,
        validator: passwordValidate(),
        trigger: 'blur',
      },
    ],
    confirmPassword: [
      {
        required: true,
        validator: passwordValidate(),
        trigger: 'blur',
      },
    ],
  });

  // 密码二重校验
  const checkDoubleHandle = () => {
    const password = dataForm.value.newPassword;
    const dbPassword = dataForm.value.confirmPassword;
    if (password && dbPassword && password !== dbPassword) {
      message.warning(t('两次密码不一致，请仔细校验'));
      return false;
    } else {
      return true;
    }
  };

  // 修改密码
  async function updatePassword() {
    const publicKey = await getPublicKey();
    if (permissionStore.getUserInfo?.username) {
      return await modifyUserPassword({
        rawPassword: encrypt(publicKey, dataForm.value.password),
        password: encrypt(publicKey, dataForm.value.newPassword),
        username: permissionStore.getUserInfo?.username,
      });
    } else {
      return undefined;
    }
  }

  function closeModal() {
    dialogVisible.value = false;
    emit('refresh');
  }

  watch(
    () => props.visible,
    async (val) => {
      if (val) {
        formRef.value?.resetFields();
        updateDataForm({
          username: props.current.username,
        });
      }
    }
  );

  // 保存
  async function handleSubmit() {
    await formRef.value?.validate();
    const isDouble = checkDoubleHandle();
    if (isDouble) {
      const res = await updatePassword();
      res && message.success(res);
      emit('refresh');
      closeModal();
    }
  }

  return {
    dataForm,
    rules,
    formRef,
    dialogVisible,
    checkDoubleHandle,
    closeModal,
    handleSubmit,
  };
}

export {
  useUser,
  useCreateUser,
  useUserFailNumber,
  useResetPassword,
  useUserModal,
  useUpdatePassword,
};
