/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \system\src\controller\useTcb.ts
 */
import { reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import {
  getEnableOrNotApi,
  enableIptablesApi,
  disableIptablesApi,
  getIpRuleApi,
  getMacListApi,
} from "../model/tcb";

function useTcbEnbale(refreshTableData) {
  // 其他数据
  const enbaleStatus = reactive({
    isEnable: false, // 使能值
    switchDisabled: false, // 使能状态
  });

  // 获取使能状态
  const getStatus = () => {
    getEnableOrNotApi().then((res) => {
      enbaleStatus.isEnable = res;
    });
  };

  // 使能
  const changeEnable = async () => {
    enbaleStatus.switchDisabled = true;
    const isEmpty = await isEmptyTable();
    if (enbaleStatus.isEnable) {
      if (isEmpty) {
        enbaleStatus.isEnable = false;
        enbaleStatus.switchDisabled = false;
        message.warning("请至少添加一个可信主机后再进行使能操作!");
      } else {
        enableIptablesApi()
          .then(() => {
            message.success("使能开启！");
            refreshTableData();
            getStatus();
          })
          .finally(() => {
            enbaleStatus.switchDisabled = false;
          });
      }
    } else {
      disableIptablesApi()
        .then(() => {
          message.success("使能关闭！");
          refreshTableData();
          getStatus();
        })
        .finally(() => {
          enbaleStatus.switchDisabled = false;
        });
    }
  };

  async function isEmptyTable() {
    const ips = await getIpRule();
    const macs = await getMacList();
    console.log(ips, macs);
    return ips.length === 0 && macs.length === 0;
  }

  async function getIpRule() {
    return await getIpRuleApi();
  }

  // 获取Mac列表
  async function getMacList() {
    return await getMacListApi();
  }

  onMounted(() => {
    getStatus();
  });

  return {
    enbaleStatus,
    changeEnable,
  };
}

export { useTcbEnbale };
