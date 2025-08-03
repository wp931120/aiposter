import React, { useEffect, useRef, useState } from 'react';
import { Card, Timeline, Typography, Empty, Badge, Tooltip, Space, Progress } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { theme, commonStyles } from '../theme';

const { Title, Text } = Typography;

// 日志条目接口
interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  status: 'success' | 'error' | 'processing' | 'waiting' | 'info';
  details?: string;
}

// 组件属性接口
export interface ProcessLoggerProps {
  logs: LogEntry[];
  title?: string;
  currentProgress?: number;
  currentStage?: string;
}

// 获取状态对应的图标
const getStatusIcon = (status: LogEntry['status'], message?: string, currentStage?: string) => {
  // 如果当前有正在处理的步骤，且该日志不是当前步骤的日志，则显示成功图标
  if (status === 'processing' && message && currentStage) {
    // 提取日志消息中的阶段名称
    const logStage = message.split(':')[0]?.trim();
    if (logStage && logStage !== currentStage) {
      return <CheckCircleOutlined style={{ fontSize: '16px', color: theme.colors.success }} />;
    }
  }
  
  switch (status) {
    case 'success':
      return <CheckCircleOutlined style={{ fontSize: '16px', color: theme.colors.success }} />;
    case 'error':
      return <CloseCircleOutlined style={{ fontSize: '16px', color: theme.colors.error }} />;
    case 'processing':
      return <LoadingOutlined style={{ fontSize: '16px', color: theme.colors.processing }} spin />;
    case 'waiting':
      return <ClockCircleOutlined style={{ fontSize: '16px', color: theme.colors.warning }} />;
    case 'info':
      return <InfoCircleOutlined style={{ fontSize: '16px', color: theme.colors.secondary }} />;
    default:
      return <InfoCircleOutlined style={{ fontSize: '16px', color: theme.colors.textSecondary }} />;
  };
};

// 获取状态对应的颜色
const getStatusColor = (status: LogEntry['status']) => {
  switch (status) {
    case 'success':
      return theme.colors.success;
    case 'error':
      return theme.colors.error;
    case 'processing':
      return theme.colors.processing;
    case 'waiting':
      return theme.colors.warning;
    case 'info':
      return theme.colors.secondary;
    default:
      return theme.colors.textSecondary;
  }
};

// 格式化时间戳
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const ProcessLogger: React.FC<ProcessLoggerProps> = ({ logs, title = '生成进度日志', currentProgress = 0, currentStage = '' }) => {
  // 创建引用以自动滚动到最新日志
  const timelineRef = useRef<HTMLDivElement>(null);
  // 计算当前进度
  const [progress, setProgress] = useState(0);
  
  // 当日志更新时，自动滚动到底部
  useEffect(() => {
    if (timelineRef.current && logs.length > 0) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [logs]);
  
  // 当日志更新时，计算进度
  useEffect(() => {
    if (logs.length > 0) {
      // 尝试从日志中提取进度信息
      const progressLogs = logs.filter(log => log.details && log.details.includes('进度:'));
      if (progressLogs.length > 0) {
        const latestProgressLog = progressLogs[progressLogs.length - 1];
        const progressMatch = latestProgressLog.details?.match(/进度:\s*(\d+)%/);
        if (progressMatch && progressMatch[1]) {
          setProgress(parseInt(progressMatch[1], 10));
        }
      } else if (currentProgress > 0) {
        setProgress(currentProgress);
      }
    } else {
      setProgress(0);
    }
  }, [logs, currentProgress]);

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          {logs.length > 0 && (
            <Badge 
              count={logs.length} 
              style={{ 
                backgroundColor: theme.colors.secondary,
                marginLeft: theme.spacing.xs,
              }} 
            />
          )}
        </Space>
      }
      style={{
        height: '100%',
        ...commonStyles.card,
      }}
      styles={{
        body: {
        padding: theme.spacing.md,
        height: 'calc(100% - 57px)', // 减去卡片头部高度
        overflow: 'hidden',
      }}}
    >
      {/* 进度条 */}
      {logs.length > 0 && (
        <div style={{ marginBottom: theme.spacing.md }}>
          <Progress 
            percent={progress} 
            status="active" 
            strokeColor={{
              from: theme.colors.primary,
              to: theme.colors.secondary,
            }}
            strokeWidth={8}
            showInfo={true}
          />
        </div>
      )}
      <div
        ref={timelineRef}
        style={{
          height: '100%',
          overflowY: 'auto',
          padding: `0 ${theme.spacing.sm}`,
        }}
      >
        {logs.length > 0 ? (
          <Timeline
            mode="left"
            items={logs.map((log) => ({
              key: log.id,
              color: getStatusColor(log.status),
              dot: getStatusIcon(log.status, log.message, currentStage),
              children: (
                <div style={{ marginBottom: theme.spacing.md }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: theme.spacing.xs,
                  }}>
                    <Text strong style={{ wordBreak: 'break-word', flex: 1 }}>
                      {log.message}
                    </Text>
                    <Tooltip title={new Date(log.timestamp).toLocaleString()}>
                      <Text type="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap', marginLeft: theme.spacing.sm }}>
                        {formatTimestamp(log.timestamp)}
                      </Text>
                    </Tooltip>
                  </div>
                  
                  {log.details && (
                    <div
                      style={{
                        background: theme.colors.bgLight,
                        padding: theme.spacing.sm,
                        borderRadius: theme.borderRadius.sm,
                        borderLeft: `3px solid ${getStatusColor(log.status)}`,
                        fontSize: '12px',
                        color: theme.colors.textSecondary,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: '150px',
                        overflowY: 'auto',
                      }}
                    >
                      {log.details}
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary">
                暂无日志记录，生成海报时将显示进度
              </Text>
            }
            style={{
              margin: 'auto',
              marginTop: '30%',
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default ProcessLogger;