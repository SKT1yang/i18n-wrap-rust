import { http } from '@guolisec/request';

/**
 * 全部设为基线
 * @param params
 */
function setAllAssetBaseLineApi() {
  return http.post({
    url: `/api/assetBaseLine/setAll`,
  });
}

export { setAllAssetBaseLineApi };
