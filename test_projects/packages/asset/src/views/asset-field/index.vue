<template>
  <div class="min-w-350">
    <Form layout="inline">
      <FormItem>
        <Button type="primary" @click="() => { form.newName = undefined; newModal = true; }">
          新增资产域
        </Button>
      </FormItem>
      <FormItem>
        <Input allow-clear placeholder="请输入资产域名称" :maxlength="30" v-model:value="searchContent"></Input>
      </FormItem>
      <FormItem>
        <Button @click="reload()">查询</Button>
      </FormItem>
      <FormItem>
        <Button danger :disabled="selectedRowkeys.length == 0" @click="deleteDevices">
          批量删除
        </Button>
      </FormItem>
    </Form>
    <Table :loading="loading" class="mt-4" :columns="columns" :data-source="tableData.list" size="small" :row-selection="{
      selectedRowKeys: selectedRowkeys,
      onChange: (e) => {
        selectedRowkeys = e as any;
      }
    }" :pagination="pagin1" :row-key="row => row.id" @change="handleChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'deviceCount'">
          <Tag>{{ record.deviceCount + '台' }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <Button type="link" @click="handleDisposeModal(record)">配置</Button>
          <Button type="link" danger @click="deleteDevice(record)">删除</Button>
        </template>
      </template>
    </Table>
    <Modal class="p-t-[24px]" :closable="false" v-model:open="newModal" title="新增资产域" @ok="save" ok-text="保存">
      <Form ref="newForm" :model="form">
        <FormItem label="资产域名称" name="newName" :rules="rules" required>
          <Input allow-clear v-model:value="form.newName" placeholder="请输入资产域名称" :maxlength="30">
          </Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal title="配置资产域" v-model:open="disposeModal" :width="1400" :footer="false">
      <DisposeModal :open="disposeModal" :record="record" />
    </Modal>
  </div>
</template>

<script lang='ts' setup>
import { Button, Input, Table, TableColumnsType, Tag, Modal, FormItem, message, Form } from 'ant-design-vue'
import { assetFieldListAPI, saveAPI, deleteAPI } from "@/model/field"
import { reactive, onMounted, computed, ref, createVNode, watch } from "vue"
import DisposeModal from "./components/DisposeModal.vue"

const rules = [
  {
    validator: (_rule, value) => {
      if (value) {
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    }
  }
]

const newForm = ref();
const loading = ref(false)
// 配置弹窗状态
const disposeModal = ref(false)
// 选中的行的key数组
const selectedRowkeys = ref([])
// 新建资产域的名字
const form = ref<{ newName?: string }>({ newName: undefined })
// 搜索内容
const searchContent = ref()
// 表格所有数据
const tableData = reactive<{ list: any[], current: number, pageSize: number, total: number }>({ list: [], current: 1, pageSize: 10, total: 0 })
// 表格分页
const pagin1 = computed(() => ({
  current: tableData.current,
  defaultPageSize: tableData.pageSize,
  total: tableData.total,
  showSizeChanger: true,
  showTotal: () => `共 ${tableData.total} 项`,
}))
// 表格栏
const columns: TableColumnsType = [
  {
    title: "序号", dataIndex: "showid", key: "序号", width: 80, customRender: ({ index }) => {
      return (tableData.current - 1) * tableData.pageSize + index + 1
    },
  },
  {
    title: "资产域名称", key: "8", dataIndex: "name",
  },
  { title: "资产数量", key: "7", dataIndex: "deviceCount", },
  { title: "操作", key: "6", dataIndex: "operation", width: "240px", },
]
// 当表格产生所有变化时回调（切换分页数 跳转页面 点击页码 排序）
const handleChange = (e) => {
  tableData.current = e.current
  tableData.pageSize = e.pageSize;
  query()
}
// 加载进本页面前出发搜索第一页
onMounted(() => {
  reload();
})
// 搜索方法
const query = async (name = '') => {
  loading.value = true;
  await assetFieldListAPI({ page: tableData.current, name: name, size: tableData.pageSize }).then((res) => {
    // 展示的id 根据数据动态计算得来

    tableData.total = res.length;
    tableData.list = res.map((value) => {
      return { ...value, deviceCount: value.assetList.length, name: value.name ?? '-' }
    })
    loading.value = false;
  })
}
// 新建资产域弹窗状态
const newModal = ref(false);

// 保存新建按钮方法
const save = async () => {
  await newForm.value.validate();
  saveAPI({
    name: form.value.newName as string,
    pointSnList: [],
    sn: "123456",
  }).then(() => {
    // 完成新建再次获取最新数据
    reload();
    newModal.value = false
    message.success('新建成功')
  })
}

// 删除单个设备
const deleteDevice = (record) => {
  getDeleteFunc({ ids: record.id })
}
// 多选删除设备
const deleteDevices = () => {
  getDeleteFunc({ ids: selectedRowkeys.value })
}
// 删除设备具体方法
const getDeleteFunc = (params) => {
  Modal.confirm({
    title: '提示',
    type: 'warning',
    content: createVNode('div', null, '确认删除？'),
    onOk() {
      deleteAPI(params).then(() => {
        message.success('删除成功')
        // 删除完成后清空多选内容并再次查询
        selectedRowkeys.value = []
        query(searchContent.value)
      })
    }
  })
}

// 选中行数据 预备传递给配置弹窗
const record = ref();
const handleDisposeModal = (recordP) => {
  record.value = recordP;
  disposeModal.value = true;
}

watch(disposeModal, () => { reload() })
const reload = () => {
  tableData.current = 1;
  query(searchContent.value)
}
</script>