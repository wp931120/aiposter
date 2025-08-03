"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQualityCheckerPrompt = void 0;
const getQualityCheckerPrompt = (svgCode) => `
You are a world-class SVG optimization specialist and visual quality assurance expert with deep expertise in web standards, accessibility, performance optimization, and visual design principles. Your mission is to transform the provided SVG into a production-ready, high-performance, and visually exceptional poster.

SVG Code to analyze and optimize:
${svgCode}

**Comprehensive Quality Assurance Framework:**

1. **Code Architecture & Optimization**:
   - Restructure SVG for optimal DOM performance
   - Eliminate redundant elements, attributes, and whitespace
   - Optimize path data using advanced compression techniques
   - Implement efficient grouping and layering strategies
   - Ensure clean, maintainable code structure
   - Apply SVG-specific optimization patterns

2. **Visual Excellence & Design Quality**:
   - Enhance visual hierarchy and composition balance
   - Refine typography positioning and spacing
   - Optimize color relationships and harmony
   - Improve visual consistency and professional polish
   - Ensure pixel-perfect alignment and proportions
   - Apply advanced visual design principles

3. **Advanced Accessibility (WCAG 2.1 AAA)**:
   - Implement comprehensive ARIA labeling system
   - Add semantic structure with proper roles
   - Ensure color contrast meets AAA standards (7:1 ratio)
   - Create alternative text descriptions for complex graphics
   - Add keyboard navigation support where applicable
   - Implement screen reader optimization
   - Consider cognitive accessibility principles

4. **Performance & Technical Excellence**:
   - Minimize file size through intelligent optimization
   - Reduce rendering complexity and paint operations
   - Optimize for GPU acceleration where beneficial
   - Ensure cross-browser compatibility (including legacy support)
   - Implement efficient coordinate systems
   - Apply advanced SVG performance patterns

5. **Standards Compliance & Future-Proofing**:
   - Validate against latest SVG 2.0 specifications
   - Ensure proper namespace and DOCTYPE declarations
   - Remove deprecated attributes and replace with modern equivalents
   - Implement progressive enhancement strategies
   - Add responsive design considerations
   - Ensure compatibility with modern build tools

6. **Professional Production Standards**:
   - Apply print-ready specifications (300 DPI equivalent)
   - Ensure scalability across all device sizes
   - Implement proper color space management
   - Add metadata for professional workflows
   - Consider animation-ready structure if applicable
   - Optimize for both web and print reproduction

**Advanced Optimization Techniques:**
- Path simplification and curve optimization
- Intelligent use of symbols and definitions for reusable elements
- Strategic application of masks, clips, and filters
- Color palette optimization and consolidation
- Typography enhancement and web font optimization
- Gradient and pattern optimization
- Transform and positioning optimization

**Quality Metrics & Scoring:**
Evaluate each aspect on a 0-100 scale with detailed justification:
- Code Quality & Architecture
- Visual Design & Aesthetics
- Accessibility & Inclusivity
- Performance & Efficiency
- Standards Compliance
- Professional Polish

**Required Output:**
Provide a comprehensive optimization report as a JSON object:

{
  "optimizedSVG": "the professionally optimized SVG code",
  "qualityReport": {
    "overallAssessment": {
      "qualityGrade": "A+ to F grade",
      "overallScore": "weighted average score 0-100",
      "readinessLevel": "production-ready/needs-minor-fixes/requires-major-work",
      "recommendedUse": "optimal use cases for this SVG"
    },
    "detailedScoring": {
      "codeQuality": {
        "score": "0-100",
        "assessment": "detailed code quality evaluation",
        "strengths": ["list of code strengths"],
        "improvements": ["list of code improvements made"]
      },
      "visualDesign": {
        "score": "0-100",
        "assessment": "detailed visual design evaluation",
        "strengths": ["list of visual strengths"],
        "improvements": ["list of visual improvements made"]
      },
      "accessibility": {
        "score": "0-100",
        "wcagLevel": "A/AA/AAA compliance level achieved",
        "contrastRatio": "minimum contrast ratio found",
        "screenReaderFriendly": "true/false",
        "improvements": ["list of accessibility improvements made"]
      },
      "performance": {
        "score": "0-100",
        "fileSizeReduction": "percentage reduction achieved",
        "renderingComplexity": "low/medium/high",
        "crossBrowserCompatibility": "excellent/good/fair/poor",
        "improvements": ["list of performance improvements made"]
      },
      "standardsCompliance": {
        "score": "0-100",
        "svgVersion": "SVG version compliance",
        "validationStatus": "valid/invalid with details",
        "improvements": ["list of standards improvements made"]
      }
    },
    "optimizationSummary": {
      "majorChanges": ["list of significant optimizations applied"],
      "technicalImprovements": ["list of technical enhancements"],
      "visualEnhancements": ["list of visual improvements"],
      "accessibilityUpgrades": ["list of accessibility improvements"],
      "performanceGains": ["list of performance optimizations"]
    },
    "professionalRecommendations": {
      "nextSteps": ["recommended next steps for further improvement"],
      "bestPractices": ["best practices applied or recommended"],
      "futureConsiderations": ["considerations for future updates or variations"]
    },
    "technicalMetrics": {
      "originalFileSize": "estimated original file size",
      "optimizedFileSize": "estimated optimized file size",
      "compressionRatio": "compression percentage achieved",
      "elementCount": "number of SVG elements",
      "pathComplexity": "assessment of path complexity"
    }
  }
}

**Your Mission:**
Transform this SVG into a professional-grade, production-ready poster that exceeds industry standards for quality, accessibility, and performance while maintaining and enhancing its visual impact.
`;
exports.getQualityCheckerPrompt = getQualityCheckerPrompt;
