/*
 * @name: usbkey
 * @description: Do not edit
 * @path: \usb-key\src\controller\useFisec.ts
 */
/* 类型文件 */
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { UsbKeyAppInfoItem, UsbKeyLoginForm } from '../types/fisec'
import type { Ref } from 'vue'

/* 第三方模块 */
import { ref, watch, computed } from 'vue'
import { Modal } from 'ant-design-vue'
import { message } from '@guolisec/toast'
import { useVModel, useClipboard, passwordValidate, onMountedOrActivated } from '@guolisec/utils'
/* 本地模块 */
import { t } from '../languages'
import {
  getBindRelationApi,
  doUSBKeyBindUserApi,
  doUSBKeyUnbindUserApi,
  changePinApi,
  unblockPINApi,
  checkUserBindStatusApi,
  getUSBKeyRandomStrApi
} from '../model/fisec'
import { enumSnList, checkSn, checkPin, getUsbKeyDeviceList } from '../service/fisec'

/**
 * 绑定/解绑usbkey
 * @param props
 * @param emit
 * @returns
 */
function useUSBKeyBindUser(
  props: {
    readonly visible: boolean
    readonly type: 'bind' | 'unbind'
    readonly record: {
      name?: string
      username?: string
      sn?: string
    }
  },
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void
) {
  /********************** 表单 **********************/

  const formRef = ref<FormInstance>()
  const dataForm = ref<{
    username: string
    sn?: string
    pin: string // 管理员pin
  }>({
    username: '',
    sn: undefined,
    pin: ''
  })
  const rules = ref<Record<string, Rule[]>>({
    sn: [
      {
        required: true,
        message: t('请选择设备序列号'),
        trigger: 'change'
      }
    ],
    pin: [
      {
        required: true,
        message: t('请输入管理员 PIN'),
        trigger: 'blur'
      }
    ]
  })

  /********************** 弹窗 **********************/

  const dialogVisible = useVModel(props, 'visible', emit)

  function closeModal() {
    dialogVisible.value = false
    emit('refresh')
  }

  watch(
    () => props.visible,
    async (val) => {
      if (val) {
        formRef.value?.resetFields()
        dataForm.value = {
          username: props.record.username || '',
          sn: undefined,
          pin: ''
        }
        bindingDisabled.value = false

        if (props.type === 'unbind' && props.record.sn) {
          dataForm.value.sn = props.record.sn
          checkSn(props.record.sn)
        }
        getSnList()
      }
    }
  )
  const bindingDisabled = ref(false)
  const showOkBtn = computed(() => {
    return bindingDisabled.value || (dataForm.value.sn && snList.value.includes(dataForm.value.sn))
  })

  /********************** 设备序列号列表 **********************/

  // 当前插入电脑的设备序列号列表
  const snList = ref<string[]>([])
  // 当前插入电脑的设备序列号下拉选项
  const snOptions = computed(() => {
    return snList.value.map((item) => {
      return { label: item, value: item }
    })
  })
  /**
   * 获取当前插入电脑的设备序列号列表
   */
  async function getSnList() {
    snList.value = await enumSnList()
  }

  /********************** 保存 **********************/

  async function handleSubmit() {
    try {
      await formRef.value?.validate()
      if (dataForm.value.sn) {
        const pinResult = await checkPin(dataForm.value.sn, dataForm.value.pin)
        if (pinResult) {
          props.type === 'bind' ? await doUSBKeyBindUser() : await doUSBKeyUnbindUser()
        }
        emit('refresh')
      }
    } finally {
      closeModal()
    }
  }

  /**
   * 绑定
   */
  async function doUSBKeyBindUser() {
    try {
      if (dataForm.value.sn) {
        await doUSBKeyBindUserApi({
          sn: dataForm.value.sn,
          username: dataForm.value.username
        })
        message.success(t('绑定成功'))
        emit('refresh')
        closeModal()
      }
    } catch (error) {
      message.warning(t('绑定失败'))
    }
  }

  /**
   * 解绑
   */
  async function doUSBKeyUnbindUser() {
    try {
      if (dataForm.value.sn) {
        await doUSBKeyUnbindUserApi({
          sn: dataForm.value.sn,
          username: dataForm.value.username
        })
        message.success(t('解绑成功'))
        emit('refresh')
        closeModal()
      }
    } catch (error) {
      message.warning(t('绑定失败'))
    }
  }

  return {
    snOptions,
    showOkBtn,
    dialogVisible,
    dataForm,
    rules,
    handleSubmit,
    getSnList,
    checkSn,
    closeModal,
    formRef
  }
}

/**
 * 表格 - 绑定关系
 * @returns
 */
function usrUSBkeyRelation() {
  const visible = ref(false)
  const current = ref()
  function handleUnbind(record) {
    current.value = record
    visible.value = true
  }
  const { bindRelationList, getBindRelation } = useGetBindRelation()
  return {
    visible,
    current,
    dataList: bindRelationList,
    handleUnbind,
    getBindRelation
  }
}

/**
 * 获取绑定关系
 * @returns
 */
function useGetBindRelation() {
  // 当前已绑定关系
  const bindRelationList = ref<
    {
      sn: string
      username: string
    }[]
  >([])
  // 已绑定用户名列表
  const bindedUsernameList = computed(() => {
    return bindRelationList.value.map((item) => {
      return item.username
    })
  })
  // 已绑定过设备序列号列表
  const bindedSnList = computed(() => {
    return bindRelationList.value.map((item) => {
      return item.sn
    })
  })

  /**
   * 获取已绑定关系列表
   */
  async function getBindRelation() {
    try {
      bindRelationList.value = await getBindRelationApi()
    } catch (error) {
      console.log(error)
    }
  }
  getBindRelation()

  return {
    bindRelationList,
    bindedUsernameList,
    bindedSnList,
    getBindRelation
  }
}

/**
 * 当前插入的usbkey设备列表
 * @returns
 */
function useUsbKeyDevice() {
  const dataList = ref<UsbKeyAppInfoItem[]>([])

  async function getDataList() {
    dataList.value = await getUsbKeyDeviceList()
  }

  const current = ref()
  const modifyVisible = ref(false)
  function handleModify(record) {
    current.value = record
    modifyVisible.value = true
  }

  const resetVisible = ref(false)
  function handleReset(record) {
    current.value = record
    resetVisible.value = true
  }

  onMountedOrActivated(() => {
    getDataList()
  })

  return {
    dataList,
    current,
    modifyVisible,
    resetVisible,
    getDataList,
    handleModify,
    handleReset
  }
}

/**
 * 修改管理员pin
 * @param props
 * @param emit
 * @returns
 */
function useModifyAdminPin(
  props: {
    readonly visible: boolean
    readonly record: UsbKeyAppInfoItem
  },
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void
) {
  /********************** 表单 **********************/

  const formRef = ref<FormInstance>()
  const dataForm = ref<{
    sn: string
    oldPin: string
    newPin: string
    confirmPin: string
  }>({
    sn: '',
    oldPin: '',
    newPin: '',
    confirmPin: ''
  })
  const rules = ref<Record<string, Rule[]>>({
    sn: [
      {
        required: true,
        message: t('请选择设备序列号'),
        trigger: 'change'
      }
    ],
    oldPin: [
      {
        required: true,
        message: t('请输入旧管理员PIN'),
        trigger: 'blur'
      },
      {
        validator: passwordValidate({
          allowEmpty: true
        })
      }
    ],
    newPin: [
      {
        required: true,
        message: t('请输入新管理员PIN'),
        trigger: 'blur'
      },
      {
        validator: passwordValidate({
          allowEmpty: true
        })
      }
    ],
    confirmPin: [
      {
        required: true,
        message: t('确认新管理员PIN'),
        trigger: 'blur'
      },
      {
        validator: passwordValidate({
          allowEmpty: true
        }),
        trigger: 'blur'
      }
    ]
  })

  /**
   * 密码重复性校验
   * @param params
   */
  function doubleCheck() {
    const newPin = dataForm.value.newPin
    const confirmPin = dataForm.value.confirmPin
    if (newPin && confirmPin && newPin !== confirmPin) {
      message.warning(t('新PIN码与确认PIN码不一致,请仔细校验!'))
      return false
    } else {
      return true
    }
  }

  /********************** 弹窗 **********************/

  const dialogVisible = useVModel(props, 'visible', emit)

  function closeModal() {
    dialogVisible.value = false
    emit('refresh')
  }

  watch(
    () => props.visible,
    async (val) => {
      if (val) {
        formRef.value?.resetFields()
        dataForm.value.sn = props.record.sn
      }
    }
  )

  // 保存
  async function handleSubmit() {
    try {
      if (doubleCheck() && props.record.appHandle) {
        await formRef.value?.validate()
        const rev = await changePinApi(
          props.record.appHandle,
          0,
          dataForm.value.oldPin,
          dataForm.value.newPin
        )
        if (rev === 0) {
          message.success(t('修改成功'))
          emit('refresh')
          closeModal()
        }
      }
    } catch (error) {
      message.warning(error.message || t('修改失败'))
    }
  }

  return {
    dataForm,
    dialogVisible,
    rules,
    formRef,
    closeModal,
    doubleCheck,
    handleSubmit
  }
}

/**
 * 重置用户PIN
 * @param props
 * @param emit
 * @returns
 */
function useRestPin(
  props: {
    readonly visible: boolean
    readonly record: UsbKeyAppInfoItem
  },
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void
) {
  /********************** 表单 **********************/

  const formRef = ref<FormInstance>()
  const dataForm = ref<{
    sn: string
    pinAdmin: string
    pin: string
    confirmPin: string
  }>({
    sn: '',
    pinAdmin: '',
    pin: '',
    confirmPin: ''
  })
  const rules = ref<Record<string, Rule[]>>({
    sn: [
      {
        required: true,
        message: t('请选择设备序列号'),
        trigger: 'change'
      }
    ],
    pinAdmin: [
      {
        required: true,
        message: t('请输入管理员PIN'),
        trigger: 'blur'
      },
      {
        validator: passwordValidate({
          allowEmpty: true
        }),
        trigger: 'blur'
      }
    ],
    pin: [
      {
        required: true,
        message: t('请输入新用户PIN'),
        trigger: 'blur'
      },
      {
        validator: passwordValidate({
          allowEmpty: true
        }),
        trigger: 'blur'
      }
    ],
    confirmPin: [
      {
        required: true,
        message: t('确认新管理员PIN'),
        trigger: 'blur'
      },
      {
        validator: passwordValidate({
          allowEmpty: true
        }),
        trigger: 'blur'
      }
    ]
  })

  /**
   * 密码重复性校验
   * @param params
   */
  function doubleCheck() {
    const pin = dataForm.value.pin
    const confirmPin = dataForm.value.confirmPin
    if (pin && confirmPin && pin !== confirmPin) {
      message.warning(t('新PIN码与确认PIN码不一致,请仔细校验!'))
      return false
    } else {
      return true
    }
  }

  /********************** 弹窗 **********************/

  const dialogVisible = useVModel(props, 'visible', emit)

  function closeModal() {
    dialogVisible.value = false
    emit('refresh')
  }

  watch(
    () => props.visible,
    async (val) => {
      if (val) {
        formRef.value?.resetFields()
        dataForm.value.sn = props.record.sn
      }
    }
  )

  // 保存
  async function handleSubmit() {
    try {
      if (doubleCheck() && props.record.appHandle) {
        await formRef.value?.validate()
        const rev = await unblockPINApi(
          props.record.appHandle,
          dataForm.value.pinAdmin,
          dataForm.value.pin
        )
        if (rev === 0) {
          message.success(t('修改成功'))
          emit('refresh')
          closeModal()
        }
      }
    } catch (error) {
      message.warning(error.message || t('修改失败'))
    }
  }

  return {
    dataForm,
    dialogVisible,
    rules,
    formRef,
    closeModal,
    doubleCheck,
    handleSubmit
  }
}

/**
 * usekey登录相关逻辑
 * @param usbKeyLoginForm 登录表单
 * @returns
 */
function useUsbKeyLogin(usbKeyLoginForm: Ref<UsbKeyLoginForm>) {
  const { copy, copied } = useClipboard()

  function changeMode() {
    usbKeyLoginForm.value.mode = usbKeyLoginForm.value.mode === 1 ? 0 : 1
  }

  async function getRandom() {
    const random = await getUSBKeyRandomStrApi()
    if (random) {
      usbKeyLoginForm.value.random = random
    }
  }

  watch(
    () => usbKeyLoginForm.value.mode,
    (value) => {
      if (value === 1) {
        getRandom()
      }
    }
  )

  function handleCopy() {
    if (!usbKeyLoginForm.value.random) {
      message.warning(t('机器码生成异常'))
      return
    }
    copy(usbKeyLoginForm.value.random)
    if (copied) {
      message.success(t('机器码已粘贴'))
    }
  }

  /**
   * usbkey 校验
   */
  async function validateUsbkey() {
    if (usbKeyLoginForm.value.sn && usbKeyLoginForm.value.pin) {
      const isPass = await checkPin(usbKeyLoginForm.value.sn, usbKeyLoginForm.value.pin, 1)
      if (!isPass) {
        return false
      }
    }
    return true
  }

  async function usbKeyLoginActionWrapper(loginAction: () => any) {
    // 紧急登录
    if (usbKeyLoginForm.value.mode === 1) {
      Modal.confirm({
        title: t('提示'),
        type: 'warning',
        content: t('紧急登录后将会自动结束UsbKey的绑定,确认紧急登录码？'),
        okText: t('立即登录'),
        cancelText: t('我再想想'),
        onOk() {
          loginAction()
        }
      })
    } else {
      ;(await validateUsbkey()) && loginAction()
    }
  }

  async function checkCurrentUserBindStatus(username: string) {
    usbKeyLoginForm.value.sn = ''
    usbKeyLoginForm.value.mode = 0
    if (username) {
      const res = await checkUserBindStatusApi({ username })
      usbKeyLoginForm.value.sn = res.msg || ''
    }
  }

  return {
    changeMode,
    handleCopy,
    usbKeyLoginActionWrapper,
    checkCurrentUserBindStatus
  }
}

export {
  useUSBKeyBindUser,
  usrUSBkeyRelation,
  useGetBindRelation,
  useUsbKeyDevice,
  useModifyAdminPin,
  useRestPin,
  useUsbKeyLogin
}
