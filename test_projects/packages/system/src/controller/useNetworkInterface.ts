/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-20 14:20:30
 * @path: \system\src\controller\useNetworkInterface.ts
 */
/* 类型文件 */
import type { FormInstance } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import type { ColumnProps } from "ant-design-vue/es/table";
import type { NetworkInterface } from "../types/interface";
/* 第三方模块 */
import { ref, onMounted, watch } from "vue";
import { message } from "@guolisec/toast";
import {
  useIntervalFn,
  useVModel,
  ipValidate,
  maskValidate,
  isNetworkSegment,
} from "@guolisec/utils";

/* 共享模块 */

/* 业务模块 */
import { getNetworkcardInfoApi } from "../model/interface";
import { modifyInterfaceApi } from "../model/interface";

function useInterface() {
  // 接口数据
  let interfaceList = ref<NetworkInterface[]>([]);
  async function getNetworkcardInfo() {
    interfaceList.value = await getNetworkcardInfoApi();
  }

  const columns: ColumnProps[] = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      align: "center",
      ellipsis: true,
      customRender({ index }) {
        return index + 1;
      },
    },
    {
      title: "接口名称",
      dataIndex: "networkCardName",
      key: "networkCardName",
      align: "center",
      ellipsis: true,
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      key: "ip",
      align: "center",
      ellipsis: true,
    },
    {
      title: "子网掩码",
      dataIndex: "subnetMask",
      key: "subnetMask",
      align: "center",
      ellipsis: true,
    },
    {
      title: "网关地址",
      dataIndex: "gateway",
      key: "gateway",
      align: "center",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      align: "center",
      ellipsis: true,
    },
  ];

  // 修改网口
  const current = ref<NetworkInterface>();
  const dialogVisible = ref(false);

  function handleModify(record) {
    current.value = record;
    dialogVisible.value = true;
  }

  onMounted(() => {
    useIntervalFn(
      () => {
        getNetworkcardInfo();
      },
      5000,
      {
        immediateCallback: true,
      }
    );
  });
  return {
    columns,
    interfaceList,
    current,
    dialogVisible,
    getNetworkcardInfo,
    handleModify,
  };
}

function useModifyInterface(
  props: {
    readonly visible: boolean;
    readonly current: NetworkInterface;
  },
  emit: (event: "refresh" | "update:visible", ...args: any[]) => void
) {
  const dialogVisible = useVModel(props, "visible", emit);

  const formRef = ref<FormInstance>();
  let dataForm = ref<NetworkInterface>({
    id: 0,
    ip: "",
    networkCardName: "",
    subnetMask: "",
    gateway: "",
    operation: "",
    switchStatus: false,
    switchSet: false,
    interfaceType: false,
    interfaceDirection: false,
    mgmt: false,
    ipSet: false,
    upFlow: "",
    downFlow: "",
    status: true,
  });
  const rules = ref<Record<string, Rule[]>>({
    ip: [
      {
        required: true,
        validator: ipValidate(),
        trigger: "blur",
      },
    ],
    subnetMask: [
      {
        required: true,
        validator: maskValidate(),
        trigger: "blur",
      },
    ],
    gateway: [
      {
        validator: ipValidate({
          allowEmpty: true,
          errorMsg: "请正确填写网关地址",
        }),
        trigger: "blur",
      },
    ],
  });

  watch(
    () => props.visible,
    async (val) => {
      if (val) {
        formRef.value?.resetFields();
        dataForm.value = props.current;
      }
    }
  );

  function closeModal() {
    dialogVisible.value = false;
    emit("refresh");
  }

  // 保存
  const confirmButtonLoading = ref(false);
  async function handleSubmit() {
    await formRef.value?.validate();
    const { ip, subnetMask, gateway } = dataForm.value;
    const isNetworkSegmentValue = isNetworkSegment(ip, subnetMask, gateway);
    if (isNetworkSegmentValue) {
      confirmButtonLoading.value = true;
      let responseInfo: any = null;
      modifyInterfaceApi(dataForm.value)
        .then(() => {
          responseInfo = "ok";
          message.success("修改成功");
          emit("refresh");
          closeModal();
        })
        .catch((e) => {
          responseInfo = e;
        })
        .finally(() => {
          confirmButtonLoading.value = false;
        });

      // 修改 IP 后，服务器断连，脚本无法结束，所以会接口超时，如果接口 5秒内没有返回，提示修改成功，并关闭弹窗
      setTimeout(() => {
        if (!responseInfo) {
          message.success("修改成功");
          closeModal();
          confirmButtonLoading.value = false;
        }
      }, 5000);
    } else {
      message.warning("请确保IP地址有效且与网关地址在同一网段内！");
    }
  }

  return {
    dataForm,
    rules,
    dialogVisible,
    closeModal,
    handleSubmit,
    confirmButtonLoading,
  };
}

export { useInterface, useModifyInterface };
