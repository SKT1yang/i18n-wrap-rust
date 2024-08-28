export interface IAsset {
	assetField: IAssetField;
	assetGroup: IAssetGroup;
	assetGroupId: number;
	assetIp: string;
	assetMac: string;
	assetSeriesCode: number;
	assetSeriesName: string;
	assetSeriesNameLong: string;
	assetTypeCode: number;
	assetTypeName: string;
	availableSshPwd: boolean;
	clarityLevel: number;
	counterNum: number;
	createTime: string;
	dyExtendMemSize: number;
	dyMemPipeNum: number;
	errorLog: string;
	fieldId: string;
	fireStatus: number;
	firmwareVersion: string;
	flag: number;
	https: boolean;
	id: number;
	ifaceNum: number;
	ioIface: string;
	ioMemSize: number;
	memCardSize: number;
	memCardType: string;
	name: string;
	networkAdapterType: string;
	networkAssetList: INetworkAsset[];
	networkId: number;
	nodeX: number;
	nodeY: number;
	os: string;
	programChecksum: string;
	programMemSize: number;
	protect: number;
	protectCps: number;
	runStatus: RunStatus;
	score: number;
	scoreLevel: number;
	supVlan: number;
	timeInfo: string;
	trademarkCode: number;
	trademarkName: string;
	tranferSpeed: number;
	trust: number;
	type: number;
	uid: string;
	updateTime: string;
	sn: string;
	softwareVersion: string;
	assetLocation: string;
	importance: number;
	security: string;
	hardwareModel: string;
	deviceModel: string;
	cpuRate: number | null;
	memoryRate: number | null;
}
export interface IAssetField {
	id: string;
	name: string;
}
export interface IAssetGroup {
	id: number;
	label: string;
	parentId: number;
}
export interface INetworkAsset {
	assetList: ISubAsset[];
	id: number;
	mainUid: string;
	networkName: string;
}
export interface ISubAsset {
	assetGroupId: number;
	assetIp: string;
	assetMac: string;
	assetSeriesCode: number;
	assetSeriesName: string;
	assetTypeCode: number;
	assetTypeName: string;
	fieldId: string;
	flag: number;
	https: boolean;
	id: number;
	name: string;
	nodeX: number;
	nodeY: number;
	runStatus: RunStatus;
	trademarkCode: number;
	trademarkName: string;
	type: number;
	uid: string;
}
export interface IAssetGroupTree {
	assetNum: number;
	children?: IAssetGroupTree[];
	id: string;
	ipLimit?: string;
	label: string;
	name: string;
	parentId: string;
	remarks?: string;
}
export type RunStatus = 0 | 1 | 2;
export interface IAssetProps {
	haveAssetMerge?: boolean;
	haveAddDevice?: boolean;
	haveAssetField?: boolean;
	haveAssetRelation?: boolean;
	haveAssetFlow?: boolean;
	haveAssetVul?: boolean;
	havePlcMonitor?: boolean;
	haveBaselineModify?: boolean;
	haveHardwareInfo?: boolean;
	haveInterfaceStatusTable?: boolean;
	haveAssetSession?: boolean;
}
