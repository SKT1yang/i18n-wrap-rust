interface AssetConnectionItem {
  id: number
  srcIp: string
  srcMac: string
  srcType: string
  srcHash: string
  dstIp: string
  dstMac: string
  dstType: string
  dstHash: string
  srcPort: number
  dstPort: string
  linkHash: string
  status: boolean
  createTime: string
}

export type { AssetConnectionItem }

