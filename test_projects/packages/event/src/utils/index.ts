/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs/esm/index';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(
  date: dayjs.ConfigType = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToDate(date: dayjs.ConfigType = undefined, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToToday(skip = false, format = DATE_TIME_FORMAT): [string, string] {
  if (skip) {
    return [dayjs().startOf('D').format(), dayjs().endOf('D').format()];
  } else {
    return [dayjs().startOf('D').format(format), dayjs().endOf('D').format(format)];
  }
}

export function formatToCurrentToday(skip = false, format = DATE_TIME_FORMAT): string[] {
  if (skip) {
    return [dayjs().startOf('D').format(), dayjs().format()];
  } else {
    return [dayjs().startOf('D').format(format), dayjs().format(format)];
  }
}

export function _isADayjsObject(data) {
  return dayjs.isDayjs(data);
}

/**
 * IP为空、null、0.0.0.0，统一显示为 -
 * @param ip
 * @returns {string} 格式化显示后的ip
 */
export function EmptyIpFilter(ip: string): string {
  if (ip === null || ip === '' || ip === '0.0.0.0' || ip === undefined) {
    return '-';
  }
  return ip;
}

/**
 * name为空、null，统一显示为 -
 * @param name
 * @returns {string} 格式化显示后的name
 */
export function EmptyNameFilter(name: string): string {
  if (name === null || name === '' || name === undefined) {
    return '-';
  }
  return name;
}

export const dateUtil = dayjs;