<!--
 * @name: 知识库升级
 * @description: Do not edit
 * @date: 2023-09-19 09:36:35
 * @path: \feature-vue\platform\front\knowledge-upgrade\src\views\index.vue
-->
<template>
    <div class="space-y-4">
        <Form layout="inline">
            <FormItem>
                <Upload :show-upload-list="false" :disabled="state.uploading" accept=".bin" :before-upload="beforeUpload"
                    :custom-request="handleUpload" :max-count="1">
                    <Button :disabled="state.uploading" :loading="state.uploading">
                        上传
                    </Button>
                </Upload>
            </FormItem>
        </Form>
        <Divider></Divider>
        <Spin :spinning="spinning">
            <div class="knowledge-upgrade  grid grid-cols-3 gap-4">
                <UpgrateItem v-for="item in knowledgeBaseData" :data="item" :key="item.id" @loading="handleLoading" />
            </div>
        </Spin>
    </div>
</template>   

<script setup lang="ts">
/* 类型文件 */
/* 第三方模块 */
import { reactive, ref, type PropType } from 'vue'
import {
    Form,
    FormItem,
    Upload,
    Button,
    Divider,
    notification,
    message,
    Spin
} from 'ant-design-vue';
/* 本地共享模块 */
/* 业务模块 */
import { importKnowledgeBaseNoLicenseApi } from '../model/upgrade'
import UpgrateItem from './UpgrateItem.vue';
import { useKnowledgeUpgrade } from '../controller/useKnowledgeUpgrade'
import { provideUpgradeKnowledgeContext } from '../utils'

const props = defineProps({
    noLicense: {
        type: Boolean,
        dedault: false
    },
    sn: {
        type: String as PropType<'csmp' | 'sid' | 'ahm'>,
        dedault: 'csmp'
    },
    limitLibs: {
        type: Array<string>,
        dedault: () => {
            return []
        }
    },
})

const spinning = ref(false)

function handleLoading(loading) {
    spinning.value = loading
}

let { knowledgeBaseData, getKnowledgeBaseData } = useKnowledgeUpgrade(props)
const state = reactive({
    uploading: false, // 上传状态
    isDisable: false, // 升级按钮是否可以点击
});

provideUpgradeKnowledgeContext({
    noLicense: props.noLicense,
    sn: props.sn,
})

// 文件上传之前
const beforeUpload = (file) => {
    let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
    if (extension.toLowerCase() !== 'bin') {
        notification.warning({
            message: '警告',
            description: '只能上传bin文件',
        });
        return false;
    }
    // 如果存在指定的库，需要对比上传的文件名是否在指定的库中
    if (props.limitLibs?.length ?? 0 > 0) {
        const allow = props.limitLibs?.some(item => {
            return file.name.toLowerCase().includes(item)
        })
        const dict = {
            devices: '设备库',
            vuls: '漏洞库',
            rules: '特征库',
            protos: '协议库',
            events: '事件库',
        }
        const libNames = props.limitLibs?.map(item => {
            return dict[item]
        }).join()
        if (!allow) {
            notification.warning({
                message: '警告',
                description: `只能上传 ${libNames} 文件`,
            });
            return false
        }
    }
};

// 文件上传
async function handleUpload(e) {
    try {
        state.uploading = true;
        let data = new FormData();
        data.append('multipartFile', e.file);
        await importKnowledgeBase(data)
        message.success('导入成功');
        getKnowledgeBaseData();
    } finally {
        state.uploading = false;
    }
}

async function importKnowledgeBase(data) {
    // return props.noLicense ? await importKnowledgeBaseNoLicenseApi(data) : await importKnowledgeBaseApi(data)
    return await importKnowledgeBaseNoLicenseApi(data)
}
</script>