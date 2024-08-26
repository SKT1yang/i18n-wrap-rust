import { http } from '@guolisec/request'

interface pageType {
  page: number
  size: number
  ip?: string
  levelIn?: number[] | null
  sort?: string
  treat: boolean
}
async function getDealAssetPage(params: pageType) {
  return http.get<any>({
    url: '/api/asset/getDealAssetPage',
    params
  })
}
export { getDealAssetPage }
