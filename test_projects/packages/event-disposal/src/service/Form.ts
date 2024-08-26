import { http } from '@guolisec/request'

async function getLogSourceType() {
  return http.get<string[]>({
    url: '/api/realtimeMonitoring/getLogSourceTypeName?eventType=0'
  })
}
async function getLogSourceName() {
  return http.get<string[]>({
    url: '/api/realtimeMonitoring/getLogSourceName?eventType=0'
  })
}
type LoopTree = {
  eventTypes?: LoopTree
  id: number
  level: number
  name: string
}[]

async function getTree() {
  return http.get<LoopTree>({
    url: '/api/eventStore/getTree'
  })
}
interface pageTypeIPList extends pageType2 {
  filterZero: true
}
type resultType = { count: number; eventName: string }[]
type resultType2 = { count: number; srcIp: string }[]
async function countUntreatedEventBySrcIpReport(params: pageTypeIPList) {
  return http.get<resultType2>({
    url: '/api/untreatedEvent/situation/countUntreatedEventBySrcIpReport',
    params
  })
}
async function countUntreatedEventByDstIpReport(params: pageTypeIPList) {
  return http.get<{ srcIp: string; count: number }[]>({
    url: '/api/untreatedEvent/situation/countUntreatedEventByDstIpReport',
    params
  })
}
export interface pageType {
  page: number
  size: number
  treat: boolean
  createTime?: string[]
  dstIp?: string //目标ip
  ip?: string //源或目的IP
  srcIps?: string[] //源ip
  mac?: string
  logSourceName?: string //日志源名称
  unionId?: string //资产查询id
  logSourceTypeName?: string //日志源类型
  eventType?: string //事件类型
  sort?: string
  score?: number
  name?: string
  statusType?: number | null
}
async function showUnTreatEvent(params: pageType) {
  //不能确定部分属性
  return http.get<{ content: any[]; totalElements: number }>({
    url: '/api/untreatedEvent/showUnTreatEvent',
    params
  })
}

//第一个柱状图数据来源
interface pageType2 {
  start?: string
  end?: string
  treat: boolean
}

async function countUntreatedEventByEventNameReport(params: pageType2) {
  return http.get<resultType>({
    url: '/api/untreatedEvent/situation/countUntreatedEventByEventNameReport',
    params
  })
}
async function countUntreatedEventByEventLevelReport(params: pageType2) {
  return http.get<resultType>({
    url: '/api/untreatedEvent/situation/countUntreatedEventByEventLevelReport',
    params
  })
}
interface pageType3 {
  page: number
  size: number
  eventName: string
  sort?: string
}

interface whiteList {
  totalElements: number
  content: {
    createTime: string
    eventId?: number
    eventName?: string
    id: number
  }[]
}
async function eventWhitelist(params: pageType3) {
  return http.get<whiteList>({
    url: '/api/eventWhitelist',
    params
  })
}

async function bigScreenStatus() {
  return http.get<{ code: 0 | 1 }>({
    url: '/api/untreatedEvent/bigScreenStatus'
  })
}

type bigScreen =
  | {
      code: 0 | 1
      createTime: '2021-11-02T09:03:17.000+0800'
      entityName: 'isBigScreen'
      id: 2
      intInfo: null
      name: '是否开启大屏数据模式（合并处置中心报警）'
      updateTime: string
    }
  | undefined

async function updateBigScreenStatus(data: bigScreen) {
  return http.put<{ code: 0 | 1 }>({
    url: '/api/untreatedEvent/bigScreenStatus',
    data
  })
}

interface pageType4 {
  page: number
  size: number
  id: number
  sort?: string
}
async function detail(params: pageType4) {
  //这个any暂时不好改，过多的属性，以及一些属性还不能确定
  return http.get<{ content: any[]; totalElements: number }>({
    url: '/api/untreatedEvent/detail',
    params
  })
}

interface pageType5 {
  treatBy: string
  treatDescription: string
  treatIdList: number[]
}

async function updateUnTreatEvent(data: pageType5) {
  return http.post<null>({
    url: '/api/untreatedEvent/updateUnTreatEvent',
    data
  })
}
async function deleteEventWhitelist(data: number[]) {
  return http.delete<null>({
    url: '/api/eventWhitelist',
    data
  })
}

interface easyForm {
  eventStore: { id: number }
}
async function trustEventWhitelist(data: easyForm) {
  return http.post<null>({
    url: '/api/eventWhitelist',
    data
  })
}

async function getEventNameByEventType(params: { eventType: 0; treat: boolean }) {
  return http.get<string[]>({
    url: '/api/realtimeMonitoring/getEventNameByEventType',
    params
  })
}

export {
  getLogSourceType,
  getLogSourceName,
  getTree,
  countUntreatedEventBySrcIpReport,
  countUntreatedEventByDstIpReport,
  showUnTreatEvent,
  countUntreatedEventByEventNameReport,
  countUntreatedEventByEventLevelReport,
  eventWhitelist,
  bigScreenStatus,
  updateBigScreenStatus,
  detail,
  updateUnTreatEvent,
  deleteEventWhitelist,
  trustEventWhitelist,
  getEventNameByEventType
}
