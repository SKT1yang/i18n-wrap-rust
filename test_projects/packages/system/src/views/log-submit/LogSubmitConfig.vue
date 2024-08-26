<!--
 * @name: 日志上送设置
 * @description: 系统设置-日志上送设置
 * @path: \feature-vue\platform\front\system\src\views\log-submit\LogSubmitConfig.vue
-->
<template>
  <Spin :spinning="pageLoading">
    <!-- 开关 switch 会有一个滑动的过程，容易引起误会，应测试的要求，接口数据返回后，再展示页面 -->
    <Form class="w-100 " :model="syslogForm" ref="syslogFormRef" :label-col="{ style: { width: '80px' } }"
      v-show="!pageLoading">
      <FormItem label="使能" name="shutdown">
        <Switch v-model:checked="shutdown" :checked-value="true" :un-checked-value="false" checked-children="开"
          un-checked-children="关" @change="changeSwitchHandle" />
      </FormItem>
      <FormItem label="IP" name="body" :rules="[
        {
          required: true,
          validator: ipValidate(),
          trigger: 'blur',
        },
      ]">
        <Input v-model:value.trim="syslogForm.body" :disabled="!shutdown" :maxlength="24" placeholder="IP 地址" />
      </FormItem>
      <FormItem label="端口" name="port" :rules="[{ required: true, validator: portValidate(), trigger: 'blur' }]">
        <Input v-model:value.trim="syslogForm.port" :disabled="!shutdown" :maxlength="24" placeholder="端口" />
      </FormItem>
      <FormItem label="发送方式" name="button">
        <RadioGroup v-model:value="syslogForm.button" :disabled="!shutdown">
          <Radio :value="true">kv</Radio>
          <Radio :value="false">json</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="上送事件">
        <RadioGroup v-model:value="sendEvent" @change="handleSendEventChange" class="my-1" :disabled="!shutdown">
          <Radio value="all">全部</Radio>
          <Radio value="custom">自定义</Radio>
        </RadioGroup>
        <Tree v-model:checkedKeys="filterKeys" checkable :tree-data="treeData" @check="handleTreeCheck()"
          :field-names="{ children: 'eventTypes', title: 'name', key: 'id' }" :disabled="!shutdown" />
      </FormItem>
      <FormItem label="事件等级">
        <CheckboxGroup v-model:value="eventLevels" :disabled="!shutdown">
          <Checkbox :value="1">高风险</Checkbox>
          <Checkbox :value="2">中风险</Checkbox>
          <Checkbox :value="3">低风险</Checkbox>
          <Checkbox :value="4">信息</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem :wrapper-col="{ style: { marginLeft: '80px' } }">
        <Button type="primary" :loading="buttonLoading" :disabled="!shutdown" @click="handleSubmit">保存</Button>
      </FormItem>
    </Form>
  </Spin>
</template>
<script setup name="SystemConfigMailAlarm" lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type DataNode } from 'ant-design-vue/es/tree';
import {
  Switch,
  Form,
  FormItem,
  Button,
  Input,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  message,
  FormInstance,
  Tree,
  Spin
} from 'ant-design-vue';
import {
  getSyslogApi,
  UpdateSyslogApi,
  getShutdownStatusApi,
  setShutdownApi,
  setFilterLogApi,
  getFilterLogApi,
  getLogTreeApi
} from '../../model/log-submit';

import { ipValidate, portValidate } from '@guolisec/utils';

// 上送事件类型
const sendEvent = ref('custom')

function handleSendEventChange() {
  if (sendEvent.value === 'all') {
    filterKeys.value = allEventKeys.value
  } else {
    filterKeys.value = []
  }
}

let shutdown = ref<boolean>(false);

let syslogForm = ref({
  body: '', // IP
  port: undefined, // 端口
  button: true, // 发送方式
});

// 保存按钮loading状态
let buttonLoading = ref(false);

// 表单实例
const syslogFormRef = ref<FormInstance>();

const pageLoading = ref(false) // 页面 loading

// 页面加载时
onMounted(async () => {
  pageLoading.value = true
  try {
    getShutdownStatus();
    getSyslog();
    await getTreeEventTypeOptsData();
    await getFilterLog();
  } finally {
    pageLoading.value = false
  }
});

// 获取使能状态
const getShutdownStatus = () => {
  getShutdownStatusApi().then((res) => {
    shutdown.value = res;
  });
};

// 修改使能状态
const changeSwitchHandle = () => {
  const description = shutdown.value ? '开启' : '关闭'
  setShutdownApi({
    shutdown: shutdown.value,
    description,
  }).then(() => {
    message.success(`使能${description}成功！`);
  });
};

// 获取当前syslog服务器
const getSyslog = () => {
  getSyslogApi().then((res) => {
    syslogForm.value = res;
  });
};

// 设置syslog服务器
async function handleSubmit() {
  await syslogFormRef.value?.validateFields();
  buttonLoading.value = true;
  try {
    await UpdateSyslogApi({
      body: syslogForm.value.body,
      port: syslogForm.value.port ? Number(syslogForm.value.port) : null,
      button: syslogForm.value.button,
    });
    await setFilterLog();
    message.success('设置成功');
    buttonLoading.value = false;
    getSyslog();
  } finally {
    buttonLoading.value = false;
  }
}

// 过滤值
let filterKeys = ref<number[]>([]);
let treeData = ref<DataNode[]>([]);
const eventLevels = ref<number[]>([]);

// 获取事件类型下拉选项
async function getTreeEventTypeOptsData() {
  treeData.value = (await getLogTreeApi()) as unknown as DataNode[];
  console.log(treeData.value, 'treeData.value')
}

// 递归出所有的事件 Id
function recursion(logs, logKeys) {
  logs.forEach(log => {
    logKeys.push(log.id)
    if (log.eventTypes) {
      recursion(log.eventTypes, logKeys)
    }
  })
}

// 获取到全部的事件的 id
const allEventKeys = computed(() => {
  const allKeys = []
  recursion(treeData.value, allKeys)
  return allKeys
})

// 树的复选框发生变化
function handleTreeCheck() {
  // 求出全部事件id 和已选择事件的差集
  const filterSet = new Set([...filterKeys.value])
  const difference = [...new Set(allEventKeys.value.filter(key => !filterSet.has(key)))]
  if (difference.length) {
    sendEvent.value = 'custom'
  } else {
    sendEvent.value = 'all'
  }
}

// 获取事件类型下拉选项
async function getFilterLog() {
  const response = await getFilterLogApi();
  // 接口传来的是过滤条件的事件，与页面展示的上送事件相反，因此将后端传来的数据过滤掉，展示未传的数据
  if (response.length === 0) {
    sendEvent.value = 'all'
    filterKeys.value = allEventKeys.value
  } else {
    sendEvent.value = 'custom'
    const eventTypes = response.map((i) => i.eventType);
    const filterSet = new Set([...eventTypes])
    filterKeys.value = [...new Set(allEventKeys.value.filter(key => !filterSet.has(key)))]
    eventLevels.value = response.map((i) => i.eventLevel);
  }
}

function setFilterLog() {
  // 接口传的是过滤条件的事件，与页面展示的上送事件相反，因此将未选的事件传给后端
  const filterSet = new Set([...filterKeys.value])
  const difference: number[] = [...new Set(allEventKeys.value.filter(key => !filterSet.has(key)))] as number[]
  let filters = difference.map((key) => {
    return {
      eventType: key,
    };
  });
  const levels = eventLevels.value.map((key) => {
    return {
      eventLevel: key,
    };
  });
  setFilterLogApi([...filters, ...levels]);
}
</script>
