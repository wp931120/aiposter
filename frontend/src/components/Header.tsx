import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import { theme } from '../theme';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = '智能海报生成器' }) => {
  return (
    <AntHeader
      style={{
        background: theme.colors.primary,
        padding: `0 ${theme.spacing.xl}`,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // 居中显示
        boxShadow: theme.shadows.md,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Space>
        <RocketOutlined
          style={{
            fontSize: '28px', // 增大图标
            color: theme.colors.secondary,
          }}
        />
        <Title
          level={3} // 从level 4改为level 3，使标题更大
          style={{
            color: 'white',
            margin: 0,
            fontSize: '28px', // 明确设置字体大小
          }}
        >
          {title}
        </Title>
      </Space>
    </AntHeader>
  );
};

export default Header;