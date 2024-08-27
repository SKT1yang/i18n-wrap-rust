import { IAsset, IAssetField, IAssetGroup, IAssetGroupTree, INetworkAsset, ISubAsset, RunStatus, IAssetProps } from "./index";
export class Asset implements IAsset {
	assetField = new AssetField();
	assetGroup = new AssetGroup();
	assetGroupId = 0;
	assetIp = "";
	assetMac = "";
	assetSeriesCode = 0;
	assetSeriesName = "";
	assetSeriesNameLong = "";
	assetTypeCode = 0;
	assetTypeName = "";
	availableSshPwd = false;
	clarityLevel = 0;
	counterNum = 0;
	createTime = "";
	dyExtendMemSize = 0;
	dyMemPipeNum = 0;
	errorLog = "";
	fieldId = "";
	fireStatus = 0;
	firmwareVersion = "";
	flag = 0;
	https = false;
	id = 0;
	ifaceNum = 0;
	ioIface = "";
	ioMemSize = 0;
	memCardSize = 0;
	memCardType = "";
	name = "";
	networkAdapterType = "";
	networkAssetList: INetworkAsset[] = [];
	networkId = 0;
	nodeX = 0;
	nodeY = 0;
	os = "";
	programChecksum = "";
	programMemSize = 0;
	protect = 0;
	protectCps = 0;
	runStatus: RunStatus = 0;
	score = 0;
	scoreLevel = 0;
	supVlan = 0;
	timeInfo = "";
	trademarkCode = 0;
	trademarkName = "";
	tranferSpeed = 0;
	trust = 0;
	type = 0;
	uid = "";
	updateTime = "";
	sn = "";
	softwareVersion = "";
	assetLocation = "";
	importance = 0;
	security = "";
	hardwareModel = "";
	deviceModel = "";
	cpuRate = null;
	memoryRate = null;
}
export class AssetField implements IAssetField {
	id = "";
	name = "";
}
export class AssetGroup implements IAssetGroup {
	id = 0;
	label = "";
	parentId = 0;
}
export class SubAsset implements ISubAsset {
	assetGroupId = 0;
	assetIp = "";
	assetMac = "";
	assetSeriesCode = 0;
	assetSeriesName = "";
	assetTypeCode = 0;
	assetTypeName = "";
	fieldId = "";
	flag = 0;
	https = true;
	id = 0;
	name = "";
	nodeX = 0;
	nodeY = 0;
	runStatus: RunStatus = 0;
	trademarkCode = 0;
	trademarkName = "";
	type = 0;
	uid = "";
}
export class NetworkAsset implements INetworkAsset {
	assetList = [new SubAsset()];
	id = 0;
	mainUid = "";
	networkName = "";
}
export class AssetGroupTree implements IAssetGroupTree {
	assetNum = 0;
	children = [];
	id = "";
	label = "";
	name = "";
	parentId = "";
}
export class AssetProps implements IAssetProps {
	haveAssetMerge? = true;
	haveAddDevice? = true;
	haveAssetField? = true;
	haveAssetRelation? = true;
	haveAssetFlow? = true;
	haveAssetVul? = true;
	havePlcMonitor? = true;
	haveBaselineModify? = true;
	haveHardwareInfo? = true;
	haveInterfaceStatusTable? = true;
	haveAssetSession? = true;
}
