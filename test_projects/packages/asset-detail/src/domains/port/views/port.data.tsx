/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { ColumnProps } from 'ant-design-vue/es/table';
import { Tag } from 'ant-design-vue';
import { t } from '@/entry/languages/useLanguage';

/**
 * 交换机监测项-交换机端口状态
 * todo
 */

const switchColumns: ColumnProps<{
  enableStatus: string;
}>[] = [
  {
    title: t('端口'),
    dataIndex: 'port',
  },
  {
    title: t('MAC 地址'),
    dataIndex: 'portMac',
    customRender({ text }) {
      if (!text || text === '00:00:00:00:00:00') {
        return '-';
      } else {
        return text;
      }
    },
  },
  {
    title: t('状态'),
    dataIndex: 'status',
    customRender({ text }) {
      const enableStatusStr = text === 'up' ? 'UP' : 'DOWN';
      const colorStr = text === 'up' ? 'green' : 'orange';
      return <Tag color={colorStr}>{enableStatusStr}</Tag>;
    },
  },
];

export { switchColumns };
