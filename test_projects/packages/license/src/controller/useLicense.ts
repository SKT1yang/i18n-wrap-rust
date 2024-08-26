/*
 * @name: 控制层 - 授权管理
 * @description: Do not edit
 * @date: 2023-10-20 15:32:18
 * @path: \front\license\src\controller\useLicense.ts
 */
/* 类型文件 */
import type { ColumnsType } from 'ant-design-vue/es/table/interface';
import type { FileType } from 'ant-design-vue/es/upload/interface';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import type {
  LicenseRecord,
  LicenseModule,
  LicenseName,
} from '../types/license';
/* 第三方模块 */
import {
  onMounted,
  ref,
  ExtractPropTypes,
  watch,
  nextTick,
  PropType,
  computed,
} from 'vue';

/* 本地共享模块 */
import { useVModel } from '@guolisec/utils';
import { message } from '@guolisec/toast';
import { formatToDateTime } from '@guolisec/utils';
/* 业务模块 */
import {
  getLicensesByMqtt,
  importLicense,
  getMachineCode,
  getSysSetting,
} from '../service/license';

export function useLicense() {
  const licenseData = ref<
    { licenseModule: LicenseModule; licenseName: LicenseName }[]
  >([
    // {
    //   licenseModule: 1,
    //   licenseName: "功能授权",
    // },
    {
      licenseModule: 2,
      licenseName: '通用授权',
    },
    {
      licenseModule: 3,
      licenseName: '知识库授权',
    },
  ]);

  /**
   * 获取机器码
   */
  const machineCode = ref<string>();
  async function getSysSettingData() {
    const res = await getSysSetting();
    machineCode.value = res.machineCode;
  }

  /**
   * 生成机器码
   */
  async function getMachineCodeData() {
    await getMachineCode();
    message.success('操作成功！');
    getSysSettingData();
  }

  onMounted(() => {
    getSysSettingData();
  });

  return { licenseData, machineCode, getMachineCodeData };
}

export function useLicenseItem(props: {
  readonly data: {
    licenseModule: LicenseModule;
    licenseName: LicenseName;
  };
}) {
  /**
   * 获取最新授权记录数据
   */
  const lastestRecordData = ref<LicenseRecord>();
  async function getLicenseRecordData() {
    const { data } = await getLicensesByMqtt({
      licenseModule: props.data.licenseModule,
      current: 1,
    });
    lastestRecordData.value = data && data.length ? data[0] : undefined;
  }

  /**
   * 导入授权文件
   */
  const uploadFileList = ref([]);
  const beforeUpload = (file: FileType) => {
    const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
    if (extension.toLowerCase() !== 'lns') {
      message.warning('只能上传 lns 文件！');
      return false;
    }
    return true;
  };
  const uploadStatus = ref(false);

  async function uploadFile(param: UploadRequestOption) {
    const data = new FormData();
    data.append('multipartFile', param.file);
    data.append('licenseModule', String(props.data.licenseModule));
    uploadStatus.value = true;
    try {
      await importLicense(data);
      message.success(`${props.data.licenseName}导入成功！`);
    } finally {
      uploadStatus.value = false;
      uploadFileList.value = [];
      getLicenseRecordData();
    }
  }

  const dialogVisible = ref(false);
  function handleOpenModal() {
    dialogVisible.value = true;
  }

  onMounted(() => {
    getLicenseRecordData();
  });

  return {
    lastestRecordData,
    beforeUpload,
    uploadFile,
    uploadFileList,
    uploadStatus,
    formatToDateTime,
    dialogVisible,
    handleOpenModal,
  };
}

export function useLicenseRecordModal(
  props: Readonly<
    ExtractPropTypes<{
      visible: {
        type: BooleanConstructor;
        required: true;
      };
      data: {
        type: PropType<{
          licenseModule: LicenseModule;
          licenseName: LicenseName;
        }>;
        required: true;
      };
    }>
  >,
  emit: (event: 'update:visible', ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, 'visible', emit);

  watch(dialogVisible, async (val) => {
    if (val) {
      await nextTick();
      getLicenseRecordData();
    }
  });

  /**
   * 获取授权记录
   */
  const tableColumns = computed(() => {
    const columnsList: ColumnsType = [
      {
        title: '序号',
        align: 'center',
        width: 70,
        key: 'index',
        customRender: ({ index }) => {
          return index + 1;
        },
      },
      {
        title: 'license名称',
        dataIndex: 'licenseContent',
        align: 'center',
        customRender: ({ text }) => {
          let content = text.toString();
          if (content.startsWith('1')) {
            return '功能授权';
          } else if (content.startsWith('2')) {
            return '通用授权';
          } else if (content.startsWith('3')) {
            return '知识库授权';
          }
        },
      },
      {
        title: '导入时间',
        align: 'center',
        dataIndex: 'importTime',
        customRender: ({ text }) => {
          return text ? formatToDateTime(text) : '-';
        },
      },
    ];
    const counts: ColumnsType = [
      {
        title: '个数',
        dataIndex: 'counts',
        align: 'right',
      },
    ];

    const expireTime: ColumnsType = [
      {
        title: '逾期时间',
        dataIndex: 'expireTime',
        align: 'center',
        customRender: ({ text }) => {
          return formatToDateTime(text);
        },
      },
    ];
    if (props.data.licenseModule === 2) {
      columnsList.push(...counts);
    } else if (props.data.licenseModule === 3) {
      columnsList.push(...expireTime);
    }
    return columnsList;
  });

  const licenseRecordData = ref<LicenseRecord[]>();
  async function getLicenseRecordData() {
    const { data } = await getLicensesByMqtt({
      current: 0,
      licenseModule: props.data.licenseModule,
    });
    licenseRecordData.value = data && data.length ? data : [];
    // total.value = totalElements;
  }

  /**
   * 关闭弹窗
   */
  function handleClose() {
    dialogVisible.value = false;
  }

  return {
    dialogVisible,
    licenseRecordData,
    tableColumns,
    handleClose,
  };
}
