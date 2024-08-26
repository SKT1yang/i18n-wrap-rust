/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs/esm/index'
import { isDayjs } from 'dayjs'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export function formatToDateTime(
  date: dayjs.ConfigType = undefined,
  format = DATE_TIME_FORMAT
): string {
  return dayjs(date).format(format)
}

export function formatToDate(date: dayjs.ConfigType = undefined, format = DATE_FORMAT): string {
  return dayjs(date).format(format)
}

export function formatToToday(skip = false, format = DATE_TIME_FORMAT): [string, string] {
  if (skip) {
    return [dayjs().startOf('D').format(), dayjs().endOf('D').format()]
  } else {
    return [dayjs().startOf('D').format(format), dayjs().endOf('D').format(format)]
  }
}

export function formatToCurrentToday(skip = false, format = DATE_TIME_FORMAT): string[] {
  if (skip) {
    return [dayjs().startOf('D').format(), dayjs().format()]
  } else {
    return [dayjs().startOf('D').format(format), dayjs().format(format)]
  }
}

export function _isADayjsObject(data) {
  return isDayjs(data)
}

export const dateUtil = dayjs
