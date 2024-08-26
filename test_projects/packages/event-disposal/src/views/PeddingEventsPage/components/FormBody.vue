<!--
 * @name: 待处置事件列表
 * @description: 待处置事件列表
-->

<template>
  <div class="pedding-event-form">
    <Row class="p-b-[24px]">
      <Col :span="8">
        <div id="pie" class="pedding-event-pie" v-show="map1Show"></div>
        <Empty
          :image="simp"
          v-if="!map1Show"
          class="color-[var(--un-ring-offset-color)] m-t-[100px]"
        />
      </Col>
      <Col :span="8">
        <div id="pie2" class="pedding-event-pie" v-show="map2Show"></div>
        <Empty
          v-if="!map2Show"
          :image="simp"
          class="color-[var(--un-ring-offset-color)] m-t-[100px]"
        />
      </Col>
      <Col :span="8">
        <div id="pie3" class="pedding-event-pie" v-show="map3Show"></div>
        <Empty
          v-if="!map3Show"
          :image="simp"
          class="color-[var(--un-ring-offset-color)] m-t-[100px]"
        />
      </Col>
    </Row>
    <Row justify="space-between" class="p-b-[16px]">
      <Col :span="13" />
      <Col :span="4.5">
        <Button type="primary" :disabled="selectedRowkeys.length == 0" @click="visibleHandleModal()"
          >批量处理</Button
        >
        <Button type="primary" @click="switchWhiteListModal = true" class="mx-2">白名单</Button>
        <Button type="primary" @click="toSwitchStatusModal">警告合并</Button>
      </Col>
    </Row>
    <Table
      size="small"
      :row-selection="{
        selectedRowKeys: selectedRowkeys,
        onChange: (e) => {
          selectedRowkeys = e as any
        }
      }"
      :columns="columns"
      :data-source="data.list"
      @change="handleChange"
      bordered
      :pagination="pagin1"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'oparetion'">
          <Button type="link" @click="visibleHandleModal(record.key)">处置</Button>
          <Popconfirm title="是否信任该事件" @confirm="trust(record)">
            <Button type="link">信任</Button></Popconfirm
          >
          <template v-if="record.threatLeval != '高风险' && record.compose">
            <Button type="link" @click="merge(record.key)">合并详情</Button>
          </template>
        </template>
        <template v-if="column.dataIndex === 'threatLeval'">
          <Tag :color="colorTable[record.threatLeval]">
            {{ record.threatLeval }}
          </Tag>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <Row v-for="item of Object.keys(record.details)" :key="item.index">
          <Col :span="4" class="text-start pl-3">
            {{ item }}
          </Col>
          <Col :span="20" class="text-start">
            {{ record.details[item] }}
          </Col>
        </Row>
      </template>
    </Table>
  </div>
  <Modal width="88%" v-model:visible="MergeStatus" title="合并详情" :footer="false">
    <Table
      :columns="mergeColumns"
      :data-source="mergeTabData.list"
      bordered
      :pagination="pagin2"
      row-key="details"
      @change="handleMergePage"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'threatLeval'">
          <Tag :color="colorTable[record.threatLeval]">
            {{ record.threatLeval }}
          </Tag>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <Row v-for="item of Object.keys(record.details)" :key="item.index">
          <Col :span="4" style="text-align: start; padding-left: 30px" :key="item.index">
            {{ item }}
          </Col>
          <Col :span="20" style="text-align: start">
            {{ record.details[item] }}
          </Col>
        </Row>
      </template>
    </Table>
  </Modal>

  <Modal width="66%" v-model:visible="switchWhiteListModal" :footer="false" title="白名单">
    <WhiteList />
  </Modal>
  <Modal v-model:visible="switchHandleModal" title="处理事件">
    <template #footer>
      <Button type="primary" @click="handleOk" :disabled="!ready2handle">确认</Button>
    </template>
    <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <FormItem label="处置人" :rules="[{ required: true, message: '必填' }]">
        <Input v-model:value="handler" :maxlength="24" placeholder="请填写处置人" />
      </FormItem>
      <FormItem label="处置信息" :rules="[{ required: true, message: '必填' }]">
        <Input v-model:value="handleInfo" :maxlength="160" placeholder="请填写处置信息" />
      </FormItem>
    </Form>
  </Modal>
  <Modal width="36%" v-model:visible="switchStatusModal" title="合并警告" footer="">
    <FormItem label="是否合并警告">
      <Switch v-model:checked="screenStatus" @change="handleScreenStatusChange" />
    </FormItem>
  </Modal>
</template>

<script lang="ts" setup>
import {
  Row,
  Col,
  Button,
  Table,
  Tag,
  Modal,
  Input,
  FormItem,
  Form,
  Switch,
  Popconfirm,
  Empty,
  message
} from 'ant-design-vue'
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import WhiteList from './WhiteList.vue'
import {
  bigScreenStatus,
  detail,
  updateUnTreatEvent,
  trustEventWhitelist,
  updateBigScreenStatus
} from '../../../service/Form'
import { useFormStore } from '../../../model/form'
import { columns, mergeColumns } from './colums'
import { getPagin } from '../../../utils/pagination'
import { listType } from '../../../types/disposedAssetType'

// 若使用echarts时需要设置dom宽高为百分比且dom一开始不加载（v-show） 则必须满足一些条件 可以使用在init前使用js手动设置 设置时机需要在init前以及window.resize 比较繁琐
// 因此直接设置默认dom都加载，待网络请求结束后再隐藏
const map1Show = ref(true)
const map2Show = ref(true)
const map3Show = ref(true)
// ant Empty组件模式
const simp = Empty.PRESENTED_IMAGE_SIMPLE
const colorTable = {
  高风险: '#ff3e32',
  中风险: '#ff9432',
  低风险: '#ffcd32',
  信息: '#1890ff',
  成功: '#32ff90'
}
let { data } = useFormStore()
const handler = ref(''),
  handleInfo = ref(''),
  switchWhiteListModal = ref(false),
  switchHandleModal = ref(false),
  screenStatus = ref(false),
  switchStatusModal = ref(false),
  MergeStatus = ref(false)
const parentFunc = defineEmits(['query'])
const parentProps = defineProps<{ map1: any; map2: any; map3: any }>()

watch(
  parentProps,
  async () => {
    data.current = 1
    data.pageSize = 10
    data.sort = 'createTime,desc'
    // 防止首次有数据时dom使用v-show还未渲染 echarts得不到dom高宽 等待页面dom加载完成后再立刻判断是否有数据
    await nextTick()
    map1Show.value = parentProps.map1 > 0
    map2Show.value = parentProps.map2 > 0
    map3Show.value = parentProps.map3 > 0
  },
  {
    immediate: true,
    deep: true
  }
)

const handleChange = (e, _filter, sorter) => {
  data.pageSize = e.pageSize
  data.current = e.current
  if (sorter.order != undefined) {
    data.sort = 'createTime,' + (sorter.order as string).match(/(.*)end/)![1]
  }
  parentFunc('query')
}

const ready2handle = computed(() => {
  return handler.value != '' && handleInfo.value != ''
})
const pagin1 = computed(() => ({
  current: data.current,
  showSizeChanger: true,
  defaultPageSize: data.pageSize,
  total: data.total,
  showQuickJumper: true,
  showTotal: () => `共${data.total}条信息`
}))
let tempId: number
const visibleHandleModal = (id?: number) => {
  switchHandleModal.value = true
  handler.value = ''
  handleInfo.value = ''
  tempId = id ?? -1
}
const mergeTabData = reactive<{
  list: listType[]
  pageSize: number
  current: number
  total: number
}>({ list: [], pageSize: 10, current: 1, total: 0 })
const handleOk = () => {
  updateUnTreatEvent({
    treatBy: handler.value,
    treatDescription: handleInfo.value,
    treatIdList: tempId == -1 ? selectedRowkeys.value : [tempId]
  }).then(() => {
    //处置后再次获取页面数据
    data.current = 1
    selectedRowkeys.value = []
    parentFunc('query')
    message.success('操作成功')
  })
  switchHandleModal.value = false
}

const toSwitchStatusModal = () => {
  switchStatusModal.value = true
}

onMounted(() => {
  bigScreenStatus().then((res) => {
    screenStatus.value = res.code == 0 ? true : false
  })
})

const handleScreenStatusChange = () => {
  updateBigScreenStatus({
    code: screenStatus.value ? 0 : 1,
    createTime: '2021-11-02T09:03:17.000+0800',
    entityName: 'isBigScreen',
    id: 2,
    intInfo: null,
    name: '是否开启大屏数据模式（合并处置中心报警）',
    updateTime: new Date().toISOString()
  }).then((_) => {
    message.success('操作成功')
  })
}

//多选选中行
let selectedRowkeys = ref<number[]>([])
const merge = async (id) => {
  await getMergeData(id)
  MergeStatus.value = true
}
let tempID = 0
const getMergeData = async (id: number, sort?: string) => {
  tempID = id
  await detail({ size: mergeTabData.pageSize, page: mergeTabData.current, id: id, sort }).then(
    (res: { totalElements: number; content }) => {
      mergeTabData.total = res.totalElements
      let id = 1 + (mergeTabData.current - 1) * mergeTabData.pageSize
      const riskTable = ['高风险', '中风险', '低风险', '信息']
      mergeTabData.list = res.content.map((value) => {
        //转换时间格式 从iso格式 到 YYYY-MM-DD hh-mm-ss
        let timeReg = /(.{10})T(.{8})\./
        let time =
          value['@timestamp'].match(timeReg)![1] + ' ' + value['@timestamp'].match(timeReg)![2]
        return {
          index: id++,
          time,
          srouceName: value.srcName ?? '-',
          targetName: value.dstName ?? '-',
          eventName: value.eventName ?? '-',
          eventType: value.eventType ?? '-',
          assetsName: value.deviceName ?? '-',
          agreement: value.appProtocol ?? '-',
          threatLeval: riskTable[value.eventLevel - 1],
          details: value ?? { '-': '-' }
        }
      })
    }
  )
}

const pagin2 = getPagin(mergeTabData)
const handleMergePage = (e, _filter, sorter) => {
  mergeTabData.current = e.current
  mergeTabData.pageSize = e.pageSize
  getMergeData(
    tempID,
    sorter.order != undefined
      ? 'createTime,' + (sorter.order as string).match(/(.*)end/)![1]
      : undefined
  )
}
const trust = (record) => {
  trustEventWhitelist({ eventStore: { id: record.details.eventId } })
    .then((_) => {
      parentFunc('query')
      message.success('操作成功')
      selectedRowkeys.value = []
    })
    .catch((_) => {
      message.error('操作失败')
    })
}
</script>
<style scoped>
.pedding-event-pie {
  width: 100%;
  height: 250px;
}

.pedding-event-form {
  margin: 0 2vw;
  padding: 10px;
  border-radius: 0.5em;
}

.pedding-event-but {
  margin: 10px;
  cursor: pointer;
}
</style>
