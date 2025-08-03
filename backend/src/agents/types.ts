export interface Agent<T, U> {
    execute(input: T): Promise<U> | AsyncGenerator<string, void, unknown>;
}

export interface TextAnalysisResult {
    keywords: string[];
    theme: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    structure: {
        title: string;
        body: string;
        quote?: string;
    };
}

/**
 * 定义了海报设计的不同布局类型。
 */
export type LayoutType =
  | 'centered' // 居中构图：主体内容放置在画面中央，视觉焦点集中，常用于突出核心信息。
  | 'split-left-right' // 左右图文：图片和文字在左右两侧分布，形成平衡或对比，条理清晰。
  | 'single-focus' // 单图聚焦：以单张大图作为视觉主体，文字作为辅助，视觉冲击力强。
  | 'symmetrical'; // 对称构图：元素沿中心轴对称分布，营造稳定、和谐、庄重的感觉。
export type ColorSchemeType = 'vibrant' | 'pastel' | 'monochromatic';

/**
 * 代表布局设计的结果，包含所选的布局类型。
 */
export interface LayoutResult {
    /**
     * 所选的布局类型。
     */
    layout: LayoutType;
}

export interface ColorSchemeResult {
    scheme: ColorSchemeType;
}

export interface SVGResult {
    svgCode: string;
}

export interface QualityCheckResult {
    isValid: boolean;
    errors: string[];
    optimizedSvgCode?: string;
}