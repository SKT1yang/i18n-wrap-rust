/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \event\lib\types\disposedEventType.ts
 */
type StatusType = 0 | 1 | 2 | 3 | 4

interface SelectedObj {
  time: [string, string]
  mode: undefined | string
  mulitMode: undefined | string
  mulitModeValue: undefined | string
  event: undefined | string
  threat: undefined | string
  IP: undefined | string[]
  ip: undefined | string
  targetIP: undefined | string
  threatLevel: undefined | string
  MAC: undefined | string
  assetSearchID: undefined | string
  logSourceType: undefined | string
  logSourceName: undefined | string
  statusType?: StatusType
}

export type { SelectedObj, StatusType }
