<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-04 22:38:44
 * @path: \graph\src\domain\demo\views\Home.vue
-->

<template>
  <div class="text-5xl">
    <img :src="getProductImageByAssetTypeCode(1, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(2, { type: 'png', status: 'yellow' })" alt="">
    <img :src="getProductImageByAssetTypeCode(3, { type: 'png', status: 'red' })" alt="">
    <img :src="getProductImageByAssetTypeCode(4, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(5, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(6, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(7, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(8, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(9, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(10, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(11, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(12, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(13, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(14, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(15, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(16, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(17, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(18, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(19, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(20, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(21, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(22, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(23, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(24, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(25, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(26, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(27, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(28, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(29, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(30, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(31, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(32, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(33, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(34, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(35, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(36, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(37, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(38, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(39, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(40, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(41, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(42, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(43, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(99, { type: 'png' })" alt="">
    <img :src="getProductImageByAssetTypeCode(2)" alt="" style="color: red;" stroke="#ff00ff">
    <Device :asset-type-code="1" :run-status="0"></Device>
    <Device :asset-type-code="2" :run-status="1"></Device>
    <Device :asset-type-code="3" :run-status="2"></Device>
    <Device :asset-type-code="4" :run-status="2" class="text-green-400"></Device>
    <Device :asset-type-code="5" class="text-green-400"></Device>
    <Device :asset-type-code="6" class="text-green-400"></Device>
    <Device :asset-type-code="7" class="text-green-400"></Device>
    <Device :asset-type-code="8" class="text-green-400"></Device>
    <Device :asset-type-code="9" class="text-green-400"></Device>
    <Device :asset-type-code="10" class="text-green-400"></Device>
    <Device :asset-type-code="11" class="text-green-400"></Device>
    <Device :asset-type-code="12" class="text-green-400"></Device>
    <Device :asset-type-code="13" class="text-green-400"></Device>
    <Device :asset-type-code="14" class="text-green-400"></Device>
    <Device :asset-type-code="15" class="text-green-400"></Device>
    <Device :asset-type-code="16" class="text-green-400"></Device>
    <Device :asset-type-code="17" class="text-green-400"></Device>
    <Device :asset-type-code="18" class="text-green-400"></Device>
    <Device :asset-type-code="19" class="text-green-400"></Device>
    <Device :asset-type-code="20" class="text-green-400"></Device>
    <Device :asset-type-code="21" class="text-green-400"></Device>
    <Device :asset-type-code="22" class="text-green-400"></Device>
    <Device :asset-type-code="23" class="text-green-400"></Device>
    <Device :asset-type-code="24" class="text-green-400"></Device>
    <Device :asset-type-code="25" class="text-green-400"></Device>
    <Device :asset-type-code="26" class="text-green-400"></Device>
    <Device :asset-type-code="27" class="text-green-400"></Device>
    <Device :asset-type-code="28" class="text-green-400"></Device>
    <Device :asset-type-code="29" class="text-green-400"></Device>
    <Device :asset-type-code="30" class="text-green-400"></Device>
    <Device :asset-type-code="31" class="text-green-400"></Device>
    <Device :asset-type-code="32" class="text-green-400"></Device>
    <Device :asset-type-code="33" class="text-green-400"></Device>
    <Device :asset-type-code="34" class="text-green-400"></Device>
    <Device :asset-type-code="35" class="text-green-400"></Device>
    <Device :asset-type-code="36" class="text-green-400"></Device>
    <Device :asset-type-code="37" class="text-green-400"></Device>
    <Device :asset-type-code="38" class="text-green-400"></Device>
    <Device :asset-type-code="39" class="text-green-400"></Device>
    <Device :asset-type-code="40" class="text-green-400"></Device>
    <Device :asset-type-code="41" class="text-green-400"></Device>
    <Device :asset-type-code="42" class="text-green-400"></Device>
    <Device :asset-type-code="43" class="text-green-400"></Device>
    <Device :asset-type-code="99" class="text-green-400"></Device>
    <Device :asset-type-code="index" class="text-yellow-400"></Device>
    <Button @click="handleClick">切换</Button>
    <img :src="imgUrl" alt="">
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'ant-design-vue';
import { getProductImageByAssetTypeCode } from '@/index'
import { Device } from '@/index'
import base from '@iconify-icons/base'
import publicCloud from "@/device/0/other-normal.svg?url";
import publicCloud1 from "@/device/0/other-normal.svg";
const index = ref(0)
const imgUrl = ref('')
function handleClick() {
  index.value++
  console.log(base.icons['4k-fill'], 'base')
  imgUrl.value = convertSVGToImage()
  console.log('imgUrl.value', imgUrl.value, publicCloud, publicCloud1)
}


function convertSVGToImage() {
  const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
${base.icons['4k-fill'].body.replace('currentColor', '#ff0000')}
</svg>`
  const blob = new Blob([svg], {
    type: 'image/svg+xml'
  })

  return URL.createObjectURL(blob)
}
</script>