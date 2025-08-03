import React, { useRef } from 'react';
import { Card, Empty, Spin, Typography, Space, Button, Tooltip, message } from 'antd';
import { DownloadOutlined, FullscreenOutlined, LoadingOutlined } from '@ant-design/icons';
import { theme, commonStyles } from '../theme';

const { Title } = Typography;

interface PosterPreviewProps {
  imageUrl: string | null;
  loading: boolean;
  onDownload: () => void; // 强制要求提供下载处理器
}

const PosterPreview: React.FC<PosterPreviewProps> = ({
  imageUrl,
  loading,
  onDownload,
}) => {
  // 处理下载功能
  const handleDownload = () => {
    if (imageUrl) {
      onDownload();
    } else {
      message.warning('没有可供下载的海报');
    }
  };

  // 处理全屏预览
  const handleFullscreen = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <Card
      title={
        <div style={commonStyles.flexBetween}>
          <Title level={4} style={{ margin: 0 }}>
            海报预览
          </Title>
          {imageUrl && (
            <Space>
              <Tooltip title="下载海报">
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                />
              </Tooltip>
              <Tooltip title="全屏查看">
                <Button
                  type="text"
                  icon={<FullscreenOutlined />}
                  onClick={handleFullscreen}
                />
              </Tooltip>
            </Space>
          )}
        </div>
      }
      style={{
        height: '100%',
        ...commonStyles.card,
      }}
      styles={{
        body: {
        padding: theme.spacing.md,
        height: 'calc(100% - 57px)', // 减去卡片头部高度
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.colors.bgDark,
        borderRadius: `0 0 ${theme.borderRadius.md} ${theme.borderRadius.md}`,
        overflow: 'hidden',
      }}}
    >
      {loading ? (
        <div
          style={{
            ...commonStyles.flexCenter,
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 48, color: theme.colors.secondary }}
                spin
              />
            }
          />
          <Typography.Text
            style={{ color: theme.colors.textLight, marginTop: theme.spacing.md }}
          >
            正在生成海报，请稍候...
          </Typography.Text>
        </div>
      ) : imageUrl ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto', // 改为auto，允许在内容超出时滚动
            padding: theme.spacing.md, // 添加内边距
          }}
        >
          <img
            src={imageUrl}
            alt="生成的海报预览"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: theme.borderRadius.sm,
              boxShadow: theme.shadows.lg,
              transition: theme.transitions.normal,
              width: 'auto',
              height: 'auto',
              objectFit: 'contain', // 确保图片等比缩放
            }}
            onError={(e) => {
              console.error('图片加载失败', e);
              message.error('海报预览加载失败，请检查SVG数据是否有效');
            }}
          />
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Typography.Text style={{ color: theme.colors.textLight }}>
              输入文本并点击生成按钮，查看海报预览
            </Typography.Text>
          }
          style={{
            color: theme.colors.textLight,
            margin: 'auto',
          }}
        />
      )}
    </Card>
  );
};

export default PosterPreview;