<!--
 * @name: 首页
 * @description: 404 not found
-->
<template>
  <div>
    111
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { clearBrowserUrlQuery } from '../../../src/url'
import { encrypt } from '../../../src/encrypt/encrypt.ts'

onMounted(() => {
  clearBrowserUrlQuery('hash')
  console.log('12121', encrypt('werwer', '323423423'));
})

</script>
