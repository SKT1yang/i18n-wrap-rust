<!--
 * @name: 绑定usbkey按钮
 * @description: Do not edit
-->
<template>
  <div class="inline">
    <Button @click="open" type="text" :disabled="disabled">{{ t('绑定 USB Key') }}</Button>
    <ModalUsbKeyBindUser v-model:visible="visible" type="bind" :record="props.record" />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { ref, computed } from 'vue'
import { Button } from 'ant-design-vue'
import ModalUsbKeyBindUser from './ModalUsbKeyBindUser.vue'
import { useGetBindRelation } from '../../../controller/useFisec'
import { enumSnList } from '../../../service/fisec'
import { message } from '@guolisec/toast'
import { t } from '../../../languages/useLanguage'

const props = defineProps({
  record: {
    type: Object as PropType<{
      name?: string
      username?: string
      sn?: string
    }>,
    default: () => {}
  }
})

const visible = ref(false)
async function open() {
  const snList = await enumSnList()
  if (snList.length === 0) {
    message.warning('请插入USB Key')
    return
  }
  visible.value = true
}

const { bindedUsernameList } = useGetBindRelation()
const disabled = computed(() => {
  return Boolean(
    props?.record?.username && bindedUsernameList.value.includes(props.record.username)
  )
})
</script>
