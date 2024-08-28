import { http } from "@guolisec/request";
export async function modifyMaxFailedNum(data: {num: number}) {
	return http.post<string>({
		url: "/api/user/modifyMaxFailedNum",
		data
	});
}
