import { useState, useEffect, useMemo, useRef } from 'react';

const INDUSTRIES = ['机械设备', '五金建材', '电子电工', '商务服务', '化工环保', '招商加盟', '数码家电', '农林牧渔'];

const ARTICLE_TYPES = [
  { id: 'spec', name: '产品参数与详情测评', desc: '突出性能参数、结构特点、应用场景与品质' },
  { id: 'factory', name: '源头厂家实力与批发直销', desc: '突出工厂规模、定制生产能力、现货仓储与售后保障' },
  { id: 'guide', name: '选型指南与避坑对比', desc: '买家采购决策、不同型号区别、选型要点' },
  { id: 'faq', name: '常见问题解答与百科', desc: '针对搜索问答精准解答，利于搜索与AI抓取' },
];

function generateHtmlArticle(opts: {
  title: string;
  keyword: string;
  industry: string;
  includeTable: boolean;
  includeFaq: boolean;
  includeContact: boolean;
}) {
  const { title, keyword, industry, includeTable, includeFaq, includeContact } = opts;
  const kw = keyword || title.slice(0, 10);
  const now = new Date().toISOString().slice(0, 10);

  const tableHtml = includeTable ? `
<h2>核心规格与技术参数表</h2>
<table style="width:100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #334155;">
  <thead>
    <tr style="background: rgba(30, 41, 59, 0.8);">
      <th style="border: 1px solid #334155; padding: 10px 14px; text-align: left; font-weight: 600;">指标项目</th>
      <th style="border: 1px solid #334155; padding: 10px 14px; text-align: left; font-weight: 600;">标准配置 / 技术参数</th>
      <th style="border: 1px solid #334155; padding: 10px 14px; text-align: left; font-weight: 600;">行业参考标准</th>
      <th style="border: 1px solid #334155; padding: 10px 14px; text-align: left; font-weight: 600;">备注说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #334155; padding: 10px 14px;"><strong>设备/产品类别</strong></td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">${industry}专用级 ${kw}</td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">ISO9001 / CE 认证</td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">支持非标定制</td>
    </tr>
    <tr style="background: rgba(15, 23, 42, 0.4);">
      <td style="border: 1px solid #334155; padding: 10px 14px;"><strong>工作效率/功率</strong></td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">工业级高效稳定输出</td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">优于行业同类 15%</td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">低耗耐用设计</td>
    </tr>
    <tr>
      <td style="border: 1px solid #334155; padding: 10px 14px;"><strong>核心材质/零部件</strong></td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">加厚合金钢 / 进口控制元器件</td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">国标优质用料</td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">延长使用寿命</td>
    </tr>
    <tr style="background: rgba(15, 23, 42, 0.4);">
      <td style="border: 1px solid #334155; padding: 10px 14px;"><strong>供货周期</strong></td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">常规型号现货速发 / 定制款 3-7 天</td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">极速响应</td>
      <td style="border: 1px solid #334155; padding: 10px 14px;">厂家直发直达</td>
    </tr>
  </tbody>
</table>
` : '';

  const faqHtml = includeFaq ? `
<h2>采购常见问题解答 (FAQ)</h2>
<p><strong>Q1：如何根据实际需求选购合适的【${kw}】？</strong><br/>
A：建议首先明确日常生产负荷、工作场地尺寸以及特定材质工艺要求。我司技术人员可提供免费选型计算与方案匹配服务。</p>
<p><strong>Q2：从下单到发货需要多长时间？</strong><br/>
A：标准现货型号当天或次日即可发货；对于特殊规格或定制化订单，一般在确定图纸方案后 3-7 个工作日内完成交付。</p>
<p><strong>Q3：产品质保与售后服务如何保障？</strong><br/>
A：所有出厂产品提供全面质量质保，核心部件提供长期技术支持与快速备件更换服务，售后技术人员全天候在线协助。</p>
` : '';

  const contactHtml = includeContact ? `
<hr style="border-color: #334155; margin: 24px 0;" />
<h3>📞 厂家直销 · 咨询与报价通道</h3>
<p>如果您对【<strong>${title}</strong>】有采购意向、工程招标需求或需要获取最新产品画册与出厂批发底价，欢迎随时与我们销售工程师取得联系。</p>
<ul>
  <li>服务支持：提供一对一免费选型建议与技术方案交流</li>
  <li>订购优势：全国物流直达配送，支持开具增值税专用发票</li>
</ul>
` : '';

  return `<h1>${title}</h1>
<p style="color: #94a3b8; font-size: 13px;"><em>发布时间：${now} | 所属行业：${industry} | 核心关键词：${kw}</em></p>
<p>在当今注重品质与效率的工业与商业制造领域，【<strong>${kw}</strong>】作为${industry}行业中的关键环节，直接关系到客户的生产效率与产品交付质量。近期很多采购商和企业客户都在关注“${title}”的相关信息。本文将围绕产品技术参数、核心性能优势、厂家实力保障及采购常见问题，为您进行全方位剖析。</p>
<h2>为什么选择源头实力的【${kw}】？</h2>
<ol>
  <li><strong>精工选材与严格质检</strong>：从原材料入库到成品出厂，每台【${kw}】均经过多道严密工序检测，杜绝虚标参数，确保运行平稳可靠。</li>
  <li><strong>高性价比与一手价格</strong>：省去中间商代理层层加价环节，源头工厂直接面向终端客户与工程项目采购，大幅缩减企业采购预算。</li>
  <li><strong>支持非标定制设计</strong>：拥有经验丰富的设计与研发技术团队，可根据您的实际工况要求量身设计专属方案，满足各类特殊作业需求。</li>
</ol>
${tableHtml}
${faqHtml}
${contactHtml}
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

  // 生成状态与编辑器
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState('p');
  const [editorText, setEditorText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

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

  // 富文本执行命令工具
  const execCmd = (cmd: string, val: string | undefined = undefined) => {
    document.execCommand(cmd, false, val);
    handleEditorInput();
  };

  const handleBlockChange = (val: string) => {
    setSelectedBlock(val);
    if (val === 'p') {
      execCmd('formatBlock', '<p>');
    } else if (val === 'h1') {
      execCmd('formatBlock', '<h1>');
    } else if (val === 'h2') {
      execCmd('formatBlock', '<h2>');
    } else if (val === 'h3') {
      execCmd('formatBlock', '<h3>');
    } else if (val === 'blockquote') {
      execCmd('formatBlock', '<blockquote>');
    } else if (val === 'pre') {
      execCmd('formatBlock', '<pre>');
    }
  };

  const insertLink = () => {
    const url = prompt('请输入链接地址 (URL):', 'https://');
    if (url) {
      execCmd('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('请输入图片地址 (Image URL):', 'https://');
    if (url) {
      execCmd('insertImage', url);
    }
  };

  const insertTable = () => {
    const tableHtml = `
<table style="width:100%; border-collapse: collapse; margin: 12px 0; border: 1px solid #475569;">
  <thead>
    <tr style="background: rgba(51, 65, 85, 0.6);">
      <th style="border: 1px solid #475569; padding: 8px;">表头 1</th>
      <th style="border: 1px solid #475569; padding: 8px;">表头 2</th>
      <th style="border: 1px solid #475569; padding: 8px;">表头 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #475569; padding: 8px;">单元格数据</td>
      <td style="border: 1px solid #475569; padding: 8px;">单元格数据</td>
      <td style="border: 1px solid #475569; padding: 8px;">单元格数据</td>
    </tr>
  </tbody>
</table><p><br/></p>
`;
    execCmd('insertHTML', tableHtml);
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setEditorText(editorRef.current.innerText || '');
    }
  };

  // 生成文章
  const handleGenerate = async () => {
    if (!title.trim()) {
      alert('请输入文章标题');
      return;
    }
    setIsGenerating(true);

    if (!useCustomAi || !apiKey) {
      setTimeout(() => {
        const html = generateHtmlArticle({
          title,
          keyword,
          industry,
          includeTable,
          includeFaq,
          includeContact,
        });
        if (editorRef.current) {
          editorRef.current.innerHTML = html;
          setEditorText(editorRef.current.innerText || '');
        }
        setIsGenerating(false);
      }, 500);
      return;
    }

    try {
      const prompt = `你是一位精通 B2B 工业品营销与 SEO 的资深文案专家。请围绕标题《${title}》写一篇专业的企业宣传文章。
要求：
- 核心关键词：${keyword}（请在文章自然融入，保持合理密度）
- 所属行业：${industry}
- 文章体裁：${ARTICLE_TYPES.find(t => t.id === articleType)?.name}
- 格式要求：直接输出 HTML 结构标签（如 <h1>, <h2>, <p>, <table>, <ul>, <li> 等），无需任何 markdown 标记。`;

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: '你是一位工业品与B2B营销SEO文案专家。直接返回干净的 HTML 片段。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        })
      });

      if (!res.ok) throw new Error(`API 响应错误: ${res.statusText}`);
      const data = await res.json();
      let content = data.choices?.[0]?.message?.content || '';
      content = content.replace(/```html/g, '').replace(/```/g, '').trim();

      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        setEditorText(editorRef.current.innerText || '');
      }
    } catch (err: any) {
      alert(`AI 接口调用失败: ${err.message || '请检查网络或 API Key'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // SEO 指标统计
  const seoStats = useMemo(() => {
    const raw = editorText.replace(/\s+/g, '');
    const charCount = raw.length;
    let kwCount = 0;
    if (keyword && raw) {
      const reg = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = raw.match(reg);
      kwCount = matches ? matches.length : 0;
    }
    const kwDensity = charCount > 0 ? ((kwCount * keyword.length) / charCount * 100).toFixed(1) : '0';
    const html = editorRef.current?.innerHTML || '';
    return {
      charCount,
      kwCount,
      kwDensity,
      hasTable: html.includes('<table'),
      hasH2: html.includes('<h2') || html.includes('<h1'),
    };
  }, [editorText, keyword]);

  const copyPlain = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyRich = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([editorRef.current.innerText], { type: 'text/plain' });
      // 写入富文本剪贴板
      if (typeof ClipboardItem !== 'undefined') {
        navigator.clipboard.write([
          new ClipboardItem({
            'text/html': blobHtml,
            'text/plain': blobText,
          })
        ]).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          navigator.clipboard.writeText(html);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      } else {
        navigator.clipboard.writeText(html);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const exportHtml = () => {
    if (!editorRef.current) return;
    const blob = new Blob([editorRef.current.innerHTML], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/[\/\\:*?"<>|]/g, '_') || 'article'}.html`;
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

          {/* AI 引擎高级配置 */}
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

        {/* 右侧：工作台与富文本编辑器 (占 7 列) */}
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

          {/* 富文本编辑器核心结构 (参考图片1) */}
          <div className="flex flex-col flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200">文章正文</label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={copyPlain}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                  title="复制纯文本"
                >
                  复制纯文本
                </button>
                <button
                  type="button"
                  onClick={copyRich}
                  className={`px-2.5 py-1 rounded border text-xs font-medium transition cursor-pointer ${
                    copied
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400'
                  }`}
                  title="可直接带格式粘贴进微信公众号/博客/Word"
                >
                  {copied ? '✅ 已复制' : '📋 复制富文本'}
                </button>
                <button
                  type="button"
                  onClick={exportHtml}
                  className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 text-xs transition cursor-pointer"
                >
                  ⬇ 导出 HTML
                </button>
              </div>
            </div>

            {/* 富文本容器卡片 */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl flex flex-col flex-1 min-h-[560px]">
              {/* 图1样式工具栏 */}
              <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center flex-wrap gap-1 text-slate-400 text-xs select-none">
                {/* Paragraph 级别选择器 */}
                <div className="relative inline-flex items-center mr-1">
                  <select
                    value={selectedBlock}
                    onChange={e => handleBlockChange(e.target.value)}
                    className="appearance-none bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs px-2.5 py-1.5 pr-6 rounded border border-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="blockquote">Quote</option>
                    <option value="pre">Code Block</option>
                  </select>
                  <span className="absolute right-2 pointer-events-none text-[10px] text-slate-400">↕</span>
                </div>

                <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

                {/* 格式按钮：B, I, S, <>, Tx */}
                <button
                  type="button"
                  onClick={() => execCmd('bold')}
                  title="Bold (加粗)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center font-bold text-xs transition"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('italic')}
                  title="Italic (斜体)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center italic text-xs transition"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('strikeThrough')}
                  title="Strikethrough (删除线)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center line-through text-xs transition"
                >
                  S
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<code>')}
                  title="Inline Code (行内代码)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center font-mono text-[11px] transition"
                >
                  &lt;&gt;
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('removeFormat')}
                  title="Clear formatting (清除格式)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center text-xs transition"
                >
                  T<sub className="text-[9px]">x</sub>
                </button>

                <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

                {/* 列表按钮：Bullet, Numbered */}
                <button
                  type="button"
                  onClick={() => execCmd('insertUnorderedList')}
                  title="Bullet List (无序列表)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center text-xs transition"
                >
                  •≡
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('insertOrderedList')}
                  title="Numbered List (有序列表)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center text-xs transition"
                >
                  1.≡
                </button>

                <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

                {/* 插入元素：Divider, Link, Quote, Code, Table, Image */}
                <button
                  type="button"
                  onClick={() => execCmd('insertHorizontalRule')}
                  title="Horizontal Rule (分割线)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center text-sm font-bold transition"
                >
                  —
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  title="Insert Link (插入链接)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center text-xs transition"
                >
                  🔗
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<blockquote>')}
                  title="Blockquote (引用块)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center text-sm font-serif transition"
                >
                  ”
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<pre>')}
                  title="Code Block (代码块)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center font-mono text-[11px] transition"
                >
                  {`{}`}
                </button>
                <button
                  type="button"
                  onClick={insertTable}
                  title="Insert Table (插入表格)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center text-xs transition"
                >
                  田
                </button>
                <button
                  type="button"
                  onClick={insertImage}
                  title="Insert Image (插入图片)"
                  className="w-7 h-7 rounded hover:bg-slate-800 hover:text-slate-100 flex items-center justify-center text-xs transition"
                >
                  🖼️
                </button>
              </div>

              {/* 富文本可编辑正文区 */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                data-placeholder='Start writing or press "/" for commands...'
                className="flex-1 p-6 text-slate-100 text-sm leading-relaxed focus:outline-none overflow-y-auto prose prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-600 empty:before:pointer-events-none"
                style={{
                  minHeight: '480px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
