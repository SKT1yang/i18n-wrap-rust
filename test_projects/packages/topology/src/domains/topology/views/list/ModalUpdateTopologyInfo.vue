<!--
 * @name: 编辑网络拓扑图基本信息弹窗
 * @description: Do not edit
 * @date: 2023-02-16 09:19:15
 * @path: \feature-vue\platform\front\topology\src\domains\topology\views\list\ModalUpdateTopologyInfo.vue
-->
<template>
  <Modal :title="title" v-model:open="dialogVisible" @cancel="closeModal" centered>
    <Form ref="formRef" :model="dataForm" :rules="rules" :label-col="{ span: 6 }" class="mt-6">
      <FormItem name="topoName" label="拓扑图名称:">
        <Input v-model:value.trim="dataForm.topoName" show-count :maxlength="20" placeholder="请输入网络拓扑图名称" />
      </FormItem>
      <FormItem name="description" label="拓扑图说明:">
        <Textarea v-model:value="dataForm.description" show-count :maxlength="100" :auto-size="{ minRows: 3, maxRows: 3 }"
          placeholder="请输入网络拓扑图说明" />
      </FormItem>
      <template v-if="mode === 'create'">
        <FormItem label="新建画布:">
          <RadioGroup v-model:value="createType">
            <Radio value="default">空白画布</Radio>
            <Radio value="copy">现有拓扑副本</Radio>
          </RadioGroup>
        </FormItem>
      </template>
      <FormItem name="assetGroupIds" label="包含资产组:" v-if="createType === 'default'">

        <RadioGroup v-model:value="assetGroupType" class="my-2" v-if="mode === 'create'">
          <Radio value="all" class="flex h-[22px] leading-[22px] mb-2">全部资产组</Radio>
          <Radio value="part">指定资产组</Radio>
        </RadioGroup>

        <SelectTreeAssetGroup class="min-w-30" v-model:value="dataForm.assetGroupIds"
          :disabled="mode === 'modify' || assetGroupType === 'all'" :options="assetGroupOptions" />

      </FormItem>
      <template v-if="mode === 'create'">
        <FormItem name="sourceTopoId" label="新建自:" v-if="createType === 'copy'">
          <Select class="min-w-30" v-model:value="dataForm.sourceTopoId" :options="copyTopoOptions"
            placeholder="选择一张网络拓扑图以创建副本" :field-names="{ label: 'topoName', value: 'id' }" />
        </FormItem>
      </template>
    </Form>

    <Alert type="warning" show-icon class="mt-4" message="拓扑图包含的资产组新建后不可修改，请谨慎选择！" v-if="mode === 'create'" />

    <template #footer>
      <Button @click="closeModal">取消</Button>
      <Button type="primary" @click="handleSubmit">{{ mode === 'create' ? '新建' : '确认编辑' }}</Button>
    </template>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
import { PropType } from 'vue'
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from "ant-design-vue/es/form";
import type { TopologyInfo, TopologyQuery } from "../../types";
import type { IAssetGroupTreeItem } from '@guolisec/types';
/* 第三方模块 */
import { ref, watch, computed } from 'vue'
import { message } from '@guolisec/toast'
import { Modal, Form, FormItem, Input, Button, Textarea, Radio, RadioGroup, Select, Alert } from 'ant-design-vue';
import { useVModel } from '@guolisec/utils';
/* 本地模块 */
import { createTopoInformationApi, modifyTopoInformationApi, getAssetGroupTreeApi, getTopoInformationListApi } from '../../model/list'
import SelectTreeAssetGroup from './SelectTreeAssetGroup.vue';

/********************** 外部状态或配置 **********************/

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object as PropType<TopologyInfo>,
  },
  mode: {
    type: String as PropType<'modify' | 'create'>,
    default: 'create'
  }
});

const emit = defineEmits(['update:visible', 'refresh']);

/********************** 初始状态 **********************/

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      formRef.value?.resetFields()
      createType.value = 'default'
      if (props.mode === 'modify' && props.current) {
        dataForm.value.id = props.current.id
        dataForm.value.topoName = props.current.topoName
        dataForm.value.description = props.current.description
        dataForm.value.assetGroupIds = props.current.assetGroup.map(i => String(i.id))
        dataForm.value.information = props.current.information
        dataForm.value.mainTopo = props.current.mainTopo
      } else if (props.mode === 'create') {
        getAssetGroupOfAllData()
        assetGroupType.value = 'all'
        getTopoListData()
      }
    }
  },
)

/********************** 弹窗 **********************/

const dialogVisible = useVModel(props, 'visible', emit)

const title = computed(() => {
  return props.mode === "create" ? `新建网络拓扑图` : '编辑网络拓扑图信息'
})

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}

/********************** 表单 **********************/

const formRef = ref<FormInstance>()

const dataForm = ref<TopologyQuery>({
  information: "{}",
  assetGroupIds: [],
  topoName: "",
  mainTopo: false,
  description: "",
  sourceTopoId: undefined
});

const rules = ref<Record<string, Rule[]>>({
  topoName: [
    { required: true, min: 2, max: 20, message: "长度为 2-20 个字符", trigger: "blur" },
  ],
  assetGroupIds: [
    {
      validator: async (_rule: Record<string, any>, value: string, _callback: Function) => {
        if (assetGroupType.value === 'part' && value.length === 0) {
          return Promise.reject("选择网络拓扑图中包含的资产组")
        }
      },
      trigger: "blur",
    },
  ],
  sourceTopoId: [
    {
      required: true,
      message: "选择一张网络拓扑图以创建副本",
      trigger: "change",
    },
  ]
});

const createType = ref<'default' | 'copy'>('default')

const assetGroupOptions = ref([])
// 选择拓扑图副本
const copyTopoOptions = ref<TopologyInfo[]>([])

async function getTopoListData() {
  const { content, } = await getTopoInformationListApi({
    size: 10000,
    page: 1,
    name: ''
  });
  copyTopoOptions.value = content
}

/********************** 包含资产组 **********************/
const assetGroupType = ref<'all' | 'part'>('all')

const assetGroupOfAll = ref<string[]>([])
async function getAssetGroupOfAllData() {
  const data = await getAssetGroupTreeApi();
  assetGroupOfAll.value = []
  function traverse(assetGroupList: IAssetGroupTreeItem[]) {
    assetGroupList.forEach(item => {
      if (item.children) {
        traverse(item.children)
      } else {
        assetGroupOfAll.value.push(item.id)
      }
    })
  }

  traverse(data)
}

/********************** 保存结束 **********************/

async function handleSubmit() {
  await formRef.value?.validate()
  // 在创建拓扑时, 判断当前新建画布模式, 对包含资产组做处理
  if (props.mode === 'create' && createType.value === 'default' && assetGroupType.value === 'all') {
    dataForm.value.assetGroupIds = assetGroupOfAll.value
  } else if (props.mode === 'create' && createType.value === 'copy') {
    dataForm.value.assetGroupIds = undefined
  }
  const msg: string = props.mode === 'create' ? await createTopoInformationApi(dataForm.value) : await modifyTopoInformationApi(dataForm.value)
  message.success(msg || '操作成功');
  emit('refresh');
  closeModal();
}
</script>
