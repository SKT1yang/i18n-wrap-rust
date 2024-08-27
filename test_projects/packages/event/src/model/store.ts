import { useStore } from "@guolisec/storable";
import { defineStore } from "pinia";
interface PermissionState {
	token: string;
}
export const usePermissionStore = defineStore({
	id: "permission-store",
	state: (): PermissionState => ({ token: "" }),
	getters: { getToken() {
		return this.token;
	} }
});
export function usePermissionStoreWithOut() {
	const store = useStore();
	return usePermissionStore(store);
}
