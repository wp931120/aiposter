import React, { useState } from 'react';
import { Layout, Row, Col, message } from 'antd';

import { v4 as uuidv4 } from 'uuid';

// 导入自定义组件
import Header from './components/Header';
import PosterPreview from './components/PosterPreview';
import InputPanel from './components/InputPanel';
import ProcessLogger from './components/ProcessLogger';

// SVG验证函数
// SVG验证函数 - 简化版
const validateSvg = (svgData: string): boolean => {
  // 仅检查是否包含基本的SVG标签，因为浏览器渲染容错性强
  if (typeof svgData === 'string' && svgData.includes('<svg') && svgData.includes('</svg>')) {
    return true;
  }
  console.error('SVG数据无效或不完整');
  return false;
};

// 日志条目接口
interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  status: 'success' | 'error' | 'processing' | 'waiting' | 'info';
  details?: string;
}

// 导入主题
import { theme } from './theme';

// 主应用组件
const App: React.FC = () => {
  // 状态管理
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string>('');

  // 添加日志的辅助函数
  const addLog = (message: string, status: LogEntry['status'] = 'info', details?: string) => {
    const newLog: LogEntry = {
      id: uuidv4(),
      message,
      timestamp: new Date().toISOString(),
      status,
      details,
    };
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  // 存储创建的Blob URLs，以便在组件卸载时释放
  const blobUrlsRef = React.useRef<string[]>([]);

  // 在组件卸载时释放所有创建的Blob URLs
  React.useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error('释放Blob URL失败', error);
        }
      });
    };
  }, []);

  // 当SVG内容更新时，创建新的Blob URL
  React.useEffect(() => {
    // 清理之前的Blob URL
    if (blobUrlsRef.current.length > 0) {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];
    }

    if (svgContent && validateSvg(svgContent)) {
      const svgUrl = createAndTrackBlobUrl(svgContent);
      setImageUrl(svgUrl);
    } else if (svgContent) {
      console.error('SVG数据无效，无法生成预览');
      addLog('预览生成失败', 'error', '接收到的SVG数据无效');
      setImageUrl(null); // 清除旧的或无效的图片
    }
  }, [svgContent]);

  // 创建并跟踪Blob URL的辅助函数
  const createAndTrackBlobUrl = (data: string, type: string = 'image/svg+xml;charset=utf-8'): string => {
    const blob = new Blob([data], {type});
    const url = URL.createObjectURL(blob);
    blobUrlsRef.current.push(url);
    return url;
  };

  // 处理生成海报的函数
  const handleGenerate = async (text: string) => {
    if (!text.trim()) {
      message.warning('请输入描述文本');
      return;
    }

    setLoading(true);
    setImageUrl(null); // 清除之前的图片
    setSvgContent(null); // 清除之前的SVG内容
    setLogs([]); // 清除之前的日志

    addLog('开始处理请求', 'processing');

    try {
      // 使用fetch处理SSE流式响应
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.body) {
        throw new Error('响应体为空');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let svgData = '';

      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n').filter(line => line.startsWith('data: '));

          for (const line of lines) {
            try {
              const jsonStr = line.substring(6);
              const data = JSON.parse(jsonStr);

              // 处理进度信息
              if (data.progress) {
                const { stage, percentage, description } = data.progress;
                setCurrentProgress(percentage);

                if (stage !== currentStage && currentStage !== '') {
                  const prevStage = currentStage;
                  setLogs(prevLogs =>
                    prevLogs.map(log =>
                      log.message.startsWith(`${prevStage}:`) && log.status === 'processing'
                        ? { ...log, status: 'success' }
                        : log
                    )
                  );
                }

                setCurrentStage(stage);
                addLog(`${stage}: ${description}`, 'processing', `进度: ${percentage}%`);
              }

              // 处理SVG数据
              if (data.svgChunk) {
                svgData += data.svgChunk;
              }

              // 处理完成状态
              if (data.status === 'done') {
                setSvgContent(svgData);
                setLogs(prevLogs =>
                  prevLogs.map(log =>
                    log.status === 'processing' ? { ...log, status: 'success' } : log
                  )
                );
                setCurrentProgress(100);
                addLog('海报生成成功', 'success', '海报已成功生成，可以在预览区查看');
                setLoading(false);
                setCurrentStage('');
                return; // 结束处理
              }
            } catch (error) {
              console.error('解析事件数据时出错:', error);
            }
          }
        }
      };

      processStream().catch(error => {
        console.error('处理数据流时出错:', error);
        addLog('处理失败', 'error', error.message);
        setLoading(false);
      });
    } catch (error) {
      console.error('生成海报时出错:', error);
      addLog('请求失败', 'error', error.message);
      setLoading(false);

      // 将当前步骤的状态更新为'error'
      if (currentStage !== '') {
        setLogs(prevLogs =>
          prevLogs.map(log =>
            log.message.startsWith(`${currentStage}:`) && log.status === 'processing'
              ? { ...log, status: 'error' }
              : log
          )
        );
      }
    }
  };

  // 处理下载海报的函数
  const handleDownload = () => {
    if (svgContent) {
      try {
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `poster-${new Date().getTime()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addLog('海报已下载', 'success');
        message.success('海报已开始下载');
      } catch (error) {
        console.error('下载SVG时出错:', error);
        message.error('下载失败，请重试');
      }
    } else {
      message.warning('没有可供下载的海报');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部标题栏 */}
      <Header />
      
      {/* 主体内容区 */}
      <Layout.Content
        style={{
          padding: theme.spacing.xl,
          background: theme.colors.bgLight,
          minHeight: 'calc(100vh - 64px)', // 减去Header高度
        }}
      >
        <Row gutter={[theme.spacing.lg, theme.spacing.lg]}>
          {/* 操作面板 */}
          <Col span={24}>
            <InputPanel onGenerate={handleGenerate} loading={loading} />
          </Col>
          
          {/* 生成进度日志 */}
          <Col span={24}>
            <ProcessLogger logs={logs} currentProgress={currentProgress} currentStage={currentStage} />
          </Col>
          
          {/* 结果预览区 */}
          <Col span={24}>
            <PosterPreview
              imageUrl={imageUrl}
              loading={loading}
              onDownload={handleDownload} // 传递下载处理器
            />
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default App;
