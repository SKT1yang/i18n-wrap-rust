import type { DataListResult } from "@guolisec/types";
import type { User } from "../types/user";
import { http } from "@guolisec/request";
export async function getUserList(data) {
	return http.post<DataListResult<User>>({
		url: "/api/user/getUserList",
		data
	});
}
