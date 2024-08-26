/*
 * @name: 控制层
 * @description: 数据转储
 * @date: 2023-10-10 08:54:13
 * @path: \front\data-backup\src\controller\useDataDump.ts
 */

/* 类型文件 */
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
/* 第三方模块 */
import { onMounted, ref } from 'vue'
/* 本地共享模块 */
import { ipValidate, portValidate } from '@guolisec/utils'
import { message } from '@guolisec/toast'

/* 业务模块 */
import { getFtpSettingList, setFtp, getFtpStatus, setFtpStatus } from '../service/dataDump'

export function useDataDump() {
  /**
   * 表单
   */
  const formRef = ref<FormInstance>()
  const formData = ref<{
    id?: number
    host?: string // FTP 服务器
    port?: number // FTP 端口
    password?: string // FTP 密码
    userName?: string // FTP 用户名
  }>({})

  const rules = ref<Record<string, Rule[]>>({
    host: [
      {
        required: true,
        validator: ipValidate({
          emptyMsg: 'FTP 服务器 IP 不能为空',
          errorMsg: 'FTP 服务器 IP 不正确'
        }),
        trigger: 'blur'
      }
    ],
    port: [
      {
        required: true,
        validator: portValidate({
          emptyMsg: 'FTP 服务器端口不能为空',
          errorMsg: 'FTP 服务器端口不正确'
        }),
        trigger: 'blur'
      }
    ],
    userName: [{ required: true, message: 'FTP 用户名不能为空', trigger: 'blur' }],
    password: [{ required: true, message: 'FTP 密码不能为空', trigger: 'blur' }]
  })

  const isEditButton = ref(true) // 按钮类型，false显示应用，true显示编辑

  /**
   * 获取 FTP 设置数据
   */
  async function getFtpSettingData() {
    const res = await getFtpSettingList()
    if (res.length) {
      formData.value = res[0]
    } else {
      isEditButton.value = false
    }
  }

  async function handleButtonTypeChange() {
    if (isEditButton.value) {
      isEditButton.value = false
    } else {
      await handleSave()
    }
  }

  /**
   * 保存 FTP 设置
   */
  const saveButtonLoading = ref(false)

  async function handleSave() {
    await formRef.value?.validate()
    saveButtonLoading.value = true
    try {
      const { id, host, port, password, userName } = formData.value
      await setFtp({
        id: id!,
        host: host!,
        port: port!,
        password: password!,
        userName: userName!,
        status: isEditButton.value
      })
      message.success('保存成功！')
    } finally {
      getFtpSettingData()
      saveButtonLoading.value = false
      isEditButton.value = true
    }
  }

  /**
   * 获取 FTP 转储状态
   */
  const ftpStatus = ref<0 | 1>()
  async function getFtpStatusData() {
    const status = await getFtpStatus()
    if (status === null) {
      const res = await getFtpSettingList()
      ftpStatus.value = res && res.length ? 1 : 0
    } else {
      ftpStatus.value = status
    }
  }

  /**
   * 设置 FTP 转储状态
   */
  async function handleSetFtpStatus(value) {
    console.log(value, 'value')
    try {
      await setFtpStatus({
        status: value
      })
      value
        ? message.success('磁盘使用率超过阈值后将自动进行数据转储！')
        : message.warning('磁盘使用率超过阈值后将自动清理，不再进行数据转储。')
    } finally {
      getFtpStatusData()
    }
  }

  onMounted(() => {
    getFtpSettingData()
    getFtpStatusData()
  })

  return {
    formRef,
    formData,
    rules,
    saveButtonLoading,
    handleSave,
    ftpStatus,
    handleSetFtpStatus,
    isEditButton,
    handleButtonTypeChange
  }
}
