// 全局类型定义

// 日志条目接口
export interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  status: 'success' | 'error' | 'processing' | 'waiting' | 'info';
  details?: string;
}