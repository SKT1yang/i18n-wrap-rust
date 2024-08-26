<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <div>
    <Row class="m-b-2" justify="space-between">
      <Col :span="21">
      </Col>
      <template v-if="parentProp.tabKey == 0">
        <Col :span="2.5">
        <Button :disabled="selectedRows.length == 0" @click="trustAssets">批量信任</Button>
        </Col>
        <Col :span="1.5">
        <Button class="m-r-3" :disabled="selectedRows.length == 0" @click="ignoreAssets">批量忽略</Button>
        </Col>
      </template>
      <template v-else>
        <Col :span="1.5">
        <Button class="m-r-3" :disabled="selectedRows.length == 0" @click="unignoreAssets">批量恢复</Button>
        </Col>
      </template>
    </Row>
    <Table :loading="loading" :data-source="data.list" size="small" bordered :columns="columns" :pagination="pagin1"
      @change="handleChange" :row-selection="{
        selectedRowKeys: selectedRows,
        onChange: (e) => {
          selectedRows = e;
          console.log(selectedRows)
        }
      }" :row-key="line => line.id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <template v-if="parentProp.tabKey == 0">
            <Popconfirm title="是否确认信任资产" @confirm="trustAsset(record)">
              <Button type="link">信任</Button>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="是否确认忽略资产" @confirm="ignoreAsset(record)">
              <Button type="link">忽略</Button>
            </Popconfirm>
          </template>
          <template v-else>
            <Popconfirm title="是否确认恢复资产" @confirm="unignoreAsset(record)">
              <Button type="link">恢复</Button>
            </Popconfirm>
          </template>
        </template>
      </template>
    </Table>
  </div>
</template>

<script lang='ts' setup>
import { Row, Col, Button, message, Table, Divider, Popconfirm } from "ant-design-vue"
import { computed, ref, watch } from "vue"
import { columns } from "./trust.data"
import { trustAssetAPI, saveAPI } from "@/model/trust"
import { useStore } from "@/model/trustStore";

const { data } = useStore();
const parentFunc = defineEmits(['query'])
const handleChange = (e, _f, sorter) => {
  data.pageSize = e.pageSize;
  data.current = e.current
  if (sorter.order != undefined) {
    if (sorter.field == 'assetTypeName') {
      parentFunc("query", 'assetTypeCode' + "," + (sorter.order as string).match(/(.*)end/)![1])
    }
    else {
      parentFunc("query", sorter.field + "," + (sorter.order as string).match(/(.*)end/)![1])
    }
  } else {
    parentFunc("query")
  }
}

const parentProp = defineProps<{ tabKey: number, loading: boolean }>()
const pagin1 = computed(() => ({
  current: data.current,
  defaultPageSize: data.pageSize,
  total: data.total,
  showSizeChanger: true,
  showTotal: () => `共${data.total}条信息,共${Math.ceil(data.total / data.pageSize)}页`,
  showQuickJumper: true,
}))
//多选选中行
let selectedRows = ref<any[]>([])
watch(() => parentProp.tabKey, () => {
  if (parentProp.tabKey == 1) {
    parentFunc('query', undefined, 1)
  } else {
    parentFunc('query')
  }
})

const trustAssets = () => {
  let temp = data.list.filter((value) => {
    return selectedRows.value.includes(value.id)
  })
  trustAssetAPI(temp.map(value => {
    return { ...value, treat: true }
  })).then(() => {
    parentFunc("query")
    selectedRows.value = [];
    message.success(`信任资产成功`);
  })
}
const trustAsset = (record) => {
  trustAssetAPI([{ ...record, treat: true }]).then(() => {
    parentFunc("query")
    message.success(`信任资产成功`);
  })
}
const ignoreAssets = () => {
  let temp = data.list.filter((value) => {
    return selectedRows.value.includes(value.id)
  })
  saveAPI(temp.map(value => {
    return { ...value, ignoreStatus: 1 }
  })).then(() => {
    message.success(`忽略资产成功`);
    selectedRows.value = [];
    parentFunc("query")
  })
}
const ignoreAsset = (record) => {
  saveAPI([{ ...record, ignoreStatus: 1 }]).then(() => {
    parentFunc("query")
    message.success(`忽略资产成功`);
  })
}
const unignoreAssets = () => {
  let temp = data.list.filter((value) => {
    return selectedRows.value.includes(value.id)
  })
  saveAPI(temp.map(value => {
    return { ...value, ignoreStatus: 0 }
  })).then(() => {
    parentFunc("query")
    selectedRows.value = [];
    message.success(`恢复资产成功`);
  })
}
const unignoreAsset = (record) => {
  saveAPI([{ ...record, ignoreStatus: 0 }]).then(() => {
    parentFunc("query")
    message.success(`恢复资产成功`);
  })
}
</script>