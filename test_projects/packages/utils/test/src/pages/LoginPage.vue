<!--
 * @name: 登录页面
 * @description: Do not edit
-->
<template>
  <Login :usb-key="true" />
</template>
<script lang="ts" setup>
import { Login } from '@guolisec/permission'
import { encrypt, decrypt } from '../../../src/encrypt/encrypt.ts'

const privateKey =
  'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAIB6WUcgbnN/UGRKc1VJZ4VIbXvK15S4DizOubEeiCA2xYb8xBGJ2Q8zh2gIyJ5EIepq97fXts5YbJ7tM3wSdk72UHoYSWkBIZIsTakiMewkN3mvkBx1C1uzij4uOZ1NIcpDcfxbWtnDj2RRIzrJ0xkA8UhxQo5+fBSg9IHeyKtvAgMBAAECgYBfV2wNRlnwx9fmtQEll1WFKRxmMz8MFBIg2kAe2mN2VG79H3J4+WzkxP6FC4+lMzZf+YVfHmuAcUoaHjiIqEK2hPQsaCyUNcjyRit63iSPMLlgdGTuDAQl4KGcnmYhiiRgr55JgTiYAv9SNbFsFdrk54pZKGSpHqK0W3go+xguYQJBALr6tK4biWOm8OAVXINpNumxDVqJrPkPSncebpESSxaM1ithKWwMGC9Cgw3UrlBghUweXfhLNzCfBpCBri8Gg2kCQQCv51b/0vR6nbJ+dYBa3OSTN54mZs2N2VZYgD/BBGlyO1Paa+HFUq/fvqVAC5K9/NprBMrFHQWdEv5C6kq56VUXAkEAouZTTbDN9NT33LKfpBmhbt4C/VMfMOnifX804w0mACJ5YNfIp8qts1bmKMGXkI1W9KcsRWr6TVDu/i0NHQk2qQJBAKG0gsbk0DjUNZ2JOTjObhZj/6//u6FWFcmABJvVCXao0XouyLsUO3ftk45f1UNwaf4NxrYT6vAt4K31IkLsHHsCQHGkMdS6ycXu9t14A+H0c5MAJwfL8WB9B8cE5eaItBhLaKdovonZOo57MLc9bTTQI788YneK3WS75Ig8bl5yy9E=';
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAellHIG5zf1BkSnNVSWeFSG17yteUuA4szrmxHoggNsWG/MQRidkPM4doCMieRCHqave317bOWGye7TN8EnZO9lB6GElpASGSLE2pIjHsJDd5r5AcdQtbs4o+LjmdTSHKQ3H8W1rZw49kUSM6ydMZAPFIcUKOfnwUoPSB3sirbwIDAQAB';

function test() {
  const encryptedPassword = encrypt(publicKey, 'GLsec@123z');
  const result = decrypt(privateKey, encryptedPassword);
  console.log('result:', result, result === 'GLsec@123z');
}

test();
</script>
