import { computed } from 'vue';
import { ColumnProps } from 'ant-design-vue/es/table';
import { formatToDateTime, formatFlow } from '@guolisec/utils';
import type { IEventDetail } from '@/domains/event/types/event';
import { t } from '@/entry/languages/useLanguage';
import { formatAppend, formatStatus } from '@/shared/utils/format';

/**
 * 资产会话表格
 */
const sessionEventColumns = computed<ColumnProps<IEventDetail>[]>(() => {
  return [
    {
      title: t('序号'),
      width: 50,
      key: 'index',
      align: 'center',
    },
    {
      title: t('时间'),
      dataIndex: '@timestamp',
      customRender(opt) {
        return formatToDateTime(opt.record['@timestamp']);
      },
    },
    {
      title: t('源资产'),
      dataIndex: 'srcName',
      customRender(opt) {
        return formatAppend(opt.record.srcName, opt.record.srcIp);
      },
    },
    {
      title: t('目的资产'),
      dataIndex: 'dstName',
      customRender(opt) {
        return formatAppend(opt.record.dstName, opt.record.dstIp);
      },
    },
    {
      title: t('协议'),
      dataIndex: 'protocol',
      customRender(opt) {
        // 如果后端传来UNKOWN则修改为N/A
        if (opt.record.protocol == 'UNKNOWN') {
          opt.record.protocol = 'N/A';
        }
        return opt.record.protocol;
      },
    },
    {
      title: t('上行流量'),
      dataIndex: 'upTraffic',
      customRender(opt) {
        return opt.record.upTraffic ? formatFlow(opt.record.upTraffic) : '-';
      },
    },
    {
      title: t('下行流量'),
      dataIndex: 'downTraffic',
      customRender(opt) {
        return opt.record.downTraffic
          ? formatFlow(opt.record.downTraffic)
          : '-';
      },
    },
    {
      title: t('会话状态'),
      dataIndex: 'status',
      customRender(opt) {
        return formatStatus(opt.record.status);
      },
    },
  ];
});

export { sessionEventColumns };
