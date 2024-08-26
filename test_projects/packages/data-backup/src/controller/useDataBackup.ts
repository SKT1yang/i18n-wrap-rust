/*
 * @name: 控制层
 * @description: 数据备份
 */

/* 类型文件 */
import type { FileType } from 'ant-design-vue/es/upload/interface'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import type { DataBackup } from '../types/dataBackup'
import type { Dayjs } from 'dayjs'
/* 第三方模块 */
import { onMounted, ref, ExtractPropTypes, watch, nextTick } from 'vue'
import { Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
/* 本地共享模块 */
import { useVModel, formatToDateTime, downloadByData } from '@guolisec/utils'
import { message } from '@guolisec/toast'

/* 业务模块 */
import {
  getOutputRecord,
  importDataBackup,
  deleteDataBackup,
  downloadDataBackup,
  outputBackup
} from '../service/dataBackup'

export function useDataBackup() {
  /**
   * 分页、排序
   */
  const currentPage = ref(1)
  const size = ref(10)
  const total = ref(0)
  const sort = ref('createTime,desc')

  /**
   * 表格数据发生改变
   */
  function handleTableChange(pagination, _filters, sorter) {
    const { current, pageSize } = pagination
    currentPage.value = current
    size.value = pageSize

    const { order, columnKey } = sorter
    switch (order) {
      case 'ascend':
        sort.value = `${columnKey},asc`
        break
      case 'descend':
        sort.value = `${columnKey},desc`
        break
      default:
        sort.value = ''
    }

    selectedRowKeys.value = []
    getBackupData()
  }
  /**
   * 获取表格数据
   */
  const tableColumns = ref([
    {
      title: '序号',
      align: 'center',
      width: 80,
      key: 'index',
      customRender: ({ index }) => {
        return (currentPage.value - 1) * size.value + index + 1
      }
    },
    {
      title: '生成时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: true,
      customRender: ({ text }) => {
        return formatToDateTime(text, 'YYYY-MM-DD HH:mm:ss')
      }
    },

    {
      title: '文件日期',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: true,
      align: 'center',
      customRender: ({ text }) => {
        return formatToDateTime(text, 'YYYY-MM-DD')
      }
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      align: 'center'
    },
    {
      title: '文件大小',
      dataIndex: 'sizeStr',
      align: 'center'
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: 140,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      width: 160,
      align: 'center'
    }
  ])

  function getGenerateStatus(status, type: 'tagColor' | 'text' = 'text') {
    let tagColor = 'green'
    let text = '成功'
    switch (status) {
      case 0:
        tagColor = 'blue'
        text = '生成中'
        break
      case 1:
        tagColor = 'green'
        text = '成功'
        break
      case 2:
        tagColor = 'red'
        text = '失败'
        break
      default:
        tagColor = 'orange'
        text = '异常'
    }
    return type === 'tagColor' ? tagColor : text
  }

  const tableData = ref<DataBackup[]>([])
  async function getBackupData() {
    const { content, totalElements } = await getOutputRecord({
      size: size.value,
      page: currentPage.value,
      sort: sort.value
    })
    tableData.value = content
    total.value = totalElements
    autoRefreshTable(content)
  }

  function autoRefreshTable(data: DataBackup[]) {
    let generateDataStatus = false
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (item.status === 0) {
        generateDataStatus = true
        break
      }
    }
    if (generateDataStatus) {
      setTimeout(() => {
        getBackupData()
      }, 2000)
    }
  }

  function handleSearch() {
    currentPage.value = 1
    getBackupData()
  }

  /**
   * 导入
   */
  const uploadFileList = ref<FileType[]>([])
  const beforeUpload = (file: FileType) => {
    const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
    if (extension.toLowerCase() !== 'bin') {
      message.warning('导入文件格式错误！')
      return false
    } else {
      uploadFileList.value.push(file)
    }
    return true
  }
  const uploadStatus = ref(false)

  async function uploadFile(param: UploadRequestOption) {
    const data = new window.FormData()

    data.append('multipartFile', uploadFileList.value[0])
    console.log(param, 'param', uploadFileList.value[0], data)
    uploadStatus.value = true
    try {
      await importDataBackup(data)
      message.success('导入成功！')
    } finally {
      uploadStatus.value = false
      uploadFileList.value = []
      handleSearch()
    }
  }

  /**
   * 下载
   */
  async function handleDownload(record: DataBackup) {
    const res = await downloadDataBackup({
      id: record.id
    })
    downloadByData(res, record.fileName, 'application/zip')
    message.success('下载成功！')
  }

  /**
   * 删除
   */
  async function handleDeleteBackup(ids: number[]) {
    await deleteDataBackup({ idList: ids })
    message.success('删除成功！')
    handleSearch()
  }

  /**
   * 批量删除
   */
  const selectedRowKeys = ref<number[]>([]) // 勾选的id列表
  function handleSelectionChange(selectionRowKeys) {
    selectedRowKeys.value = selectionRowKeys
  }
  async function handleMutilDelete() {
    if (selectedRowKeys.value.length > 0) {
      Modal.confirm({
        title: '提示',
        content: '确认删除选中的备份吗?',
        style: {
          top: '30%'
        },
        okText: '确定',
        onOk: async () => {
          await handleDeleteBackup(selectedRowKeys.value)
          selectedRowKeys.value = []
        }
      })
    } else {
      message.warning('请选择要删除的备份!')
    }
  }

  /**
   * 生成数据包
   */
  const dialogVisible = ref(false)

  function handleAddGenerateDate() {
    dialogVisible.value = true
  }

  onMounted(() => {
    getBackupData()
  })

  return {
    total,
    currentPage,
    size,
    sort,
    handleTableChange,
    getGenerateStatus,
    tableData,
    tableColumns,
    handleSearch,
    beforeUpload,
    uploadFile,
    uploadFileList,
    uploadStatus,
    handleDownload,
    selectedRowKeys,
    handleSelectionChange,
    handleDeleteBackup,
    handleMutilDelete,
    dialogVisible,
    handleAddGenerateDate
  }
}

export function useGeneratePackets(
  props: Readonly<
    ExtractPropTypes<{
      visible: {
        type: BooleanConstructor
        required: true
      }
    }>
  >,
  emit: (event: 'update:visible' | 'refresh', ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, 'visible', emit)

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick()
      generatePacketsList.value = []
    }
  })

  const generatePacketsList = ref<{ data: Dayjs | '' }[]>([])

  function disabledDate(current: Dayjs) {
    return current && current > dayjs().endOf('day')
  }

  /**
   * 添加日期
   */
  function handleAddDatePicker() {
    if (generatePacketsList.value.length >= 7) {
      message.warning('最多添加七个日期！')
    } else {
      generatePacketsList.value.push({
        data: ''
      })
    }
  }

  /**
   * 删除日期
   */
  function handleRemoveDatePicker(index) {
    generatePacketsList.value.splice(index, 1)
  }

  /**
   * 确定新增、确定修改
   */
  const confirmButtonStatus = ref(false)

  async function handleConfirm() {
    if (generatePacketsList.value.length === 0) {
      message.warning('至少选择一个日期！')
    } else {
      const createTimeList: string[] = []
      for (let i = 0; i < generatePacketsList.value.length; i++) {
        const item = generatePacketsList.value[i]
        if (item.data) {
          createTimeList.push(dayjs(item.data).format())
        } else {
          message.warning('请检查日期！')
          return
        }
      }
      confirmButtonStatus.value = true
      try {
        await outputBackup({ createTime: createTimeList })
        message.success('操作成功！')
        handleClose()
      } finally {
        confirmButtonStatus.value = false
      }
    }
  }

  /**
   * 关闭弹窗
   */
  function handleClose() {
    dialogVisible.value = false
    emit('refresh')
  }

  return {
    dialogVisible,
    generatePacketsList,
    disabledDate,
    handleAddDatePicker,
    handleRemoveDatePicker,
    confirmButtonStatus,
    handleConfirm,
    handleClose
  }
}
