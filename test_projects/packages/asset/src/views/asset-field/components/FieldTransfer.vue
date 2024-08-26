<template>
  <div>
    <Row class="p-3 h-[605px]" justify="space-between">
      <Col :span="12" class="border-[gray] border-1 border-solid rounded-sm">
      <Form ref="formLeft" :model="form" :rules="rules" layout="inline">
        <Row class="p-1 space-x-1">
          <Col>
          <Cascader :loading="leftLoading" :disabled="leftLoading" size="small" class="w-35 m-l-1"
            v-model:value="assetGroup" changeOnSelect expand-trigger="hover" :options="parentProps.treeData"
            placeholder="请选择资产组">
          </Cascader>
          </Col>
          <Col>
          <FormItem class="m-0 p-0" name="assetIp">
            <Input :autocomplete="'off'" :maxlength="30" size="small" v-model:value="form.assetIp" allow-clear
              placeholder="请输入ip"></Input>
          </FormItem>
          </Col>
          <Col>
          <Button size="small" type="primary" :loading="leftLoading" @click="checkQuery">查询</Button>
          </Col>
        </Row>
      </Form>
      <Table @change="handleChange" :loading="leftLoading" size="small" bordered :columns="columns"
        :data-source="data.list" :row-selection="{
          onChange: handleLeftChange,
          selectedRowKeys: selectedRowKeys
        }" :pagination="pagin1" row-key="id">
      </Table>
      </Col>
      <Col :span="1" class="h-[100%] flex justify-center flex-col">
      <Button @click="transferChange()" :disabled="leftButton || leftLoading" type="link" primary size="small"
        class="m-b-2">
        <span class="border border-solid px-1 py-0.5">
          <i class="i-base-right align-icon"></i>
        </span>
      </Button>
      <Button @click="transferChange(true)" :disabled="rightButton || rightLoading" type="link" primary size="small">
        <span class="border border-solid px-1 py-0.5">
          <i class="i-base-left align-icon"></i>
        </span>
      </Button>
      </Col>
      <Col :span="11" class="border-[gray] border-1 border-solid rounded-sm">
      <Form ref="formRight" :model="form2" :rules="rules" layout="inline">
        <Row class="p-1 space-x-1">
          <Col>
          <FormItem class="m-0 p-0" name="assetIp">
            <Input size="small" v-model:value="form2.assetIp" :maxlength="30" placeholder="请输入ip" allow-clear />
          </FormItem>
          </Col>
          <Col>
          <Button size="small" type="primary" @click="filterTable2">查询</Button>
          </Col>
        </Row>
      </Form>
      <Table :loading="table2Loading" :row-selection="{
        onChange: handleRightChange,
        selectedRowKeys: selectedRowKeys2
      }" size="small" bordered :columns="columns" :data-source="data2.list" :row-key="row => row.id"
        :pagination="false"></Table>
      </Col>
    </Row>
  </div>
</template>

<script lang='ts' setup>
import { computed, reactive, ref, watch } from 'vue';
import { Key } from 'ant-design-vue/es/table/interface';
import { Button, Col, Row, Input, FormItem, Form, Table, Cascader, TableColumnsType, message } from 'ant-design-vue'
import { getCanChooseAssetByFieldIdAPI, updateAssetColumnBatchAPI, allAPI } from "@/model/field"
import { getRules } from '../utils/formRules';
import { backType, FieldAsset } from '../types';

const checkQuery = async () => {
  data.current = 1;
  console.log(formLeft.value)
  if (formLeft.value) {
    await formLeft.value.validate();
  }
  query();
}
const leftLoading = ref(false);
const rightLoading = ref(false);
const formLeft = ref();
const formRight = ref();
const pagin1 = computed(() => ({
  current: data.current,
  defaultPageSize: data.pageSize,
  total: data.total,
  showSizeChanger: false,
  showTotal: () => `共${data.total}条信息,共${Math.ceil(data.total / data.pageSize)}页`,
}))

const handleChange = (e, _f) => {
  data.pageSize = e.pageSize;
  data.current = e.current;
  query();
}
// 控制向左向右按钮状态
const leftButton = ref(true)
const rightButton = ref(true)
const _d = ref()
// 表单规则
const rules = getRules(_d);
const form = reactive<{ assetIp: string }>({ assetIp: '' })
const form2 = reactive<{ assetIp: string }>({ assetIp: '' })
const columns: TableColumnsType = [
  { title: "资产名称", dataIndex: "name", key: "1", width: "50%", align: "center" },
  { title: "资产IP", key: "2", dataIndex: "assetIp", width: "50%", align: "center" },
]
// 从父组件获取树型输入框数据
const parentProps = defineProps<{ treeData: any, obj: any, open: boolean }>()
const assetGroupLabel = ref();
const assetGroup = ref()
const table2Loading = ref(false)
const filterTable2 = async () => {
  table2Loading.value = true;
  allAPI({ name: '', assetIp: form2.assetIp, fieldId: parentProps.obj.id }).then(res => {
    clearRightSelect()
    data2.list = res
    table2Loading.value = false;
  })
}
const allData = ref();
const data = reactive<{ list: backType['content'], current: number, pageSize: number, total: number }>({ list: [], pageSize: 10, current: 1, total: 0 })
const data2 = reactive<{ list: backType['content'], current: number, pageSize: number, total: number }>({ list: [], pageSize: 10, current: 1, total: 0 })

const init = () => {
  assetGroup.value = undefined;
  assetGroupLabel.value = undefined;
  data.current = 1;
  data.list = [];
  data.pageSize = 10;
  data.total = 0;
  form.assetIp = '';
  form2.assetIp = '';
}

const query = async () => {
  leftLoading.value = true;
  const statusTabel = ["离线", "在线", "闲置"]
  await getCanChooseAssetByFieldIdAPI({
    fieldIdNull: 'null',
    assetGroupId: assetGroup.value,
    errorLogLeftLike: parentProps.obj.sn,
    assetFieldId: parentProps.obj.id,
    name: '',
    assetIp: form.assetIp ?? '',
    page: data.current,
    size: data.pageSize
  }).then((res) => {
    clearLeftSelect();
    allData.value = res;
    let rewriteRes = res.content.map((value) => {
      return { ...value, assetGroupLabel: value.assetGroup?.label ?? undefined, assetFieldName: value.assetField?.name ?? "-", statuLongName: statusTabel[value.runStatus] }
    })
    data.total = res.totalElements
    data.list = rewriteRes
    leftLoading.value = false;
  })
}

watch(() => parentProps.open, () => {
  if (parentProps.open) {
    init();
    query();
    filterTable2();
  }
}, {
  immediate: true
})

const selectedRows = ref<FieldAsset[]>([]);
const selectedRowKeys = ref<Key[]>([]);
const selectedRows2 = ref<FieldAsset[]>([]);
const selectedRowKeys2 = ref<Key[]>([]);

function handleLeftChange(keys, rows) {
  selectedRows.value = rows
  selectedRowKeys.value = keys
  if (rows.length > 0) {
    leftButton.value = false
  } else {
    leftButton.value = true
  }
}

function handleRightChange(keys, rows) {
  selectedRows2.value = rows
  selectedRowKeys2.value = keys
  if (rows.length > 0) {
    rightButton.value = false
  } else {
    rightButton.value = true
  }
}

function clearLeftSelect() {
  handleLeftChange([], [])
}

function clearRightSelect() {
  handleRightChange([], [])
}

const transferChange = async (isRight = false) => {
  leftLoading.value = true
  rightLoading.value = true
  try {
    let rows = isRight ? selectedRows2 : selectedRows;
    let tDatemp = rows.value.map((row) => {
      return {
        ...row,
        fieldId: isRight ? undefined : parentProps.obj.id
      }
    })
    await updateAssetColumnBatchAPI(tDatemp)
    //左侧为资产组意味着左侧列表有数据 需要更新
    await query();
    const res = await allAPI({ name: form2.assetIp ?? '', assetIp: form2.assetIp, fieldId: parentProps.obj.id })
    data2.list = res
    isRight ? rightButton.value = true : leftButton.value = true;
    message.success('操作成功')
  } finally {
    clearLeftSelect()
    clearRightSelect()
    leftLoading.value = false
    rightLoading.value = false
  }
}

</script>
<style scoped>
:deep(.ant-table-content) {
  overflow-y: auto;
  max-height: 470px;
}

:deep(.ant-form-item-control-input) {
  min-height: 0;
}

:deep(.ant-form-item) {
  margin-inline-end: 0;
}
</style>