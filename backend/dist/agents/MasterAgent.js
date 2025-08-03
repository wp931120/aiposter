"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterAgent = void 0;
const TextAnalyzerAgent_1 = require("./TextAnalyzerAgent");
const LayoutDesignerAgent_1 = require("./LayoutDesignerAgent");
const ColorSchemeAgent_1 = require("./ColorSchemeAgent");
const SVGGeneratorAgent_1 = require("./SVGGeneratorAgent");
const llm_1 = require("../llm");
const prompts_1 = require("../prompts");
const tools_1 = require("../tools");
class MasterAgent {
    constructor() {
        this.llm = new llm_1.LLM();
        const toolRegistry = new tools_1.ToolRegistry();
        this.agents = {
            TextAnalyzerAgent: new TextAnalyzerAgent_1.TextAnalyzerAgent(this.llm),
            LayoutDesignerAgent: new LayoutDesignerAgent_1.LayoutDesignerAgent(this.llm, toolRegistry),
            ColorSchemeAgent: new ColorSchemeAgent_1.ColorSchemeAgent(this.llm, toolRegistry),
            SVGGeneratorAgent: new SVGGeneratorAgent_1.SVGGeneratorAgent(this.llm),
        };
    }
    processRequest(text) {
        return __asyncGenerator(this, arguments, function* processRequest_1() {
            var _a, e_1, _b, _c, _d, e_2, _e, _f;
            const planPrompt = (0, prompts_1.getMasterAgentPlanPrompt)(text);
            console.log('MasterAgent: Calling LLM for plan...');
            let planResponse = '';
            try {
                for (var _g = true, _h = __asyncValues(this.llm.stream(planPrompt)), _j; _j = yield __await(_h.next()), _a = _j.done, !_a;) {
                    _c = _j.value;
                    _g = false;
                    try {
                        const chunk = _c;
                        planResponse += chunk;
                    }
                    finally {
                        _g = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_g && !_a && (_b = _h.return)) yield __await(_b.call(_h));
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.log('MasterAgent: Received plan response:', planResponse);
            const jsonPlan = this.extractJsonFromMarkdown(planResponse);
            const plan = JSON.parse(jsonPlan).plan;
            let context = { text };
            for (const agentName of plan) {
                const agent = this.agents[agentName];
                if (!agent) {
                    throw new Error(`Agent ${agentName} not found`);
                }
                const input = this.mapInput(agentName, context);
                if (agent instanceof SVGGeneratorAgent_1.SVGGeneratorAgent) {
                    let svgContent = '';
                    const stream = agent.execute(input);
                    try {
                        for (var _k = true, stream_1 = (e_2 = void 0, __asyncValues(stream)), stream_1_1; stream_1_1 = yield __await(stream_1.next()), _d = stream_1_1.done, !_d;) {
                            _f = stream_1_1.value;
                            _k = false;
                            try {
                                const chunk = _f;
                                svgContent += chunk;
                                yield yield __await(chunk);
                            }
                            finally {
                                _k = true;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_k && !_d && (_e = stream_1.return)) yield __await(_e.call(stream_1));
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    this.updateContext(agentName, svgContent, context);
                }
                else {
                    const result = yield __await(agent.execute(input));
                    this.updateContext(agentName, result, context);
                }
            }
            console.info('MasterAgent: Final context:', context);
            return yield __await(context.finalResult);
        });
    }
    extractJsonFromMarkdown(markdown) {
        const jsonRegex = /```json\n([\s\S]*?)\n```/;
        const match = markdown.match(jsonRegex);
        if (match && match[1]) {
            return match[1];
        }
        return markdown; // Fallback to the original response if no markdown block is found
    }
    mapInput(agentName, context) {
        switch (agentName) {
            case 'TextAnalyzerAgent':
                return context.text;
            case 'LayoutDesignerAgent':
                return context.analysis;
            case 'ColorSchemeAgent':
                return context.analysis;
            case 'SVGGeneratorAgent':
                return { analysis: context.analysis, layout: context.layout, colorScheme: context.colorScheme };
            default:
                throw new Error(`Unknown agent for input mapping: ${agentName}`);
        }
    }
    updateContext(agentName, result, context) {
        switch (agentName) {
            case 'TextAnalyzerAgent':
                context.analysis = result;
                break;
            case 'LayoutDesignerAgent':
                context.layout = result;
                break;
            case 'ColorSchemeAgent':
                context.colorScheme = result;
                break;
            case 'SVGGeneratorAgent':
                context.svg = result;
                context.finalResult = result;
                break;
            default:
                throw new Error(`Unknown agent for context update: ${agentName}`);
        }
    }
}
exports.MasterAgent = MasterAgent;
