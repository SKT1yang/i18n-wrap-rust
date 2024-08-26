<template>
  <div class="mt-6">
    <Form layout="inline" :wrapper-col="{ style: { width: '190px' } }" class="p-b-4">
      <FormItem>
        <Cascader :value="(selectedObj.data.assetGroupLabel as any)" changeOnSelect expand-trigger="hover"
          placeholder="资产组" @change="onSelect" :options="fileObj.treeData">
        </Cascader>
      </FormItem>
      <FormItem>
        <Select allow-clear v-model:value="selectedObj.data.assetTypeName" :options="fileObj.assetType"
          placeholder="资产类型">
        </Select>
      </FormItem>
      <FormItem>
        <Select allow-clear v-model:value="selectedObj.data.runStatus" :options="fileObj.runStatus" placeholder="运行状态">
        </Select>
      </FormItem>
      <Button @click="clear" class="mr-4">重置</Button>
      <Button type="primary" @click="() => { tableData.current = 1; query() }">查询</Button>
    </Form>

    <Table :loading="loading" :data-source="tableData.list" :columns="columns" :pagination="pagin1" bordered
      @change="handleChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'runStatus'">
          <Tag :color="record.runStatus == 1 ? 'green' : record.runStatus == 0 ? 'red' : 'yellow'">{{
          statusTable[record.runStatus] }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <Button type="link" @click="handleDetailModal(record)">详情</Button>
        </template>
      </template>
    </Table>
    <Modal v-model:open="detailModal" title="资产详情" width="1000px" :footer="false">
      <DetailModal :detailRecord="detailRecord" :hidden-features="hiddenFeatures"></DetailModal>
    </Modal>
  </div>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue'
import type { Features } from '../context/useStatusContext'
import { reactive, ref, onMounted, computed } from "vue"
import { Button, Table, FormItem, Form, Select, Cascader, Tag, Modal } from 'ant-design-vue'
import { getAssetGroupTreeApi } from "@/model/group"
import { getAssetTypeApi, getAssetListApi } from "@/model/list"
import { columns } from "./assetStatus.data"
import DetailModal from "./DetailModal.vue";
import { baseType } from "../../asset-field/types"
import { injectContext } from "@guolisec/utils"

const statusList = injectContext('assetStatus::statusList', [0, 1, 2])

const detailModal = ref(false)
const loading = ref(false)
const handleChange = (e) => {
  tableData.pageSize = e.pageSize
  tableData.current = e.current
  query()
}
const tableData = reactive<{ list: any[], current: number, pageSize: number, total: number }>({ list: [], current: 1, pageSize: 10, total: 0 })
const pagin1 = computed(() => ({
  current: tableData.current,
  showSizeChanger: true,
  defaultPageSize: tableData.pageSize,
  total: tableData.total,
  showTotal: () => `共 ${tableData.total} 项`,
}))
const transform2treeform = (res) => {
  return res.map((value) => {
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
onMounted(() => {
  query()
  getAssetGroupTreeApi().then((res) => {
    fileObj.treeData = transform2treeform(res)
  })
  getAssetTypeApi().then((res) => {
    fileObj.assetType = res.map(value => {
      return { label: value.assetTypeName, value: value.assetTypeCode }
    })
  })
})

let selectedObj = reactive({
  data: {
    name: undefined,
    assetTypeName: undefined,
    assetGroup: undefined,
    assetGroupLabel: undefined,
    runStatus: undefined,
  }
})
const onSelect = (_value, option) => {
  selectedObj.data.assetGroupLabel = option ? option[option.length - 1].label : undefined
  selectedObj.data.assetGroup = option ? option[option.length - 1].value : undefined
}
const statusTable = ["离线", "在线", "闲置"]
const fileObj = reactive<{ runStatus: baseType[], assetType: baseType[], treeData: baseType[] }>({
  assetType: [],
  runStatus: statusList.map(status => {
    if (status === 0) {
      return { label: '离线', value: 0 }
    } else if (status === 1) {
      return { label: '在线', value: 1 }
    } else {
      return { label: '闲置', value: 2 }
    }
  }),
  treeData: []
})
const clear = () => {
  Object.keys(selectedObj.data).forEach((value) => {
    selectedObj.data[value] = undefined
  })
}

const query = () => {
  loading.value = true;
  getAssetListApi({
    page: tableData.current,
    size: tableData.pageSize,
    assetTypeCode: selectedObj.data.assetTypeName,
    assetGroupId: selectedObj.data.assetGroup,
    runStatus: selectedObj.data.runStatus,
    signP: 'null'
  }).then((value) => {
    tableData.total = value.totalElements;
    loading.value = false;
    tableData.list = value.content.map((item) => {
      return { ...item, assetGroupLongName: item.assetGroup.label }
    })
  })
}
const detailRecord = ref()
const handleDetailModal = (record) => {
  detailRecord.value = record;
  detailModal.value = true;
}

// 父组件传值
const props = defineProps({
  hiddenFeatures: {
    type: Object as PropType<Features>,
    default: () => []
  },
});

const hiddenFeatures = computed(() => {
  let result = [...props.hiddenFeatures]
  result = Array.from(new Set(result))
  return result
})
</script>