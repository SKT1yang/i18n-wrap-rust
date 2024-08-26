<template>
  <div>
    <Form ref="headForm" :rules="rules" :model="formObj">
      <Row>
        <FormItem label="资产域名称" required class="p-5" name="newName">
          <div v-if="showName">
            {{ formObj.newName }}
            <Button type="text" @click="showName = false">
              <template #icon>
                <i class="i-base-edit align-icon"></i>
              </template>
            </Button>
          </div>
          <InputSearch v-else :maxlength="30" :autocomplete="'off'" v-model:value="formObj.newName" placeholder="请输入资产与名称"
            enter-button="保存" @search="handleEdit">
          </InputSearch>
        </FormItem>
      </Row>
    </Form>
    <Tabs v-model:active-key="activeKey">
      <TabPane :key="0" tab="添加资产">
        <FieldTransfer :obj="parentProps.record" :open="open" :treeData="treeData" />
      </TabPane>
      <TabPane :key="1" tab="上送资产配置">
        <Row>
          <Button type="primary" @click="addPoint">添加点位</Button>
        </Row>
        <Table class="m-y-2" :data-source="tableData.list" bordered size="small" :columns="columns" :pagination="pagin1"
          @change="handleChange">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'sn'">
              <template v-if="record.doEdit">
                <Select v-model:value="selectedPoint" class="w-[300px]" placeholder="请选择点位" :options="pointList"></Select>
              </template>
              <template v-else>
                {{ record.sn }}
              </template>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <template v-if="record.doEdit">
                <Button type="text" @click="createPoint()">确定</Button>
                <Button type="text" @click="tableData.list.pop()" danger>取消</Button>
              </template>
              <template v-else>
                <Button type="text" @click="deletePoint(record)" danger>删除</Button>
              </template>
            </template>
          </template>
        </Table>
      </TabPane>
    </Tabs>
  </div>
</template>

<script lang='ts' setup>
import { reactive, watch, ref, computed, createVNode } from 'vue';
import { Button, Row, TabPane, FormItem, Form, Table, Select, Tabs, InputSearch, TableColumnsType, Modal, message } from 'ant-design-vue'
import { saveAPI, pointFieldRelationListPageAPI, deleteAllAPI, getPointAPI, createPointFieldRelationListAPI } from "@/model/field"
import { getAssetGroupTreeApi } from "@/model/group"
import FieldTransfer from "./FieldTransfer.vue"

const headForm = ref();
// 树型选择框的数据
const treeData = ref()
// 上送配置被选中的sn选项
const selectedPoint = ref();
// 选择点位的选项
const pointList = ref<{ label: string, value: string }[]>([])
// 上送配置表 表格属性
const tableData = reactive<{ list: any[], current: number, pageSize: number, total: number }>({ list: [], current: 1, pageSize: 10, total: 0 })
// 上送配置表 分页对象
const pagin1 = computed(() => ({
  current: tableData.current,
  defaultPageSize: tableData.pageSize,
  total: tableData.total,
  showQuickJumper: true,
  showTotal: () => `共${tableData.total}条信息,共${Math.ceil(tableData.total / tableData.pageSize)}页`,
}))
// 上送配置表 栏
const columns: TableColumnsType = [
  { title: "点位名称", dataIndex: "assetName", key: "1", width: "100px", align: "center" },
  { title: "sn", key: "8", dataIndex: "sn", width: "300px", align: "center" },
  { title: "操作", key: "7", dataIndex: "operation", width: "80px", align: "center" },
]
// 活动页签当前选中
const activeKey = ref(0)
// 修改资产域名称
const formObj = reactive<{ newName?: string }>({ newName: undefined })
// 不允许为空的规则
const rules = {
  newName: [{
    validator: (_rule, value) => {
      if (value) {
        return Promise.resolve();
      } else {
        return Promise.reject()
      }
    }
  }]
}
// 父组件刚进入时触发的查询
const query = (current) => {
  // 置空被选中点位，以防上次选中未确定带来的缓存
  selectedPoint.value = undefined;
  // 给名字附默认值
  formObj.newName = parentProps.record.name
  // 上送资产配置表格数据获取
  pointFieldRelationListPageAPI({ fieldId: parentProps.record.id, page: current, size: tableData.pageSize }).then(res => {
    tableData.list = res.content;
    tableData.total = res.totalElements;
  })
  // 用递归将请求得到的数据转化成树型组件需要的数据结构
  const allTreeNodeID: string[] = []
  const transform2treeform = (res) => {
    return res.map((value) => {
      allTreeNodeID.push(value.id)
      if (Array.isArray(value.children)) {
        return {
          title: value.label,
          key: value.id,
          label: value.label,
          value: value.id,
          children: transform2treeform(value.children)
        }
      } else {
        return {
          title: value.label,
          label: value.label,
          value: value.id,
          key: value.id
        }
      }
    })
  }
  getAssetGroupTreeApi().then((res) => {
    treeData.value = transform2treeform(res)
  })
}
const parentProps = defineProps<{ record: any, open: boolean }>()
const showName = ref(true)
// 父组件传来的一行数据有任何变化立即进行一次查询
watch(parentProps, () => {
  activeKey.value = 0
  formObj.newName = undefined;
  tableData.list = [];
  tableData.current = 1;
  tableData.pageSize = 10;
  tableData.total = 0;
  query(1);
}, {
  deep: true,
  immediate: true
})
// 点击确认修改 修改完成将输入框隐藏 显示名字
const handleEdit = async () => {
  await headForm.value.validate()
  saveAPI({ ...parentProps.record, name: formObj.newName }).then(() => {
    showName.value = true
    message.success('修改成功')
  })
}

// 获取可用sn列表
const addPoint = () => {
  if (tableData.list[tableData.list.length - 1]?.doEdit) {
    message.warning('请完成当前编辑后再添加点位')
    return;
  }
  getPointAPI().then(res => {
    pointList.value = res.map(value => {
      return { value: value.sn, label: `${value.assetIp}(${value.sn})` }
    })
  })
  selectedPoint.value = undefined;
  // 通过判断table数据只有0个或数据最后一条doEdit为true判断是否可以给table添加一行
  if (tableData.list.length == 0 || !tableData.list[tableData.list.length - 1].doEdit) {
    // 此行为后续添加点位行为占位，因此id为-1 doEdit用以使table表单得知这行是编辑状态
    tableData.list.push({ doEdit: true, id: -1, assetName: '-' })
  }
}

const deletePoint = (record) => {
  Modal.confirm({
    title: '提示',
    type: 'warning',
    okText: "确定删除",
    okType: 'danger',
    centered: true,
    cancelText: "取消删除",
    content: createVNode('div', null, '确认删除？'),
    onOk() {
      deleteAllAPI({ ids: record.id }).then(() => {
        pointFieldRelationListPageAPI({ fieldId: parentProps.record.id, page: 1, size: 10 }).then(res => {
          tableData.list = res.content;
          tableData.total = res.totalElements;
          message.success('删除成功')
        })
      })
    }
  })
}

// 确认新增点位
const createPoint = () => {
  // 保证已经选中点位
  if (selectedPoint.value == undefined) {
    message.error("未选择点位")
    return
  }
  createPointFieldRelationListAPI([{ sn: selectedPoint.value, fieldId: parentProps.record.id }]).then(() => {
    pointFieldRelationListPageAPI({ fieldId: parentProps.record.id, page: 1, size: 10 }).then(res => {
      message.success('添加成功')
      tableData.list = res.content;
      tableData.list = tableData.list.map(value => {
        return { ...value, assetName: value.assetName ?? '-' }
      })
      tableData.total = res.totalElements;
    })
  })
}

const handleChange = (e) => {
  tableData.current = e.current
  tableData.pageSize = e.pageSize;
  query(e.current)
}
</script>