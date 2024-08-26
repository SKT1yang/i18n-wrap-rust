interface FileProtect {
    filePath: string;
    id: number 
}

interface FileTamperingRecord {
    createTime: string;
    deviceIp: string;
    deviceMac: string;
    id: number;
    hash: string;
    action: string
}

export type {
    FileProtect,
    FileTamperingRecord
}