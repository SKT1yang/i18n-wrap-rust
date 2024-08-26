<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-08 13:37:54
 * @path: \permission\test\pages\HomePage.vue
-->
<template>
  <MarginPageWrapper>
    <Button @click="handlePush">跳转</Button>
    <LoginTimeout />
    <PasswordTimeout></PasswordTimeout>
    <DatePicker v-model:value="value"></DatePicker>
  </MarginPageWrapper>
</template> 
<script lang="ts">
import { ref, defineComponent } from 'vue'
import { LoginTimeout, PasswordTimeout, MarginPageWrapper } from '@/index'
import { Button, DatePicker } from 'ant-design-vue';
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
    LoginTimeout,
    PasswordTimeout,
    DatePicker,
    Button,
    MarginPageWrapper
  },
  setup() {
    const router = useRouter()
    function handlePush() {
      router.push({
        name: 'ConfirmAsset'
      })
    }

    return {
      value,
      handlePush,
    }
  }
})

const value = ref('')
</script>

<style scoped>
.box {
  color: #11ff11
}
</style>
