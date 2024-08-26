<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <LoginContainer class="login-bg-image">

    <!-- 登录表单 -->
    <LoginForm />

    <!-- 公司完整图标 -->
    <template #logo-full>
      <slot name="logo-full">
        <LogoFull />
      </slot>
    </template>

    <!-- 公司图标 -->
    <template #logo>
      <slot name="logo">
        <Logo />
      </slot>
    </template>

  </LoginContainer>
</template>
<script lang="ts" setup>
import LoginForm from './LoginForm.vue'
import LoginContainer from './LoginContainer.vue'
import Logo from './Logo.vue';
import LogoFull from './LogoFull.vue'
import { provideLoginContext } from '../../controller/useContext'

const props = defineProps({
  copyright: {
    type: Boolean,
    default: true,
  },
  usbKey: {
    type: Boolean,
    default: true,
  }
})

provideLoginContext({
  copyright: props.copyright,
  usbKey: props.usbKey
})
</script>

<style scoped>
.login-bg-image::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url('../../assets/wave.svg');
  background-repeat: no-repeat;
  content: '';
}

.login-bg-image::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url('../../assets/analyse-scene.svg');
  background-repeat: no-repeat;
  background-size: 45%;
  background-position: 10%;
  content: '';
}
</style>

