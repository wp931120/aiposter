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
exports.TextAnalyzerAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const prompts_1 = require("../prompts");
class TextAnalyzerAgent extends BaseAgent_1.BaseAgent {
    constructor(llm) {
        super(llm);
    }
    execute(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = (0, prompts_1.getTextAnalyzerPrompt)(text);
            const response = yield this.streamLLM(prompt);
            return response;
        });
    }
}
exports.TextAnalyzerAgent = TextAnalyzerAgent;
