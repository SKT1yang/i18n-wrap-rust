import { computed } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { ColumnProps } from 'ant-design-vue/es/table';
import { formatToDateTime } from '@guolisec/utils';
import { EventAlarmTag } from '@guolisec/component';
import type { IEventDetail, IEventRecord } from '../types/event';
import { t } from '@/entry/languages/useLanguage';
import { emptyRender, formatAppend } from '@/shared/utils/format';

/**
 * 工控事件表格
 */
const IcEventColumns = computed<ColumnProps<IEventDetail>[]>(() => {
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
      sorter: true,
      customRender(opt) {
        return emptyRender(formatToDateTime(opt.record['@timestamp']));
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
    },
    {
      title: t('功能码'),
      dataIndex: 'functionCode',
      customRender(opt) {
        return emptyRender(opt.record['functionCode']);
      },
    },
    {
      title: t('异常'),
      dataIndex: 'remarks',
      customRender(opt) {
        return emptyRender(opt.record['remarks']);
      },
    },
    {
      title: t('操作名称'),
      dataIndex: 'funcDescribe',
    },
    {
      title: t('地址'),
      dataIndex: 'operationAddress',
      customRender(opt) {
        return emptyRender(opt.record['operationAddress']);
      },
    },
    {
      title: t('值'),
      dataIndex: 'operationData',
      customRender(opt) {
        return emptyRender(opt.record['operationData']);
      },
    },
  ];
});

/**
 * 网络事件表格
 */
const NetEventColumns = computed<ColumnProps<IEventDetail>[]>(() => {
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
      sorter: true,
      customRender(opt) {
        return emptyRender(formatToDateTime(opt.record['@timestamp']));
      },
    },
    {
      title: t('源资产'),
      dataIndex: 'srcName',
      customRender(opt) {
        return (
          <div>
            {formatAppend(opt.record.srcName, opt.record.srcIp)}
            <Tooltip v-slots={{ title: <span>{t('异常IP')}</span> }}>
              <i class="i-base-error-warning-line text-red-700" />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: t('目的资产'),
      dataIndex: 'dstName',
      customRender(opt) {
        return emptyRender(formatAppend(opt.record.dstName, opt.record.dstIp));
      },
    },
    {
      title: t('协议'),
      dataIndex: 'protocol',
    },
    {
      title: t('事件名称'),
      dataIndex: 'eventName',
      customRender(opt) {
        return emptyRender(opt.record['eventName']);
      },
    },
  ];
});

/**
 * 攻击事件表格
 */
const IdsEventColumns = computed<ColumnProps<IEventDetail>[]>(() => {
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
      sorter: true,
      customRender(opt) {
        return emptyRender(formatToDateTime(opt.record['@timestamp']));
      },
    },
    {
      title: t('源资产'),
      dataIndex: 'srcName',
      customRender(opt) {
        return emptyRender(formatAppend(opt.record.srcName, opt.record.srcIp));
      },
    },
    {
      title: t('目的资产'),
      dataIndex: 'dstName',
      customRender(opt) {
        return emptyRender(formatAppend(opt.record.dstName, opt.record.dstIp));
      },
    },
    {
      title: t('协议'),
      dataIndex: 'protocol',
    },
    {
      title: t('威胁名称'),
      dataIndex: 'eventName',
      customRender(opt) {
        return emptyRender(opt.record['eventName']);
      },
    },
    {
      title: t('威胁级别'),
      dataIndex: 'eventLevel',
      customRender(opt) {
        return <EventAlarmTag level={opt.record.eventLevel} />;
      },
    },
    {
      title: 'CVE-ID',
      dataIndex: 'cve',
      customRender(opt) {
        return emptyRender(opt.record['cve']);
      },
    },
    {
      title: 'CNNVD-ID',
      dataIndex: 'cnnvd',
      customRender(opt) {
        return emptyRender(opt.record['cnnvd']);
      },
    },
    {
      title: t('处理建议'),
      dataIndex: 'suggestion',
      customRender(opt) {
        return emptyRender(opt.record['suggestion']);
      },
    },
  ];
});

/**
 * 组态变更表格
 */
const configurationChangeEventColumns = computed<ColumnProps<IEventRecord>[]>(
  () => {
    return [
      {
        title: t('序号'),
        width: 50,
        key: 'index',
        align: 'center',
      },
      {
        title: t('变更时间'),
        dataIndex: 'createTime',
        sorter: true,
        customRender({ record }) {
          return formatToDateTime(record.createTime);
        },
      },
      {
        title: t('变更详情'),
        dataIndex: 'naturalLanguageDescription',
      },
      {
        title: t('处置建议'),
        dataIndex: 'suggestion',
      },
    ];
  }
);

export {
  IcEventColumns,
  NetEventColumns,
  IdsEventColumns,
  configurationChangeEventColumns,
};
