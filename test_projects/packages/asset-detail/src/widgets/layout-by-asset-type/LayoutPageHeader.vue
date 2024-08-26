<!--
 * @name: 资产详情导航头
 * @description: Do not edit
-->
<template>
  <div @click="handleBack" class="flex items-center ml-3 space-x-4 text-base h-[64px]">
    <i class="i-base-arrow-left cursor-pointer"></i>
    <span class="font-bold text-md">{{ asset.name }}</span>
  </div>
</template>

<script lang='ts' setup>
import { useRouter } from '@guolisec/routerable'
import { useAssetInfoStore } from '../../entry/store'

const { asset } = useAssetInfoStore()

function handleBack() {
  const router = useRouter()
  router.go(-1)
}

</script>