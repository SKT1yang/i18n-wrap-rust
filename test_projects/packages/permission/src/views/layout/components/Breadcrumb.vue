<!--
 * @name: 面包屑
 * @description: Do not edit
-->
<template>
  <nav class="ml-4 text-gray-400">
    <ol class="flex flex-wrap">
      <li v-for="(route, index) in routes" :key="index">
        <span>{{ route.breadcrumbName }}</span>
        <span class="m-inline-2" v-if="index < routes.length - 1">{{ separator }}</span>
      </li>
    </ol>
  </nav>
</template>
<script lang="ts" setup>
/* 类型文件 */

/* 第三方模块 */
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

/* 本地共享模块 */
/* 业务模块 */

interface Route {
  path?: string;
  breadcrumbName: string;
  children?: Array<{
    path: string;
    breadcrumbName: string;
  }>
}


const routes = ref<Route[]>([
  {
    path: '/home/fetch',
    breadcrumbName: 'home1'
  },
  {
    path: '/home/fetch',
    breadcrumbName: 'home2'
  },
  {
    path: '/home/fetch',
    breadcrumbName: 'home3'
  },
  {
    path: '/home/fetch',
    breadcrumbName: 'home4'
  },
])
const separator = ref('/')
const { currentRoute } = useRouter();

watchEffect(async () => {
  const routeMatched = currentRoute.value.matched;

  routes.value = routeMatched.map((route) => {
    return {
      path: route.path,
      breadcrumbName: route.meta && route.meta.title
    }
  });
});
</script>