<template>
  <div class="topology-editor relative">
    <header class="flex justify-between items-center pr-2 bg-$color-bg-base h-[64px]">
      <div>
        <PageHeader :title="topologyInfo.topoName" @back="handleBack">
          <template #subTitle>
            <Tag color="blue" v-if="topologyInfo.mainTopo">基线</Tag>
          </template>
        </PageHeader>
      </div>
      <div class="space-x-2">
        <Button @click="handleMainTopo" :disabled="topologyInfo.mainTopo">{{
          topologyInfo.mainTopo ? '已为基线' : '设为基线'
        }}</Button>
        <Button type="primary" @click="goTopologyEditor">编辑拓扑图</Button>
        <Dropdown>
          <Button>
            导出
            <i class="i-base-arrow-down-s-line align-icon ml-1"></i>
          </Button>
          <template #overlay>
            <Menu @click="handleDropdownMenu">
              <MenuItem key="png">
              为.png
              </MenuItem>
              <!-- 注释掉原因请看 BUG: 13011 -->
              <!-- <MenuItem key="json">
              为 .json
              </MenuItem> -->
              <MenuItem key="pdf">
              为.pdf
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
        <Button @click="handleDeleteTopology" danger :disabled="topologyInfo.mainTopo">删除</Button>
      </div>
    </header>
    <div class="p-4">
      <div class="flex relative w-full p-4">
        <div class="flex w-full">
          <!-- 左边区域 -->
          <div class="flex flex-col space-y-6 max-w-80 w-[300px] text-sm">
            <!-- 左上 -->
            <div class="bg-$color-bg-base p-6 min-h-40 space-y-4">
              <div class="flex items-center justify-between ">
                <div class="font-bold text-base">{{ topologyInfo.topoName }}</div>
                <Button size="small" @click="handleModifyTopology(topologyInfo)" class="flex items-center !w-32px !h-32px">
                  <i class="i-base-edit text-base"></i>
                </Button>
              </div>
              <!-- 拓扑描述 -->
              <div class="leading-[22px] break-words max-h-[66px] overflow-auto">
                {{ topologyInfo.description }}
              </div>
              <div class="font-bold ">包含资产组</div>
              <div class="leading-[22px] max-h-[66px] break-words overflow-auto">
                {{ topologyInfo.assetGroup.map(i => i.label).join('、') }}
              </div>
            </div>
            <!-- 左下 -->
            <div class="flex-1 bg-$color-bg-base p-6 space-y-4">
              <div class="font-bold text-base">拓扑元素</div>
              <div class="flex">
                <div class="flex flex-col items-center w-1/3 space-y-1">
                  <div class="color-slate-500">
                    <span>L</span>
                    <span>1</span>
                  </div>
                  <div class="font-bold text-xl">{{ level1.length }}</div>
                </div>
                <div class="flex flex-col items-center w-1/3 space-y-1">
                  <div class="color-slate-500">
                    <span>L</span>
                    <span>2</span>
                  </div>
                  <div class="font-bold text-xl">{{ level2.length }}</div>
                </div>
                <div class="flex flex-col items-center w-1/3 space-y-1">
                  <div class="color-slate-500">
                    <span>L</span>
                    <span>3</span>
                  </div>
                  <div class="font-bold text-xl">{{ level3.length }}</div>
                </div>
              </div>
              <Input v-model:value="queryForm.name" placeholder="搜索资产名称">
              <template #prefix>
                <i class="i-base-search"></i>
              </template>
              </Input>
              <div class="min-h-80">
                <Menu @select="handleMenuSelect" @click="handleDeSelect" v-model:selectedKeys="selectedKeys">
                  <MenuItem v-for="item in dataList" :key="item.id">
                  <template #icon>
                    <i class="i-base-other"></i>
                  </template>
                  {{ item.data?.name }}
                  </MenuItem>
                </Menu>
              </div>

              <SimplePagination class="mt-2" v-model:page="currentPage" :total="total" :size="pageSize"
                @change="handleChangePage" />
            </div>
          </div>

          <!--  画布区:START  -->
          <div class="topology-canvas mx-4 flex-1 bg-$color-bg-base">
            <TopologyViewCanvas ref="topologyViewRef" :data="graphData" />
          </div>
          <!--  画布区:END  -->
        </div>
      </div>
    </div>

    <div class="fixed left-[100000px] w-1000 h-1000 z-[-999]">
      <TopologyViewCanvas ref="downloadTopologyViewRef" :data="graphData" />
    </div>


    <ModalUpdateTopologyInfo v-model:visible="updateVisible" :current="current" mode="modify"
      @refresh="getTopologyData" />
  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted, ref } from 'vue'
import { Button, Tag, PageHeader, Input, Menu, MenuItem, message, Modal, Dropdown } from 'ant-design-vue'
import type { TopologyInfo } from '../../types';
import { topologyInfoFactory } from '../../model/store';
import { useRouter } from "@guolisec/routerable";
import SimplePagination from '../editor/element/SimplePagination.vue';
import TopologyViewCanvas from './TopologyViewCanvas.vue'
import { getTopologyId, getTopoInformationById, transformInformation, getAllAssetNodeConfigList } from '../../service/getTopologyInfo';
import ModalUpdateTopologyInfo from '../list/ModalUpdateTopologyInfo.vue';
import {
  deleteTopoInformationApi,
  setMainTopoApi,
} from '../../model/list'

onMounted(() => {
  getTopologyData()
})

const topologyInfo = ref<TopologyInfo>(topologyInfoFactory())

const graphData = computed(() => {
  return transformInformation(topologyInfo.value.information)
})

async function getTopologyData() {
  const id = getTopologyId()
  topologyInfo.value = await getTopoInformationById(id)
}

function handleBack() {
  const router = useRouter()
  router.push({
    name: 'TopologyList',
  })
}

async function goTopologyEditor() {
  const id = getTopologyId()
  const router = useRouter()
  router.push({
    name: 'TopologyEditor',
    query: {
      id: id
    }
  })
}

// 导出
const downloadTopologyViewRef = ref<InstanceType<typeof TopologyViewCanvas>>()
function handleDropdownMenu(event) {
  if (!event?.key) return
  switch (event.key) {
    case 'png':
      downloadTopologyViewRef.value?.exportPng(topologyInfo.value.topoName)
      break;
    case 'json':
      topologyViewRef.value?.exportJson(topologyInfo.value.topoName)
      break;
    case 'pdf':
      downloadTopologyViewRef.value?.exportPdf(topologyInfo.value.topoName)
      break;
  }
}
/**********************  **********************/

const updateVisible = ref(false)
const current = ref<TopologyInfo>()
const mode = ref('modify')
async function handleModifyTopology(record) {
  current.value = record
  mode.value = 'modify'
  updateVisible.value = true
}

async function handleMainTopo() {
  if (!topologyInfo.value.id) {
    console.warn('设置主拓扑失败,未找到拓扑id')
    return
  }
  await setMainTopoApi(topologyInfo.value.id)
  getTopologyData()
}

async function handleDeleteTopology() {
  if (!topologyInfo.value.id) {
    console.warn('删除主拓扑失败,未找到拓扑id')
    return
  }
  Modal.confirm({
    iconType: "warning",
    title: '提示',
    content: '确认删除该拓扑？',
    async onOk() {
      const msg: string = await deleteTopoInformationApi({
        ids: [topologyInfo.value.id]
      })
      message.success(msg || '删除成功');
      handleBack()
    },
  })
}

/********************** 已选资产逻辑 **********************/
const selectedKeys = ref<(string | number)[]>([])
const queryForm = ref<{
  name: string
}>({
  name: '',
})
const nodeList = computed(() => {
  return graphData.value.nodes ? getAllAssetNodeConfigList(graphData.value.nodes) : []
})
const afterSearchDataList = computed(() => {
  return nodeList.value.filter(i => i.data && i.data.name.indexOf(queryForm.value.name) !== -1)
})
const dataList = computed(() => {
  return afterSearchDataList.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

// L1层资产
const level1 = computed(() => {
  return nodeList.value.filter((data) => {
    return data.data?.layer === 1
  })
})

// L2层资产
const level2 = computed(() => {
  return nodeList.value.filter((data) => {
    return data.data?.layer === 2
  })
})
// L3层资产
const level3 = computed(() => {
  return nodeList.value.filter((data) => {
    return data.data?.layer === 3
  })
})

const total = computed(() => {
  return afterSearchDataList.value.length
})
const currentPage = ref(1)
const pageSize = ref(7)

// 页码改变
function handleChangePage(page: number) {
  currentPage.value = page
}
const topologyViewRef = ref<InstanceType<typeof TopologyViewCanvas>>()

function handleMenuSelect(value) {
  topologyViewRef.value?.focusAssetNode(value.key)
}

function handleDeSelect(value) {
  const key = value.key as string
  if (selectedKeys.value.includes(key)) {
    selectedKeys.value = []
    topologyViewRef.value?.clearFocus()
  }
}
</script>
<style scoped>
.topology-canvas {
  flex: 1 0 auto;
  height: calc(100vh - 240px);
  overflow: hidden;
}
</style>