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
exports.LayoutDesignerAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const layout_1 = require("../prompts/layout");
class LayoutDesignerAgent extends BaseAgent_1.BaseAgent {
    constructor(llm, toolRegistry) {
        super(llm, toolRegistry);
    }
    execute(analysis) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = (0, layout_1.getLayoutPrompt)(analysis);
            const response = yield this.streamLLM(prompt);
            if (response.tool) {
                const toolResult = yield this.toolRegistry.execute(response.tool, response.tool_input);
                // For simplicity, we'll just return the first result from the tool
                return toolResult[0];
            }
            else {
                return response.layout;
            }
        });
    }
}
exports.LayoutDesignerAgent = LayoutDesignerAgent;
