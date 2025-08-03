"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolRegistry = void 0;
// A simple tool registry and execution system
const tools = {
    get_layout_templates: (args) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Executing tool 'get_layout_templates' with args:`, args);
        // Mock implementation
        return [
            {
                layoutId: 'template-modern',
                name: 'Modern Minimalist',
                description: 'A clean layout with a strong focus on typography.',
                preview: 'about:blank',
            },
            {
                layoutId: 'template-bold',
                name: 'Bold & Graphic',
                description: 'A vibrant layout with geometric shapes and bold colors.',
                preview: 'about:blank',
            },
        ];
    }),
    get_color_schemes: (args) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Executing tool 'get_color_schemes' with args:`, args);
        // Mock implementation
        return [
            {
                schemeId: 'vibrant-meadow',
                name: 'Vibrant Meadow',
                colors: ['#6a994e', '#a7c957', '#f2e8cf', '#bc4749'],
            },
            {
                schemeId: 'ocean-breeze',
                name: 'Ocean Breeze',
                colors: ['#006d77', '#83c5be', '#edf6f9', '#ffddd2'],
            },
        ];
    }),
};
class ToolRegistry {
    execute(toolName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tools[toolName]) {
                return tools[toolName](args);
            }
            throw new Error(`Tool '${toolName}' not found.`);
        });
    }
}
exports.ToolRegistry = ToolRegistry;
