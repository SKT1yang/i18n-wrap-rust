/*
 * @name: Do not edit
 * @description: Do not edit
 */
/* 类型文件 */
import type { IntervalHandle } from '@guolisec/types';
import type { LoginFormData } from '../types/login';
/* 第三方模块 */
import { ref, onMounted } from 'vue';
import { message } from '@guolisec/toast';
import {
  hasChinese,
  encrypt,
  onUnMountedOrDeactivated,
  onMountedOrActivated,
} from '@guolisec/utils';
import { useUsbKeyLogin } from '@guolisec/usb-key';
/* 本地模块 */
import {
  getPublicKey,
  getVerifyCodeInfo,
  getLicenseStatus,
  getMachineCode,
} from '../model/login';
import { CLIENT_ID, CLIENT_SECRET } from '../types/enum';
import { usePermissionStore } from '../model/store';
import { login, submitLicenseCode } from '../service/login';
import { injectLoginContext } from './useContext';
import { t } from '@/languages';

export function useLogin() {
  const { usbKey = true } = injectLoginContext();
  // 提交数据
  const loginForm = ref<LoginFormData>({
    username: '',
    password: '',
    validateCode: '',
    validateCodeUUid: '',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'password',
    scope: 'all',
    ret: '',
    sn: '',
    pin: '',
    mode: 0, // usbkey登录模式，0为正常模式，1为紧急登录模式，默认为0
    recoveryCode: '', // 恢复代码
    random: '',
  });

  // 公钥
  const publicKey = ref('');

  // 验证码
  const verifyCodeImg = ref('');

  async function updateVerifyCodeInfo() {
    const { uuid, img } = await getVerifyCodeInfo();
    verifyCodeImg.value = img;
    loginForm.value.validateCodeUUid = uuid;
  }

  // 登录
  async function loginAction() {
    try {
      const { password, ...form } = loginForm.value;
      const encryptPassword = encrypt(publicKey.value, password);
      await login({
        password: encryptPassword,
        ...form,
      });
    } finally {
      await updateVerifyCodeInfo();
    }
  }

  // 用户提交
  function handleLogin() {
    if (usbKey) {
      usbKeyLoginActionWrapper(loginAction);
    } else {
      loginAction();
    }
  }

  const {
    changeMode,
    checkCurrentUserBindStatus,
    usbKeyLoginActionWrapper,
    handleCopy,
  } = useUsbKeyLogin(loginForm);

  function handleCheckUsbKey(username: string) {
    if (hasChinese(username)) {
      message.warning(t('账号名称不能包含异常中文'));
      return;
    }
    usbKey && checkCurrentUserBindStatus(username);
  }

  // 刷新验证码定时器
  let timer: null | IntervalHandle = null;

  onMountedOrActivated(async () => {
    publicKey.value = await getPublicKey();
    updateVerifyCodeInfo();
    timer = setInterval(updateVerifyCodeInfo, 60000);
  });

  onUnMountedOrDeactivated(() => {
    timer && clearInterval(timer);
  });

  return {
    loginForm,
    usbKey,
    verifyCodeImg,
    changeMode,
    handleCheckUsbKey,
    handleCopy,
    handleLogin,
    updateVerifyCodeInfo,
  };
}

export function useLicense() {
  const dataForm = ref({
    licenseCode: '',
  });

  const store = usePermissionStore();

  /**
   * 查询授权状态
   */
  const licenseStatus = ref(false);
  async function getLicenseStatusData() {
    const { success } = await getLicenseStatus();
    licenseStatus.value = success;
  }

  /**
   * 获取机器码
   */
  const machineCode = ref('');
  async function getMachineCodeData() {
    machineCode.value = await getMachineCode();
  }

  /**
   * 提交授权码
   */
  async function submitLicenseCodeData() {
    const { licenseCode } = dataForm.value;
    const { success } = await submitLicenseCode({
      licenseCode,
      machineCode: machineCode.value,
    });

    store.setLicenseStatus(success);
  }

  function handleSubmit() {
    const { licenseCode } = dataForm.value;
    if (licenseCode) {
      submitLicenseCodeData();
    } else {
      message.warning(t('请输入授权码'));
    }
  }

  onMounted(async () => {
    await getLicenseStatusData();
    if (licenseStatus.value) {
      store.setLicenseStatus(true);
    } else {
      getMachineCodeData();
    }
  });

  return {
    dataForm,
    machineCode,
    handleSubmit,
  };
}
