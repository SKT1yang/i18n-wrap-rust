import { t as i18nTranslate } from '@/entry/languages';


function emptyRender(val) {
  return !val ? '-' : val;
}

function formatAppend(name, ip) {
  const srcName = name ? name : '';
  const srcIp = name === ip ? '' : srcName ? `(${ip})` : ip;
  return `${srcName}${srcIp}`;
}

function formatStatus(value) {
  const status = [
    i18nTranslate('新建'),
    i18nTranslate('连接'),
    i18nTranslate('关闭'),
    'bypass',
    i18nTranslate('超时'),
  ];
  return status[value];
}

export {
  emptyRender,
  formatAppend,
  formatStatus
}