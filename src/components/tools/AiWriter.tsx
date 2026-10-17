import { useState, useEffect, useMemo, useCallback } from 'react';

const INDUSTRIES = ['机械设备', '五金建材', '电子电工', '商务服务', '化工环保', '招商加盟', '数码家电', '农林牧渔'];

const ARTICLE_TYPES = [
  { id: 'spec', name: '产品参数与详情测评', desc: '突出性能参数、结构特点、应用场景与品质' },
  { id: 'factory', name: '源头厂家实力与批发直销', desc: '突出工厂规模、定制生产能力、现货仓储与售后保障' },
  { id: 'guide', name: '选型指南与避坑对比', desc: '买家采购决策、不同型号区别、选型要点' },
  { id: 'faq', name: '常见问题解答与百科', desc: '针对搜索问答精准解答，利于搜索与AI抓取' },
];

function generateLocalArticle(opts: {
  title: string;
  keyword: string;
  industry: string;
  type: string;
  lengthTier: string;
  includeTable: boolean;
  includeFaq: boolean;
  includeContact: boolean;
}) {
  const { title, keyword, industry, type, includeTable, includeFaq, includeContact } = opts;
  const kw = keyword || title.slice(0, 10);
  const now = new Date().toISOString().slice(0, 10);

  const intro = `在当今注重品质与效率的工业与商业制造领域，【${kw}】作为${industry}行业中的关键环节，直接关系到客户的生产效率与产品交付质量。近期很多采购商和企业客户都在关注“${title}”的相关信息。本文将围绕产品技术参数、核心性能优势、厂家实力保障及采购常见问题，为您进行全方位剖析。`;

  const specTable = includeTable ? `
## 核心规格与技术参数表

| 指标项目 | 标准配置 / 技术参数 | 行业参考标准 | 备注说明 |
| :--- | :--- | :--- | :--- |
| **设备/产品类别** | ${industry}专用级 ${kw} | ISO9001 / CE 认证 | 支持非标定制 |
| **工作效率/功率** | 工业级高效稳定输出 | 优于行业同类 15% | 低耗耐用设计 |
| **核心材质/零部件** | 加厚合金钢 / 进口控制元器件 | 国标优质用料 | 延长使用寿命 |
| **适配场景** | 车间流水线、中大型工矿及商业场所 | 多工况稳定适应 | 宽温高湿无忧 |
| **供货周期** | 常规型号现货速发 / 定制款 3-7 天 | 极速响应 | 厂家直发直达 |
` : '';

  const bodySection = `
## 为什么选择源头实力的【${kw}】？

1. **精工选材与严格质检**：从原材料入库到成品出厂，每台【${kw}】均经过多道严密工序检测，杜绝虚标参数，确保运行平稳可靠。
2. **高性价比与一手价格**：省去中间商代理层层加价环节，源头工厂直接面向终端客户与工程项目采购，大幅缩减企业采购预算。
3. **支持非标定制设计**：拥有经验丰富的设计与研发技术团队，可根据您的实际工况要求量身设计专属方案，满足各类特殊作业需求。
`;

  const faqSection = includeFaq ? `
## 采购常见问题解答 (FAQ)

**Q1：如何根据实际需求选购合适的【${kw}】？**  
A：建议首先明确日常生产负荷、工作场地尺寸以及特定材质工艺要求。我司技术人员可提供免费选型计算与方案匹配服务。

**Q2：从下单到发货需要多长时间？**  
A：标准现货型号当天或次日即可发货；对于特殊规格或定制化订单，一般在确定图纸方案后 3-7 个工作日内完成交付。

**Q3：产品质保与售后服务如何保障？**  
A：所有出厂产品提供全面质量质保，核心部件提供长期技术支持与快速备件更换服务，售后技术人员全天候在线协助。
` : '';

  const contactSection = includeContact ? `
---

### 📞 厂家直销 · 咨询与报价通道
如果您对【**${title}**】有采购意向、工程招标需求或需要获取最新产品画册与出厂批发底价，欢迎随时与我们销售工程师取得联系。  
* 服务支持：提供一对一免费选型建议与技术方案交流  
* 订购优势：全国物流直达配送，支持开具增值税专用发票
` : '';

  return `# ${title}

*发布时间：${now} | 所属行业：${industry} | 核心关键词：${kw}*

${intro}

${bodySection}
${specTable}
${faqSection}
${contactSection}
`;
}

export default function AiWriter() {
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [industry, setIndustry] = useState('机械设备');
  const [articleType, setArticleType] = useState('spec');
  const [lengthTier, setLengthTier] = useState('medium');
  const [includeTable, setIncludeTable] = useState(true);
  const [includeFaq, setIncludeFaq] = useState(true);
  const [includeContact, setIncludeContact] = useState(true);

  // AI API 配置
  const [useCustomAi, setUseCustomAi] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('https://api.openai.com/v1/chat/completions');
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('gpt-3.5-turbo');

  // 生成状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [articleContent, setArticleContent] = useState('');
  const [copied, setCopied] = useState(false);

  // 初始化从 localStorage 读取由标题生成器传来的标题
  useEffect(() => {
    const savedTitle = localStorage.getItem('ai_writer_title');
    if (savedTitle) {
      setTitle(savedTitle);
      setKeyword(savedTitle.replace(/【.*?】/g, '').slice(0, 8));
      localStorage.removeItem('ai_writer_title');
    } else {
      setTitle('【源头厂家】全自动激光切割机 现货供应支持定制');
      setKeyword('激光切割机');
    }
  }, []);

  // 生成文章
  const handleGenerate = async () => {
    if (!title.trim()) {
      alert('请输入文章标题');
      return;
    }
    setIsGenerating(true);

    if (!useCustomAi || !apiKey) {
      // 本地高质量模板引擎
      setTimeout(() => {
        const generated = generateLocalArticle({
          title,
          keyword,
          industry,
          type: articleType,
          lengthTier,
          includeTable,
          includeFaq,
          includeContact,
        });
        setArticleContent(generated);
        setIsGenerating(false);
      }, 500);
      return;
    }

    // 调用自定义 API
    try {
      const prompt = `你是一位精通 B2B 工业品营销与 SEO 的资深文案专家。请围绕标题《${title}》写一篇专业的企业宣传/软文。
要求：
- 核心关键词：${keyword}（请在文章自然融入，保持合理密度）
- 所属行业：${industry}
- 文章体裁：${ARTICLE_TYPES.find(t => t.id === articleType)?.name}
- 模块要求：${includeTable ? '包含规格参数Markdown表格；' : ''}${includeFaq ? '包含常见问答FAQ；' : ''}${includeContact ? '包含文末采购咨询引导；' : ''}
- 输出格式：标准 Markdown 格式，具备规范的 H1、H2 标题层级。`;

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: '你是一位工业品与B2B营销SEO文案专家。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        })
      });

      if (!res.ok) {
        throw new Error(`API 响应错误: ${res.statusText}`);
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      setArticleContent(content);
    } catch (err: any) {
      alert(`AI 接口调用失败: ${err.message || '请检查网络或 API Key'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // SEO 指标统计
  const seoStats = useMemo(() => {
    const textOnly = articleContent.replace(/[#*`|\-\n\s]/g, '');
    const charCount = textOnly.length;
    let kwCount = 0;
    if (keyword && textOnly) {
      const reg = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = textOnly.match(reg);
      kwCount = matches ? matches.length : 0;
    }
    const kwDensity = charCount > 0 ? ((kwCount * keyword.length) / charCount * 100).toFixed(1) : '0';
    return {
      charCount,
      kwCount,
      kwDensity,
      hasTable: articleContent.includes('|'),
      hasH2: articleContent.includes('##'),
    };
  }, [articleContent, keyword]);

  const copyText = (mode: 'plain' | 'md') => {
    const text = mode === 'plain'
      ? articleContent.replace(/[#*`_~]/g, '')
      : articleContent;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportMarkdown = () => {
    const blob = new Blob([articleContent], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/[\/\\:*?"<>|]/g, '_') || 'seo-article'}.md`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：参数配置 (占 5 列) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl bg-slate-900/60 border border-emerald-500/20 p-5 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <span>✍️</span> 创作需求配置
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">文章标题 *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="例如：【源头厂家】全自动激光切割机 现货供应支持定制"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500/60 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">核心关键词 (用于SEO埋词)</label>
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="例如：激光切割机"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-700/60 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500/60 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">所属行业</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500/60"
                >
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">文章字数级别</label>
                <select
                  value={lengthTier}
                  onChange={e => setLengthTier(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500/60"
                >
                  <option value="short">短平快 (约 500 字)</option>
                  <option value="medium">标准详情 (约 800-1000 字)</option>
                  <option value="long">深度评测 (约 1500+ 字)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">文章体裁与场景</label>
              <div className="grid grid-cols-2 gap-2">
                {ARTICLE_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setArticleType(t.id)}
                    className={`text-left p-2.5 rounded-lg border text-xs transition ${
                      articleType === t.id
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-[11px] mb-0.5">{t.name}</div>
                    <div className="text-[10px] opacity-60 leading-tight line-clamp-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">包含特色模块</label>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={includeTable} onChange={e => setIncludeTable(e.target.checked)} className="accent-emerald-500"/>
                  规格参数表
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={includeFaq} onChange={e => setIncludeFaq(e.target.checked)} className="accent-emerald-500"/>
                  采购 FAQ 问答
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={includeContact} onChange={e => setIncludeContact(e.target.checked)} className="accent-emerald-500"/>
                  厂家咨询引导
                </label>
              </div>
            </div>
          </div>

          {/* AI 引擎高级配置折叠卡 */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>🤖</span> 大模型 API 模式
              </span>
              <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomAi}
                  onChange={e => setUseCustomAi(e.target.checked)}
                  className="accent-cyan-500"
                />
                启用自填 API
              </label>
            </div>
            {useCustomAi ? (
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">接口地址 (兼容 OpenAI)</label>
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={e => setApiEndpoint(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">模型名称 (Model)</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={e => setModelName(e.target.value)}
                    placeholder="例如 gpt-3.5-turbo, deepseek-chat"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200"
                  />
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 leading-relaxed">
                当前为【离线高质量模板秒生引擎】，无需 API Key，0 成本秒级生成规范 B2B 软文。
              </p>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/10 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>正在智能创作文章中...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>立即开始生成文章</span>
              </>
            )}
          </button>
        </div>

        {/* 右侧：工作台与文章预览 (占 7 列) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          {/* SEO 实时质量看板 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-500">正文字数</div>
              <div className="text-lg font-bold text-slate-200 mt-0.5">{seoStats.charCount} 字</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-500">主词出现频次</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">{seoStats.kwCount} 次</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-500">关键词密度</div>
              <div className="text-lg font-bold text-cyan-400 mt-0.5">{seoStats.kwDensity}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-500">结构完整度</div>
              <div className="text-xs font-semibold text-violet-300 mt-1">
                {seoStats.hasH2 ? '✅ 小标题 ' : '❌ 标题 '}
                {seoStats.hasTable ? '✅ 参数表' : ''}
              </div>
            </div>
          </div>

          {/* 文章编辑与预览区 */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 flex-1 flex flex-col min-h-[500px] overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-400">📄 Markdown 编辑与预览</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyText('plain')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                  title="去除Markdown符号的纯文本"
                >
                  复制纯文本
                </button>
                <button
                  onClick={() => copyText('md')}
                  className={`px-2.5 py-1 rounded border text-xs transition ${
                    copied
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400'
                  }`}
                >
                  {copied ? '✅ 已复制' : '📋 复制 Markdown'}
                </button>
                <button
                  onClick={exportMarkdown}
                  className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 text-xs transition"
                >
                  ⬇ 导出 .md
                </button>
              </div>
            </div>

            <textarea
              value={articleContent}
              onChange={e => setArticleContent(e.target.value)}
              placeholder="点击左侧【立即开始生成文章】按钮，生成的内容将显示在此处，支持直接编辑与修改..."
              className="flex-1 w-full p-4 bg-transparent text-slate-200 text-sm font-mono leading-relaxed resize-none focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
