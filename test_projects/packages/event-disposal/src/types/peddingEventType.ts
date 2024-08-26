interface baseType {
  value: string | number
  label: string
}
interface fileType {
  time: undefined | [string, string]
  modes: baseType[]
  mulitModes: baseType[]
  events: baseType[]
  threats: baseType[]
  IPs: baseType[]
  targetIPs: baseType[]
  threatLevels: baseType[]
  Mac: baseType[]
  logSourceTypes: baseType[]
  logSourceNames: baseType[]
}

export type { fileType, baseType }
