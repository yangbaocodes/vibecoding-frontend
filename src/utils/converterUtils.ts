export enum FileStatus {
  PENDING = 'pending',
  CONVERTING = 'converting',
  CONVERTED = 'converted',
  FAILED = 'failed',
  SIZE_LIMIT_EXCEEDED = 'size_limit_exceeded'
}

export enum OperationType {
  CONVERT = 'convert',
  DELETE = 'delete',
  DOWNLOAD = 'download',
  NONE = 'none'
}

export interface FileItem {
  name: string
  size: number
  file: File
  path?: string
  status: FileStatus
  httpId?: String
}
