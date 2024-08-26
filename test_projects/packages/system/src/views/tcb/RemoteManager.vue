<!--
 * @name: 远程管理
 * @description: Do not edit
 * @date: 2023-06-27 16:26:26
 * @path: \feature-vue\platform\front\system\src\views\tcb\RemoteManager.vue
-->
<template>
  <div>
    <Form layout="inline">
      <FormItem label="远程SSH管理">
        <Switch v-model:checked="sshForm.code" :checkedValue="1" :unCheckedValue="0" @change="updateSSH" />
      </FormItem>
      <FormItem label="可信主机设置">
        <Popconfirm title="确定要初始化吗?" ok-text="确认" cancel-text="取消" @confirm="clearAllRule">
          <Button :loading="state.clearButtonLoading" danger>初始化</Button>
        </Popconfirm>
      </FormItem>
      <FormItem>
        <Switch checked-children="使能" un-checked-children="未使能" v-model:checked="enbaleStatus.isEnable"
          :loading="enbaleStatus.switchDisabled" @change="changeEnable" />
      </FormItem>
    </Form>
    <Tabs v-model:active-key="activeKey" destroy-inactive-tab-pane>
      <TabPane key="ip" tab="可信 IP">
        <TrustedIp ref="trustedIpRef" />
      </TabPane>
      <TabPane key="mac" tab="可信 MAC">
        <TrustedMac ref="trustedMac" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script setup name="iptablesIndex" lang="ts">
import { reactive, ref, onMounted } from 'vue'
import {
  Tabs,
  TabPane,
  Form,
  FormItem,
  Popconfirm,
  Button,
  message,
  Switch,
} from 'ant-design-vue';
import TrustedIp from './TrustedIp.vue';
import TrustedMac from './TrustedMac.vue';
import { clearAllRuleApi, getSSHApi, updateSSHApi } from '../../model/tcb';
import { useTcbEnbale } from '../../controller/useTcb'

const emit = defineEmits(["refresh"]);

const { enbaleStatus,
  changeEnable } = useTcbEnbale(refreshTableData)

let activeKey = ref('ip');
const state = reactive({
  clearButtonLoading: false, // 初始化按钮加载状态
  switchCode: false,
});

let sshForm = reactive({
  id: '',
  code: 1,
});

let trustedIpRef = ref();
let trustedMac = ref();

onMounted(() => {
  getSSH();
});

// 查询当前的ssh
const getSSH = () => {
  getSSHApi().then((res) => {
    sshForm.id = res.id;
    sshForm.code = res.code;
  });
};

// 设置ssh
const updateSSH = () => {
  updateSSHApi(sshForm, { description: sshForm.code ? '开启' : '关闭' })
    .then(() => {
      message.success('修改成功');
    })
    .catch(() => {
      sshForm.code = sshForm.code ? 0 : 1;
    });
};

// 初始化
const clearAllRule = () => {
  state.clearButtonLoading = true;
  clearAllRuleApi()
    .then(() => {
      message.success('删除成功');
      refreshTableData()
    })
    .finally(() => {
      state.clearButtonLoading = false;
    });
};

function refreshTableData() {
  if (trustedIpRef.value) {
    trustedIpRef.value.getIpRule();
  }
  if (trustedMac.value) {
    trustedMac.value.getMacList();
  }
}


</script>
