<template>
  <Modal title="核查结果" v-model:open="dialogVisible" @cancel="closeModal" :width="1920" :footer="null">
    <Spin :spinning="loading">
      <Form layout="inline" class="flex-end mb-4">
        <FormItem>
          <Button @click="downloadFile">
            <i class="i-base-download align-icon" />
            <span>下载核查清单</span>
          </Button>
        </FormItem>
        <Dropdown>
          <Button type="primary">导出核查结果<i class="i-base-down align-icon" /></Button>
          <template #overlay>
            <Menu>
              <MenuItem @click="downloadCompareXlsx">导出为.xlsx</MenuItem>
              <MenuItem @click="downloadCompare">导出为.pdf</MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </Form>

      <!-- <Tabs v-model:active-key="tabsKey">
        <TabPane key="compared" tab="核查资产">
        </TabPane>
        <TabPane key="unCompared" tab="未核查资产">
        </TabPane>
      </Tabs> -->

      <div id="cpmpare-asset-print-element" class="overflow-y-auto">
        <div class="w-full flex flex-wrap" v-show="tabsKey === 'compared'">
          <div class="flex-1">
            <div class="head">导入资产清单</div>
            <AssetTable :data-list="importDataList"></AssetTable>
          </div>
          <div class="line"></div>
          <div class="flex-1">
            <div class="head">资产清单</div>
            <AssetTable :data-list="compareDataList"></AssetTable>
          </div>
        </div>

        <!-- <div class="w-full" v-show="tabsKey === 'unCompared' || isPrint">
          <Divider v-show="isPrint">未核查资产</Divider>
          <AssetTable :data-list="uncompareDataList"></AssetTable>
        </div> -->
      </div>
    </Spin>


    <template #footer>
      <Button @click="closeModal">取消</Button>
    </template>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue'
import type { AssetCompareRecord } from '../../model/compare';
import type { CompareAsset } from './types'
/* 第三方模块 */
import { ref, watch } from 'vue'
import { Modal, message, Form, FormItem, Button, Dropdown, Menu, MenuItem, Spin } from 'ant-design-vue';
import { useVModel, downloadByData, isEmptyValue } from '@guolisec/utils';
import JsPDF from "jspdf";
import html2canvas from "html2canvas";
/* 本地模块 */
import AssetTable from './AssetTable.vue';
import { downloadApi, checkCompareApi, downloadCompareXlsxApi } from '../../model/compare'

/********************** 外部状态或配置 **********************/

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object as PropType<AssetCompareRecord>,
  }
});

const emit = defineEmits(['update:visible', 'refresh']);

/********************** 初始化状态 **********************/

const loading = ref<boolean>(false);

watch(
  () => props.visible,
  (v) => {
    if (v) {
      loading.value = false
      getDataList()
    }
  },
)

/********************** 弹窗 **********************/

const dialogVisible = useVModel(props, 'visible', emit)

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}

/********************** 下载文件 **********************/

// 下载资产核查清单

async function downloadFile() {
  if (!props.current) {
    return
  }
  loading.value = true
  try {
    // loading.value = true
    const data = await downloadApi({
      id: props.current.id
    })
    downloadByData(data, props.current.fileName, data.type)
    message.success('导出成功')
  } finally {
    loading.value = false
  }
}

// 下载对比文件
const isPrint = ref(false)

async function downloadCompare() {
  if (!props.current) {
    return
  }
  const current = props.current
  printPdf(current)
}

function printPdf(current: AssetCompareRecord) {
  const element = document.querySelector<HTMLElement>('#cpmpare-asset-print-element')
  if (!element) {
    return
  }
  loading.value = true
  isPrint.value = true
  let timer = setTimeout(() => {
    html2canvas(element, {
      allowTaint: true,
      height: element.scrollHeight,
      windowHeight: element.scrollHeight
    }).then(function (canvas) {
      let contentWidth = canvas.width;
      let contentHeight = canvas.height;
      let pageHeight = (contentWidth / 592.28) * 840;
      let leftHeight = contentHeight;
      let position = 0;
      let imgWidth = 595.28;
      let imgHeight = (592.28 / contentWidth) * contentHeight;
      let pageData = canvas.toDataURL("image/jpeg", 1.0);
      let PDF = new JsPDF(undefined, "pt", "a4");
      if (leftHeight < pageHeight) {
        PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 840;
          if (leftHeight > 0) {
            PDF.addPage();
          }
        }
      }
      PDF.save(current.fileName.split('.xlsx')[0] + "核查结果" + ".pdf");
      loading.value = false;
      isPrint.value = false
      timer && clearTimeout(timer)
    });
  }, 2000)
}

// 下载资产核查结果
const downloadCompareXlsxLoading = ref(false)
async function downloadCompareXlsx() {
  if (!props.current) {
    return
  }
  try {
    downloadCompareXlsxLoading.value = true
    const data = await downloadCompareXlsxApi({
      id: props.current.id
    })
    downloadByData(data, props.current.fileName.split('.xlsx')[0] + "对比详情.xlsx", data.type)
    message.success('导出成功')
  } finally {
    downloadCompareXlsxLoading.value = false
  }
}

/********************** tabs **********************/

const tabsKey = ref('compared') // 值为资产状态


/********************** 表格 **********************/

const importDataList = ref<CompareAsset[]>([]);
const compareDataList = ref<CompareAsset[]>([]);
// const uncompareDataList = ref<IAsset[]>([]);

/**
 * 查询
 */
async function getDataList() {
  if (!props.current) {
    return
  }
  loading.value = true;
  try {
    const { commonList, unCommonList } = await checkCompareApi({
      id: props.current.id
    });
    markCommonList(commonList)
    importDataList.value = commonList
    // compareDataList.value = commonList.map(i => i.asset)
    // uncompareDataList.value = unCommonList
    const rightList = unCommonList.map(item => {
      return {
        ...item,
        assetIpMark: true,
        assetMacMark: true,
        nameMark: true,
        assetTypeNameMark: true,
        trademarkNameMark: true,
        assetSeriesNameMark: true,
        rowMark: true,
      }
    })
    compareDataList.value = commonList.map(i => i.asset).concat(rightList)
    for (let index = 0; index < unCommonList.length; index++) {
      importDataList.value.push({
        assetIp: '',
        assetMac: '',
        name: '',
        assetTypeName: '',
        trademarkName: '',
        assetSeriesName: '',
      })
    }
  } finally {
    loading.value = false;
  }
}

// 标记不同的数据
function markCommonList(commonList) {
  const array = ['assetIp', 'assetMac', 'name', 'assetTypeName', 'trademarkName', 'assetSeriesName']
  commonList.forEach(item => {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      const parent = item[element]
      const child = item.asset[element]
      const key = element + 'Mark'
      if (parent !== child) {
        item.rowMark = !isEmptyValue(parent) || !isEmptyValue(child)
        item.asset.rowMark = !isEmptyValue(parent) || !isEmptyValue(child)
        item[key] = true
        item.asset[key] = true
      }
    }
  })
}
</script>
<style scoped>
.line {
  width: 2px;
  margin: 0 5px;
  background: whitesmoke;
}

.head {
  font-weight: bold;
  text-align: center;
  background-color: whitesmoke;
  padding: 15px 0;
  border-bottom: solid 1px #ebebeb;
}
</style>
