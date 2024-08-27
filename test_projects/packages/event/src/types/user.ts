interface User {
	id: number;
	username: string;
	password: string;
	role: number;
	rolename: string;
	name: string;
	phone: string;
	createtime: Date;
	lastmodifytime: Date;
	pwdLastmodifytime: Date;
	privilege: number;
	accountNonLocked: boolean;
	online?: boolean;
}
export { type User };
