import { http } from "@guolisec/request";

type typeBack = {
  assetSeriesCode: number;
  assetSeriesName: string;
};
function type() {
  return http.get<typeBack[]>({
    url: "/api/device/manage/type",
  });
}

export { type };

export type { typeBack };
