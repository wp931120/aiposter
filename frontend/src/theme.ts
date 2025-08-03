// 全局主题变量定义

export const theme = {
  // 颜色系统
  colors: {
    // 主色调
    primary: '#1a365d',      // 深蓝色
    secondary: '#ed8936',    // 橙色
    
    // 背景色
    bgLight: '#f7fafc',      // 浅灰背景
    bgDark: '#2d3748',       // 深灰背景
    bgCard: '#ffffff',       // 卡片背景
    
    // 文本色
    textPrimary: '#2d3748',  // 主要文本
    textSecondary: '#718096', // 次要文本
    textLight: '#e2e8f0',    // 浅色文本
    
    // 状态色
    success: '#48bb78',      // 成功
    processing: '#4299e1',   // 处理中
    warning: '#ecc94b',      // 警告
    error: '#f56565',        // 错误
    
    // 边框色
    border: '#e2e8f0',       // 边框
    borderDark: '#cbd5e0',   // 深色边框
  },
  
  // 间距系统
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // 圆角
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  
  // 阴影
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // 过渡
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  // 断点
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px',
  },
};

// 导出常用样式组合
export const commonStyles = {
  // 卡片样式
  card: {
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.md,
    backgroundColor: theme.colors.bgCard,
    border: `1px solid ${theme.colors.border}`,
    transition: theme.transitions.normal,
  },
  
  // 内容容器
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.bgLight,
  },
  
  // 按钮样式
  button: {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.textLight,
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      transition: theme.transitions.fast,
      border: 'none',
      cursor: 'pointer',
      fontWeight: 500,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      transition: theme.transitions.fast,
      border: `1px solid ${theme.colors.primary}`,
      cursor: 'pointer',
      fontWeight: 500,
    },
  },
  
  // 输入框样式
  input: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    transition: theme.transitions.fast,
    backgroundColor: theme.colors.bgCard,
    color: theme.colors.textPrimary,
  },
  
  // 弹性布局
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
};