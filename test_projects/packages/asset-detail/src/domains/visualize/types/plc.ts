type ModuleVOItem = {
  id?: number;
  repeat?: number;
  show?: boolean;
  blockSlotNo?: number;
  blockModel: string;
  blockType: string;
  blockVersion: string;
  blockRunStatus: number;
  deviceIp?: string;
  deviceMac?: string;
  blockGuideName?: string;
  blockGuideNo?: number;
  guideNoNum?: number;
  // 0-后台扫描出的机架  1-手动添加的机架
  flag?: 0 | 1;
};

type ModulePlcVisualize = {
  // api没有，前端增加
  uuid?: string;
  blockGuideName: string;
  blockGuideNo: number;
  moduleVOList: ModuleVOItem[];
  // 0-后台扫描出的机架  1-手动添加的机架
  flag?: 0 | 1;
};

export type {
  ModuleVOItem,
  ModulePlcVisualize,
};
