import React, { useState } from 'react';
import { Card, Input, Button, Typography, Space, Tooltip, Tag, Divider } from 'antd';
import { SendOutlined, CopyOutlined, DeleteOutlined, BulbOutlined } from '@ant-design/icons';
import { theme, commonStyles } from '../theme';

const { TextArea } = Input;
const { Title, Text } = Typography;

// 预设的提示词模板
const PROMPT_TEMPLATES = [
  { label: '商业海报', value: '设计一张商业产品推广海报，突出产品的核心优势和价值主张。' },
  { label: '活动宣传', value: '创建一张活动宣传海报，包含时间、地点和活动亮点。' },
  { label: '招聘广告', value: '设计一张招聘海报，展示公司文化和职位要求。' },
  { label: '节日祝福', value: '制作一张节日祝福海报，传达温馨的节日氛围和祝福。' },
];

interface InputPanelProps {
  onGenerate: (text: string) => void;
  loading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ onGenerate, loading }) => {
  const [inputText, setInputText] = useState('');
  
  // 处理生成请求
  const handleGenerate = () => {
    if (inputText.trim()) {
      onGenerate(inputText.trim());
    }
  };
  
  // 清空输入
  const handleClear = () => {
    setInputText('');
  };
  
  // 复制输入文本
  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
  };
  
  // 使用模板
  const useTemplate = (template: string) => {
    setInputText(template);
  };
  
  // 计算剩余字符
  const maxLength = 10000;
  const remainingChars = maxLength - inputText.length;
  const isOverLimit = remainingChars < 0;
  
  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          操作面板
        </Title>
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
      }}}
    >
      <div style={{ marginBottom: theme.spacing.md }}>
        <Text type="secondary">输入描述文本，生成精美海报</Text>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="请输入海报内容描述..."
          autoSize={{ minRows: 10, maxRows: 15 }}
          maxLength={maxLength}
          showCount={false}
          style={{
            resize: 'none',
            flex: 1,
            marginBottom: theme.spacing.md,
            borderColor: isOverLimit ? theme.colors.error : theme.colors.border,
            borderWidth: '1px',
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            fontSize: '16px',
            transition: theme.transitions.fast,
          }}
        />
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.lg,
        }}>
          <Text 
            type={isOverLimit ? 'danger' : 'secondary'}
            style={{ fontSize: '12px' }}
          >
            {remainingChars} / {maxLength}
          </Text>
          
          <Space>
            <Tooltip title="复制文本">
              <Button 
                icon={<CopyOutlined />} 
                type="text" 
                onClick={handleCopy}
                disabled={!inputText}
              />
            </Tooltip>
            <Tooltip title="清空文本">
              <Button 
                icon={<DeleteOutlined />} 
                type="text" 
                onClick={handleClear}
                disabled={!inputText}
              />
            </Tooltip>
          </Space>
        </div>
        
        <Divider orientation="left" plain>
          <Space>
            <BulbOutlined style={{ color: theme.colors.warning }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              提示词模板
            </Text>
          </Space>
        </Divider>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.lg,
        }}>
          {PROMPT_TEMPLATES.map((template, index) => (
            <Tag
              key={index}
              color={theme.colors.primary}
              style={{ 
                cursor: 'pointer',
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.borderRadius.sm,
              }}
              onClick={() => useTemplate(template.value)}
            >
              {template.label}
            </Tag>
          ))}
        </div>
        
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleGenerate}
          disabled={!inputText.trim() || isOverLimit || loading}
          loading={loading}
          style={{
            backgroundColor: theme.colors.primary,
            height: '40px',
            borderRadius: theme.borderRadius.md,
            boxShadow: theme.shadows.md,
            marginTop: 'auto',
          }}
        >
          生成海报
        </Button>
      </div>
    </Card>
  );
};

export default InputPanel;